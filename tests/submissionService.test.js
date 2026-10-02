import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'

const STORAGE_KEY = 'pool-finder-submissions'
const source = await readFile(
  new URL('../src/services/submissionService.js', import.meta.url),
  'utf8',
)

// Load the actual service with only its backend import replaced. No real
// Supabase client, browser storage or network connection is created.
async function loadService(supabase = null, existing = []) {
  const storage = new Map([[STORAGE_KEY, JSON.stringify(existing)]])
  const context = createContext({
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
    console: { error() {} },
  })
  const service = new SourceTextModule(source, { context })
  await service.link((specifier) => {
    assert.equal(specifier, '../lib/supabase')
    return new SyntheticModule(['supabase'], function () {
      this.setExport('supabase', supabase)
    }, { context })
  })
  await service.evaluate()
  return {
    submitVenue: service.namespace.submitVenue,
    saved: () => JSON.parse(storage.get(STORAGE_KEY)),
  }
}

function submission(tableCount) {
  return { name: 'Test venue', address: 'Test address', suburb: 'Test suburb', tableCount }
}

for (const count of [1, 3]) {
  test(`Supabase stores a ${count}-table suggestion without changing the count`, async () => {
    const inserts = []
    const service = await loadService({
      from(table) {
        assert.equal(table, 'submissions')
        return { async insert(payload) { inserts.push(payload); return { error: null } } }
      },
    })

    const result = await service.submitVenue(submission(count))

    assert.deepEqual({ ...result }, { success: true, source: 'supabase' })
    assert.equal(inserts.length, 1)
    assert.equal(inserts[0].tables_count, count)
    assert.equal(inserts[0].venue_name, 'Test venue')
    assert.deepEqual(service.saved(), [])
  })

  for (const backend of ['unconfigured', 'error']) {
    test(`${backend} backend keeps ${count} tables in local storage`, async () => {
      const existing = [{ name: 'Earlier suggestion', tableCount: 2 }]
      const inserts = []
      const client = backend === 'unconfigured' ? null : {
        from(table) {
          assert.equal(table, 'submissions')
          return { async insert(payload) { inserts.push(payload); return { error: { message: 'Test failure' } } } }
        },
      }
      const service = await loadService(client, existing)

      const result = await service.submitVenue(submission(count))

      assert.deepEqual({ ...result }, { success: true, source: 'local' })
      const saved = service.saved()
      assert.equal(saved.length, 2)
      assert.deepEqual(saved[0], existing[0])
      assert.equal(saved[1].tableCount, count)
      assert.equal(saved[1].name, 'Test venue')
      assert.ok(Number.isFinite(Date.parse(saved[1].created_at)))
      if (backend === 'error') {
        assert.equal(inserts.length, 1)
        assert.equal(inserts[0].tables_count, count)
      }
    })
  }
}

test('Supabase retains the one-table default when the count is absent', async () => {
  let inserted
  const service = await loadService({
    from() {
      return { async insert(payload) { inserted = payload; return { error: null } } }
    },
  })

  await service.submitVenue({ name: 'Test venue' })

  assert.equal(inserted.tables_count, 1)
})

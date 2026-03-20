import { useState, useRef, useEffect } from 'react'

const FEATURE_OPTIONS = [
  'free pool',
  'happy hour',
  'comp night',
  'coin operated',
  'food available',
  'late night',
  'outdoor area',
]

export function FilterBar({
  suburbs,
  suburb,
  onSuburbChange,
  tableFilter,
  onTableFilterChange,
  featureFilters,
  onFeatureFiltersChange,
  freeTonight,
  onFreeTonightChange,
  compTonight,
  onCompTonightChange,
  happyHour,
  onHappyHourChange,
  brandFilter,
  onBrandFilterChange,
  brands,
}) {
  const [suburbSearch, setSuburbSearch] = useState('')
  const [suburbOpen, setSuburbOpen] = useState(false)
  const suburbRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suburbRef.current && !suburbRef.current.contains(e.target)) {
        setSuburbOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSuburbs = suburbs.filter((s) =>
    s.toLowerCase().includes(suburbSearch.toLowerCase())
  )

  const handleSuburbSelect = (value) => {
    onSuburbChange(value)
    setSuburbSearch('')
    setSuburbOpen(false)
  }

  const handleSuburbClear = () => {
    onSuburbChange('')
    setSuburbSearch('')
    setSuburbOpen(false)
  }

  const toggleFeature = (feature) => {
    if (featureFilters.includes(feature)) {
      onFeatureFiltersChange(featureFilters.filter((f) => f !== feature))
    } else {
      onFeatureFiltersChange([...featureFilters, feature])
    }
  }

  return (
    <div className="p-3 space-y-2 border-b border-gray-200">
      {/* Tonight quick-filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFreeTonightChange(!freeTonight)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            freeTonight
              ? 'bg-green-100 text-green-800 border-green-400'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
          }`}
        >
          🎱 Free pool tonight
        </button>
        <button
          onClick={() => onCompTonightChange(!compTonight)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            compTonight
              ? 'bg-blue-100 text-blue-800 border-blue-400'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
          }`}
        >
          🏆 Comp night tonight
        </button>
        <button
          onClick={() => onHappyHourChange(!happyHour)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            happyHour
              ? 'bg-amber-100 text-amber-800 border-amber-400'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
          }`}
        >
          🍺 Happy hour
        </button>
      </div>

      <div className="flex gap-2">
        <div ref={suburbRef} className="relative flex-1">
          <input
            type="text"
            value={suburbOpen ? suburbSearch : suburb || ''}
            placeholder="All suburbs"
            onFocus={() => {
              setSuburbOpen(true)
              setSuburbSearch('')
            }}
            onChange={(e) => {
              setSuburbSearch(e.target.value)
              setSuburbOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSuburbOpen(false)
                e.target.blur()
              }
            }}
            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white pr-7"
          />
          {suburb && !suburbOpen && (
            <button
              onClick={handleSuburbClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none"
              aria-label="Clear suburb filter"
            >
              ×
            </button>
          )}
          {suburbOpen && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
              {filteredSuburbs.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-400">
                  No suburbs found
                </li>
              ) : (
                filteredSuburbs.map((s) => (
                  <li
                    key={s}
                    onMouseDown={() => handleSuburbSelect(s)}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                  >
                    {s}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <select
          value={tableFilter}
          onChange={(e) => onTableFilterChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="">Any tables</option>
          <option value="single">1 table</option>
          <option value="multiple">2+ tables</option>
        </select>

        {brands.length > 0 && (
          <select
            value={brandFilter}
            onChange={(e) => onBrandFilterChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
          >
            <option value="">Any brand</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FEATURE_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFeature(f)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              featureFilters.includes(f)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

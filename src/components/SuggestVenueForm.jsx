import { useState } from 'react'
import { submitVenue } from '../services/submissionService'

function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function SuggestVenueForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    address: '',
    suburb: '',
    tableCount: '',
    pricing: '',
    notes: '',
  })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Venue name is required'
    if (!form.address.trim()) next.address = 'Address is required'
    if (!form.suburb.trim()) next.suburb = 'Suburb is required'
    if (!form.tableCount || Number(form.tableCount) < 1) {
      next.tableCount = 'At least 1 table required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const id = toKebabCase(`${form.name} ${form.suburb}`)

    setSubmitting(true)
    setSubmitError(null)

    try {
      await submitVenue({
        id,
        name: form.name.trim(),
        address: form.address.trim(),
        suburb: form.suburb.trim(),
        tableCount: Number(form.tableCount),
        pricing: form.pricing.trim() || null,
        notes: form.notes.trim() || null,
        status: 'pending',
        source: 'user-submission',
        submittedAt: new Date().toISOString(),
      })

      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start p-5 pb-0">
          <h2 className="text-lg font-bold text-gray-900">
            Suggest a venue
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {submitted ? (
          <div className="p-5 text-center">
            <p className="text-green-700 font-medium">
              Thanks! Your suggestion has been submitted for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <Field
              label="Venue name"
              required
              error={errors.name}
            >
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                className={inputClass(errors.name)}
              />
            </Field>

            <Field
              label="Address"
              required
              error={errors.address}
            >
              <input
                type="text"
                value={form.address}
                onChange={handleChange('address')}
                placeholder="e.g. 123 King St, Newtown NSW 2042"
                className={inputClass(errors.address)}
              />
            </Field>

            <Field
              label="Suburb"
              required
              error={errors.suburb}
            >
              <input
                type="text"
                value={form.suburb}
                onChange={handleChange('suburb')}
                className={inputClass(errors.suburb)}
              />
            </Field>

            <Field
              label="Number of tables"
              required
              error={errors.tableCount}
            >
              <input
                type="number"
                min="1"
                value={form.tableCount}
                onChange={handleChange('tableCount')}
                className={inputClass(errors.tableCount)}
              />
            </Field>

            <Field label="Pricing">
              <input
                type="text"
                value={form.pricing}
                onChange={handleChange('pricing')}
                placeholder="e.g. $2 per game"
                className={inputClass()}
              />
            </Field>

            <Field label="Notes">
              <textarea
                value={form.notes}
                onChange={handleChange('notes')}
                placeholder="Any other details — table brands, free pool nights, vibes..."
                rows={3}
                className={inputClass()}
              />
            </Field>

            {submitError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit suggestion'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

function inputClass(error) {
  const base =
    'w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
  return error
    ? `${base} border-red-400`
    : `${base} border-gray-300`
}

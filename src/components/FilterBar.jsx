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
}) {
  const toggleFeature = (feature) => {
    if (featureFilters.includes(feature)) {
      onFeatureFiltersChange(featureFilters.filter((f) => f !== feature))
    } else {
      onFeatureFiltersChange([...featureFilters, feature])
    }
  }

  return (
    <div className="p-3 space-y-2 border-b border-gray-200">
      <div className="flex gap-2">
        <select
          value={suburb}
          onChange={(e) => onSuburbChange(e.target.value)}
          className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="">All suburbs</option>
          {suburbs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={tableFilter}
          onChange={(e) => onTableFilterChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="">Any tables</option>
          <option value="single">1 table</option>
          <option value="multiple">2+ tables</option>
        </select>
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

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

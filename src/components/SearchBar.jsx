export function SearchBar({ value, onChange }) {
  return (
    <div className="p-3 border-b border-gray-200">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search venues or suburbs..."
        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>
  )
}

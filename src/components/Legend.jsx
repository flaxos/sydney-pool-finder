export function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-lg shadow px-3 py-2 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
        <span>1 table</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
        <span>2+ tables</span>
      </div>
    </div>
  )
}

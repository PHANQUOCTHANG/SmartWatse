const BinStatusDonut = () => {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-4">Trạng thái thùng rác</h3>

      {/* Donut */}
      <div className="flex justify-center mb-6">
        <div className="relative w-44 h-44">
          {/* Outer donut */}
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `
                conic-gradient(
                  #10B981 0% 60%,
                  #F59E0B 60% 85%,
                  #EF4444 85% 100%
                )
              `,
            }}
          />

          {/* Inner hole */}
          <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">850</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Tổng số thùng
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">Trống / Bình thường</span>
          </div>
          <span className="font-medium">60%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-700">Sắp đầy (Warning)</span>
          </div>
          <span className="font-medium">25%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-700">Quá tải (Overloaded)</span>
          </div>
          <span className="font-medium">15%</span>
        </div>
      </div>
    </div>
  )
}

export default BinStatusDonut

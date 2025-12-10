import { TEMPERATURE_LEGEND } from '../../data/cities';

export const TemperatureLegend = () => {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3">
      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
        Maximum Temperature
      </h4>
      <div className="flex flex-col gap-0.5">
        {[...TEMPERATURE_LEGEND].reverse().map((range, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-6 h-4 rounded-sm border border-slate-300/50"
              style={{ backgroundColor: range.color }}
            />
            <span className="text-xs text-slate-600 font-mono">
              {range.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

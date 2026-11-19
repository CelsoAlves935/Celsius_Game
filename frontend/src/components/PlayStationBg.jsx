const PARTICLES = [
  { left: '12%', size: 6, duration: '16s', delay: '0s' },
  { left: '28%', size: 8, duration: '20s', delay: '-5s' },
  { left: '46%', size: 5, duration: '15s', delay: '-9s' },
  { left: '64%', size: 7, duration: '22s', delay: '-3s' },
  { left: '78%', size: 6, duration: '18s', delay: '-11s' },
  { left: '90%', size: 5, duration: '17s', delay: '-6s' },
];

function buildLoopItems(covers, offset = 0, minItems = 10) {
  if (!covers || covers.length === 0) return [];
  const base = covers.slice(0, 20);
  const rotated = [...base.slice(offset % base.length), ...base.slice(0, offset % base.length)];
  const filled = [...rotated];
  while (filled.length < minItems) {
    filled.push(...rotated);
  }
  return [...filled, ...filled];
}

const ROW_CONFIGS = [
  { id: 'r1', directionClass: 'track-left', offset: 0 },
  { id: 'r2', directionClass: 'track-right', offset: 2 },
  { id: 'r3', directionClass: 'track-left-slow', offset: 4 },
];

export function PlayStationBg({ covers = [] }) {
  return (
    <div className="ps-bg" aria-hidden="true">
      {covers.length > 0 && (
        <div className="ps-covers-backdrop">
          {ROW_CONFIGS.map((row) => {
            const items = buildLoopItems(covers, row.offset);
            return (
              <div key={row.id} className="ps-cover-row">
                <div className={`ps-cover-track ${row.directionClass}`}>
                  {items.map((url, idx) => (
                    <img
                      key={`${row.id}-${idx}`}
                      src={url}
                      alt=""
                      className="ps-cover-item"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="ps-wave ps-wave-1" />
      <div className="ps-wave ps-wave-2" />

      {PARTICLES.map((p, idx) => (
        <span
          key={idx}
          className="ps-particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

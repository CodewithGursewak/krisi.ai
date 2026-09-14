interface Props {
  active: boolean;
  bars?: number;
}
export function Waveform({ active, bars = 5 }: Props) {
  return (
    <div className="flex items-end gap-[3px] h-4" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-current ${active ? "wave-bar" : "opacity-40"}`}
          style={{
            height: "100%",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

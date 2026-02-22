function getYAxisTicks(data: { marketSize: number }[], parts: number = 5): {
  domain: [number, number],
  ticks: number[]
} {
  const maxValue = Math.max(...data.map(d => d.marketSize));
  const roundedMax = Math.ceil(maxValue / 10) * 10;
  const step = roundedMax / parts;

  const ticks = Array.from({ length: parts + 1 }, (_, i) => Math.round(i * step));

  return {
    domain: [0, roundedMax],
    ticks
  };
}

export default getYAxisTicks;

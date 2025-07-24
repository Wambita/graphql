// graph.js

export function getXPByDate(transactions) {
  const xpMap = {};

  transactions.forEach((tx) => {
    if (tx.type === "xp" && tx.createdAt) {
      const date = tx.createdAt.split("T")[0];
      xpMap[date] = (xpMap[date] || 0) + tx.amount;
    }
  });

  return Object.entries(xpMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, amount]) => ({
      date,
      xp: amount / 1_000_000, // Convert to MB
    }));
}

export function drawXPGraph(data, svgId = "xpGraph") {
  const svg = document.getElementById(svgId);
  svg.innerHTML = ""; // Clear previous

  const width = 600;
  const height = 250;
  const padding = 40;

  const maxXP = Math.max(...data.map(d => d.xp)) || 1;
  const xStep = (width - padding * 2) / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = padding + i * xStep;
    const y = height - padding - (d.xp / maxXP) * (height - padding * 2);
    return { x, y, label: d.date, value: d.xp };
  });

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "#3b82f6");
  polyline.setAttribute("stroke-width", 2);
  polyline.setAttribute("points", points.map(p => `${p.x},${p.y}`).join(" "));
  svg.appendChild(polyline);

  points.forEach(p => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", 4);
    circle.setAttribute("fill", "#1e3a8a");
    circle.setAttribute("data-tooltip", `${p.label}: ${p.value.toFixed(2)} MB`);
    svg.appendChild(circle);
  });
}

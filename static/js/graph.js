// graphs.js

export function generateXPGraph(transactions, startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const currentDate = new Date();
  const xAxisEndDate = currentDate < endDate ? currentDate : endDate;

  const xpTransactions = transactions
    .filter((tx) => tx.type === "xp" && tx.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let cumulativeXP = 0;
  const dataPoints = xpTransactions.map((tx) => {
    const date = new Date(tx.createdAt);
    cumulativeXP += tx.amount;
    return { date, xp: cumulativeXP };
  });

  if (dataPoints.length === 0 || dataPoints[0].date > startDate) {
    dataPoints.unshift({ date: startDate, xp: 0 });
  }
  if (dataPoints[dataPoints.length - 1].date < xAxisEndDate) {
    dataPoints.push({ date: xAxisEndDate, xp: cumulativeXP });
  }

  const svg = createXPGraphSVG(dataPoints, startDate, xAxisEndDate);
  document.getElementById("xpGraph").innerHTML = svg;
}

function createXPGraphSVG(dataPoints, startDate, endDate) {
  const svgWidth = 800, svgHeight = 500;
  const margin = { top: 80, right: 50, bottom: 70, left: 100 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.bottom - margin.top;
  const dateRange = endDate - startDate;

  const maxXP = Math.max(...dataPoints.map((p) => p.xp));
  const roundedMaxXP = Math.ceil(maxXP / 50000) * 50000;

  const dateToX = (date) => margin.left + ((date - startDate) / dateRange) * chartWidth;
  const xpToY = (xp) => margin.top + chartHeight - (xp / roundedMaxXP) * chartHeight;

  const polylinePoints = dataPoints.map(p => `${dateToX(p.date)},${xpToY(p.xp)}`).join(" ");
  const areaPath = `
    M${polylinePoints}
    L${dateToX(dataPoints[dataPoints.length - 1].date)},${xpToY(0)}
    L${dateToX(dataPoints[0].date)},${xpToY(0)} Z
  `;

  return `
  <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#7c4dff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#7c4dff" stop-opacity="0.05" />
      </linearGradient>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#3d5afe"/>
        <stop offset="100%" stop-color="#7c4dff"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#1A202C" rx="10" />
    <path d="${areaPath}" fill="url(#areaGradient)" />
    <polyline points="${polylinePoints}" fill="none" stroke="url(#lineGradient)" stroke-width="3" />
    ${dataPoints.map((p, i) => {
      const x = dateToX(p.date);
      const y = xpToY(p.xp);
      return `
        <circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#7c4dff" stroke-width="2">
          <title>${formatXP(p.xp)} on ${p.date.toLocaleDateString()}</title>
        </circle>
      `;
    }).join("")}
    <text x="400" y="40" text-anchor="middle" font-size="18" fill="#fff" font-family="Segoe UI">XP Progress Over Time</text>
    <text x="400" y="490" text-anchor="middle" font-size="14" fill="#ccc">Timeline</text>
    <text x="-250" y="30" text-anchor="middle" transform="rotate(-90)" font-size="14" fill="#ccc">Cumulative XP</text>
  </svg>
  `;
}

function formatXP(xp) {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}MB`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}KB`;
  return `${xp}B`;
}

export function generatePassFailPie(progresses, svgId = "passFailGraph") {
  const svg = document.getElementById(svgId);
  svg.innerHTML = "";

  const passed = progresses.filter(p => p.grade >= 1).length;
  const failed = progresses.length - passed;
  const total = passed + failed || 1;

  const radius = 100;
  const centerX = 200;
  const centerY = 125;

  const passAngle = (passed / total) * 2 * Math.PI;

  const path = (startAngle, endAngle, color) => {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `<path d="M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z" fill="${color}" />`;
  };

  const pieSVG = `
  <svg width="100%" height="250" viewBox="0 0 400 250">
    ${path(0, passAngle, "#6A1B9A")}
    ${path(passAngle, 2 * Math.PI, "#9C27B0")}
    <rect x="20" y="20" width="12" height="12" fill="#6A1B9A"/>
    <text x="40" y="30" fill="#fff" font-size="14">Passed: ${passed}</text>
    <rect x="20" y="45" width="12" height="12" fill="#9C27B0"/>
    <text x="40" y="55" fill="#fff" font-size="14">Failed: ${failed}</text>
    <text x="200" y="240" text-anchor="middle" fill="#fff" font-size="16">Project Pass/Fail Ratio</text>
  </svg>
  `;

  svg.innerHTML = pieSVG;
}

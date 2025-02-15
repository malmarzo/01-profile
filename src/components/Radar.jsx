import React from "react";

const RadarChart = ({ skills }) => {
  const width = 600;
  const height = 400;
  const levels = 10; // Set levels to 10 for percentage scale
  const radius = Math.min(width, height) / 2 - 50;
  const angleSlice = (2 * Math.PI) / skills.length;
  const centerX = width / 2;
  const centerY = height / 2;

  const circles = Array.from({ length: levels }, (_, i) => {
    const levelRadius = (radius / levels) * (i + 1);
    return (
      <circle
        key={i}
        cx={centerX}
        cy={centerY}
        r={levelRadius}
        fill="none"
        stroke="#ddd"
      />
    );
  });

  let pathData = "";
  const linesAndLabels = skills.map((skill, i) => {
    const valueRatio = skill.amount / 100; // Scale based on percentage (0-100%)
    const x =
      centerX + radius * valueRatio * Math.cos(angleSlice * i - Math.PI / 2);
    const y =
      centerY + radius * valueRatio * Math.sin(angleSlice * i - Math.PI / 2);
    pathData += `${i === 0 ? "M" : "L"} ${x},${y} `;

    return (
      <g key={skill.type}>
        <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#bbb" />
        <text
          x={x}
          y={y}
          dy="0.35em"
          textAnchor={x < centerX ? "end" : "start"}
          style={{ cursor: "pointer", fontSize: "12px", fill: "#333" }}
        >
          {skill.type.replace("skill_", "").toUpperCase()}
        </text>
      </g>
    );
  });
  pathData += "Z";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f4f4f4",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ background: "#fff", borderRadius: "10px" }}
      >
        {circles}
        {linesAndLabels}
        <path
          d={pathData}
          fill="rgba(0, 123, 255, 0.5)"
          stroke="#007bff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default RadarChart;

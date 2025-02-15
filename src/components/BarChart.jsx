import React from "react";


//Component to create a bar chart for the audits done and received
const AuditBarChart = ({ auditsDone, auditsReceived }) => {
  const width = 400; 
  const height = 180; 
  const barHeight = 30;
  const maxValue = Math.max(auditsDone, auditsReceived) || 1;

  const doneWidth = (auditsDone / maxValue) * width;
  const receivedWidth = (auditsReceived / maxValue) * width;

    return (
      <div>
        <svg
          width={width}
          height={height}
          style={{ background: "#f4f4f4", borderRadius: "10px" }}
        >
          {/* Audits Done Label */}
          <text x={0} y={20} fill="black" fontSize="18" fontWeight="">
            Audits Done: {auditsDone} MB
          </text>

          {/* Audits Done Bar */}
          <rect
            x={0}
            y={30}
            width={doneWidth}
            height={barHeight}
            fill="#2196F3"
          />

          {/* Audits Received Label */}
          <text x={0} y={85} fill="black" fontSize="18" fontWeight="">
            Audits Received: {auditsReceived} MB
          </text>

          {/* Audits Received Bar */}
          <rect
            x={0}
            y={95}
            width={receivedWidth}
            height={barHeight}
            fill="#F44336"
          />
        </svg>
      </div>
    );
};

export default AuditBarChart;

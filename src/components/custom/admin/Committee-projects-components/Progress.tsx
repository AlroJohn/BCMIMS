import React from "react";

// Progress component extracted from the main file
const Progress = ({
  value = 0,
  className = "",
}: {
  value?: number;
  className?: string;
}) => (
  <div
    className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
  >
    <div
      className="h-full bg-blue-500 transition-all"
      style={{ width: `${Math.min(Math.max(0, value), 100)}%` }}
    />
  </div>
);

export default Progress;

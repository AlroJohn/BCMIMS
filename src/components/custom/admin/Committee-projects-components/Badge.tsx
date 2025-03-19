import React from "react";

// Badge component extracted from the main file
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
  >
    {children}
  </span>
);

export default Badge;

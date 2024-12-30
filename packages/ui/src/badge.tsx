import React, { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center rounded-full text-xs font-medium px-3 py-1";

  const variantStyles = {
    primary: "bg-primary text-black",
    secondary: "bg-secondary text-black",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

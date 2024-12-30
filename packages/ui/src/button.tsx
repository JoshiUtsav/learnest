import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  position?: "static" | "absolute" | "relative" | "fixed" | "sticky";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  href,
  onClick,
  className = "",
  disabled = false,
  fullWidth = false,
  position = "static",
  top,
  right,
  bottom,
  left,
  target,
  rel,
}) => {
  const baseStyles =
    "font-medium rounded-md transition-colors duration-200 flex items-center justify-center";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-700",
    secondary: "bg-secondary text-white hover:bg-secondary-700",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
  };

  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const positionStyles =
    position !== "static"
      ? `${position} ${top || ""} ${right || ""} ${bottom || ""} ${left || ""}`
      : "";

  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${positionStyles}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `.trim();

  if (href) {
    return (
      <a
        href={href}
        className={buttonStyles}
        onClick={onClick}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

import React from "react";
import Button from "./button";

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-white px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Logo</div>
        <Button variant="secondary">Sign In</Button>
      </div>
    </nav>
  );
};

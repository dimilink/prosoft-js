import React from "react";
import { NavLink } from "react-router";

export const Header = () => {
  return (
    <div style={{ display: "flex", columnGap: "10px" }}>
      <NavLink to="/catalog">
        <button>Каталог</button>
      </NavLink>
    </div>
  );
};


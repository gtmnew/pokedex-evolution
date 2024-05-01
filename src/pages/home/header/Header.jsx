import React from "react";
import css from "./header.module.scss";
import logo from "../../../assets/pokemon.png";
import * as FaIcons from "react-icons/fa";
import pokeball from "../../../../src/assets/pokeball.png";

export default function Header({ getSearch }) {
  return (
    <nav className={css.header}>
      <div className={css.div_header}>
        <div className={css.div_logo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={css.div_search}>
          <div>
            <FaIcons.FaSearch />
          </div>
          <input type="search" onChange={(e) => getSearch(e.target.value)} />
          <img src={pokeball} alt="pokeball" className="pokeball" />
        </div>
      </div>
    </nav>
  );
}

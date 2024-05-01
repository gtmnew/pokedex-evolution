import React, { useState, useEffect } from "react";
import css from "./layout.module.scss";
import Header from "../home/header/Header";
import axios from "axios";
import * as FaIcons from "react-icons/fa";
import { URL_POKEMON } from "./../../api/apiRest";
import Card from "../home/card/Card";

export default function LayoutHome() {
  const [arrayPokemon, setArrayPokemon] = useState([]);
  const [globalPokemon, setGlobalPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [xpage, setXpage] = useState(1);

  useEffect(() => {
    const api = async () => {
      const limit = 15;
      const xp = (xpage - 1) * limit;
      const apiPoke = await axios.get(
        `${URL_POKEMON}/?offset=${xp}&limit=${limit}`
      );

      setArrayPokemon(apiPoke.data.results);
    };
    api();
    getGlobalPokemons();
  }, [xpage]);

  const getGlobalPokemons = async () => {
    const res = await axios.get(`${URL_POKEMON}?offset=0&limit=1000`);

    const promises = res.data.results.map((pokemon) => {
      return pokemon;
    });

    const results = await Promise.all(promises);
    setGlobalPokemon(results);
  };

  const filterPokemons =
    search?.length > 0
      ? globalPokemon?.filter((pokemon) => pokemon?.name?.includes(search))
      : arrayPokemon;

  const getSearch = (e) => {
    const texto = e.toLowerCase();
    setSearch(texto);
    setXpage(1);
  };

  return (
    <div className={css.layout}>
      <Header getSearch={getSearch} />

      <section className={css.section_pagination}>
        <div className={css.div_pagination}>
          <span
            className={css.item_left}
            onClick={() => {
              if (xpage === 1) {
                return console.log("Página carregada!");
              }
              setXpage(xpage - 1);
            }}
          >
            {" "}
            <FaIcons.FaAngleLeft />{" "}
          </span>
          <span className={css.item}>{xpage}</span>
          <span className={css.item}> DE </span>
          <span className={css.item}>
            {" "}
            {Math.round(globalPokemon?.length / 15)}
          </span>
          <span
            className={css.item_right}
            onClick={() => {
              if (xpage === 67) {
                return console.log("Última página já foi carregada!");
              }
              setXpage(xpage + 1);
            }}
          >
            <FaIcons.FaAngleRight />{" "}
          </span>
        </div>
      </section>

      <div className={css.card_content}>
        {filterPokemons.map((card, index) => {
          return <Card key={index} card={card} />;
        })}
      </div>
    </div>
  );
}

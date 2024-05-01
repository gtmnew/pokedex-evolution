import React, { useEffect, useState } from "react";
import css from "./card.module.scss";
import axios from "axios";
import {
  URL_ESPECIES,
  URL_EVOLUCTIONS,
  URL_POKEMON,
} from "../../../api/apiRest";

export default function Card({ card }) {
  const [itemPokemon, setItemPokemon] = useState({});
  const [especiePokemon, setEspeciePokemon] = useState({});
  const [evoluctions, setEvoluctions] = useState([]);

  console.log(evoluctions);

  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);
      setItemPokemon(api.data);
    };
    dataPokemon();
  }, [card]);

  useEffect(() => {
    const dataEspecie = async () => {
      const URL = card.url.split("/");
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
      setEspeciePokemon({
        url_especie: api?.data?.evolution_chain,
        data: api?.data,
      });
    };

    dataEspecie();
  }, [card]);

  useEffect(() => {
    async function getPokemonImage(id) {
      const response = await axios.get(`${URL_POKEMON}/${id}`);
      return response?.data?.sprites?.other["official-artwork"]?.front_default;
    }

    if (especiePokemon?.url_especie) {
      const getEvoluctions = async () => {
        const arrayEvoluctions = [];
        const URL = especiePokemon?.url_especie?.url?.split("/");
        const api = await axios.get(`${URL_EVOLUCTIONS}/${URL[6]}`);
        const URL2 = api?.data?.chain?.species?.url?.split("/");
        const img1 = await getPokemonImage(URL2[6]);

        arrayEvoluctions.push({
          img: img1,
          name: api?.data?.chain?.species?.name,
        });

        if (api?.data?.chain?.evolves_to?.length !== 0) {
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          const ID = DATA2?.url?.split("/");
          const img2 = await getPokemonImage(ID[6]);

          arrayEvoluctions.push({
            img: img2,
            name: DATA2?.name,
          });

          if (api?.data?.chain?.evolves_to[0]?.evolves_to?.length !== 0) {
            const DATA3 =
              api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
            const ID = DATA3?.url?.split("/");
            const img3 = await getPokemonImage(ID[6]);

            arrayEvoluctions.push({
              img: img3,
              name: DATA3?.name,
            });
          }
        }

        setEvoluctions(arrayEvoluctions);
      };
      getEvoluctions();
    }
  }, [especiePokemon]);

  let pokeId = itemPokemon?.id?.toString();

  if (pokeId?.length == 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId?.length == 2) {
    pokeId = "0" + pokeId;
  }
  console.log(especiePokemon);
  return (
    <div className={css.card}>
      <img
        className={css.img_poke}
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
        alt="pokemon"
      />
      <div
        className={`bg-${especiePokemon?.data?.color?.name} ${css.sub_card}`}
      >
        <strong className={css.id_card}>#{pokeId}</strong>
        <strong className={css.name_card}>{itemPokemon.name}</strong>
        <h4 className={css.altura_poke}>
          Altura: {itemPokemon.height}0 <span>cm</span>
        </h4>
        <h4 className={css.peso_poke}>
          Peso: {itemPokemon.weight} <span>kg</span>
        </h4>
        <h4 className={css.habitat_poke}>
          Habitat: {especiePokemon?.data?.habitat?.name}{" "}
        </h4>

        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return (
              <h6 key={index} className={css.item_stats}>
                <span className={css.name}> {sta.stat.name} </span>
                <progress value={sta.base_stat} max={160}></progress>
                <span className={css.number}> {sta.base_stat} </span>
              </h6>
            );
          })}
        </div>
        <div className={css.div_type_color}>
          {itemPokemon?.types?.map((ty, index) => {
            return (
              <h6
                key={index}
                className={`color-${ty.type.name} ${css.color_type}`}
              >
                {" "}
                {ty.type.name}{" "}
              </h6>
            );
          })}
        </div>
        <div className={css.div_evoluction}>
          {evoluctions.map((evo, index) => {
            return (
              <div key={index} className={css.item_evo}>
                <img src={evo.img} alt={evo.name} className={css.img} />
                <h6> {evo.name}</h6>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

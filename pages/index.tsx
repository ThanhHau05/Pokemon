import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import InfoPokemon from "../components/InfoPokemon";
import IconSVG from "../Icons/IconSVG";
import { HiSearch } from "react-icons/hi";
import styles from "../styles/Home.module.scss";
import { NamePokemon } from "../components/NamePokemon";
const cx = classNames.bind(styles);
const axios = require("axios");
interface ItemPokemon {
  id: string;
  name: string;
  sprites: {
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
}

export default function Home() {
  const [itempokemon, setItemPokemon] = useState<ItemPokemon[]>([]);
  const [itempokemonsearch, setItemPokemonSearch] = useState<ItemPokemon>();
  const [nexturl, setNextUrl] = useState("");
  const [numberpokemon, setNumberPokemon] = useState(48);
  const [valueinput, setValueInput] = useState("");
  const [valuesearch, setValueSearch] = useState("");
  const [iteminfopokemon, setItemInfoPokemon] = useState("");
  const [searchloading, setSearchLoading] = useState(false);
  const [checkpokemon, setCheckPokemon] = useState(false);
  useEffect(() => {
    setItemPokemon([]);
    const _getpokemon = async () => {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${numberpokemon}&offset=0`
      );
      await setNextUrl(res.data.next);
      await res.data.results.forEach(async (element) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${element.name}`
        );
        await setItemPokemon((prev) => [...prev, poke.data]);
      });
    };
    _getpokemon();
  }, [numberpokemon]);

  useEffect(() => {
    if (valueinput !== "") {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        const _handlegetpokemon = async () => {
          try {
            const poke = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${valueinput
                .toLowerCase()
                .trim()}`
            );
            setValueSearch("");
            setItemPokemonSearch(poke.data);
          } catch {
            const data = [];
            const _handle = async () => {
              await Promise.all(
                NamePokemon.map(async (item) => {
                  const contents = await SearchPokemon(
                    valueinput,
                    item.toLowerCase()
                  );
                  const items = {
                    smallest_number: contents,
                    name: item.toLowerCase(),
                  };
                  data.push(items);
                })
              );
              let number_min = await data.reduce(function (prev, current) {
                return prev.smallest_number < current.smallest_number
                  ? prev
                  : current;
              });
              setValueSearch(number_min.name);
            };
            _handle();
          }
        };
        _handlegetpokemon();
        const timer = setTimeout(() => {
          setSearchLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [valueinput]);

  useEffect(() => {
    const removetext = document.getElementById("removetext");
    if (valueinput !== "") {
      removetext.style.display = "flex";
      const timer = setTimeout(async () => {
        const textabove = document.getElementById("removetext-above");
        textabove.style.transform = "rotate(45deg)";
        const textbelow = document.getElementById("removetext-below");
        textbelow.style.transform = "rotate(315deg)";
      }, 50);
      return async () => clearTimeout(timer);
    } else if (removetext !== null) {
      const textabove = document.getElementById("removetext-above");
      textabove.style.transform = "rotate(0deg)";
      const textbelow = document.getElementById("removetext-below");
      textbelow.style.transform = "rotate(0deg)";
      const timer = setTimeout(() => {
        removetext.style.display = "none";
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [valueinput]);

  const SearchPokemon = async (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    var j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = await j;
    }
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = await matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  const _handleRenderItem = () => {
    if (valueinput === "") {
      if (itempokemon.length < numberpokemon) {
        return (
          <div className={cx("pokeball-loading-container")}>
            <div className={cx("pokeball-loading")}>
              <IconSVG.Pokeball />
            </div>
          </div>
        );
      } else {
        return itempokemon.map((item) => (
          <div className={cx("item-pokemon-container")} key={item.id}>
            <div
              className={cx("item-pokemon")}
              onClick={() => _handleGetItemInfoPokemon(item)}
            >
              <div className={cx("pokemon-title")}>
                {Number(item.id) >= 100 ? (
                  <small>#{item.id}</small>
                ) : (
                  <small>#0{item.id}</small>
                )}
                <span>{item.name}</span>
              </div>
              <img
                src={item.sprites.other["official-artwork"].front_default}
                alt={item.name}
              />
            </div>
          </div>
        ));
      }
    } else {
      if (searchloading) {
        return (
          <div className={cx("pokeball-loading-container")}>
            <div className={cx("pokeball-loading")}>
              <IconSVG.Pokeball />
            </div>
          </div>
        );
      } else {
        if (valuesearch !== "") {
          return (
            <div className={cx("cantfind-pokemon")}>
              <p>Cant&apos;s find Pokemon&nbsp;{valueinput}</p>
              <span>
                You&apos;re referring to Pokemon&nbsp;
                <p
                  className={cx("pokemon-name-suggestion")}
                  onClick={() =>
                    setValueInput(valuesearch.match(/[a-z,A-Z]+/gm)[0])
                  }
                >
                  {valuesearch.match(/[a-z,A-Z]+/gm)}
                </p>
                ?
              </span>
            </div>
          );
        } else if (itempokemonsearch !== undefined) {
          return (
            <div
              className={cx("item-pokemon-container")}
              key={itempokemonsearch.id}
            >
              <div
                className={cx("item-pokemon")}
                onClick={() => _handleGetItemInfoPokemon(itempokemonsearch)}
              >
                <div className={cx("pokemon-title")}>
                  <span>{itempokemonsearch.name}</span>
                </div>
                <img
                  src={
                    itempokemonsearch.sprites.other["official-artwork"]
                      .front_default
                  }
                  alt={itempokemonsearch.name}
                />
              </div>
            </div>
          );
        }
      }
    }
  };

  const _handleGetItemInfoPokemon = (e) => {
    setItemInfoPokemon(e);
    setCheckPokemon(true);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h2 className={cx("main-title")}>Prokemon</h2>
        <div className={cx("button-search-container")}>
          <HiSearch className={cx("search-icon")} />
          <input
            type="text"
            placeholder="pikachu, ditto,..."
            value={valueinput}
            onChange={(e) => setValueInput(e.target.value)}
          />
          <div id="removetext" className={cx("removetext-container")}>
            <div className={cx("removetext")} onClick={() => setValueInput("")}>
              <div
                id="removetext-above"
                className={cx("removetext-above")}
              ></div>
              <div
                id="removetext-below"
                className={cx("removetext-below")}
              ></div>
            </div>
          </div>
        </div>
        <div className={cx("pokemon-container")}>{_handleRenderItem()}</div>
        <div id="see-more" className={cx("see-more-container")}>
          <span
            className={cx("see-more")}
            onClick={() => setNumberPokemon(numberpokemon + 48)}
          >
            See More
          </span>
        </div>
      </div>
      <InfoPokemon
        nextpokemon={nexturl}
        checkpokemon={checkpokemon}
        itempokemon={iteminfopokemon}
      />
    </div>
  );
}

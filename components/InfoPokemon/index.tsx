import styles from "../InfoPokemon/InfoPokemon.module.scss";
import classNames from "classnames/bind";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import SampleNextArrow from "../SampleNextArrow";
import SamplePrevArrow from "../SamplePrevArrow";
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
    versions: {
      ["generation-v"]: {
        ["black-white"]: {
          animated: {
            front_default: string;
          };
        };
      };
    };
  };
  height: string;
  weight: string;
  types: {
    [x: string]: any;
    slot: string;
    type: {
      name: string;
    };
  };
}

function InfoPokemon({ nextpokemon }) {
  const [itemslider, setItemSlider] = useState<ItemPokemon[]>([]);
  const [showarrow, setShowArrow] = useState(false);
  useEffect(() => {
    const _getnextpokemon = async () => {
      const res = await axios.get(nextpokemon);
      res.data.results?.forEach(async (element) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${element.name}`
        );
        setItemSlider((prev) => [...prev, poke.data]);
      });
    };
    _getnextpokemon();
  }, [nextpokemon]);

  const _handleRenderItem = () => {
    return itemslider.map((item) => (
      <div key={item.id}>
        <div className={cx("item-slider-container")}>
          <div className={cx("pokemon-image")}>
            <img
              src={item.sprites.other["official-artwork"].front_default}
              alt={item.name}
            />
          </div>
          <div className={cx("slider-content-container")}>
            <div className={cx("pokemon-title")}>
              <span>{item.name}</span>
            </div>
            <div className={cx("pokemon-type-container")}>
              <span className={cx("pokemon-type-title")}>Types:</span>
              <div className={cx("pokemon-types-type")}>
                {item.types.map((items) => (
                  <span
                    key={items.slot}
                    className={cx("type_" + items.type.name)}
                  >
                    {items.type.name}
                  </span>
                ))}
              </div>
            </div>
            <div className={cx("hw-pokemon")}>
              <span className={cx("h-pokemon")}>
                Height: <span>{Number(item.height) / 10}m</span>
              </span>
              <span className={cx("w-pokemon")}>
                Weight: <span>{Number(item.weight) / 10}kg</span>
              </span>
            </div>
            <div className={cx("pokemon-gif")}>
              <img
                src={
                  item.sprites.versions["generation-v"]["black-white"].animated
                    .front_default
                }
                alt={item.name}
              />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const _handleShowArrow = () => {
    setShowArrow(true);
  };

  const _handleHideArrow = () => {
    setShowArrow(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    rows: 3,
  };
  const settingarrow = {
    nextArrow: <SampleNextArrow onClick={undefined} isHighLight={showarrow} />,
    prevArrow: <SamplePrevArrow onClick={undefined} isHighLight={showarrow} />,
  };
  return (
    <div
      className={cx("container")}
      onMouseOver={_handleShowArrow}
      onMouseOut={_handleHideArrow}
    >
      <Slider {...settings} {...settingarrow}>
        {_handleRenderItem()}
      </Slider>
    </div>
  );
}

export default InfoPokemon;

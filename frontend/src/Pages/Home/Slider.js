import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { v4 } from "uuid";
import { backend, loadingUrl } from "../../env";
import SmallCard from "./SmallCard";
import "./styles/Slider.scss";

const getCardData = async (query, totalDisplay, page) => {
  try {
    const responce = await fetch(backend+`/course/search?q=${query}&pagesize=${totalDisplay}&page=${page}`);
    const data = await responce.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const Slider = ({ name, query }) => {
  const [cards, setCard] = useState([]);
  const [current, setCurrent] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [leftHide, setLeftHide] = useState(false);
  const [rightHide, setRightHide] = useState(false);
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    getCardData(query, totalDisplay, current).then((data) => {
      setCard(data.courses);
      setTotalCards(data.totalPages);
      setLoaded(true)
    }).catch((err) => console.log(err));
  }, [])
  

  let totalDisplay = 5;
  const width = window.innerWidth;
  const veryBigScreen = width >= 1560;
  if (!veryBigScreen) {
    const bigScreen = width < 1560 && width >= 1200;
    if (bigScreen) {
      totalDisplay = 4;
    }

    const mediumScreen = width < 1200 && width >= 930;
    if (mediumScreen) {
      totalDisplay = 3;
    }

    const smallScreen = width < 930 && width >= 660;
    if (smallScreen) {
      totalDisplay = 2;
    }

    if (width < 660) {
      totalDisplay = 1;
    }
  }

  const prvSlide = () => {
    getCardData(query, totalDisplay, current-1).then((data) => {
      setCurrent(current-1);
      setCard(data.courses);
      setTotalCards(data.totalPages);
    }).catch((err) => console.log(err));
  }

  const nextSlide = () => {
    getCardData(query, totalDisplay, current+1).then((data) => {
      setCurrent(current+1);
      setCard(data.courses);
      setTotalCards(data.totalPages);
    }).catch((err) => console.log(err));
  }

  useEffect(() => {
    if(current<=1) {
      setLeftHide(true);
    }

    if(current>1) {
      setLeftHide(false);
    }

    if(current<totalCards) {
      setRightHide(false);
    }
    
    if(current>=totalCards) {
      setRightHide(true);
    }
  }, [current, cards])


  return (
    <div className="Slider">
      <h1>{name}</h1>

      <div className="cards">
        <img
          src="/left-arrow.png"
          alt="left-arrow"
          className={`left-arrow arrow ${leftHide?"hide":""}`}
          onClick={prvSlide}
        />

        {!loaded?
          Array.from(Array(totalDisplay).keys()).map(() => 
            <img src={loadingUrl+"?tr=h-155"} alt="loading" />
          )
        :""}

        {cards?.map((card) => (
          <SmallCard
            key={v4()}
            card={card}
            fav={true}
          />
        ))}

        <img
          src="/left-arrow.png"
          alt="right-arrow"
          className={`right-arrow arrow ${rightHide?"hide":""}`}
          onClick={nextSlide}
        />
      </div>
    </div>
  );
};

export default Slider;

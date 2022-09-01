import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./styles/HomeCarosel.scss";
import { backend } from "../../env";
import { v4 } from "uuid";

const options = {
  autoFocus: true,
  autoPlay: true,
  dynamicHeight: false,
  emulateTouch: true,
  infiniteLoop: true,
  showThumbs: false,
  showStatus: false,
};

const getCaroselData = async () => {
  try {
    const responce = await fetch(backend + "/info");
    const caroselData = await responce.json();
    return caroselData.carousel;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const HomeCarosel = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getCaroselData()
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div id="home-carosel">
      <Carousel {...options}>
        {data.map((item) => (
          <div key={v4()}>
            <img src={item?.img} alt="" />
            <a href={item?.link} className={`legend ${item?.type}`}>{item?.text}</a>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarosel;

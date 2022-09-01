import React, { useEffect, useState } from "react";
import "./styles/Main.scss";
import CatCard from "./CatCard";
import HomeCarosel from "./HomeCarosel";
import { backend } from "../../env";
import Slider from "./Slider";
import { v4 } from "uuid";

const getTopCategories = async () => {
  try {
    const responce = await fetch(backend + "/info");
    const caroselData = await responce.json();
    return caroselData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const Home = () => {
  const [cat, setCat] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    getTopCategories().then((data) => {
      setCat(data.topCat);
      setSections(data.section);
    }).catch((err) => console.log(err));
  }, []);
  return (
    <section id="home">
      <HomeCarosel />
      <Slider name="Hot Courses" query="a" />

      {cat.length > 0 && (
        <div className="categories">
          <div className="head">
            <h1 className="section">Top Categories</h1>
            <a href="/">View All</a>
          </div>

          <div className="body">
          {cat.map((item) => (
            <CatCard
              key={v4()}
              img={item.img}
              query={item.query.replaceAll(" ", "+")}
              text={item.text}
            />
          ))}
          </div>
        </div>
      )}

      {sections?.map((section) => (
        <Slider name={section.name} query={section.query} />
      ))}
    </section>
  );
};

export default Home;

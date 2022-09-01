import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { backend, loadingUrl } from "../../env";
import CatCard from "../Home/CatCard";
import "./Main.scss";

const getCategories = async () => {
  try {
    const responce = await fetch(backend + "/info");
    const caroselData = await responce.json();
    return caroselData.categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const Main = () => {
  const [cat, setCat] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getCategories().then(
      (data) => {
        setCat(data)
        setLoaded(true);
      }).catch((err) => console.log(err));
  }, []);

  return (
    <div id="categories">
      {!loaded?<img src={loadingUrl+"?tr=h-155"} alt="loading" />:""}
      {cat.map((item) => (
        <CatCard
          key={v4()}
          img={item.img}
          query={item.query.replaceAll(" ", "+")}
          text={item.text}
        />
      ))}
    </div>
  );
};

export default Main;

import React from "react";
import "./styles/CatCard.scss";
import {useNavigate} from "react-router-dom";

const CatCard = ({ img, query, text }) => {
  const history = useNavigate();
  return (
    <div className="cat">
      <div className="cover-img">
        <p onClick={() => history("/search?topic="+query)}>
          <img src={img} alt="Design" />
        </p>
      </div>
      <h3>{text}</h3>
    </div>
  );
};

export default CatCard;

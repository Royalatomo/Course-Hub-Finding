import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateList } from "../../app/slice/favlistSlice";
import "./styles/ResultCard.scss";

const ResultCard = ({ card }) => {
  const history = useNavigate();
  const [favState, setFavState] = useState(false);
  const favCourses = useSelector((state) => state.favlist);
  const dispatch = useDispatch();

  useEffect(() => {
    let marked = false;
    for (let i = 0; i < favCourses.length; i++) {
      if (favCourses[i] === card._id) {
        marked = true;
        setFavState(true);
        break;
      }
    }
    if(!marked) setFavState(false);
  }, [card._id, favCourses]);

  const saveFavStorage = () => {
    if (!favState) {
      const list = [...favCourses, card._id];
      dispatch(updateList({list}));
    } else {
      const newList = [];
      favCourses.forEach((course) => {
        if (course !== card._id) {
          newList.push(course);
        }
      });
      dispatch(updateList({list: newList}));
    }
  };

  const toggleFav = (e) => {
    saveFavStorage();
    setFavState(!favState);
  };

  function returnText(lvl) {
    switch (lvl) {
      case 0:
        return "All Levels";

      case 1:
        return "Beginner";

      case 2:
        return "Intermediate";

      case 3:
        return "Expert";

      default:
        return "All Levels";
    }
  }

  return (
    <div className="course">
      <img className="pointer" src={card.img} alt="course_image" onClick={() => history("/course?id="+card._id)} />

      <div className="info">
        <p className="pointer" onClick={() => history("/course?id="+card._id)}>
          <h3>{card.name}</h3>
        </p>
        <p className="desc">{card.description}</p>
        <p className="instructor">
          {card?.instructors.map((item, i) => {
            let text = item;
            if (i !== card?.instructors.length - 1) {
              text += ", ";
            }
            return text;
          })}
        </p>

        <p className="time">
          {card?.info?.hrs} hrs
          <span className="dot" />
          {card?.info?.lectures} Lectures
          <span className="dot" />
          {returnText(card?.info?.level)}
        </p>
      </div>

      <button className="fav" onClick={toggleFav}>
        <img src={favState ? "/favicon-filled.png" : "/heart-gray.png"} alt="" />
      </button>
    </div>
  );
};

export default ResultCard;

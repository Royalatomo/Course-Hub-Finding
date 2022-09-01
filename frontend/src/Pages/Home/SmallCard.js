import React, { useEffect, useState } from "react";
import "./styles/SmallCard.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateList } from "../../app/slice/favlistSlice";
import { v4 } from "uuid";

const SmallCard = ({ card, fav }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [favState, setFavState] = useState(false);
  const favCourses = useSelector((state) => state.favlist);

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

  function popupShow(e) {
    const box = e.currentTarget.querySelector(".popup-box");
    const right = box.getBoundingClientRect().right;
    const width = window.innerWidth;
    const rightFuturePosition = right + box.clientWidth;

    if (rightFuturePosition > width) {
      const left = box.getBoundingClientRect().left;
      const leftFuturePosition = left - box.clientWidth;
      if (leftFuturePosition < 0) {
        box.classList.add("center");
      } else {
        box.classList.add("left");
      }
    }
    box.classList.add("active");
  }

  function popupHide(e) {
    const box = e.currentTarget.querySelector(".popup-box");
    box.classList.remove("active");
    box.classList.remove("center");
    box.classList.remove("left");
  }

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

  function getDate(updated) {
    if(!updated) return;
    const date = new Date(parseInt(updated));
    return `Last Updated: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  return (
    <div
      className="card"
      onMouseEnter={popupShow}
      onMouseLeave={popupHide}
      data-id={card?._id}
      >
      <span className="head">
        <img
          src={favState ? "/favicon-filled.png" : "/favicon-empty.png"}
          alt=""
          className={`favourite ${favState ? "" : "empty"}`}
          onClick={toggleFav}
          />
        <img src={card?.img} alt="img" className="pointer cover-img" onClick={() => history("/course?id="+card._id)} />
      </span>

      <span className="body">
        <p className="cname pointer" onClick={() => history("/course?id="+card._id)}>{card?.name}</p>

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
      </span>

      <div className="popup-box">
        <h1 className="pointer" onClick={() => history("/course?id="+card._id)}>{card?.name}</h1>
        <p className="last-updated">{getDate(card?.lastUpdated)}</p>
        <div className="instructors">
          {card?.instructors.map((item) => (
            <span key={v4()}>{item}</span>
          ))}
        </div>

        <p className="time">
          {card?.info?.hrs} hrs
          <span className="dot" />
          {card?.info?.lectures} Lectures
          <span className="dot" />
          {returnText(card?.info?.level)}
        </p>
        <p className="desc">{card?.description}</p>
        <div className="original-div" onClick={toggleFav}>
          <a href={card?.links?.original} className="original">
            Buy Original
          </a>
          <img
            src={favState ? "/favicon-filled.png" : "/heart-gray.png"}
            alt="fav-icon"
          />
        </div>
        <p onClick={() => history("/course?id="+card._id)} className="watch-now pointer">
          Watch Now
        </p>
      </div>
    </div>
  );
};

export default SmallCard;

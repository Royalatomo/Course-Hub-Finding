import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { updateList } from "../../app/slice/favlistSlice";
import "./styles/CollectionCard.scss";
import { useNavigate } from "react-router-dom";

const CollectionCard = ({ course: card }) => {
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
    if (!marked) setFavState(false);
  }, [card._id, favCourses]);

  function sendToCourse(e) {
    if (e.target.classList.contains("desc")) return;
    else if (e.target.classList.contains("fav-img")) return;
    else if (e.target.classList.contains("fav")) return;
    // window.location.href = "/";
  }

  function popupShow(e) {
    const box = e.currentTarget.querySelector(".popup-box");
    const right = box.getBoundingClientRect().right;
    const width = window.innerWidth;
    const rightFuturePosition = right + box.clientWidth;

    if (rightFuturePosition > width) {
      const left = box.getBoundingClientRect().left;
      const leftFuturePosition = left - box.clientWidth;
      console.log(leftFuturePosition);
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
      dispatch(updateList({ list }));
    } else {
      const newList = [];
      favCourses.forEach((course) => {
        if (course !== card._id) {
          newList.push(course);
        }
      });
      dispatch(updateList({ list: newList }));
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
    if (!updated) return;
    const date = new Date(parseInt(updated));
    return `Last Updated: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }
  return (
    <div
      className="card"
      onClick={sendToCourse}
      onMouseEnter={popupShow}
      onMouseLeave={popupHide}
    >
      <img src={card.img} alt="cover-img" className="cover-img pointer" onClick={() => history("/course?id="+card._id)} />

      <div className="divide">
        <h4 className="course-name pointer" onClick={() => history("/course?id="+card._id)}>{card.name}</h4>
        <p className="desc">{card.description}</p>

        <div className="fav" onClick={toggleFav}>
          <img src={favState ? "/favicon-filled.png" : "/heart-gray.png"} alt="fav" className="fav-img" />
        </div>
        <div className="intructors">
          {card.instructors?.map((author) => (
            <span key={v4()}>{author}</span>
          ))}
        </div>

        <p className="time">
          {card?.info?.hrs} hrs
          <span className="dot" />
          {card?.info?.lectures} Lectures
          <span className="dot" />
          {returnText(card?.info?.level)}
        </p>
      </div>

      <div className="popup-box ">
        <h1 className="pointer" onClick={() => history("/course?id="+card._id)}>{card.name}</h1>
        <p className="last-updated">{getDate(card.lastUpdated)}</p>
        <div className="instructors">
          {card.instructors?.map((author) => (
            <span key={v4()}>{author}</span>
          ))}
        </div>

        <p className="time">
          {card?.info?.hrs} hrs
          <span className="dot" />
          {card?.info?.lectures} Lectures
          <span className="dot" />
          {returnText(card?.info?.level)}
        </p>
        <p className="desc">{card.description}</p>
        <div className="original-div" onClick={toggleFav}>
          <a href="/" className="original">
            Buy Original
          </a>
          <img src={favState ? "/favicon-filled.png" : "/heart-gray.png"}  alt="fav-icon" onClick={toggleFav} />
        </div>
        <p onClick={() => history("/course?id="+card._id)} className="watch-now pointer">
          Watch Now
        </p>
      </div>
    </div>
  );
};

export default CollectionCard;

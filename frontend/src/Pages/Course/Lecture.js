import React from "react";
import "./styles/Lecture.scss";

const Lecture = ({ name, num, mins }) => {
  return (
    <div className="lecture">
      <img src="/play.png" alt="play" />
      <p className="lecture-heading">
        <span>Lecture {num}:</span> {name}
      </p>
      <p className="length">{mins} min</p>
    </div>
  );
};

export default Lecture;

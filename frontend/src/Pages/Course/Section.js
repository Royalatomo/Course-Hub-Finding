import React from "react";
import { v4 } from "uuid";
import Lecture from "./Lecture";
import "./styles/Section.scss";

const Section = ({ name, info, lectures }) => {
  const toggleBox = (e) => {
    const box = e.currentTarget.parentElement;
    box.classList.toggle("active");
  };
  return (
    <div className="box">
      <div className="section" onClick={toggleBox}>
        <img src="/down-arrow.png" alt="down" />
        <p className="section-head">{name}</p>
        <p className="info">
          {info.lectures} Lectures <span className="dot" /> {info.mins} min
        </p>
      </div>

      <div className="section-lectures">
        {lectures.map((lecture, i) => {
          return (
            <React.Fragment key={v4()}>
              <Lecture name={lecture.name} num={i} mins={lecture.mins} />
              {i!==lectures.length-1?<hr />:""}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Section;

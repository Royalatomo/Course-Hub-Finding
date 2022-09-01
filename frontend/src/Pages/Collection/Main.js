import React, { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import "./styles/Main.scss";
import { backend, loadingUrl } from "../../env";
import { v4 } from "uuid";

const getCourseData = async (list, mode) => {
  const course = [];

  for(let i of list) {
    try {
      const responce = await fetch(backend  + `/course/single?courseId=${i}&mode=${mode}`);
      const data = await responce.json();
      if(data.course) {
        course.push(data.course);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return course;
};

const Main = ({fav}) => {
  const courseList = JSON.parse(localStorage.getItem(fav?"favlist":"recent") || "[]");
  const [courseData, setCourseData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCourseData([])
    setLoaded(false)
    getCourseData(courseList, 0)
      .then((data) => {
          setCourseData(data);
          setLoaded(true);
      })
      .catch((err) => console.log(err));
  }, [fav]);

  return (
    <div id="collection">
      <h1 className="heading">{courseData.length} Courses</h1>

      <div className="cards-container">
        {!loaded?<img src={loadingUrl+"?tr=h-155"} alt="loading" />:""}
        {courseData?.map((item) => (
          <CollectionCard key={v4()} course={item} />
        ))}
      </div>
    </div>
  );
};

export default Main;

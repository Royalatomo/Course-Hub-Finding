import React, { useEffect, useState } from "react";
import { backend, loadingUrl } from "../../env";
import Section from "./Section";
import "./styles/Main.scss";
import { v4 } from "uuid";

const getCourseData = async (id, mode) => {
  try {
    const responce = await fetch(
      backend + `/course/single?courseId=${id}&mode=${mode}`
    );
    const data = await responce.json();
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const Main = () => {
  const courseId = window.location.search.split("&")[0].replaceAll("?id=", "");
  const [card, setCard] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(10);

  useEffect(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem("recent") || "[]");
    const newList = [];
    recentlyViewed.forEach((course) => {
      if (course !== courseId) {
        newList.push(course);
      }
    });
    localStorage.setItem("recent", JSON.stringify([courseId, ...newList]));

    getCourseData(courseId, 2)
      .then((data) => {
        setCard(data.course || 0);
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  }, []);

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
    <>
      {!loaded?<img src={loadingUrl+"?tr=h-155"} alt="loading" />:""}
      {card === 0 ? (
        <h1>Course Not Found</h1>
      ) : (
        <div id="course">
          <div className="divider info">
            <h1 className="title">{card.name}</h1>
            <p className="last-updated">{getDate(card.lastUpdated)}</p>
            <p className="description">{card.description}</p>

            <div className="creators">
              <h3 className="text">Created By</h3>
              {card.instructors?.map((author) => (
                <p key={v4()} className="creator-name">
                  {author}
                </p>
              ))}
            </div>

            <div className="course-content">
              <h2 className="section-heading">Course Content</h2>
              <p className="time">
                {card?.info?.hrs} hrs
                <span className="dot" />
                {card?.info?.lectures} Lectures
                <span className="dot" />
                {returnText(card?.info?.level)}
              </p>

              <div className="dropdown-boxes">
                {card.content?.slice(0, showContent)?.map((section) => (
                  <Section
                    key={v4()}
                    name={section.name}
                    info={section.info}
                    lectures={section.lectures}
                  />
                ))}
              </div>

              {card.content?.length > showContent ? (
                <p
                  className="loadmore pointer"
                  onClick={() => setShowContent(showContent + 10)}
                >
                  Show More
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="divider video">
            <div>
              <iframe
                height="230"
                width="410"
                src={card.trailer}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <div className="wrapper">
                <div className="buttons">
                  <a target="_blank" rel="noreferrer" className="original" href={card.links?.original}>
                    Buy Original Course
                  </a>
                  <a target="_blank" rel="noreferrer" className="watch" href={card.links?.watch}>
                    Watch Course Online
                  </a>
                  <a target="_blank" rel="noreferrer" className="download" href={card.links?.download}>
                    Download Course
                  </a>
                </div>

                <p className="msg">
                  We do not recommend watching/downloading course online for
                  free... Please if you can afford to pay for the course we
                  highly support that...
                </p>
                <p className="alert">
                  <span>Note:</span> Online watching and downloading services
                  are provided by 3rd party sites
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;

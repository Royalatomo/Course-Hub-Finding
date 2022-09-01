import React, { useEffect, useState } from "react";
import "./styles/Main.scss";
import ResultCard from "./ResultCard";

import { backend, loadingUrl } from "../../env";
import { useSelector } from "react-redux";

const getSearch = async (query="", level=0, topic="", length=17, pagesize=4, page=1) => {
  try {
    const responce = await fetch(backend + 
      `/course/search?q=${query}&level=${level}&topic=${topic}&length=${length}&pagesize=${pagesize}&page=${page}`);
    const data = await responce.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const Main = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState({total: 0, current: 0});
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({topics: [], level: "", length: ""});
  const [loaded, setLoaded] = useState(false);

  const search = useSelector((state) => state.search) || "";

  const PAGE_SIZE = 8;

  const [searchTopic, setSearchTopics] = useState([]);

  let query = window.location.search.split("&")[0].replace("?topic=", "");
  query = query.replaceAll("+", " ").replaceAll("%40", "&");

  useEffect(() => {
    getSearch(query, "", [], "", PAGE_SIZE)
    .then((data) => {
      setPage({total: data.totalPages, current: data.currentPage})
      setTotalResults(data.totalCourses)
      setSearchTopics(data.topics);
      setCourses(data.courses);
      setLoaded(true);
    })
    .catch((err) => console.log(err));
  }, [search, query])

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const filterBtn = document.querySelector(".controllers .filter");
    filterBtn.addEventListener("click", () => {
      toggleFilter();
    });

    document.querySelector("header .search input").value = query;
  }, []);

  function toggleFilter() {
    const filtersArea = document.querySelector(".items .filters");
    const allCourses = document.querySelector(".all-courses");

    if (filtersArea.classList.contains("disable")) {
      filtersArea.classList.toggle("disable");
      allCourses.classList.toggle("non-filter");
    } else {
      filtersArea.classList.add("animate-div");

      setTimeout(() => {
        allCourses.classList.toggle("non-filter");
        filtersArea.classList.toggle("disable");
        filtersArea.classList.remove("animate-div");
      }, 300);
    }
  }

  const loadmore = () => {
    getSearch(query, filters.level, filters.topic, filters.length, PAGE_SIZE, page.current+1)
    .then((data) => {
      setPage({total: data.totalPages, current: data.currentPage})
      setTotalResults(data.totalCourses)
      setSearchTopics(data.topics);
      setCourses([...courses, ...data.courses]);
    })
    .catch((err) => console.log(err));
  }

  const topicFilter = () => {
    const allInputs = document.querySelectorAll(".filter-item.topic input");
    const topic = [];
    for(let input of allInputs) {
      if(input.checked) {
        topic.push(input.dataset["value"]);
      }
    }

    getSearch(query, filters.level, topic.join(","), filters.length, PAGE_SIZE, 1)
    .then((data) => {
      setPage({total: data.totalPages, current: data.currentPage})
      setTotalResults(data.totalCourses)
      setCourses(data.courses);
    })

    setFilters({...filters, topic: topic.join(",")})
  }
  
  const levelFilter = (e) => {
    const alreadyChecked = !e.currentTarget.checked;
    const allInputs = document.querySelectorAll(".filter-item.level input");
    for(let i of allInputs) {
      i.checked = false;
    }

    let level = "";
    if(!alreadyChecked) {
      e.currentTarget.checked = true;
      level = e.currentTarget.dataset["value"];
    }

    getSearch(query, level, filters.topic, filters.length, PAGE_SIZE, 1)
    .then((data) => {
      setPage({total: data.totalPages, current: data.currentPage})
      setTotalResults(data.totalCourses)
      setCourses(data.courses);
    })
    
    setFilters({...filters, level})
  }
  const lengthFilter = (e) => {
    const alreadyChecked = !e.currentTarget.checked;
    const allInputs = document.querySelectorAll(".filter-item.length input");
    for(let i of allInputs) {
      i.checked = false;
    }

    let length = "";
    if(!alreadyChecked) {
      e.currentTarget.checked = true;
      length = e.currentTarget.dataset["value"];
    }

    getSearch(query, filters.level, filters.topic, length, PAGE_SIZE, 1)
    .then((data) => {
      setPage({total: data.totalPages, current: data.currentPage})
      setTotalResults(data.totalCourses)
      setCourses(data.courses);
    })
    setFilters({...filters, length})
  }

  const toggleTopicOption = (e) => {
    const element = e.currentTarget;
    const optionsDiv = element.parentElement.querySelector(".options");
    optionsDiv.classList.toggle("hide");

    const span = element.querySelector("span");
    const img = element.querySelector("img");

    if(span.innerText.toLowerCase() === "show more") {
      span.innerText = 'Show Less';
      img.style.transform = "rotate(180deg)"
    }else {
      span.innerHTML = 'Show More';
      img.style.transform = "rotate(0deg)"
    }
  }

  const clearFilter = () => {
    setFilters({topics: [], level: "", length: ""});
    const optionsDiv = document.querySelectorAll(".filter-item .options input");
    for(let i of optionsDiv) {
      i.checked = false;
    }

    getSearch(query, "", [], "", PAGE_SIZE, 1)
    .then((data) => {
      setPage({total: data.totalPages, current: data.currentPage})
      setTotalResults(data.totalCourses)
      setCourses(data.courses);
    })
  }

  return (
    <div id="result">
      <h1>{totalResults} Results for "{query}"</h1>

      <div className="controllers">
        <button className="filter">Filters</button>
        <button className="clear" onClick={clearFilter}>Clear Filters</button>
      </div>

      <div className="items">
        <div className="filters disable">

          <div className="filter-item topic">
            <img
              src="/close.png"
              alt="close-btn"
              onClick={toggleFilter}
              className="close-btn"
            />
            <h4>Topics</h4>
            <div className={`options ${(searchTopic || [])?.length>4?"hide":""}`}>
              {searchTopic?.map((item) => (
                <div className="option-item">
                  <input data-value={item} type="checkbox" onClick={topicFilter} /> {item}
                </div>
              ))}
            </div>

            {(searchTopic || [])?.length>4?
              <button className="show-more" onClick={toggleTopicOption}>
                <span>Show More</span> <img src="/blue-down-arrow.png" alt="arrow-down" />
              </button>:""
            }
          </div>

          <div className="filter-item level">
            <h4>Levels</h4>

            <div className="options">
              <div className="option-item">
                <input data-value={0} type="checkbox" onClick={levelFilter} /> All Levels
              </div>
              <div className="option-item">
                <input data-value={1} type="checkbox" onClick={levelFilter} /> Beginner
              </div>
              <div className="option-item">
                <input data-value={2} type="checkbox" onClick={levelFilter} /> Intermediate
              </div>
              <div className="option-item">
                <input data-value={3} type="checkbox" onClick={levelFilter} /> Expert
              </div>
            </div>
          </div>

          <div className="filter-item length">
            <h4>Length</h4>

            <div className="options">
              <div className="option-item">
                <input data-value="0-1" type="checkbox" onClick={lengthFilter} /> 0-1 Hours
              </div>
              <div className="option-item">
                <input data-value="1-3" type="checkbox" onClick={lengthFilter} /> 1-3 Hours
              </div>
              <div className="option-item">
                <input data-value="6-7" type="checkbox" onClick={lengthFilter} /> 6-7 Hours
              </div>
              <div className="option-item">
                <input data-value="17" type="checkbox" onClick={lengthFilter} /> 17+ Hours
              </div>
            </div>
          </div>
        </div>

        <div className="all-courses non-filter">
          {!loaded?<img src={loadingUrl+"?tr=h-155"} alt="loading" />:""}
        
          {courses?.map((course) => (
            <ResultCard card={course} />
          ))}
          
          {page.total !== page.current?<button className="loadmore pointer" onClick={loadmore}>Show More</button>:""}        
        </div>
        
      </div>
    </div>
  );
};

export default Main;

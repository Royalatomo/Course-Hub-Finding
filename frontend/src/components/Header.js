import React from 'react'
import "./styles/Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSearch } from "../app/slice/searchSlice";

const Header = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const toggelMenu = function() {
    const menu = document.querySelector(".hamburger .hamburger-menu");
    if(!menu) return;
    menu.classList.toggle("active");
  }

  function search(e, div=true) {
    let query = "";
    if(!div){
      query = e.currentTarget.parentElement.querySelector("input").value;
      if(!query) return;
      dispatch(updateSearch({search: query}));
      history("/search?topic=" + query.replaceAll(" ", "+").replaceAll("&", "%40"));;
    }else{
      if(e.keyCode === 13){
        query = e.currentTarget.querySelector("input").value;
        if(!query) return;
        dispatch(updateSearch({search: query}));
        history("/search?topic=" + query.replaceAll(" ", "+").replaceAll("&", "%40"));;
      }
    }
  }

  return (
    <header>
      <Link to="/" className="logo">
        <img src="/logo.png" alt="logo" />
      </Link>

      <Link to="/cat" className='header-text'>Categories</Link>
      <div className="search" onKeyDown={search}>
        <img onClick={(e) => search(e, false)} src="/search.png" alt="search" />
        <input type="text" placeholder='search' />
      </div>

      <Link to="/favourite" className="fav">
        <img src="/heart.png" alt="logo" />
      </Link>

      <a target="_blank" rel="noreferrer" href="https://droptop.in" className='header-text'>Blogs</a>
      <Link to="/recent" className='header-text'>Recently Viewed</Link>

      <div className="hamburger">
        <img src="/hamburger.png" alt="menu" onClick={toggelMenu} />
        <div className="hamburger-menu">
          <div className="container">
            <h2>Navigation</h2>
            <img src="/close.png" alt="close-btn" onClick={toggelMenu} />
          </div>

          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="https://droptop.in" target="_blank" rel="noreferrer">Favourite</a></li>
            <li><Link to="/">Blogs</Link></li>
            <li><Link to="/">Recently Viewed</Link></li>
          </ul>
        </div>
      </div>

      <div className="bottom-menu">
        <img onClick={() => history("/")} src="/home.png" alt="home" />
        <img onClick={() => history("/favourite")} src="/menu-heart.png" alt="heart" />
        <a href="https://droptop.in" target="_blank" rel="noreferrer"><img src="/read-blog.png" alt="read-blog" /></a>
        <img onClick={() => history("/recent")} src="/recent.png" alt="recent" />
      </div>
    </header>
  )
}

export default Header
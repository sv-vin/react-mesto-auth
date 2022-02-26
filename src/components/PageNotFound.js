import React from "react";
import { Link } from "react-router-dom";
import Eror from "../images/unnamed.jpg";

function PageNotFound() {
  return (
    <div className="enterPage">
      <h3 className="enterPage__text">
        <span>404</span> - Страница не найдена
      </h3>
      <img className="popup__image" src={Eror} alt="404" />
      <Link to="/profile" className="enterPage__link">Возвращайся!</Link>
    </div>
  );
}

export default PageNotFound;

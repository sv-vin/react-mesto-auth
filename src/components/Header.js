import React from "react";
import logo from "../images/Logo.svg";
import { Link, useLocation } from "react-router-dom";

function Header(props) {
  let location = useLocation();

  let loginLinkVisible = false;
  let registrLinkVisible = false;

  if (location.pathname === "/sign-in") {
    loginLinkVisible = true;
  } else {
    registrLinkVisible = true;
  }

  const onHeaderPopup = () => {
    props.onHeaderPopup();
  };

  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Место-Россия" />
      <div
        className={
          props.loggedIn
            ? "header__menu_type-visible"
            : "header__menu_type-none"
        }
      >
        <button
          type="button"
          className={`header__option-open ${
            props.isOpen ? "header__option-open_type_none" : ""
          }`}
          onClick={onHeaderPopup}
        ></button>
      </div>
      <div className={props.loggedIn ? "header__option" : "header__option_type-none"}>
        <p className="header__email">{props.userData.email}</p>
        <button onClick={props.onLogout} className="header__out">
          Выйти
        </button>
      </div>
      <Link
        to="/sign-up"
        className={
          props.loggedIn || registrLinkVisible
            ? "header__reg_type-none"
            : "header__reg"
        }
      >
        Регистрация
      </Link>
      <Link
        to="/sign-in"
        className={
          props.loggedIn || loginLinkVisible
            ? "header__reg_type-none"
            : "header__reg"
        }
      >
        Войти
      </Link>
    </header>
  );
}

export default Header;


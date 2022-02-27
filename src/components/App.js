import React, { useEffect, useState } from "react";
import Profile from "./profile/Profile";
import Register from "./register/Register ";
import Login from "./login/Login ";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";
import InfoTooltip from "./register/InfoTooltip";
import api from "../utils/Api";
import EditProfilePopup from "./profile/EditProfilePopup";
import ImagePopup from "./profile/ImagePopup";
import EditAvatarPopup from "./profile/EditAvatarPopup";
import DeletePopup from "./profile/DeletePopup";
import AddPlacePopup from "./profile/AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import Menu from "./profile/Menu";
import PageNotFound from "./PageNotFound.js"

const App = () => {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setcurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isNotInfoTooltipPopupOpen, setIsNotInfoTooltipPopupOpen] = useState(false);
  const [cardForDelete, setCardForDelete] = useState({});
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    link: "",
    name: "",
  });
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  function handleDeleteClick(card) {
    setCardForDelete(card);
    setIsDeletePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleInfoTooltipPopupOpen() {
    setIsInfoTooltipPopupOpen(true);
  }

  function handleNotInfoTooltipPopupOpen() {
    setIsNotInfoTooltipPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setImagePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard({ name: "", link: "" });
    setIsInfoTooltipPopupOpen(false);
    setIsNotInfoTooltipPopupOpen(false);
  }

  useEffect(() => {
    //спасибо за подсказку, я как раз думал как это сделать
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  useEffect(() => {
    if (loggedIn === true) {
      history.push("/profile");
    }
  }, [loggedIn, history]);

  useEffect(() => {
    tokenCheck();
  }, []);

  const tokenCheck = () => {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const token = localStorage.getItem("token");
    if (token) {
      // проверим токен
      auth
        .getContent(token)
        .then((data) => {
          if (data) {
            // здесь можем получить данные пользователя!
            const userData = {
              email: data.data.email,
              //          password: data.data._id,

            };


            localStorage.setItem("token", token);
            setUserData(userData);
            setLoggedIn(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleLogin = ({ email, password }) => {
    auth
      .authorize({
        email,
        password,
      })
      .then((data) => {
        if (data) {
          localStorage.setItem("token", data.token);
          setLoggedIn(true);
        }
        const userData = {
          email
        };
        setUserData(userData);
      })
      .catch((error) => {
        console.error(error);
        handleNotInfoTooltipPopupOpen();
        history.push("/sign-in");
      });
  };

  const handleRegister = ({ email, password }) => {
    auth

      .register({ email, password })
      .then((data) => {
       
        if (data) {
          setUserData({
            email,
            password,
          });
          handleInfoTooltipPopupOpen();
          history.push("/sign-in");
        }
      })
      .catch((error) => {
        console.error(error);
        handleNotInfoTooltipPopupOpen();
       
      });

  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({
      email: "",
      password: "",
    });
    setLoggedIn(false);
  };

  useEffect(() => {
    Promise.all([api.getPersonalInfo(), api.getCard()])
      .then(([user, data]) => {
        setcurrentUser(user);
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль(исправил)
      });
  }

  const handleClick = (card) => {
    setSelectedCard(card);
    setImagePopupOpen(true);
  };

  function handleCardDelete(element) {
    // Отменяем стандартное поведение
    element.preventDefault();
    // Отправляем запрос в API
    api
      .removeCard(cardForDelete._id)
      .then(() => {
        // Методом фильтр мы создаем новый массив на основе нашего только с некоторыми условиями
        setCards(cards.filter((c) => c._id !== cardForDelete._id));
        closeAllPopups();
      })
      //выведем ошибку в консоль
      .catch((err) => {
        console.error(err);
      });
  }

  const handleUpdateUser = (data) => {
    api
      .changeUserInfo(data)
      .then((res) => {
        setcurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUpdateAvatar = (data) => {
    api
      .editAvatarUser(data.avatarLink)
      .then((res) => {
        setcurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddPlaceSubmit = (newCard) => {
    api
      .addNewCard(newCard)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function openMenu() {
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Menu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onLogout={handleLogout}
        userData={userData}
        loggedIn={loggedIn}
      />

      <Header
        onHeaderPopup={openMenu}
        isOpen={isMenuOpen}
        onLogout={handleLogout}
        userData={userData}
        loggedIn={loggedIn}
      />

      <Switch>
        <ProtectedRoute
          path="/profile"
          loggedIn={loggedIn}
          userData={userData}
          component={Profile}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleClick}
          onHandleDeleteClick={handleDeleteClick}
          cards={cards}
          onLike={handleCardLike}>
          {" "}
        </ProtectedRoute>
        <Route path="/sign-up">
          <Register onRegister={handleRegister} loggedIn={loggedIn} />
        </Route>
        <Route path="/sign-in">
          <Login
            onLogin={handleLogin}
            tokenCheck={tokenCheck}
            loggedIn={loggedIn}
          />
      </Route>
       
        <Route exact path="/">
          {loggedIn ? <Redirect to="/profile" /> : <Redirect to="/sign-in" />}
  </Route>
  <Route path="/*">
    <PageNotFound />
        </Route>
      </Switch>

      <InfoTooltip
        isToOpen={isInfoTooltipPopupOpen}
        isDontOpen={isNotInfoTooltipPopupOpen}
        onClose={closeAllPopups}
      />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <DeletePopup
        isOpen={isDeletePopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleCardDelete}
      />

      <ImagePopup
        onClose={closeAllPopups}
        isOpen={isImagePopupOpen}
        card={selectedCard}
      />
    </CurrentUserContext.Provider>
  );
};

export default App;
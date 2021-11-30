import React from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;
  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `card__delete-button ${isOwn ? "card__delete-button_visible" : "card__delete-button_hidden"
    }`;
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some(item => item._id === currentUser._id);
  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `card__like ${isLiked ? "card__like_active" : ""
    }`;

    function handleDeleteClick() {
      props.onHandleDeleteClick(props.card);
    }

  function handleLikeClick() {
    props.onLike(props.card);
  }
 

  function handleClick() {
    props.onCardClick(props.card);
  }


  return (
    <article className="card">
      <img className="card__img" onClick={handleClick} src={props.card.link} alt={props.card.name} />
      <button onClick={handleDeleteClick} type="button" className={cardDeleteButtonClassName} aria-label="Удалить" ></button>
      <div className="card__description">
        <h2 className="card__text">{props.card.name}</h2>
        <div className="card__like-containet">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick} aria-label="Нравится"></button>
          <p className="card__like-counter">{props.card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
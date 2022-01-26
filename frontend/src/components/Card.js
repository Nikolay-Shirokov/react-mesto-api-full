import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(card) {

  //Данные профиля
  const currentUser = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = (card.owner._id === currentUser._id);
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(user => user._id === currentUser._id);

  function handleClick() {
    card.onCardClick(card);
  }

  function handleLikeClick() {
    card.onCardLike(card, isLiked);
  }

  function handleDeleteClick() {
    card.onCardDelete(card);
  }

  return (
    <li className="place">
      <img className="place__image" src={card.link} alt={card.name} title={`Добавил ${card.owner.name}`} onClick={handleClick} />
      <h2 className="place__caption">{card.name}</h2>
      {isOwn? <button className="place__delete button" type="button" aria-label="Удалить" title="Удалить" onClick={handleDeleteClick} ></button>: ''}
      <div className="place__like-container">
        <button className={`place__like ${isLiked? 'place__like_active': ''} button`} onClick={handleLikeClick} type="button" aria-label="Нравится" title="Нравится"></button>
        <p className="place__like-counter">{card.likes.length}</p>
      </div>
    </li>
  );
}

export default Card;

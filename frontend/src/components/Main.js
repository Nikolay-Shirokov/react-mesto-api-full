import { useContext } from "react";

import Card from "./Card";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {

  //Данные профиля
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="root__content">
      <section className="profile root__profile">
        <div className="profile__avatar-container" onClick={props.onEditAvatar}>
          <img className="profile__avatar" src={currentUser.avatar} alt="Аватар нашего героя" />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit button" type="button" aria-label="Редактировать профиль" onClick={props.onEditProfile}></button>
          <p className="profile__position">{currentUser.about}</p>
        </div>
        <button className="profile__add-place button" type="button" aria-label="Добавить карточку места" onClick={props.onAddPlace}></button>
      </section>
      <section className="root__places">
        <ul className="places">
          {props.cards.map(card => (
            <Card
              key={card._id}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
              {...card}
            />)
          )}
        </ul>
      </section>
    </main>
  );
}

export default Main;

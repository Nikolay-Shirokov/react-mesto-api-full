import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";

import { useState, useEffect } from "react";
import { handleError } from "../utils/utils";
import api from "../utils/api";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import Login from "./Login";
import Register from "./Register";
import { useAuth } from "../hooks/useAuth";

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isCardDeleteConfirmPopupOpen, setIsCardDeleteConfirmPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  const { authInfo, handleSignup, handleSignin, checkToken, handleLogout } = useAuth();

  useEffect(() => {

    checkToken();

  }, []);

  useEffect(() => {

    setCurrentUser(authInfo)

  }, [authInfo]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {

    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);

    setIsImagePopupOpen(false);

    setIsCardDeleteConfirmPopupOpen(false);

  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleUpdateUser(newUserInfo) {
    return api.patchUserInfo(newUserInfo)
      .then(res => {
        setCurrentUser(res);
      })
      .catch(handleError)
  }

  function handleUpdateAvatar(newLink) {
    return api.patchAvatar(newLink)
      .then(res => {
        setCurrentUser(res);
      })
      .catch(handleError)
  }

  //Карточки
  const [cards, setCards] = useState([]);

  //Разовые действия при монтированнии/демонтировании компонента
  useEffect(() => {

    // Загрузка коллекции карточек с сервера
    api.getInitialCards()
      .then(data => {
        setCards(data);
      })
      .catch(handleError);

  }, [authInfo]);

  function handleCardLike(card, isLiked) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.setStateLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(handleError);
  }

  function handleCardDeleteClick(card) {
    setSelectedCard(card);
    setIsCardDeleteConfirmPopupOpen(true);
  }

  function handleCardDelete() {

    return api.deleteCard(selectedCard._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== selectedCard._id));
      })
      .catch(handleError);
  }

  function handleAddCard(newCardData) {
    return api.postCard(newCardData)
      .then(newCard => {
        setCards([newCard, ...cards]);
      })
      .catch(handleError)
  }

  return (
    <div className="wrapper">

      <CurrentUserContext.Provider value={currentUser}>

        <Header handleLogout={handleLogout} {...authInfo} />

        <Routes>
          <Route
            path="/sign-up"
            element={
              <Register handleSubmit={handleSignup} />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login handleSubmit={handleSignin} />
            }
          />
          <Route
            path="/*"
            element={
              <RequireAuth {...authInfo} redirectTo="/sign-in">
                <Main
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  cards={cards}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDeleteClick}
                />

                <Footer />

                <EditProfilePopup
                  isOpen={isEditProfilePopupOpen}
                  onClose={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                  setOpenState={setIsEditProfilePopupOpen}
                />

                <AddPlacePopup
                  isOpen={isAddPlacePopupOpen}
                  onClose={closeAllPopups}
                  onAddCard={handleAddCard}
                  setOpenState={setIsAddPlacePopupOpen}
                />

                <EditAvatarPopup
                  isOpen={isEditAvatarPopupOpen}
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateAvatar}
                  setOpenState={setIsEditAvatarPopupOpen}
                />

                <PopupWithForm
                  isOpen={isCardDeleteConfirmPopupOpen}
                  onClose={closeAllPopups}
                  onSubmit={handleCardDelete}
                  title="Вы уверены?"
                  name="accept"
                  buttonText="Да"
                  buttonWaitingText="Удаление..."
                  setOpenState={setIsCardDeleteConfirmPopupOpen}
                />

                <ImagePopup
                  card={selectedCard}
                  isOpen={isImagePopupOpen}
                  onClose={closeAllPopups}
                  setOpenState={setIsImagePopupOpen}
                />
              </RequireAuth>
            } />
        </Routes>
      </CurrentUserContext.Provider>

    </div>
  );
}

export default App;

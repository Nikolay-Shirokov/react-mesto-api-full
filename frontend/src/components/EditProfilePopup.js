import { useContext, useEffect, useRef } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useFormAndValidation } from "../hooks/useFormAndValidation";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup(props) {

  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();
  const formRef = useRef();

  const currentUser = useContext(CurrentUserContext);
  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    if (currentUser.name) {
      const newValues = {
        name: currentUser.name,
        about: currentUser.about
      }
      resetForm(newValues, {}, formRef.current.checkValidity());
    }
  }, [currentUser, props.isOpen, resetForm]);

  function handleSubmit() {
    // Передаём значения управляемых компонентов во внешний обработчик
    const result = props.onUpdateUser({
      name: values.name,
      about: values.about,
    });
    return result;
  }

  return (
    <PopupWithForm
      {...props}
      title="Редактировать профиль"
      name="edit-profile"
      formRef={formRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isButtonDisabled={!isValid}
      buttonText="Сохранить"
      buttonWaitingText="Сохранение..."
    >
      <fieldset className="form__fields">
        <label className="form__field">
          <input value={values.name || ''} onChange={handleChange} className={`form__input ${!errors.name ? '' : 'form__input_type_error'}`} type="text" name="name" placeholder="Имя героя" required minLength="2" maxLength="40" />
          <span className={`form__input-error ${!errors.name ? '' : 'form__input-error_visible'}`}>{errors.name}</span>
        </label>
        <label className="form__field">
          <input value={values.about || ''} onChange={handleChange} className={`form__input ${!errors.about ? '' : 'form__input_type_error'}`} type="text" name="about" placeholder="Позиция героя в мире" required minLength="2" maxLength="200" />
          <span className={`form__input-error ${!errors.about ? '' : 'form__input-error_visible'}`}>{errors.about}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;

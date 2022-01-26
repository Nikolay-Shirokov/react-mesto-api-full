import { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {

  const inputRef = useRef();

  function handleSubmit() {
    const result = props.onUpdateAvatar(inputRef.current.value);
    inputRef.current.value = '';
    return result;
  }

  return (
    <PopupWithForm
      {...props}
      title="Обновить аватар"
      name="edit-avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
      buttonWaitingText="Сохренение..."
    >
      <fieldset className="form__fields">
        <label className="form__field">
          <input ref={inputRef} className="form__input" type="url" name="link" placeholder="Ссылка на картинку" required />
          <span className="form__input-error" data-input-name="link"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;

import { useEffect } from "react";
import { useFormAndValidation } from "../hooks/useFormAndValidation";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {

  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation()

  function handleSubmit() {
    const result = props.onAddCard({
      name: values.name,
      link: values.link,
    });
    return result;
  }

  useEffect(() => {
    if (props.isOpen) {
      resetForm();
    };
  }, [props.isOpen, resetForm])

  return (
    <PopupWithForm
      {...props}
      title="Новое место"
      name="add-place"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isButtonDisabled={!isValid}
      buttonText="Создать"
      buttonWaitingText="Создание..."
    >
      <fieldset className="form__fields">
        <label className="form__field">
          <input value={values.name || ''} onChange={handleChange} className={`form__input ${!errors.name ? '' : 'form__input_type_error'}`} type="text" name="name" placeholder="Название" required minLength="2" maxLength="30" />
          <span className={`form__input-error ${!errors.name ? '' : 'form__input-error_visible'}`} data-input-name="name">{errors.name}</span>
        </label>
        <label className="form__field">
          <input value={values.link || ''} onChange={handleChange} className={`form__input ${!errors.link ? '' : 'form__input_type_error'}`} type="url" name="link" placeholder="Ссылка на картинку" required />
          <span className={`form__input-error ${!errors.link ? '' : 'form__input-error_visible'}`} data-input-name="link">{errors.link}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

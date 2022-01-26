import { useState } from "react";
import Popup from "./Popup";

function PopupWithForm(props) {

  const [buttonText, setButtonText] = useState(props.buttonText)

  function handleSubmitForm(event) {
    event.preventDefault();
    if (!props.onSubmit) {
      return;
    }
    setButtonText(props.buttonWaitingText ? props.buttonWaitingText : props.buttonText);
    const result = props.onSubmit(event);
    if (result instanceof Promise) {
      result.then(res => props.setOpenState(false));
      result.finally(res => setButtonText(props.buttonText));
    }
  }

  return (
    <Popup {...props}>
      <form ref={props.formRef} className="form" action="post" name={`form-${props.name}`} onSubmit={handleSubmitForm} noValidate>
        <h2 className="form__title">{props.title}</h2>
        {props.children}
        <button className={`form__submit ${props.isButtonDisabled ? 'form__submit_disabled' : ''} button`} type="submit">{buttonText}</button>
      </form>
    </Popup >
  );
}

export default PopupWithForm;

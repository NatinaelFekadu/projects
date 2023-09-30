import { useRef,useState } from "react";
import classes from "./Checkout.module.css";

const Checkout = (props) => {
  const [formInputsValid,setFormInputsValid] = useState({
    name:true,
    street:true,
    code:true,
    city:true
  });

  const isEmpty = value => value.trim() === '';
  const isFiveChar = value => value.trim().length === 5;

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalCodeInputRef = useRef();
  const cityInputRef = useRef();
  const confirmHandler = (event) => {
    event.preventDefault();

    const name = nameInputRef.current.value;
    const street = streetInputRef.current.value;
    const code = postalCodeInputRef.current.value;
    const city = cityInputRef.current.value;

    const nameIsValid = !isEmpty(name);
    const streetIsValid = !isEmpty(street);
    const codeIsValid = isFiveChar(code);
    const cityIsValid = !isEmpty(city);

    setFormInputsValid({
      name:nameIsValid,
      street:streetIsValid,
      code:codeIsValid,
      city:cityIsValid
    })

    const formIsValid = nameIsValid && streetIsValid && codeIsValid && cityIsValid;
    if(!formIsValid){
      return
    }

    props.onConfirm({
      name:name,
      street:street,
      code:code,
      city:city
    })

  };

  const nameInputClasses = `${classes.control} ${!formInputsValid.name ? classes.invalid : ''}`
  const streetInputClasses = `${classes.control} ${!formInputsValid.street ? classes.invalid : ''}`
  const postalCodeInputClasses = `${classes.control} ${!formInputsValid.code ? classes.invalid : ''}`
  const cityInputClasses = `${classes.control} ${!formInputsValid.city ? classes.invalid : ''}`

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameInputClasses}>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" ref={nameInputRef} />
        {!formInputsValid.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={streetInputClasses}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetInputRef} />
        {!formInputsValid.street && <p>Please enter a valid street name!</p>}
      </div>
      <div className={postalCodeInputClasses}>
        <label htmlFor="postal">Postal Code</label>
        <input type="text" id="postal" ref={postalCodeInputRef} />
        {!formInputsValid.code && <p>Please enter a valid Postal code(5 characters)!</p>}
      </div>
      <div className={cityInputClasses}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityInputRef} />
        {!formInputsValid.city && <p>Please enter a valid city name!</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;

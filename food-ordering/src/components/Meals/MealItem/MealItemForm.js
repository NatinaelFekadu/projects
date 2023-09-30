import { useRef, useState } from "react";
import classes from "./MealItemForm.module.css";
import Input from "../../UI/Input";
const MealItemForm = (props) => {
  const [validAmountEntered, setValidAmountEntered] = useState(true);

  const enteredAmountRef = useRef();
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredAmount = enteredAmountRef.current.value;
    const numberEnterdAmount = +enteredAmount;
    if (
      enteredAmount.trim().length === 0 ||
      numberEnterdAmount < 1 ||
      numberEnterdAmount > 5
    ) {
      setValidAmountEntered(false);
      return;
    }
    props.onAddToCart(numberEnterdAmount);
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <Input
        ref={enteredAmountRef}
        label="Amount"
        input={{
          id: "amount_" + props.id,
          type: "number",
          min: "1",
          max: "5",
          step: "1",
          defaultValue: "1",
        }}
      />
      <button>+ Add</button>
      {!validAmountEntered && <p>Please enter a valid value(1-5)</p>}
    </form>
  );
};
export default MealItemForm;

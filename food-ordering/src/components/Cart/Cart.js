import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
const Cart = (props) => {
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ctx = useContext(CartContext);
  const totalAmount = `$${ctx.totalAmount.toFixed(2)}`;
  const hasItem = ctx.items.length > 0;
  const addItemToCartHandler = (item) => {
    ctx.addItem({ ...item, amount: 1 });
  };
  const removeItemFromCartHandler = (id) => {
    ctx.removeItem(id);
  };

  const orderHadler = (event) => {
    event.preventDefault();
    setIsCheckOut(true);
  };
  const cartItems = ctx.items.map((item) => (
    <CartItem
      key={item.id}
      id={item.id}
      name={item.name}
      price={item.price}
      amount={item.amount}
      onAdd={addItemToCartHandler.bind(null, item)}
      onRemove={removeItemFromCartHandler.bind(null, item.id)}
    />
  ));

  const submitHandler = async (userData) => {
    setIsSubmitted(true);
    await fetch(
      "https://food-ordering-e2732-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          order: userData,
          items: ctx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setIsSubmitted(true);
    ctx.clearCart();
  };

  const actionButtons = (
    <div className={classes.actions}>
      {hasItem && (
        <button className={classes["button--alt"]} onClick={orderHadler}>
          Order
        </button>
      )}
      <button className={classes.button} onClick={props.onClick}>
        Close
      </button>
    </div>
  );

  const content = (
    <React.Fragment>
      <div className={classes["cart-items"]}>
        <ul>{cartItems}</ul>
      </div>
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <Checkout onConfirm={submitHandler} onCancel={props.onClick} />
      )}
      {!isCheckOut && actionButtons}
    </React.Fragment>
  );
  const isSubmittingContent = <p>Sending entered data...</p>;
  const isSubmittedContent = (
    <React.Fragment>
      <p>Data sent successfully!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClick}>
          Close
        </button>
      </div>
    </React.Fragment>
  );
  return (
    <Modal onClick={props.onClick}>
      {!isSubmitting && !isSubmitted && content}
      {isSubmitting && !isSubmitted && isSubmittingContent}
      {!isSubmitting && isSubmitted && isSubmittedContent}
    </Modal>
  );
};
export default Cart;

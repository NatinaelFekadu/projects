import classes from "./Modal.module.css";
import { Fragment } from "react";
import ReactDom from "react-dom";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const overlay = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDom.createPortal(<Backdrop onClick={props.onClick} />, overlay)}
      {ReactDom.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        overlay
      )}
    </Fragment>
  );
};

export default Modal;

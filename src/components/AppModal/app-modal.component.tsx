import React from "react";
import {  ModalProps } from "semantic-ui-react";
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal'
import "./styles.scss";
import { addClassNames } from "../components";

export function AppModal({ className, children, ...props }: ModalProps) {
  return (
    <Modal
      className={addClassNames("components-app-modal", className)}
      {...props}
      dimmer='inverted'
    >
      {children}
    </Modal>
  );
}

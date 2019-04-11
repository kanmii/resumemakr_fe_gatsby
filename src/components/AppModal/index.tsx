import React from "react";
import { Modal, ModalProps } from "semantic-ui-react";

import "./styles.scss";
import { addClassNames } from "../components";

export function AppModal({ className, children, ...props }: ModalProps) {
  return (
    <Modal
      className={addClassNames("components-app-modal", className)}
      {...props}
    >
      {children}
    </Modal>
  );
}

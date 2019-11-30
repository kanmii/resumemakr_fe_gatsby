import React, { useLayoutEffect } from "react";
import { Loading } from "../Loading/loading.component";
import "./submitting-overlay.styles.scss";

export function SubmittingOverlay(props: { id: string; parentId: string }) {
  useLayoutEffect(() => {
    const domParentEl = document.getElementById(props.parentId) as HTMLElement;
    domParentEl.classList.add('el--submitting')
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, []);

  return (
    <div id={props.id} className="submitting-overlay">
      <Loading />
    </div>
  );
}

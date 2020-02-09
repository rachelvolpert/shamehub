import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

import React from "react";

const Header = () => (
  <IonHeader>
    <IonToolbar>
      <IonTitle color="primary" style={{ textAlign: "center", fontSize: "32px"}}>
        <p>shamehub</p>
      </IonTitle>
    </IonToolbar>
  </IonHeader>
);

export default Header;

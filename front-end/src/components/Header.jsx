import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

import React from "react";

const Header = () => (
  <IonHeader>
    <IonToolbar>
      <IonTitle size="large" style={{ textAlign: "center" }}>
        shamehub
      </IonTitle>
    </IonToolbar>
  </IonHeader>
);

export default Header;

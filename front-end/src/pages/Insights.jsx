import React, { Component } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonList,
  IonCardContent
} from "@ionic/react";
import Header from "../components/Header";

const InsightsPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab Three</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

class Insights extends Component {


  render() {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <IonCard className="welcome-card">
            <img src="/assets/shapes.svg" alt="" />
            <IonCardHeader>
              {/* <IonCardSubtitle>Get Started</IonCardSubtitle> */}
              <IonCardTitle>Shameful Insights</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList></IonList>
            </IonCardContent>
          </IonCard>

        </IonContent>
      </IonPage>
    );
  }
}

export default Insights;

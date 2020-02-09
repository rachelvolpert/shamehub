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
import axios from "axios";
import { API_BASE } from "../constants";

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
  state = {
    total: 0
  };

  componentDidMount() {
    axios
      .get(`${API_BASE}/total_spent`, { withCredentials: true })
      .then(resp => {
        this.setState({
          total: resp.data.total
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  render() {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <IonCard className="insights-card">
            <img src="https://i.imgur.com/EWtXf5k.jpg" alt="" />
            <IonCardHeader>
              <ion-card-subtitle>In the past 30 days...</ion-card-subtitle>
              <IonCardTitle color="tertiary">
                You spent {this.state.total} shame dollars
              </IonCardTitle>
              <ion-card-content color="tertiary"></ion-card-content>
            </IonCardHeader>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
}

export default Insights;

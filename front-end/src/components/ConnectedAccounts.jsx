import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel
} from "@ionic/react";

import { API_BASE } from "../constants";
import axios from "axios";
import React, { Component, useState } from "react";

export default class ConnectedAccounts extends Component {
  state = {
    accounts: []
  };
  componentDidMount() {
    axios
      .get(`${API_BASE}/get_connected_accounts`, { withCredentials: true })
      .then(resp => {
        this.setState({ accounts: resp.data });
      });
  }
  render() {
    return (
      <IonCard className="welcome-card">
        <IonCardHeader>
          <IonCardSubtitle>Connected Accounts</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {this.state.accounts.map((acct, idx) => {
              return (
                <IonItem key={idx}>
                  <IonLabel>{acct}</IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        </IonCardContent>
      </IonCard>
    );
  }
}

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonButton,
  IonModal,
  IonSearchbar
} from "@ionic/react";
import { book, build, colorFill, grid } from "ionicons/icons";
import React, { Component, useState } from "react";
import PlaidLink from "react-plaid-link";

import "./Profile.css";
import Header from "../components/Header";
import { API_BASE } from "../constants";
import axios from "axios";

// const connectAccount = () => {
//   api.post("/connect_account");
// };

class Profile extends Component {
  state = {
    showModal: false,
    showTransactionsModal: false,
    plaidTransactions: [],
    users: [],
    usersToShow: []
  };
  onSuccess = (token, metadata) => {
    axios
      .post(`${API_BASE}/get_access_token`, {
        public_token: token
      })
      .then(resp => {
        console.log("holy shit is this a response", resp);
        this.setState({
          plaidTransactions: resp.data.transactions,
          showTransactionsModal: true
        });
      });
  };

  onFollow = uid => {
    axios
      .post(
        `${API_BASE}/follows`,
        {
          fid: uid
        },
        { withCredentials: true }
      )
      .then(resp => {
        console.log("follow added", resp);
      });
  };

  componentDidMount() {
    axios
      .get(`${API_BASE}/users`)
      .then(resp => {
        this.setState({
          users: resp.data,
          usersToShow: resp.data
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  handleInput = event => {
    console.log("handleInput called");
    const query = event.target.value.toLowerCase();
    const usersToShow = this.state.users.filter(user => {
      return user.name.toLowerCase().includes(query);
    });
    this.setState({ usersToShow });
  };

  render() {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <IonCard className="welcome-card">
            <img src="https://i.imgur.com/Pq6GIEY.png" alt="" />
            <IonCardHeader>
              <IonCardTitle color="tertiary">Welcome to Shamehub</IonCardTitle>
              <ion-card-content color="tertiary">
                Cut down on bad habits by broadcasting them to be shamed by all
                of your friends! Connect your credit and debit cards and let the
                shaming begin....
              </ion-card-content>
            </IonCardHeader>
          </IonCard>

          <IonButton
            id="addfriend"
            expand="block"
            color="secondary"
            onClick={() => this.setState({ showModal: true })}
          >
            Add a Friend
          </IonButton>
          <IonModal isOpen={this.state.showModal}>
            <IonHeader translucent>
              <IonToolbar>
                <IonTitle>Searchbar</IonTitle>
              </IonToolbar>
              <IonToolbar>
                <IonSearchbar onInput={this.handleInput}></IonSearchbar>
              </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
              <IonList>
                {this.state.usersToShow.map((user, idx) => {
                  return (
                    <IonItem onClick={() => this.onFollow(user.id)} key={idx}>
                      {user.name}
                    </IonItem>
                  );
                })}
              </IonList>
            </IonContent>
            <IonButton onClick={() => this.setState({ showModal: false })}>
              Done Adding Friends
            </IonButton>
          </IonModal>

          <PlaidLink
            id="plaidlink"
            clientName="Your app name"
            env="development"
            // env="sandbox"

            product={["auth", "transactions"]}
            publicKey="b1ede095e08a4bf8d26515ed4fe3b2"
            onExit={() => {
              console.log("exited plaid");
            }}
            onSuccess={this.onSuccess}
          >
            <IonButton expand="block" color="secondary">
              Connect Bank Account with Plaid
            </IonButton>
          </PlaidLink>

          <IonModal isOpen={this.state.showTransactionsModal}>
            <IonHeader translucent>
              <IonTitle>Recent Transactions</IonTitle>
            </IonHeader>

            <IonContent fullscreen>
              <IonList>
                {this.state.usersToShow.map((user, idx) => {
                  return (
                    <IonItem onClick={() => this.onFollow(user.id)} key={idx}>
                      {user.name}
                    </IonItem>
                  );
                })}
              </IonList>
            </IonContent>
            <IonButton onClick={() => this.setState({ showModal: false })}>
              Done Adding Friends
            </IonButton>
          </IonModal>

          <IonCard className="welcome-card">
            <IonCardHeader>
              <IonCardSubtitle>Connected Accounts</IonCardSubtitle>
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

export default Profile;

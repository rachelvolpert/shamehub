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
  IonSearchbar,
  IonCheckbox
} from "@ionic/react";
import React, { Component } from "react";
import PlaidLink from "react-plaid-link";

import "./Profile.css";
import Header from "../components/Header";
import ConnectedAccounts from "../components/ConnectedAccounts";
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
    checkedPlaidTransactions: [],
    users: [],
    usersToShow: []
  };
  onSuccess = (token, metadata) => {
    axios
      .post(
        `${API_BASE}/get_access_token`,
        {
          public_token: token,
          bank_name: metadata.institution.name
        },
        { withCredentials: true }
      )
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

  processShamefulTransactions = () => {
    this.setState({ showTransactionsModal: false });

    const shamefulTransactions = this.state.plaidTransactions.filter(t =>
      this.state.checkedPlaidTransactions.includes(t.name)
    );
    console.log("plaid transactions", this.state.plaidTransactions);
    console.log("checked plaid", this.state.checkedPlaidTransactions);

    console.log("shameful", shamefulTransactions);

    axios
      .post(
        `${API_BASE}/store_plaid_transactions`,
        {
          transactions: shamefulTransactions
        },
        { withCredentials: true }
      )
      .then(resp => {
        console.log("Plaid transactions added", resp);
      });
  };

  componentDidMount() {
    axios
      .get(`${API_BASE}/users`, { withCredentials: true })
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

  checkTransaction = transactionName => {
    const isChecked = this.state.checkedPlaidTransactions.includes(
      transactionName
    );
    console.log("i want to die", isChecked);
    console.log("checked", this.state.checkedPlaidTransactions);
    console.log("t name", transactionName);
    let newCheckedTransactions = [];
    if (!isChecked) {
      newCheckedTransactions = [
        ...this.state.checkedPlaidTransactions,
        transactionName
      ];
    } else {
      newCheckedTransactions = this.state.checkedPlaidTransactions.filter(
        t => t !== transactionName
      );
    }

    console.log("new checked", newCheckedTransactions);

    this.setState({
      checkedPlaidTransactions: newCheckedTransactions
    });
  };

  render() {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <IonCard className="welcome-card">
            <img
              style={{ objectFit: "cover" }}
              src="https://i.imgur.com/Pq6GIEY.png"
              alt=""
            />
            <IonCardHeader>
              <IonCardTitle color="tertiary">Welcome to shamehub</IonCardTitle>
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
            clientName="shamehub"
            // env="development"
            env="sandbox"
            product={["auth", "transactions"]}
            publicKey="b1ede095e08a4bf8d26515ed4fe3b2"
            onExit={() => {
              console.log("exited plaid");
            }}
            onSuccess={this.onSuccess}
          >
            <IonButton expand="block" color="secondary">
              Connect a Bank Account
            </IonButton>
          </PlaidLink>

          <IonModal isOpen={this.state.showTransactionsModal}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Recent Transactions</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
              <IonLabel>
                <p style={{ padding: "15px" }}>
                  Which of the following recent transactions would you consider
                  shameful?
                </p>
              </IonLabel>
              <IonList>
                {this.state.plaidTransactions.map((transaction, idx) => {
                  return (
                    <IonItem
                      key={idx}
                      onClick={() => this.checkTransaction(transaction.name)}
                      style={{ display: "flex" }}
                    >
                      <IonCheckbox slot="start" />
                      <IonLabel>{transaction.name}</IonLabel>
                      <IonLabel>{`$${transaction.amount}`}</IonLabel>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonContent>
            <IonButton onClick={this.processShamefulTransactions}>
              Done
            </IonButton>
          </IonModal>

          <ConnectedAccounts />
        </IonContent>
      </IonPage>
    );
  }
}

export default Profile;

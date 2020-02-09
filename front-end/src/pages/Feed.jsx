import React, { Component } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonItemGroup,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonChip,
  IonInput
} from "@ionic/react";
import axios from "axios";

import Header from "../components/Header";
import Transaction from "../components/Transaction";
import "./Feed.css";
import { API_BASE } from "../constants";

// const mockTransactions = [
//   {
//     name: "Nola Chen",
//     price: "$17.00",
//     category: "Rideshare",
//     comments: [{ name: "Rachel Volpert", comment: "This is shameful" }]
//   },
//   {
//     name: "Rachel Volpert",
//     price: "$80.00",
//     category: "Abercrombie",
//     comments: []
//   }
// ];

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    };
  }

  componentDidMount() {
    axios
      .get(`${API_BASE}/transactions`, { withCredentials: true })
      .then(resp => {
        this.setState({
          transactions: resp.data
        });
      })
      .catch(e => {
        console.error(e);
      });
  }
  render() {
    console.log("transactions", this.state.transactions);
    return (
      <IonPage>
        <Header />
        <IonContent class="ion-padding">
          {/* <IonItem routerLink="/feed/details"> */}
          <IonList>
            {this.state.transactions.map((transaction, idx) => (
              <Transaction key={idx} transaction={transaction} />
            ))}
          </IonList>
          {/* <IonLabel>
                <h2>Go to detail</h2>
              </IonLabel> */}
          {/* </IonItem> */}
        </IonContent>
      </IonPage>
    );
  }
}

export default Feed;

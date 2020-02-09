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
import { groupBy } from "lodash";

import Header from "../components/header";
import "./Feed.css";
import { API_BASE } from "../constants";

const reactionToEmoji = {
  ":sad:": "😢",
  ":angry:": "😡",
  ":woozy:": "🥴"
};

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

  renderReactions(reactions) {
    const reactionsByType = groupBy(reactions, r => r.reaction);
    return Object.keys(reactionToEmoji).map((react, idx) => {
      const numReacts = (reactionsByType[react] || []).length;
      return (
        <IonChip outline={numReacts === 0} key={idx}>
          <IonLabel>{reactionToEmoji[react]}</IonLabel>
          <IonLabel>{numReacts}</IonLabel>
        </IonChip>
      );
    });
  }
  componentDidMount() {
    axios
      .get(`${API_BASE}/transactions`)
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
            {this.state.transactions.map((transaction, idx) => {
              console.log("hi transaction", transaction);
              return (
                <IonCard key={idx}>
                  <IonCardHeader>
                    <IonCardSubtitle>{transaction.name}</IonCardSubtitle>
                    <IonCardTitle>{`${transaction.category} - ${transaction.price}`}</IonCardTitle>
                  </IonCardHeader>
                  {/* <IonLabel>
                    <h3>{transaction.name}</h3>
                    <h2>{`${transaction.category} - ${transaction.price}`}</h2>
                  </IonLabel> */}
                  <hr style={{ background: "var(--ion-color-light)" }} />

                  <IonCardContent>
                    {this.renderReactions(transaction.reactions)}

                    {transaction.comments.map((comment, idx) => {
                      return (
                        <IonLabel key={idx}>
                          <h3>{comment.commentor_name}</h3>
                          <h2>{comment.comment_text}</h2>
                        </IonLabel>
                      );
                    })}
                    <div style={{ display: "flex" }}>
                      <IonInput
                        style={{ border: "solid 1px var(--ion-color-medium)" }}
                        placeholder="Add a new comment..."
                      ></IonInput>
                      {/* <IonButton color="primary">Primary</IonButton> */}
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })}
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

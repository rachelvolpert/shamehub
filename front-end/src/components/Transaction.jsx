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
import { groupBy, countBy } from "lodash";

import { API_BASE } from "../constants";

const reactionToEmoji = {
  ":sad:": "😢",
  ":angry:": "😡",
  ":woozy:": "🥴"
};

export default class Transaction extends Component {
  state = {
    comment: "",
    comments: [],
    reactions: {
      ":sad:": 0,
      ":angry:": 0,
      ":woozy:": 0
    }
  };
  componentDidMount() {
    console.log(countBy(this.props.transaction.reactions, r => r.reaction));
    this.setState({
      comments: this.props.transaction.comments,
      reactions: {
        ...this.state.reactions,
        ...countBy(this.props.transaction.reactions, r => r.reaction)
      }
    });
  }
  sendReaction(reactionName, transactionId) {
    axios
      .post(
        `${API_BASE}/reactions`,
        {
          reaction: reactionName,
          transaction_id: transactionId
        },
        { withCredentials: true }
      )
      .then(res => {
        if (res.status === 200) {
          console.log("Successfully reacted");
          console.log("state", this.state);

          this.setState(
            {
              reactions: {
                ...this.state.reactions,
                [reactionName]: this.state.reactions[reactionName] + 1
              }
            },
            () => {
              console.log("state", this.state);
            }
          );
        }
      });
  }

  renderReactions(reactionCounts, transactionId) {
    return Object.keys(reactionToEmoji).map((react, idx) => {
      const numReacts = reactionCounts[react];
      return (
        <IonChip
          onClick={() => this.sendReaction(react, transactionId)}
          outline={numReacts === 0}
          key={idx}
        >
          <IonLabel>{reactionToEmoji[react]}</IonLabel>
          <IonLabel>{numReacts}</IonLabel>
        </IonChip>
      );
    });
  }

  onInputComment = e => {
    const comment = e.target.value;
    this.setState({ comment });
  };

  onKeyDown = (e, transactionId) => {
    // Enter = submit comment
    if (e.keyCode === 13 && !!this.state.comment) {
      // time 2 submit comment
      axios
        .post(
          `${API_BASE}/comments`,
          {
            comment: this.state.comment,
            transaction_id: transactionId
          },
          { withCredentials: true }
        )
        .then(res => {
          if (res.status === 200) {
            console.log("Successfully commented");

            this.setState(
              {
                comment: "",
                comments: [
                  ...this.state.comments,
                  { comment_text: this.state.comment, commentor_name: "You" }
                ]
              },
              () => {
                console.log("state", this.state);
              }
            );
          }
        });
    }
  };

  render() {
    const { transaction } = this.props;
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>{transaction.name}</IonCardSubtitle>
          <IonCardTitle>{`${transaction.category} - $${transaction.price}`}</IonCardTitle>
        </IonCardHeader>
        {/* <IonLabel>
                <h3>{transaction.name}</h3>
                <h2>{`${transaction.category} - ${transaction.price}`}</h2>
              </IonLabel> */}
        <hr style={{ background: "var(--ion-color-light)" }} />

        <IonCardContent>
          {this.renderReactions(this.state.reactions, transaction.t_id)}

          {this.state.comments.map((comment, idx) => {
            return (
              <IonLabel key={idx}>
                <h3>{comment.commentor_name}</h3>
                <h2>{comment.comment_text}</h2>
              </IonLabel>
            );
          })}
          <div style={{ display: "flex" }}>
            <IonInput
              value={this.state.comment}
              style={{ border: "solid 1px var(--ion-color-medium)" }}
              placeholder="Add a new comment..."
              onInput={this.onInputComment}
              onKeyDown={e => this.onKeyDown(e, transaction.t_id)}
            ></IonInput>
            {/* <IonButton color="primary">Primary</IonButton> */}
          </div>
        </IonCardContent>
      </IonCard>
    );
  }
}

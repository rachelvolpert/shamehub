import React, { Component } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonInput,
  IonList,
  IonLabel,
  IonItem,
  IonButton
} from "@ionic/react";
import axios from "axios";
import { API_BASE } from "../constants";

export default class Auth extends Component {
  state = {
    email: "",
    password: "",
    name: ""
  };
  login = () => {
    console.log(`Posting to ${API_BASE}/login`);
    axios
      .post(
        `${API_BASE}/login`,
        {
          email: this.state.email,
          password: this.state.password
        },
        { withCredentials: true }
      )
      .then(resp => {
        if (resp.status === 200) {
          console.log(resp);
          window.location = "/profile";
        }
      });
  };
  signup = () => {
    axios
      .post(
        `${API_BASE}/signup`,
        {
          email: this.state.email,
          password: this.state.password,
          name: this.state.name
        },
        { withCredentials: true }
      )
      .then(resp => {
        if (resp.status === 200) {
          alert("User created!");
          window.location = "/profile";
        }
      });
  };

  onEmailInput = e => {
    this.setState({ email: e.target.value });
  };
  onPasswordInput = e => {
    this.setState({ password: e.target.value });
  };
  onNameInput = e => {
    this.setState({ name: e.target.value });
  };
  render() {
    return (
      <IonPage>
        <IonContent>
          <IonText
            style={{ textAlign: "center", fontSize: "50px" }}
            color="primary"
          >
            <p>shamehub</p>
          </IonText>

          <IonList>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                required
                type="text"
                onInput={this.onNameInput}
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Email
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonInput
                required
                type="text"
                onInput={this.onEmailInput}
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Password
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonInput
                required
                type="text"
                onInput={this.onPasswordInput}
                type="password"
              ></IonInput>
            </IonItem>
          </IonList>

          <IonList
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <IonButton style={{ width: "200px" }} onClick={this.login}>
              Login
            </IonButton>
            <IonButton style={{ width: "200px" }} onClick={this.signup}>
              Signup
            </IonButton>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

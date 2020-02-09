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
  IonButton
} from "@ionic/react";
import { book, build, colorFill, grid } from "ionicons/icons";
import React, { Component } from "react";
import PlaidLink from "react-plaid-link";

import "./Profile.css";
import Header from "../components/header";
import { API_BASE } from "../constants";
import axios from "axios";

// const connectAccount = () => {
//   api.post("/connect_account");
// };

class Profile extends Component {
  onSuccess = (token, metadata) => {
    axios
      .post(`${API_BASE}/get_access_token`, {
        public_token: token
      })
      .then(resp => {
        console.log("holy shit is this a response", resp);
      });
  };

  render() {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <IonCard className="welcome-card">
            <img src="/assets/shapes.svg" alt="" />
            <IonCardHeader>
              {/* <IonCardSubtitle>Get Started</IonCardSubtitle> */}
              <IonCardTitle>Connected Accounts</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList></IonList>
              {/* <p>
                Now that your app has been created, you'll want to start building
                out features and components. Check out some of the resources below
                for next steps.
              </p> */}
            </IonCardContent>
          </IonCard>

          {/* <IonList lines="none">
            <IonListHeader>
              <IonLabel>Resources</IonLabel>
            </IonListHeader>
            <IonItem href="https://ionicframework.com/docs/" target="_blank">
              <IonIcon slot="start" color="medium" icon={book} />
              <IonLabel>Ionic Documentation</IonLabel>
            </IonItem>
            <IonItem
              href="https://ionicframework.com/docs/building/scaffolding"
              target="_blank"
            >
              <IonIcon slot="start" color="medium" icon={build} />
              <IonLabel>Scaffold Out Your App</IonLabel>
            </IonItem>
            <IonItem
              href="https://ionicframework.com/docs/layout/structure"
              target="_blank"
            >
              <IonIcon slot="start" color="medium" icon={grid} />
              <IonLabel>Change Your App Layout</IonLabel>
            </IonItem>
            <IonItem
              href="https://ionicframework.com/docs/theming/basics"
              target="_blank"
            >
              <IonIcon slot="start" color="medium" icon={colorFill} />
              <IonLabel>Theme Your App</IonLabel>
            </IonItem>
          </IonList> */}

          <PlaidLink
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
            <IonButton id="link-button">Connect an Account (Plaid)</IonButton>
          </PlaidLink>
        </IonContent>
      </IonPage>
    );
  }
}

export default Profile;

import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { leaf, person, stats } from "ionicons/icons";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Insights from "./pages/Insights";
import Details from "./pages/Details";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/profile" component={Profile} exact={true} />
          <Route path="/feed" component={Feed} exact={true} />
          <Route path="/feed/details" component={Details} />
          <Route path="/insights" component={Insights} />
          <Route
            path="/"
            render={() => <Redirect to="/profile" />}
            exact={true}
          />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={person} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
          <IonTabButton tab="feed" href="/feed">
            <IonIcon icon={leaf} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="insights" href="/insights">
            <IonIcon icon={stats} />
            <IonLabel>Tab Three</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;

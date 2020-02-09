import React, { Component } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

export default class Auth extends Component {
  state = {
    isAuthed: false
  };
  componentDidMount() {
    console.log("document cookie", document.cookie);
    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)x-uid\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const isAuthed = !!cookieValue;
    this.setState({ isAuthed });
  }
  render() {
    const { component } = this.props;
    const { isAuthed } = this.state;
    console.log("isauthed", isAuthed);
    return isAuthed ? component : <Redirect to="/auth" />;
  }
}

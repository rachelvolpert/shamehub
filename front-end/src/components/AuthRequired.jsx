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
  componentWillMount() {
    console.log("document cookie", document.cookie);
    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)x-uid\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const isAuthed = !!cookieValue;
    // TODO lol no
    this.setState({ isAuthed: true });
  }
  render() {
    const { component } = this.props;
    let { isAuthed } = this.state;
    if (isAuthed) {
      return component;
    } else {
      return <Redirect to="/auth" />;
    }
  }
}

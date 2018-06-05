import React from 'react';
import Router from 'next/router';
import cookie from 'cookie';
import { auth, randomNoteUrl } from '../evernote';

const callbackUrl = "http://localhost:3000/"; // your endpoint

export default class extends React.Component {
  static async getInitialProps({ req, res, query }) {
    let redirectUrl = ''
    let token = '';
    let secret = '';
    const props = {};

    const cookies = cookie.parse(req.headers.cookie || '');

    if (query.oauth_verifier) {
      const ot = cookies.o.split('/')[0];
      const os = cookies.o.split('/')[1];
      const token = await new Promise((resolve) => {
        auth.getAccessToken(
          ot, os, query.oauth_verifier,
          (error, token, secret) => {
            props.at = token;
            prop.redirectUrl = '/';
            resolve(token);
          }
        );
      });
    } else if (!cookies.at) {
      await new Promise((resolve) => {
        auth.getRequestToken(callbackUrl, (error, token, secret) => {
          redirectUrl = auth.getAuthorizeUrl(token);
          props.redirectUrl = redirectUrl;
          props.osecret = secret;
          props.otoken = token;
          resolve();
        });
      });
    } else {
      props.redirectUrl = await randomNoteUrl(cookies.at);
    }
    return props;
  }
  componentDidMount() {
    if (this.props.otoken) {
      document.cookie = `o=${this.props.otoken}/${this.props.osecret}`;
    } else if (this.props.at) {
      document.cookie = `at=${this.props.at}`;
    }
    if (this.props.redirectUrl) {
      window.location.href = this.props.redirectUrl;
    }
  }
  render() {
    return (
      <div>
        Redirecting ...
      </div>
    );
  }
}

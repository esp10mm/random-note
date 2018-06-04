import React from 'react';
import Router from 'next/router';
import Evernote from 'evernote';
import cookie from 'cookie';

const callbackUrl = "http://localhost:3000/oauth_callback"; // your endpoint

// initialize OAuth
const client = new Evernote.Client({
  consumerKey: process.env.KEY,
  consumerSecret: process.env.secret,
  sandbox: false,
  china: false,
});


export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    let redirectUrl = ''
    let token = '';
    let secret = '';
    const props = await new Promise((resolve) => {
      client.getRequestToken(callbackUrl, (error, token, secret) => {
        redirectUrl = client.getAuthorizeUrl(token);
        resolve({ token, secret, redirectUrl });
      });
    });
    return props;
  }
  componentDidMount() {
    document.cookie = `c=${this.props.token}/${this.props.secret}`;
    window.location.href = this.props.redirectUrl;
  }
  render() {
    return (
      <div>
        Redirecting ...
      </div>
    );
  }
}

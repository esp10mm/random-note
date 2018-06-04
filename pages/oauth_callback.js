import React from 'react';
import Router from 'next/router';
import Evernote from 'evernote';

// initialize OAuth
const client = new Evernote.Client({
  consumerKey: process.env.KEY,
  consumerSecret: process.env.secret,
  sandbox: false,
  china: false,
});

// client.getRequestToken(callbackUrl, (error, token, secret) => {
//   redirectUrl = client.getAuthorizeUrl(token); // send the user to Evernote
// });

export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    console.log(req.headers.cookie);
    // if (res) {
    //   res.writeHead(302, {
    //     Location: redirectUrl
    //   })
    //   res.end()
    //   res.finished = true
    // } else {
    //   Router.push(redirectUrl);
    // }
    return {}
  }
  render() {
    return (
      <div />
    );
  }
}

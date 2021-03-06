import React from 'react';
import Router from 'next/router';
import cookie from 'cookie';
import { auth, randomNote, getRedirectUrl } from '../evernote';

const callbackUrl = process.env.CALLBACK_URL || 'http://localhost:3000/'; // your endpoint

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
            props.redirectUrl = '/';
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
      // props.redirectUrl = getRedirectUrl(await randomNote(cookies.at));
      props.note = await randomNote(cookies.at);
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
      <div
        style={{
          position: 'absolute',
          top: '40%',
          width: '100%',
          margin: '0px auto',
          textAlign: 'center',
        }}
      >
        {
          this.props.note ? (
            <a href={getRedirectUrl(this.props.note)}>
              {this.props.note.title}
            </a>
          ) : 'Redirecting ...'
        }
      </div>
    );
  }
}

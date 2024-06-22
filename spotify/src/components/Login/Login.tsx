import React from 'react';
import style from '../../assets/styles/loginStyle.module.scss';

const Login = () => {
  const makeid = (length: number) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const initiateSpotifyLogin = async () => {
    const randomInt = getRandomInt(43, 128);
    const codeVerifier = makeid(randomInt);
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier)
    );

    const codeChallenge = window
      .btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const state = makeid(12);

    sessionStorage.setItem('spotify-code-verifier', codeVerifier);
    sessionStorage.setItem('spotify-state', state);
    const scopes = `ugc-image-upload%20user-read-playback-state%20user-read-playback-state%20user-read-currently-playing%20app-remote-control%20streaming%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-follow-modify%20user-follow-read%20user-read-playback-position%20user-top-read%20user-read-recently-played%20user-library-modify%20user-library-read%20user-read-email%20user-read-private%20user-modify-playback-state`;
    const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=http://localhost:3000/auth&scope=${scopes}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.open(authURL, '_self');
  };

  return (
    <div className={style.loginWrapper}>
      <div className="App">
        <button onClick={initiateSpotifyLogin}>Log in to spotify</button>
      </div>
    </div>
  );
};

export default Login;

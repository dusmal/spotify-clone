import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthRedirect() {
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getParams = function(url: any) {
      let params: { [key: string]: string } = {};
      let parser = document.createElement('a');
      parser.href = url;
      const query = parser.search.substring(1);
      const vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
      return params;
    };

    const params = getParams(window.location.href);
    const code = params.code;
    const state = params.state;
    console.log(sessionStorage.getItem('spotify-code-verifier'));
    if (state !== sessionStorage.getItem('spotify-state')) {
      console.log('state not found in session storage');
      console.log(sessionStorage.getItem('spotify-state'));
      setError(true);
      return undefined;
    }
    const postBody = {
      client_id: 'CLIENT_ID',
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/auth',
      code_verifier: sessionStorage.getItem('spotify-code-verifier'),
    };

    axios
      .post('https://accounts.spotify.com/api/token', postBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
      })
      .then((res) => {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        setRedirect(true);
        navigate('/dashboard/browseCategories');
      })
      .catch((err) => {
        console.log('ERROR');
        console.log(err);
        setError(true);
      });
  }, []);
  return (
    <div>
      {!redirect && !error && <h3>Authenticating...</h3>}
      {redirect && <div>Authentication successful!</div>}
      {error && <h3>There was an error authenticating with Spotify.</h3>}
    </div>
  );
}

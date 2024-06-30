import axios from 'axios';

function getLocalAccessToken() {
  const accessToken = localStorage.getItem('access_token');
  console.log('from getLocalAccessToken() ', accessToken);
  return accessToken;
}

const spotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    Authorization: `Bearer ${getLocalAccessToken()}`,
  },
});

spotifyClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    console.log(originalConfig);
    if (err.response) {
      console.log(err.response);
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          await getRefreshToken();
          originalConfig.headers[
            'Authorization'
          ] = `Bearer ${getLocalAccessToken()}`;
          return spotifyClient(originalConfig);
        } catch (err) {
          console.log('ERROR ', err);
        }
      }
      if (err.response.status === 429) {
        alert('TOO MANY REQUESTS!');
        await new Promise(resolve => setTimeout(resolve, 30000));
        return spotifyClient(originalConfig);
      }
    }
    return Promise.reject(err);
  }
);

export async function getRefreshToken() {
  const postBody = {
    client_id: '669f7329a10d4457841813f9eb088946',
    grant_type: 'refresh_token',
    refresh_token: localStorage.getItem('refresh_token'),
  };
  let refreshToken;
  return axios
    .post('https://accounts.spotify.com/api/token', postBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;',
      },
    })
    .then((res) => {
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      refreshToken = res.data.refresh_token;
    })
    .catch((err) => {
      if ((err.response.status = 401)) {
        console.log(err);
      }
    });
}

export async function fetchProfile() {
  let response = await spotifyClient.get('/me').then((resp) => {
    sessionStorage.setItem('user_id', resp.data.id);
    return resp.data;
  });
  return response;
}

export async function fetchPlaylists() {
  let userId = sessionStorage.getItem('user_id');
  let response = await spotifyClient
    .get(`/users/${userId}/playlists`)
    .then((resp) => {
      return resp.data.items;
    });
  return response;
}

export async function getSeveralCategories() {
  let response = await spotifyClient
    .get(`/browse/categories?limit=50`)
    .then((resp) => {
      return resp.data.categories.items;
    });
  return response;
}

export async function getCategoryPlaylist(id: string) {
  let response = await spotifyClient
    .get(`/browse/categories/${id}/playlists`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function getRecentlyPlayedTracks() {
  let response = await spotifyClient
    .get(`/me/player/recently-played?limit=20`)
    .then((resp) => {
      return resp;
    });
  return response;
}

export async function fetchPlaylist(playlistId: string) {
  let response = await spotifyClient
    .get(`/playlists/${playlistId}`)
    .then((resp) => {
      return resp.data;
    });
  response.tracks.items = response.tracks.items.filter((el: any) => el.track !== null);
  return response;
}
//from playlist
export async function fetchTracks(offset: string) {
  let response = await spotifyClient
    .get(`/playlists/${offset}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}
//fetch all tracks from all playlists 
export async function fetchAllTracksFromPlaylist(playlistId: string) {
  let allTracks: any[] = [];
  let offset = 0;
  const limit = 100;
  let response;
  do {
    response = await spotifyClient.get(`/playlists/${playlistId}/tracks`, {
      params: { offset, limit }
    });

    allTracks = allTracks.concat(response.data.items);
    offset += limit;
  } while (response.data.next);
  return allTracks;
}

export async function fetchNextTracksFromToken(nextToken: string) {
  const offset = nextToken.replace('https://api.spotify.com/v1/playlists/', '');
  const nextTracks = await fetchTracks(offset);
  return nextTracks;
};

//add track to playlist
export async function addItemsToPlaylist(playlistId: string, trackId: string) {
  const body = {
    "uris": [
      `spotify:track:${trackId}`
    ],
    "position": 0
  }
  let response = await spotifyClient
    .post(`/playlists/${playlistId}/tracks`, body)
    .then((resp) => {
      return resp.data;
    });
  console.log('add track to playlost, ', response);
  return response;
}

//remove track drom playlist
export async function removePlaylistItems(playlistId: string, trackId: string) {
  let response = await spotifyClient
    .delete(`/playlists/${playlistId}/tracks`, {
      data: {
        "tracks": [
          { "uri": `spotify:track:${trackId}` }
        ]
      }
    })
    .then((resp) => {
      return resp.data;
    });
  return response;
}

//liked songs
export async function getSavedTracks(offset: string, limit: string) {
  let response = await spotifyClient
    .get(`/me/tracks?offset=${offset}&limit=${limit}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}
//check liked songs
export async function checkSavedTracks(id: string) {
  let response = await spotifyClient
    .get(`/me/tracks/contains?ids=${id}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}
//like song
export async function saveTrack(id: string) {
  let response = await spotifyClient
    .put(`/me/tracks/?ids=${id}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}
//dislike song

export async function removeSavedTrack(trackId: string) {
  let response = await spotifyClient
    .delete(`/me/tracks`, {
      data: { "ids": [`${trackId}`] }
    })
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function fetchArtist(artistId: string) {
  let response = await spotifyClient
    .get(`/artists/${artistId}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function fetchArtistsTopTracks(artistId: string) {
  let response = await spotifyClient
    .get(`/artists/${artistId}/top-tracks?country=US`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function getArtistRelatedArtists(artistId: string) {
  let response = await spotifyClient
    .get(`/artists/${artistId}/related-artists`)
    .then((resp) => {
      return resp.data.artists;
    });
  return response;
}

export async function getArtistAlbums(artistId: string) {
  let response = await spotifyClient
    .get(`/artists/${artistId}/albums`)
    .then((resp) => {
      return resp.data.items;
    });
  return response;
}


export async function getAlbum(albumId: string) {
  let response = await spotifyClient
    .get(`/albums/${albumId}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function getTrack(trackId: string) {
  let response = await spotifyClient
    .get(`/tracks/${trackId}`)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function getTrackRecommendation(trackId: string, artistId: string) {
  let response = await spotifyClient
    .get(`/recommendations?seed_tracks=${trackId}&seed_artists=${artistId}`)
    .then((resp) => {
      return resp.data.tracks;
    });
  return response;
}

export async function playAlbum(albumId: string) {
  const body = {
    "context_uri": `spotify:album:${albumId}`,
    "offset": {
      "position": 1
    },
    "position_ms": 0
  }
  let response = await spotifyClient
    .put(`/me/player/play`, body)
    .then((resp) => {
      return resp.data;
    });
  console.log(response);
  return response;
}

export async function playTracks(trackIds: string[], position = 5, deviceId: string) {
  const body = {
    "uris": trackIds,
    "offset": { "position": position }

  }
  let response = await spotifyClient
    .put(`/me/player/play?device_id=${deviceId}`, body)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function playTrackWithoutContext(trackId: string, deviceId: string) {
  const body = {
    "uris": [`spotify:track:${trackId}`],
  }
  let response = await spotifyClient
    .put(`/me/player/play?device_id=${deviceId}`, body)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function playTrack(contextUri: string, position: number, deviceId: string) {
  const body = {
    "context_uri": `${contextUri}`,
    "offset": { "position": position }
  }
  let response = await spotifyClient
    .put(`/me/player/play?device_id=${deviceId}`, body)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function pausePlayback(deviceId: string) {

  if (deviceId) {
    let response = await spotifyClient
      .put(`/me/player/pause?device_id=${deviceId}`)
      .then((resp) => {
        return resp.data;
      });
    return response;
  }
}


export async function changeVolumne(deviceId: string, value: string) {
  if (deviceId) {
    let response = await spotifyClient
      .put(`/me/player/volume?volume_percent=${value}&device_id=${deviceId}`)
      .then((resp) => {
        return resp.data;
      });
    return response;
  }
}

export async function transferPlayback(deviceId: string) {
  console.log('device_id transfer playback', deviceId);
  const body = {
    "device_ids": [
      deviceId
    ]
  }
  let response = await spotifyClient
    .put(`/me/player`, body)
    .then((resp) => {
      return resp.data;
    });
  return response;
}

export async function search(term: string) {
  if (term !== '') {
    try {
      const response = await spotifyClient.get(`/search?q=${term}&type=artist,album,track,playlist`);
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }
}




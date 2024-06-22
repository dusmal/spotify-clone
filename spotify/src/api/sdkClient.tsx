import {transferPlayback } from '../api/spotifyApiClient';
import {getRefreshToken} from './spotifyApiClient';
export let playerInstance: any; 
export let deviceId: string; 
// export function initializeSpotifyPlayer() {

//   if (!playerInstance) {
//     console.log('gallo?');
//     playerInstance = new window.Spotify.Player({
//       name: 'Web Playback SDK',
//       getOAuthToken: cb => { cb(localStorage.getItem('access_token')!) },
//       volume: 0.5
//     });
//   }
//   // return playerInstance;
// }

export function initializeSpotifyPlayer() {

  if (!playerInstance) {
    console.log('gallo?');
    playerInstance = new window.Spotify.Player({
      name: 'POMMY LOVES PETI <3',
      getOAuthToken: async (cb: any) =>{
        await getRefreshToken();
        cb(localStorage.getItem('access_token')!);
      },
      volume: 0.5
    });
  }
  // return playerInstance;
}


export function addReadyListener(callback: (deviceId: string) => void): void {
  playerInstance.addListener('ready', ({ device_id }: { device_id: string }) => {
    console.log('Ready with Device ID', device_id);
    // transferPlayback(device_id); 
    callback(device_id); 
  });
}

export function addNotReadyListener() {
  playerInstance.addListener('not_ready', ({ device_id }: { device_id: string }) => {
    console.log('Device ID has gone offline', device_id);
  });
}

export function addStateChangeListener() {
  playerInstance.addListener('player_state_changed', (state: any) => {
    if (!state) {
      return;
    }
  });
}

export async function connectPlayer() {
  await playerInstance.connect().then((success:any)  => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  });
}
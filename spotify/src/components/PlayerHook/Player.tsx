import { useState, useEffect } from "react";
import { getRefreshToken } from "../../api/spotifyApiClient";
import { transferPlayback } from "../../api/spotifyApiClient";

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
  }
type Context = {
    uri: string,
    metadata:{
        context_description: string
    }
  }
  
const usePlayer= () => {
  const [playerInstance, setPlayerInstance] = useState<any>();
  const [deviceId, setDeviceId] = useState<string>('');
  const [is_paused, setPaused] = useState<boolean>(false);
  const [is_active, setActive] = useState<boolean>(false);
  const [current_track, setCurrentTrack] = useState<any>(track);
  const [playerContext, setPlayerContext] = useState<Context>({ uri: '', metadata:{context_description:''} });
  const [playerState, setPlayerState] = useState<any>()

  useEffect(()=>{
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken:async (cb: any) => {
                              await getRefreshToken();
                              cb(localStorage.getItem('access_token')!);
                            },
            volume: 0.5
        });

        setPlayerInstance(player);

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            console.log('devideId from hook',device_id);
            setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.connect();
    };

  },[]);

  useEffect(()=>{
    if(playerInstance){
        playerInstance.addListener('player_state_changed', ( (state:any) => {
                  if (!state) {
                      return;
                  }
                  setCurrentTrack(state.track_window.current_track);
                  setPaused(state.paused);
                  setPlayerContext(state.context);
                  setPlayerState(state);
                  playerInstance.getCurrentState().then(  (state:any)  => { 
                      (!state)? setActive(false) : setActive(true) 
                  });          
                  }));
      }
  },[playerInstance]);

  useEffect(()=>{
    if(playerInstance){
      if(!is_active){
        transferPlayback(deviceId); 
        setActive(true);
      }
   }
  }, [deviceId]);

  return {playerInstance, deviceId, is_paused, is_active,current_track, playerContext, playerState};
};

export default usePlayer;
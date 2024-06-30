import { useState, useEffect } from "react";
import { getRefreshToken } from "../../api/spotifyApiClient";
import { transferPlayback } from "../../api/spotifyApiClient";
import { Context, MinimalSpotifyArtist, ISpotifyArtist, MinimalTrack, PlaybackState } from "../../types/types";

const track = {
  id: '',
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

const usePlayer = () => {
  const [playerInstance, setPlayerInstance] = useState<any>();
  const [deviceId, setDeviceId] = useState<string>('');
  const [isPaused, setPaused] = useState<boolean>(false);
  const [isActive, setActive] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<MinimalTrack>(track);
  const [trackArtists, setTrackArtists] = useState<MinimalSpotifyArtist[]>([])
  const [playerContext, setPlayerContext] = useState<Context>({ uri: '', metadata: { context_description: '' } });
  const [playerState, setPlayerState] = useState<PlaybackState>()

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: async (cb: any) => {
          await getRefreshToken();
          cb(localStorage.getItem('access_token')!);
        },
        volume: 0.5
      });

      setPlayerInstance(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        console.log('devideId from hook', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
    };

  }, []);

  useEffect(() => {
    if (!playerInstance) {
      return;
    }
    playerInstance.addListener('player_state_changed', handlePlayerStateChanged);

    return () => {
      playerInstance.removeListener('player_state_changed', handlePlayerStateChanged);
    };
  }, [playerInstance]);

  useEffect(() => {
    if (playerInstance && !isActive) {
      transferPlayback(deviceId);
      setActive(true);
    }
  }, [deviceId]);

  const handlePlayerStateChanged = (state: PlaybackState | null): void => {
    if (!state) return;

    setCurrentTrack(state.track_window.current_track);
    setPaused(state.paused);
    setPlayerContext(state.context);
    setPlayerState(state);
    const artists = extractArtistInfo(state.track_window.current_track.artists);
    setTrackArtists(artists);

    playerInstance?.getCurrentState().then((state: PlaybackState) => {
      setActive(!!state);
    });
  };

  const extractArtistInfo = (artists: ISpotifyArtist[]): MinimalSpotifyArtist[] => {
    const extractedArtists = artists.map((el: ISpotifyArtist) => {
      const artistId = el.uri.match(/spotify:(artist|playlist|album):([^:]+)/)?.[2] || "";
      return { id: artistId, name: el.name };
    })
    return extractedArtists;
  }

  return { playerInstance, deviceId, isPaused, isActive, currentTrack, playerContext, playerState, trackArtists };
};


export default usePlayer;
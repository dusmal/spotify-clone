import { Artist, ISpotifyAlbum, ISpotifyPlaylist, ISpotifyTrack } from "../types/types";
import { formatTime } from "./utils";


export const getPlaylistTime = (playlist: ISpotifyPlaylist): string => {
  let totalMs = 0;
  let approximation = false;
  playlist.tracks.items.forEach((el: any) => {
    totalMs += el.track?.duration_ms;
  });
  //approximate totoal time if more tracks than 100
  if (playlist.tracks.items.length > 100) {
    totalMs *= playlist.tracks.total / 100;
    approximation = true;
  }

  return formatTime(totalMs, approximation);
}

export const pluralize = (word: string, count: number): string => {
  return count === 1 ? word : `${word}s`;
}

export const getArtistImage = (artist: Artist): string => {
  const artistImageUrl = artist.images.length > 0
      ? artist.images[0].url
      : 'https://i.ibb.co/1JchXTW/kiwi-default.png';

  return artistImageUrl;
}

export const getAlbumImage = (album: ISpotifyAlbum): string => {
  const albumImageUrl = album.images.length > 0
  ? album.images[0].url
  : 'https://i.ibb.co/1JchXTW/kiwi-default.png';

  return albumImageUrl;
}

export const getTrackImage = (track: ISpotifyTrack): string => {
  const trackImageUrl =  track.album.images.length > 0
  ? track.album.images[0].url
  : 'https://i.ibb.co/1JchXTW/kiwi-default.png'

  return trackImageUrl;
}

export const getPlaylistImage = (playlist: ISpotifyPlaylist): string => {
  const playlistImageUrl =  playlist.images.length > 0
  ? playlist.images[0].url
  : 'https://i.ibb.co/1JchXTW/kiwi-default.png';

  return playlistImageUrl;
}

export const getPlayerContext = (context: string): string =>{
  const match = context.match(/spotify:(artist|track|playlist|album):([^:]+)/);
  const contextType = match ? match[1] : 'empty';
  return contextType; 
}

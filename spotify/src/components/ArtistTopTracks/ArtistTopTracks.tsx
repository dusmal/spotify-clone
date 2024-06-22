import React from 'react';
import { playTracks } from '../../api/spotifyApiClient';
import { ISpotifyTopTracks} from '../../types/types';
import {convertMs} from '../../helpers/sharedFunctions';
import TrackButton from '../TrackButton/TrackButton';
import style from '../../assets/styles/artistTopTracksStyle.module.scss';

type Props = {
    id: string;
    topTracks: ISpotifyTopTracks[];
    tracksUris: string[];
    player:any;
    isPlayerPaused: boolean;
    currentPlayerTrack: string;
    deviceId: string;
    playerContext: any;
    setPlayToggle: React.Dispatch<React.SetStateAction<boolean | null>>;
    onTrackSelect: (albumId: string) => void;
  };

const ArtistTopTracks = ({id, setPlayToggle, onTrackSelect, topTracks,tracksUris, player, isPlayerPaused, currentPlayerTrack, deviceId, playerContext}:Props) => {
  
    const handleTogglePlay = (trackNumber:string, trackId:any, contextId: string) => {
      let findTrackNumberPosition = tracksUris.indexOf(`spotify:track:${trackNumber}`);
      if(currentPlayerTrack!==trackNumber){
        playTracks(tracksUris, findTrackNumberPosition, deviceId);
        setPlayToggle(false);
      }else{
        if( playerContext===''  || playerContext==='-'){
          player.togglePlay();
        }
        else{
          playTracks(tracksUris, findTrackNumberPosition, deviceId);
          setPlayToggle(false);
        }
      }
    };
    
    return  <div className={style.artistTopTracksContainer}>
        <div className={style.artistTopTracksHeader}>
          <h2>Popular</h2>
        </div>
        <ul>
            {topTracks.map((track, i:number) => {
              let url = track.album.images.length === 3
                 ? track.album.images[2].url
              : 'https://i.ibb.co/1JchXTW/kiwi-default.png';
              return <li key={i+track.id+id} >
                <p className={style.playTrack}>
                  {
                    <TrackButton
                            trackId={track.id}
                            trackNumber={i+1}
                            onTogglePlay={handleTogglePlay}
                            contextId={''}
                            currentPlayerTrack={currentPlayerTrack}
                            isPlayerPaused = {isPlayerPaused}
                            playerContext = {playerContext}
                            contextType = 'artist'
                           />
                  }
                </p>
                <img src={url}></img>
                <p className={style.columnStyle} onClick={()=>onTrackSelect(track.id)}>{track.name}</p>
                <p>{convertMs(track.duration_ms)}</p>
              </li>;
            })}
        </ul>
      </div>
    };
 
export default ArtistTopTracks;
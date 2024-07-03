import React from 'react';
import { playTracks } from '../../api/spotifyApiClient';
import { ISpotifyTopTracks } from '../../types/types';
import { formatMillisecondsToTime } from '../../helpers/utils';
import TrackButton from '../TrackButton/TrackButton';
import style from '../../assets/styles/artistTopTracksStyle.module.scss';
import { getTrackImage } from '../../helpers/spotifyUtils';

type Props = {
  artistId: string;
  topTracks: ISpotifyTopTracks[];
  tracksUris: string[];
  player: any;
  setTopTracksPlayToggle: React.Dispatch<React.SetStateAction<boolean | null>>;
  onTrackSelect: (albumId: string) => void;
};

const ArtistTopTracks = ({ artistId,
                           setTopTracksPlayToggle,
                           onTrackSelect,
                           topTracks,
                           tracksUris,
                           player
                        }: Props) => {
  const { playerInstance, deviceId, isPaused, currentTrack, playerContext } = player;
  const isArtistPlayerContext = playerContext.uri === '' || playerContext.uri === '-';
  
  const handleTogglePlay = (trackNumber: string) => {
    let findTrackNumberPosition = tracksUris.indexOf(`spotify:track:${trackNumber}`);
    if (currentTrack.id !== trackNumber) {
      playTracks(tracksUris, findTrackNumberPosition, deviceId);
      setTopTracksPlayToggle(false);
    } else {
      if (isArtistPlayerContext) {
        playerInstance.togglePlay();
        setTopTracksPlayToggle(prev => !prev);
      }
      else {
        playTracks(tracksUris, findTrackNumberPosition, deviceId);
        setTopTracksPlayToggle(false);
      }
    }
  };

  return <div className={style.artistTopTracksContainer}>
    <div className={style.artistTopTracksHeader}>
      <h2>Popular</h2>
    </div>
    <ul>
      {topTracks.map((track, i: number) => {
        return <li key={i + track.id + artistId} >
          <span className={style.playTrack}>
            {
              <TrackButton
                trackId={track.id}
                trackNumber={i + 1}
                onTogglePlay={handleTogglePlay}
                contextId={''}
                currentPlayerTrack={currentTrack}
                isPlayerPaused={isPaused}
                playerContext={playerContext}
                contextType={`artist`}
              />
            }
          </span>
          <img src={getTrackImage(track)}></img>
          <p className={style.columnStyle} onClick={() => onTrackSelect(track.id)}>{track.name}</p>
          <p>{formatMillisecondsToTime(track.duration_ms)}</p>
        </li>;
      })}
    </ul>
  </div>
};

export default ArtistTopTracks;
import React, { useEffect } from 'react';
import style from '../../assets/styles/sidePlayerStyle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';
import ListArtists from '../ListArtists/ListArtists';


type Props = {
    player: any,
    onArtistSelect: (artistId: string) => void;
    onPlaylistSelect: (playlistId: string) => void;
    onTrackSelect: (albumId: string) => void;
};

function SidePlayer({ player,
    onArtistSelect,
    onPlaylistSelect,
    onTrackSelect }: Props) {

    const { playerInstance, isPaused, isActive, currentTrack, playerContext, trackArtists } = player;

    const handleContextTypeClick = (context: any): void => {
        const match = context.match(/spotify:(artist|track|playlist|album):([^:]+)/);
        if (match[1] === 'playlist') {
            if (match) {
                onPlaylistSelect(match[2]);
            } else {
                console.error("No match found for the given URI");
            }
        }
        if (match[1] === 'album') {
            console.log('handle album component display later')
        }
        if (match[1] === 'artist') {
            console.log('handle artist component display later')
        }
        if (match[1] === 'track') {
            onTrackSelect(currentTrack.id)
        }
    }

    if (!isActive) {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <div className={style.sidePlayerContainer}>
                <div>
                    <div className={style.contextDescription} onClick={() => handleContextTypeClick(playerContext.uri)}><h4>{playerContext.metadata.context_description}</h4></div>
                    <img className={style.playerImage} src={currentTrack.album.images[0].url} />
                    <div >

                        <div className={style.trackName} onClick={() => handleContextTypeClick(currentTrack.uri)}><h3>{currentTrack.name}</h3></div>
                        <ListArtists artists={trackArtists} onArtistSelect={onArtistSelect} />
                        <div className={style.buttonsContainer}>
                            <div className={style.button} onClick={() => { playerInstance.previousTrack() }} >
                                <FontAwesomeIcon icon={faBackward} />
                            </div>

                            <div className={style.button} onClick={() => { playerInstance.togglePlay() }} >
                                {isPaused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />}
                            </div>

                            <div className={style.button} onClick={() => { playerInstance.nextTrack() }} >
                                <FontAwesomeIcon icon={faForward} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SidePlayer;
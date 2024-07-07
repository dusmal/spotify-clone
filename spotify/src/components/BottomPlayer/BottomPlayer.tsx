import React, { useEffect, useState } from 'react';
import style from '../../assets/styles/bottomPlayerStyle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faForward, faBackward, faCirclePlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { getImageColors } from '../../helpers/colorsUtils';
import { saveTrack, fetchPlaylists, fetchAllTracksFromPlaylist } from '../../api/spotifyApiClient';
import AddToPlaylists from '../AddToPlaylists/AddToPlaylists';
import { ISpotifyPlaylistTracksItems, ISpotifyPlaylist } from '../../types/types';
import TrackProgressBar from '../TrackProgressBar/TrackProgressBar';
import Volume from '../Volume/Volume';
import { getCheckIcon, getPlayPauseIcon } from '../../helpers/utils';
import { checkIfTrackLiked } from '../../helpers/spotifyUtils';

type Props = {
    player: any,
};

function BottomPlayer({ player }: Props) {

    const [likedSong, setLikedSong] = useState<boolean | null>(null);
    const [likeIconHovered, setLikeIconHovered] = useState<boolean>(false);
    const [showAddToPlaylistsComponent, setShowAddToPlaylistsComponent] = useState<boolean>(false);
    const [addToPlaylistToggle, setAddToPlaylistToggle] = useState<boolean>(true);
    const [tracksPerPlaylists, setTracksPerPlaylist] = useState<{ [key: string]: any[] }>({});
    const [accentColor, setAccentColor] = useState<string>('white')
    const { playerInstance, deviceId, isPaused, isActive, currentTrack, playerState } = player;

    useEffect(() => {
        fetchTracksForPlaylists();
    }, []);

    useEffect(() => {
        if (!currentTrack?.id) {
            return;
        }
        getImageColors(currentTrack.album.images[0].url).then((color: any) => {
            setAccentColor(color)
        })

        checkIfTrackLiked(currentTrack.id).then(res => {
            setLikedSong(res);
        });
        setShowAddToPlaylistsComponent(false);
        setLikeIconHovered(false)
    }, [currentTrack?.id]);

    const handleOnMouseLikeIconHoveredLeave = () => {
        setLikeIconHovered(showAddToPlaylistsComponent);
    }

    const handleSongLike = () => {
        saveTrack(currentTrack.id).then((res) => {
            checkIfTrackLiked(currentTrack.id).then(res => {
                setLikedSong(res);
            });
        });
    }

    const handleAddToPlaylistClick = () => {
        setAddToPlaylistToggle(prev => !prev);
        setShowAddToPlaylistsComponent(addToPlaylistToggle);
    }

    const handleCloseComponent = (changed: boolean, likedSong: boolean) => {
        setLikeIconHovered(false);
        setShowAddToPlaylistsComponent(false);
        setLikedSong(likedSong);
        setAddToPlaylistToggle(prev => !prev);
        if (changed) {
            fetchTracksForPlaylists();
        }
    }

    const handleLikeAddPlaylistButton = () => {
        likedSong ? handleAddToPlaylistClick() : handleSongLike();
    }

    const fetchTracksForPlaylists = async () => {
        const loggedUserId = sessionStorage.getItem('user_id');
        const res = await fetchPlaylists();
        const usersPlaylists = res.filter((el: ISpotifyPlaylist) => el.owner.id === loggedUserId);

        const trackPromises = usersPlaylists.map(async (playlist: any) => {
            const tracks = await fetchAllTracksFromPlaylist(playlist.id);
            return {
                id: playlist.id,
                name: playlist.name,
                tracks: tracks.map((track: ISpotifyPlaylistTracksItems) => track.track.id)
            }
        });

        const allTracks = await Promise.all(trackPromises);
        const tracksPerPlaylist: { [key: string]: any } = {};

        allTracks.forEach(({ id, name, tracks }) => {
            tracksPerPlaylist[id] = { name, tracks };
        })
        setTracksPerPlaylist(tracksPerPlaylist);
    }

    if (!isActive || !playerState) {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <p> Instance not active. Transfer your playback using your Spotify app </p>
                    </div>
                </div>
            </>)
    } else {
        return (
            <div className={style.componentContainer} style={{ borderTop: `solid ${accentColor} 1px` }}>
                <div className={style.bottomPlayerContainer}>
                    <div className={style.buttonsContainer}>
                        <div className={style.button} onClick={() => { playerInstance.previousTrack() }} >
                            <FontAwesomeIcon icon={faBackward} />
                        </div>

                        <div className={style.button} style={{ color: 'white' }} onClick={() => { playerInstance.togglePlay() }} >
                            <FontAwesomeIcon icon={getPlayPauseIcon(isPaused)} />
                        </div>

                        <div className={style.button} onClick={() => { playerInstance.nextTrack() }} >
                            <FontAwesomeIcon icon={faForward} />
                        </div>
                    </div>
                    <div className={style.row}>
                        <div className={style.likeSongContainer}>
                            <div className={style.trackInfo}>
                                <p>{currentTrack?.name}</p>
                            </div>

                            <div onMouseEnter={() => setLikeIconHovered(true)} onMouseLeave={handleOnMouseLikeIconHoveredLeave} className={style.likeIconContainer}>
                                <FontAwesomeIcon style={{ color: 'white' }} icon={getCheckIcon(likedSong)} onClick={handleLikeAddPlaylistButton} />
                                {likeIconHovered &&
                                    (likedSong ? (<div id='likeWrapper' className={`${style.likeText}  ${showAddToPlaylistsComponent ? '' : style.boxStyle}`}>
                                        {showAddToPlaylistsComponent ?
                                            <div>
                                                <div className={style.addToPlaylistsContainer}>
                                                    <AddToPlaylists
                                                        current_track={currentTrack}
                                                        tracksPerPlaylists={tracksPerPlaylists}
                                                        handleCloseComponent={handleCloseComponent}
                                                    />
                                                </div>
                                            </div> : 'Add to Playlist'}</div>) : <div className={`${style.likeText} ${style.boxStyle}`}>Add to Liked Songs</div>)
                                }
                            </div>

                        </div>
                        <TrackProgressBar
                            player={player}
                            accentColor={accentColor}
                        />
                        <Volume deviceId={deviceId} />
                    </div>
                </div >
            </div>
        );
    }
}

export default BottomPlayer;
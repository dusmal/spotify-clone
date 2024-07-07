import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/albumStyle.module.scss';
import { getImageColors, invertHexColor } from '../../helpers/colorsUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop, faClock } from '@fortawesome/free-solid-svg-icons';
import { getAlbum, playTrack } from '../../api/spotifyApiClient';
import { ISpotifyAlbum } from '../../types/types';
import TrackButton from '../TrackButton/TrackButton';
import { formatMillisecondsToTime, getPlayPauseCircleIcon, pluralize } from '../../helpers/utils';
import { useParams } from 'react-router-dom';
import { getAlbumImage, getPlayerContext } from '../../helpers/spotifyUtils';
import ListArtists from '../ListArtists/ListArtists';

type Props = {
    onArtistSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
};

const Album = ({ onArtistSelect, onTrackSelect, player }: Props) => {
    const [albumColor, setAlbumColor] = useState<string>('');
    const [playAlbumToggle, setPlayAlbumToggle] = useState<boolean | null>(null);
    const { playerInstance, deviceId, isPaused, currentTrack, playerContext } = player;
    const [album, setAlbum] = useState<ISpotifyAlbum>();
    let { id } = useParams();
    const isContextMatching = currentTrack.album.uri === album?.uri;
    const isContextAlbum =  getPlayerContext(playerContext.uri) === 'album';
    
    useEffect(() => {
        if (!id) {
            return;
        }
        const fetchAlbum = async (albumId: string) => {
            try {
                const res = await getAlbum(albumId);
                setAlbum(res);
            } catch (error) {
                console.error('Error fetching artist:', error);
            }
        }

        fetchAlbum(id);
    }, [id]);

    useEffect(() => {
        if (!album) {
            return;
        }

        (isContextMatching && isContextAlbum) ? setPlayAlbumToggle(isPaused) : setPlayAlbumToggle(true);
        
        getImageColors(album.images[0].url).then(col => {
            setAlbumColor(col as string);
            return col;
        })
    }, [album]);

    useEffect(() => {
        if (!album) {
            return;
        }

        if (isContextMatching && isContextAlbum) {
            setPlayAlbumToggle(isPaused);
        }
    }, [isPaused]);

    function handleAlbumPlayButton() {
        if (!album) {
            return;
        }

        (isContextMatching && isContextAlbum) ? playerInstance.togglePlay() : playTrack(album.uri, 0, deviceId);
        setPlayAlbumToggle(prev => !prev);
    }

    function handlePlayTrack(offset: number, trackId: string) {
        if (!album) {
            return;
        }

        const isCurrentTrack = currentTrack.id === trackId;
        if (isCurrentTrack && isContextAlbum) {
            playerInstance.togglePlay();
        }
        else {
            playTrack(album.uri, offset, deviceId);
            setPlayAlbumToggle(false);
        }
    }

    if (!album) {
        return null;
    }

    return (
        <div className={style.albumComponentContainer} style={{ background: `linear-gradient(${albumColor} 0vh,#121212 90vh` }}>
            <div className={style.albumHeaderContainer}>
                <div className={style.imageWrapper}>
                    <img
                        src={getAlbumImage(album)}
                    ></img>
                </div>
                <div className={style.infoWrapper}>
                    <p className={style.textShadow}>Album</p>
                    <p id={style["title"]} className={`${style.title} ${style.textShadow}`}><span>{album?.name}</span></p>
                    <div className={style.textShadow} id={style["playlistDetails"]}>
                        <div>
                            <ListArtists artists={album.artists} onArtistSelect={onArtistSelect} />
                            <span> • </span>
                            <span>{album.release_date + ' • '}</span>
                            <span>{`${album.total_tracks} ${pluralize('song', album.total_tracks)}`}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.playContainer} style={{ color: `${invertHexColor(albumColor)}` }} >
                <FontAwesomeIcon onClick={handleAlbumPlayButton} className={style.playIcon}
                    icon={getPlayPauseCircleIcon(playAlbumToggle)}
                    style={{ color: `${invertHexColor(albumColor)}` }}
                />
            </div>
            <div className={style.albumTracksContainer}>
                <div className={style.firstRow}>
                    <p>#</p>
                    <p className={style.headerColumnStyle}>&nbsp;Title</p>
                    <p><FontAwesomeIcon icon={faClock} /></p>
                </div>
                <ul>
                    {
                        album.tracks.items.map((el, i) => {
                            return <li key={i}>
                                <span className={style.playTrack}>
                                    <TrackButton
                                        trackId={el.id}
                                        trackNumber={i + 1}
                                        onTogglePlay={() => handlePlayTrack(i, el.id)}
                                        contextId={album.id}
                                        currentPlayerTrack={currentTrack}
                                        isPlayerPaused={isPaused}
                                        playerContext={playerContext}
                                        contextType='album'
                                    />
                                </span>
                                <span className={style.trackName} onClick={() => { onTrackSelect(el.id) }}>{el.name}</span>
                                <span>{formatMillisecondsToTime(el.duration_ms)}</span>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default Album;
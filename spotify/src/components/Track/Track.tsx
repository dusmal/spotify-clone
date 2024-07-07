import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/trackStyle.module.scss';
import { getImageColors, invertHexColor } from '../../helpers/colorsUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { getTrack, getTrackRecommendation, playTrackWithoutContext } from '../../api/spotifyApiClient';
import { ISpotifyTrack } from '../../types/types';
import { formatMillisecondsToTime, getPlayPauseCircleIcon } from '../../helpers/utils';
import { useParams } from 'react-router-dom';
import ListArtists from '../ListArtists/ListArtists';
import RecommendedTracks from './RecommendedTracks/RecommendedTracks';
import { getTrackImage } from '../../helpers/spotifyUtils';

type Props = {
    onArtistSelect: (artistId: string) => void;
    onAlbumSelect: (albumId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
};

const Track = ({ onArtistSelect,
    onAlbumSelect,
    onTrackSelect,
    player }: Props) => {

    const [track, setTrack] = useState<ISpotifyTrack>();
    const [trackColor, setTrackColor] = useState<string>('');
    const [playTrackToggle, setPlayTrackToggle] = useState<boolean>(true);
    const [recommenededTracks, setRecommendedTracks] = useState<ISpotifyTrack[]>([])
    const { playerInstance, deviceId, isPaused, currentTrack } = player;
    let { id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchTrack = async (artistId: string) => {
            try {
                const res = await getTrack(artistId);
                setTrack(res);
            } catch (error) {
                console.error('Error fetching artist:', error);
            }
        }

        fetchTrack(id);
    }, [id]);

    useEffect(() => {
        if (!track) {
            return;
        }
        const artistIds = track.artists.map(el => el.id).join(',');
        getTrackRecommendation(track.id, artistIds).then(res => setRecommendedTracks(res));
        getImageColors(track.album.images[0].url).then(col => {
            setTrackColor(col as string);
            return col;
        })
    }, [track]);

    useEffect(() => {
        if (!track) {
            return;
        }

        if (track.uri === currentTrack.uri) {
            setPlayTrackToggle(isPaused);
        }
        else {
            setPlayTrackToggle(true);
        }
    }, [isPaused, currentTrack, track]);

    function handlePlay() {
        if (!track) {
            return;
        }
        if (currentTrack.uri === track.uri) {
            playerInstance.togglePlay();
        } else {
            playTrackWithoutContext(track.id, deviceId);
        }
        setPlayTrackToggle(prev => !prev);
    }

    return (
        <div className={style.trackComponentContainer} style={{ background: `linear-gradient(${trackColor} 0vh,#121212 90vh` }}>
            {track && <>
                <div className={style.trackHeaderContainer}>
                    <div className={style.imageWrapper}>
                        <img
                            src={getTrackImage(track)}
                        ></img>
                    </div>
                    <div className={style.infoWrapper}>
                        <p className={style.textShadow}>Song</p>
                        <p id={style["title"]} className={`${style.title} ${style.textShadow}`}><span>{track?.name}</span></p>
                        <div className={style.textShadow} id={style["playlistDetails"]}>
                            <div>
                                <ListArtists artists={track.artists} onArtistSelect={onArtistSelect} />
                                <span> • </span>
                                <span>{track.album.release_date}</span>
                                <span> • </span>
                                <span>{formatMillisecondsToTime(track.duration_ms)}</span>
                                <span> • </span>
                                <span className={style.albumName} onClick={() => onAlbumSelect(track.album.id)}>{track.album.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.playContainer} style={{ color: `${invertHexColor(trackColor)}` }} >
                    <FontAwesomeIcon onClick={handlePlay} className={style.playIcon}
                        icon={getPlayPauseCircleIcon(playTrackToggle)}
                        style={{ color: `${invertHexColor(trackColor)}` }}
                    />
                </div>
                <RecommendedTracks recommendedTracks={recommenededTracks}
                    onArtistSelect={onArtistSelect}
                    onTrackSelect={onTrackSelect}
                />
            </>}
        </div>
    );
};

export default Track;
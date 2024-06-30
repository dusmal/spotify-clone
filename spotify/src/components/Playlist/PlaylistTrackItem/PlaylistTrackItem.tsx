import React from 'react';
import style from '../../../assets/styles/playlistStyle.module.scss';
import { formatMillisecondsToTime, formatDateToUSLocale } from '../../../helpers/utils';
import TrackButton from '../../TrackButton/TrackButton';
import { ISpotifyPlaylist, ISpotifyPlaylistTracksItems } from '../../../types/types';
import ListArtists from '../../ListArtists/ListArtists';
import { getAlbumImage } from '../../../helpers/spotifyUtils';

type Props = {
    playlist: ISpotifyPlaylist;
    track: ISpotifyPlaylistTracksItems;
    handleTogglePlay: (trackNumber: string, trackId: any, contextId: string) => void;
    currentTrack: any;
    isPaused: boolean;
    playerContext: any;
    onAlbumSelect: (albumId: string) => void;
    onArtistSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
    index: number;
};

const PlaylistTrackItem = ({
    playlist,
    track,
    handleTogglePlay,
    currentTrack,
    isPaused,
    playerContext,
    onAlbumSelect,
    onArtistSelect,
    onTrackSelect,
    index }: Props) => {

    return <li key={index} >
        <span className={style.playTrack}>
            {
                <TrackButton
                    trackId={track.track?.id}
                    trackNumber={index + 1}
                    onTogglePlay={handleTogglePlay}
                    contextId={playlist.id}
                    currentPlayerTrack={currentTrack}
                    isPlayerPaused={isPaused}
                    playerContext={playerContext}
                    contextType='playlist'
                />
            }
        </span>
        <img src={getAlbumImage(track.track.album)}></img>
        <div className={style.columnStyle}>
            <p className={style.trackName} onClick={() => onTrackSelect(track.track.id)}>{track.track.name}</p>
            <div className={style.artistSpan}>
                <ListArtists artists={track.track.artists} onArtistSelect={onArtistSelect} />
            </div>
        </div>
        <p className={`${style.columnStyle} ${style.albumName}`} onClick={() => onAlbumSelect(track.track.album.id)}>{track.track.album.name}</p>
        <p>{formatDateToUSLocale(track.added_at)}</p>
        <p>{formatMillisecondsToTime(track.track.duration_ms)}</p>
    </li>;
};

export default PlaylistTrackItem;

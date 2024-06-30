import React from 'react';
import style from '../../../assets/styles/playlistStyle.module.scss';
import { getPlaylistImage, getPlaylistTime, pluralize } from '../../../helpers/spotifyUtils';
import { ISpotifyPlaylist } from '../../../types/types';

type Props = {
    playlist: ISpotifyPlaylist;
};


const PlaylistHeader = ({ playlist }: Props) => {

    return <div className={style.playlistHeaderContentContainer}>
        <div className={style.imageWrapper}>
            <img
                src={getPlaylistImage(playlist)}></img>
        </div>
        <div className={style.infoWrapper}>
            <p className={style.textShadow}>Playlist</p>
            <p id={style["title"]} className={`${style.title} ${style.textShadow}`}><span>{playlist?.name}</span></p>
            <p className={style.textShadow} id={style["description"]}>{playlist.description}</p>
            <div className={style.textShadow} id={style["playlistDetails"]}>
                <a href={playlist.owner.external_urls.spotify} target="_blank">
                    {playlist.owner.display_name}&nbsp; •
                </a>
                <p>
                    {`${playlist.tracks.total} ${pluralize('track', playlist.tracks.total)}`}&nbsp;•
                </p>
                <p>{getPlaylistTime(playlist)}</p></div>
        </div>
    </div>
};

export default PlaylistHeader;
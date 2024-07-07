import React, { useEffect, useState, useRef } from 'react';
import style from '../../assets/styles/addToPlaylistsStyle.module.scss';

type Props = {
    changeToPlaylists: boolean,
    likedSong: boolean,
    updateTrackToPlaylists: () => void,
    handleCloseComponent: (changeToPlaylists: boolean, likedSong: boolean) => void;
};

function AddToPlaylistsButton({ changeToPlaylists, likedSong, updateTrackToPlaylists, handleCloseComponent }: Props) {

    if (changeToPlaylists || !likedSong) {
        return <div className={style.button} onClick={() => updateTrackToPlaylists()}>Done</div>;
    }
    else {
        return <div className={style.buttonCancel} onClick={() => handleCloseComponent(false, likedSong)}>Cancel</div>
    }
}


export default AddToPlaylistsButton;
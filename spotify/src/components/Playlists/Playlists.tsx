import React from 'react';
import { useEffect, useState } from 'react';
import { fetchPlaylists, fetchPlaylist } from '../../api/spotifyApiClient';
import style from '../../assets/styles/playlistsStyle.module.scss';

type Props = {
  onPlaylistSelect: (playlistId: string) => void;
};

const Playlists = ({ onPlaylistSelect }: Props) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  
  useEffect(() => {
    fetchPlaylists().then((res) => {
      setPlaylists(res);
    });
  }, []);

  return (
    <div className={style.playlistsContainer}>
        <ul className={style.ul}>
          {playlists &&
            playlists.map((playlist, index) => (
              <li
                className={style.li}
                key={playlist.id}
                onClick={() => {
                  onPlaylistSelect(playlist.id);
                }}
              >
                <img
                  src={
                    playlist.images && playlist.images.length > 0 
                      ? playlist.images[0]?.url
                      : 'https://i.ibb.co/1JchXTW/kiwi-default.png'
                  }
                  alt="playlist image"
                  width="50"
                  height="50"
                />
                <div>
                  <p className={style.playlistName}>{playlist.name}</p>
                  <p>{playlist.owner.display_name}</p>
                </div>
              </li>
            ))}
        </ul>
    </div>
  );
};

export default Playlists;

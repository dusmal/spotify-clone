import React from 'react';
import style from '../../assets/styles/artistAlbums.module.scss';
import { ISpotifySimilarArtists} from '../../types/types';

type Props = {
    artistAlbums: ISpotifySimilarArtists;
    onAlbumSelect: (albumId: string) => void;
};

const ArtistAlbums = ({artistAlbums, onAlbumSelect}: Props)=>{
    return <div className={style.albumsWrapper}>
        <h4>Albums</h4>
        {artistAlbums.map(album=>{
            return <div onClick={()=>onAlbumSelect(album.id)} className={style.album} key={album.id}>
                <div>
                    <img src={album.images[0].url} />
                    <p>{album.name}</p>
                </div>
            </div>
        })}
    </div>
}

export default ArtistAlbums;
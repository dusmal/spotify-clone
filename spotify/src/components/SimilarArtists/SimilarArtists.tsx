import React from 'react';
import style from '../../assets/styles/similarArtists.module.scss';
import { ISpotifySimilarArtists} from '../../types/types';

type Props = {
    similarArtists: ISpotifySimilarArtists;
    onArtistSelect: (artistId: string) => void;
};

const SimilarArtists = ({similarArtists, onArtistSelect}: Props)=>{
    return <div className={style.similarArtistsWrapper}>
        <h4>Similar artists</h4>
        {similarArtists.map(artist=>{
            return <div onClick={()=>onArtistSelect(artist.id)} className={style.similarArtist} key={artist.id}>
                <img src={artist.images[0]?.url} />
                <p>{artist.name}</p>
            </div>
        })}
    </div>
}

export default SimilarArtists;
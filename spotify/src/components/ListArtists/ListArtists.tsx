import React from 'react';
import style from '../../assets/styles/listArtistsStyle.module.scss';
import { ISpotifyArtist } from '../../types/types';

type Props = {
    artists: ISpotifyArtist[];
    onArtistSelect: (artistId: string) => void;
};

const ListArtists = ({artists, onArtistSelect}: Props) => {
    return <>
        {
            artists.map((artist:ISpotifyArtist, index:number)=>{
                const isLastArtist = index === artists.length-1;
                return(<span key={artist.id}>
                    <span
                    className={style.artistSpan}
                    onClick={()=>onArtistSelect(artist.id)}>
                        {artist.name}
                    </span>
                    {!isLastArtist && <span>, </span>}</span>
                )
            })
        }
    </>;
};

export default ListArtists;

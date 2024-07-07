import React from 'react';
import style from '../../assets/styles/searchStyle.module.scss';
import { Artist, ISpotifyPlaylist, ISpotifyAlbum, ISpotifyTrack } from '../../types/types';
import { getAlbumImage, getArtistImage, getPlaylistImage, getTrackImage } from '../../helpers/spotifyUtils';

type Props = {
    type: string;
    resultArray: Artist[] | ISpotifyAlbum[] | ISpotifyTrack[] | ISpotifyPlaylist[];
    onTypeSelect: (id: string, type:string) => void;
};

const SearchResult = ({ type, resultArray, onTypeSelect }: Props) => {
    const getImageUrl = (result:Artist | ISpotifyAlbum | ISpotifyTrack | ISpotifyPlaylist)  => {
        if(type==='playlist'){
            return getPlaylistImage(result as ISpotifyPlaylist);
        }
        if(type==='artist'){
            return getArtistImage(result as Artist);
        }
        if(type==='track'){
            return getTrackImage(result as ISpotifyTrack);
        }
        if(type==='album'){
            return getAlbumImage(result as ISpotifyAlbum);
        }
        return 'https://i.ibb.co/1JchXTW/kiwi-default.png'
    }
    return <>
        <div className={style.resultTypeStyle}><h4>{type.charAt(0).toUpperCase() + type.slice(1) + 's'}</h4></div>
        {resultArray.map((result: Artist | ISpotifyAlbum | ISpotifyTrack | ISpotifyPlaylist, i: number) => {
            return <div className={style.searchTypeContainer} onClick={() => {
                onTypeSelect(result.id, type)
            }}>
                <img className={style.searchTypeImage} src={getImageUrl(result)}></img>
                <p>{result.name}</p>
            </div>
        })}
    </>

};
export default SearchResult;
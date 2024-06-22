import React from 'react';
import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import style from '../../assets/styles/searchStyle.module.scss';
import {search} from '../../api/spotifyApiClient';
import {Artist, ISpotifyPlaylist, ISpotifyAlbum, ISpotifyTrack} from '../../types/types';

type Props = {
    onArtistSelect: (artistId: string) => void;
    onPlaylistSelect: (playlistId: string) => void;
    onAlbumSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
};

const Search = ({onArtistSelect, onPlaylistSelect, onAlbumSelect, onTrackSelect}: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [artists, setArtists] = useState<Artist[]>([]);
    const [albums, setAlbums] = useState<ISpotifyAlbum[]>([]);
    const [tracks, setTracks] = useState<ISpotifyTrack[]>([]);
    const [playlists, setPlaylists] = useState<ISpotifyPlaylist[]>([]);

    let debounceTimeout: number;
    const debounce = (func: Function, delay: number) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(func, delay);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if(value!==''){
            debounce(()=>setSearchTerm(value),500);
        }
    };

    useEffect(()=>{
        if(searchTerm!==''){
            console.log('search ', searchTerm);
            search(searchTerm).then(response=>{
                console.log('response from search ', response);
                setArtists(response.artists.items);
                setPlaylists(response.playlists.items);
                setAlbums(response.albums.items);
                setTracks(response.tracks.items);
            });
        }
    }, [searchTerm])

    useEffect(()=>{
        console.log('tracks search ',tracks);
    },[tracks])

    return (
      <div className={style.searchContainer}>
        <div>
          <input className={style.searchBar}
           type="text"
           id="searchBar"
           placeholder="What do you want to play?"
           onChange={(e) => {
            handleInputChange(e);
           }} 
           ></input>
          <span className={style.searchIcon}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
        </div>
        <div className={style.resultsContainer}>
        {artists.length>0 && <div className={style.resultTypeStyle}><h4>Artists</h4></div>}
           {
            artists.length>0 && artists.map((artist:Artist, i:number)=>{
                return <div className={style.searchTypeContainer} onClick={() => {
                    onArtistSelect(artist.id)}}>
                    <img className={style.searchTypeImage} src={artist.images &&(
              artist.images.length > 0
                ? artist.images[0].url
                : 'https://i.ibb.co/1JchXTW/kiwi-default.png')}></img>
                    <p>{artist.name}</p>
                </div>
            })
           }
           {albums.length>0 && <div className={style.resultTypeStyle}><h4>Albums</h4></div>}
           {
            albums.length>0 && albums.map((album:ISpotifyAlbum, i:number)=>{
                return <div className={style.searchTypeContainer} onClick={() => {
                    onAlbumSelect(album.id)}}>
                    <img className={style.searchTypeImage} src={album.images &&(
              album.images.length > 0
                ? album.images[0].url
                : 'https://i.ibb.co/1JchXTW/kiwi-default.png')}></img>
                    <p>{album.name}</p>
                </div>
            })
           }
           {tracks.length>0 && <div className={style.resultTypeStyle}><h4>Tracks</h4></div>}
           {
            tracks.length>0 && tracks.map((track:ISpotifyTrack, i:number)=>{
                return <div className={style.searchTypeContainer} onClick={() => {
                    onTrackSelect(track.id)}}>
                    <img className={style.searchTypeImage} src={track.album.images &&(
              track.album.images.length > 0
                ? track.album.images[0].url
                : 'https://i.ibb.co/1JchXTW/kiwi-default.png')}></img>
                    <p>{track.name}</p>
                </div>
            })
           }
          {playlists.length>0 && <div className={style.resultTypeStyle}><h4>Playlists</h4></div>}
           {
            playlists.length>0 && playlists.map((playlist:ISpotifyPlaylist, i:number)=>{
                return <div className={style.searchTypeContainer} onClick={() => {
                    onPlaylistSelect(playlist.id)}}>
                    <img className={style.searchTypeImage} src={playlist.images &&(
              playlist.images.length > 0
                ? playlist.images[0].url
                : 'https://i.ibb.co/1JchXTW/kiwi-default.png')}></img>
                    <p>{playlist.name}</p>
                </div>
            })
           }
        </div>
      </div>
    );
  };
export default Search;
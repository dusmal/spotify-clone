import React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import style from '../../assets/styles/searchStyle.module.scss';
import { search } from '../../api/spotifyApiClient';
import { Artist, ISpotifyPlaylist, ISpotifyAlbum, ISpotifyTrack } from '../../types/types';
import { debounce } from '../../helpers/utils';
import SearchResult from './SearchResult';

type Props = {
    onArtistSelect: (artistId: string) => void;
    onPlaylistSelect: (playlistId: string) => void;
    onAlbumSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
};

const Search = ({ onArtistSelect,
    onPlaylistSelect,
    onAlbumSelect,
    onTrackSelect }: Props) => {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [artists, setArtists] = useState<Artist[]>([]);
    const [albums, setAlbums] = useState<ISpotifyAlbum[]>([]);
    const [tracks, setTracks] = useState<ISpotifyTrack[]>([]);
    const [playlists, setPlaylists] = useState<ISpotifyPlaylist[]>([]);

    useEffect(() => {
        if (searchTerm !== '') {
            console.log('search ', searchTerm);
            search(searchTerm).then(response => {
                console.log('response from search ', response);
                setArtists(response.artists.items);
                setPlaylists(response.playlists.items);
                setAlbums(response.albums.items);
                setTracks(response.tracks.items);
            });
        }
    }, [searchTerm])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value !== '') {
            debounce(() => setSearchTerm(value), 500);
        }
    };

    const onTypeSelect = (id: string, type: string) => {
        if (type === 'artist') {
            onArtistSelect(id);
        }
        if (type === 'playlist') {
            onPlaylistSelect(id);
        }
        if (type === 'album') {
            onAlbumSelect(id);
        }
        if (type === 'track') {
            onTrackSelect(id);
        }
    }

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
                {artists.length > 0 && <SearchResult type='artist' resultArray={artists} onTypeSelect={onTypeSelect}></SearchResult>}
                {albums.length > 0 && <SearchResult type='album' resultArray={albums} onTypeSelect={onTypeSelect}></SearchResult>}
                {tracks.length > 0 && <SearchResult type='track' resultArray={tracks} onTypeSelect={onTypeSelect}></SearchResult>}
                {playlists.length > 0 && <SearchResult type='playlist' resultArray={playlists} onTypeSelect={onTypeSelect}></SearchResult>}
            </div>
        </div>
    );
};
export default Search;
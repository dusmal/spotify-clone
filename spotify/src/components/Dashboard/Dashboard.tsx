import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProfile, fetchPlaylist, fetchArtist, getRecentlyPlayedTracks, getTrack, playTrackWithoutContext, getAlbum } from '../../api/spotifyApiClient';
import Playlists from '../Playlists/Playlists';
import Album from '../Album/Album';
import Track from '../Track/Track';
import Playlist from '../Playlist/Playlist';
import BrowseCategories from '../BrowseCategories/BrowseCategories';
import BrowseSubcategories from '../BrowseSubcategories/BrowseSubcategories';
import Artist from '../Artist/Artist';
import Search from '../Search/Search';
import SidePlayer from '../SidePlayer/SidePlayer';
import BottomPlayer from '../BottomPlayer/BottomPlayer';
import style from '../../assets/styles/dashboardStyle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faHouse } from '@fortawesome/free-solid-svg-icons';
import usePlayer from '../PlayerHook/Player';
import { Routes, Route } from 'react-router-dom';
import { ISpotifyTrack, SpotifyProfile } from '../../types/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [subcategoryId, setSubcategoryId] = useState('');
  const player = usePlayer();

  useEffect(() => {
    const fetchUserData = async () => {
      const profileData = await fetchProfile();
      setProfile(profileData);
    };
    const loggedinUser = localStorage.getItem('access_token');
    if (loggedinUser) {
      fetchUserData();
    } else {
      navigate('/');
    }
  }, []);

  const handlePlaylistSelect = async (playlistId: string) => {
    navigate(`/dashboard/playlist/${playlistId}`);
  };

  const handleArtistSelect = async (artistId: string) => {
    navigate(`/dashboard/artist/${artistId}`);
  };

  const handleAlbumSelect = (albumId: string) => {
    navigate(`/dashboard/album/${albumId}`);
  }
  const handleTrackSelect = (trackId: string) => {
    navigate(`/dashboard/track/${trackId}`);
  }

  const handleSearchButtonClicked = () => {
    navigate(`/dashboard/search`);
  }
  const handleBrowseCategoriesClicked = () => {
    navigate(`/dashboard/browseCategories`);
  }

  const handleCategorySelect = (playlistId: string) => {
    setSubcategoryId(playlistId);
    navigate(`/dashboard/browseSubcategories/${playlistId}`);
  }

  const handleSubcategorySelect = (playlistId: string) => {
    handlePlaylistSelect(playlistId);
  }

  return (
    <div className={style.dashboardContainer}>
      <div className={style.row}>
        <div className={style.sideBarContainer}>
          <div className={style.searchButtonContainer} onClick={handleBrowseCategoriesClicked}>
            <FontAwesomeIcon icon={faHouse} /><span>Home</span>
          </div>
          <div className={style.searchButtonContainer} onClick={handleSearchButtonClicked}>
            <FontAwesomeIcon icon={faMagnifyingGlass} /><span>Search</span>
          </div>
          {profile && (
            <Playlists onPlaylistSelect={handlePlaylistSelect}></Playlists>
          )}
        </div>
        <div className={style.mainContentContainer}>
          <Routes>
            <Route path="playlist/:id" element={<Playlist onArtistSelect={handleArtistSelect}
              onAlbumSelect={handleAlbumSelect}
              onTrackSelect={handleTrackSelect}
              player={player} />} />
            <Route path="artist/:id" element={<Artist
              player={player}
              onArtistSelect={handleArtistSelect}
              onAlbumSelect={handleAlbumSelect}
              onTrackSelect={handleTrackSelect} />} />
            <Route path="album/:id" element={<Album
              player={player}
              onArtistSelect={handleArtistSelect}
              onTrackSelect={handleTrackSelect} />} />
            <Route path="track/:id" element={<Track
              player={player}
              onArtistSelect={handleArtistSelect}
              onAlbumSelect={handleAlbumSelect}
              onTrackSelect={handleTrackSelect} />} />
            <Route path="search" element={<Search onArtistSelect={handleArtistSelect}
              onPlaylistSelect={handlePlaylistSelect}
              onAlbumSelect={handleAlbumSelect}
              onTrackSelect={handleTrackSelect} />} />
            <Route path="browseCategories" element={<BrowseCategories onCategorySelect={handleCategorySelect} />} />
            <Route path="browseSubcategories/:id" element={<BrowseSubcategories onSubcategorySelect={handleSubcategorySelect} subcategoryId={subcategoryId} />} />
          </Routes>
        </div>
        <div className={style.sidePlayerContainer}>
          <SidePlayer player={player}
            onArtistSelect={handleArtistSelect}
            onPlaylistSelect={handlePlaylistSelect}
            onTrackSelect={handleTrackSelect}
          ></SidePlayer>
        </div>
      </div>
      <div className={style.bottomPlayerContainer}>
        <BottomPlayer player={player}
        ></BottomPlayer>
      </div>
    </div>
  );
};
export default Dashboard;

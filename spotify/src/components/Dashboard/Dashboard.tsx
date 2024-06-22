import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProfile, fetchPlaylist, fetchArtist, getRecentlyPlayedTracks, getTrack, playTrackWithoutContext, getAlbum} from '../../api/spotifyApiClient';
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
import { faMagnifyingGlass, faHouse} from '@fortawesome/free-solid-svg-icons';
import usePlayer from '../PlayerHook/Player';
import { ISpotifyTrack, SpotifyProfile } from '../../types/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [playlist, setPlaylist] = useState(null);
  const [artist, setArtist] = useState(null);
  const [album, setAlbum] = useState(null);
  const [track, setTrack] = useState<ISpotifyTrack|null>(null); 
  const [displayComponent, setDisplayComponent] = useState(''); 
  const [subcategoryId, setSubcategoryId] = useState('');

  const {playerInstance, deviceId, is_paused, is_active,current_track, playerContext, playerState} = usePlayer();

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
    setDisplayComponent('browseCategories');
  }, []);

  useEffect(()=>{
    if(deviceId && playerInstance && current_track.name===''){
      getInitialTrack().then(()=>{
        playerInstance.pause();
      });
    }
  }, [deviceId]);

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    const id = location.pathname.split('/')[3];
    if(path==='playlist'){
      fetchPlaylist(id).then(res=>{setPlaylist(res);
        setDisplayComponent('playlist');
      });
    }
    if(path==='track'){
      getTrack(id).then((res)=>{setTrack(res);
        setDisplayComponent('track');
      })
    }
    if(path==='artist'){
      fetchArtist(id).then(res=>{setArtist(res);
        setDisplayComponent('artist');
      })
    }
    if(path==='album'){
      getAlbum(id).then(res=>{setAlbum(res);
        setDisplayComponent('album');
      });
    }
    if(path==='search'){
      setDisplayComponent('search');
    }
    if(path==='browseCategories'){
      setDisplayComponent('browseCategories');
    }
    if(path==='browseSubcategories'){
      setDisplayComponent('browseSubcategories');
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem('lastUrl', location.pathname);
  }, [location]);

  const handlePlaylistSelect = async (playlistId: string) => {
    navigate(`/dashboard/playlist/${playlistId}`);
  };

  const handleArtistSelect = async (artistId: string) => {
    navigate(`/dashboard/artist/${artistId}`);
  };

  const handleAlbumSelect = (albumId: string) =>{
      navigate(`/dashboard/album/${albumId}`);
  }
  const handleTrackSelect = (trackId: string) =>{
    navigate(`/dashboard/track/${trackId}`);
  }

  const handleSearchButtonClicked = ()=> {
    navigate(`/dashboard/search`);
  }
  const handleBrowseCategoriesClicked = () =>{
    navigate(`/dashboard/browseCategories`);
  }

  const handleCategorySelect = (playlistId: string) => {
      setSubcategoryId(playlistId);
      navigate(`/dashboard/browseSubcategories/${playlistId}`);
  }

  const handleSubcategorySelect = (playlistId: string) =>{
      handlePlaylistSelect(playlistId);
  }


  const getInitialTrack = async () =>{
    const initialTrack = await getRecentlyPlayedTracks();
    if(current_track.id===''){
        console.log('without context!');
        playTrackWithoutContext(initialTrack.data.items[0].track.id, deviceId);
    }    
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
            {
              displayComponent==='playlist' &&
              playlist && <Playlist
                onArtistSelect={handleArtistSelect}
                onAlbumSelect={handleAlbumSelect}
                onTrackSelect={handleTrackSelect}
                playlist={playlist}
                player={playerInstance}
                currentPlayerTrack={current_track}
                isPlayerPaused={is_paused}
                deviceId={deviceId}
                playerContext={playerContext.uri}></Playlist>}
            {
              displayComponent==='artist' &&
              artist &&
                <Artist artist={artist} 
                  player={playerInstance}
                  currentPlayerTrack={current_track}
                  isPlayerPaused={is_paused}
                  deviceId={deviceId}
                  playerContext={playerContext.uri}
                  onArtistSelect={handleArtistSelect}
                  onAlbumSelect={handleAlbumSelect}
                  onTrackSelect={handleTrackSelect}
                ></Artist>
            }
            {
              displayComponent==='album' &&
              album &&
                <Album
                  album={album}
                  player={playerInstance}
                  currentPlayerTrack={current_track}
                  isPlayerPaused={is_paused}
                  deviceId={deviceId}
                  playerContext={playerContext.uri}
                  onArtistSelect={handleArtistSelect}
                  onTrackSelect={handleTrackSelect}
                ></Album>
            }
            {
              displayComponent==='track' &&
              track &&
                <Track
                  track={track}
                  player={playerInstance}
                  currentPlayerTrack={current_track}
                  isPlayerPaused={is_paused}
                  deviceId={deviceId}
                  playerContext={playerContext.uri}
                  onArtistSelect={handleArtistSelect}
                  onAlbumSelect={handleAlbumSelect}
                  onTrackSelect={handleTrackSelect}
                ></Track>
            }
            {
              displayComponent==='search' &&
                <Search onArtistSelect={handleArtistSelect} 
                onPlaylistSelect={handlePlaylistSelect}
                onAlbumSelect={handleAlbumSelect}
                onTrackSelect={handleTrackSelect}
                ></Search>
            }
            {
              displayComponent==='browseCategories' &&
                <BrowseCategories onCategorySelect={handleCategorySelect}></BrowseCategories>
            }
            {
              displayComponent==='browseSubcategories' &&
                <BrowseSubcategories onSubcategorySelect={handleSubcategorySelect} subcategoryId={subcategoryId}></BrowseSubcategories>
            }
        </div>
        <div className={style.sidePlayerContainer}>
          <SidePlayer player={playerInstance}
            is_active={is_active}
            current_track={current_track}
            is_paused={is_paused}
            contextDescription={playerContext.metadata.context_description}
            contextUri={playerContext.uri}
            onArtistSelect={handleArtistSelect}
            onPlaylistSelect={handlePlaylistSelect}
            onTrackSelect={handleTrackSelect}
          ></SidePlayer>
          {/* } */}
        </div>
      </div>
      <div className={style.bottomPlayerContainer}>
        <BottomPlayer player={playerInstance}
          is_active={is_active}
          current_track={current_track}
          is_paused={is_paused}
          playerState={playerState}
          deviceId={deviceId}
         ></BottomPlayer>
      </div>
    </div>
  );
};
export default Dashboard;

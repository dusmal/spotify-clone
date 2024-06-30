import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/artistStyle.module.scss';
import {getImageColors, invertHexColor} from '../../helpers/colorsUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import ArtistTopTracks from '../ArtistTopTracks/ArtistTopTracks';
import { playTracks, getArtistAlbums, fetchArtistsTopTracks, getArtistRelatedArtists, fetchArtist } from '../../api/spotifyApiClient';
import { ISpotifyTopTracks, ISpotifySimilarArtists, ISpotifyArtist} from '../../types/types';
import { hexToRgba } from '../../helpers/colorsUtils';
import SimilarArtists from '../SimilarArtists/SimilarArtists';
import ArtistAlbums from '../ArtistAlbums/ArtistAlbums';
import { useParams } from 'react-router-dom';

type Props = {
    onArtistSelect: (artistId: string) => void;
    onAlbumSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
  };

const Artist = ({onTrackSelect, player, onArtistSelect, onAlbumSelect}:Props) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [artist, setArtist] = useState<ISpotifyArtist>();
  const [topTracks, setTopTracks] = useState<ISpotifyTopTracks[]>([]);
  const [tracksUris, setTracksUris] = useState<string[]>([]);
  const [playToggle, setPlayToggle] = useState<boolean|null>(true);
  const [similarArtists, setSimilarArtists] = useState<ISpotifySimilarArtists>([]);
  const [albums, setAlbums] = useState<ISpotifyArtist[]>([]);
  const {playerInstance, deviceId, isPaused, isActive, currentTrack, playerContext, playerState} = player;
  let { id } = useParams();

  useEffect(() => {
    if(!id){
      return;
    }

    const getArtist = async (artistId: string) => {
      try {
        const res = await fetchArtist(artistId);
        setArtist(res);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    }
    
    getArtist(id);
  }, [id]);

  useEffect(()=>{
    if(!artist){
      return;
    }
    getImageColors(artist.images &&(
      artist.images.length > 0
        ? artist.images[0].url
        : 'https://i.ibb.co/1JchXTW/kiwi-default.png')).then(col=>{
          setBackgroundColor(col as string);
          return col;
    });
    fetchTopTracks();
    fetchSimilarArtists();
    fetchArtistAlbums();
  },[artist]);

  useEffect(()=>{
    if(topTracks){
      const uris = topTracks.map(el=>el.uri);
      setTracksUris(uris);
    }
  },[topTracks])
  
  useEffect(()=>{
    if(playerContext==='' || playerContext==='-'){
      if(tracksUris.length>0){
        if(!tracksUris.includes(currentTrack.uri)){
          console.log('!tracksUris.includes(currentTrack.uri) setPlayToggle(true)');
          setPlayToggle(true);
        }
        else{
            if(isPaused){
              console.log('isPaused, ', isPaused);
              setPlayToggle(true)
            }
            else{
              console.log('isPaused, ', isPaused);
              setPlayToggle(false);
            }
        }
      }
    }
  },[tracksUris])

  useEffect(()=>{
    if(playerContext.uri==='' || playerContext.uri==='-'){
      if(tracksUris.includes(currentTrack?.uri)){
        if(!isPaused){
          setPlayToggle(false);
        }
        else{
          setPlayToggle(true);
        }
      }
      else{
        setPlayToggle(true);
      }
   }
  },[isPaused])


  function handlePlayButton(){
    if(playerContext.uri===''|| playerContext.uri==='-'){
      if(!playToggle){
        if(tracksUris.includes(currentTrack.uri)){
          playerInstance.togglePlay();
        }
        else{
          playTracks(tracksUris,0, deviceId);
        }
      }
      else{
        if(!tracksUris.includes(currentTrack.uri)){
          playTracks(tracksUris,0, deviceId);
        }
        else{
          playerInstance.togglePlay();
        }
      }
    }
    else{
      playTracks(tracksUris,0, deviceId);
    }
    setPlayToggle(prev=>!prev);
  }
  

  const fetchTopTracks = async () => {
    if(!artist){
      return;
    }
    const nextTracks = await fetchArtistsTopTracks(artist.id);
    setTopTracks(nextTracks.tracks);
  };

  const fetchSimilarArtists = async () => {
    if(!artist){
      return;
    }
    const similarArtists = await getArtistRelatedArtists(artist.id);
    setSimilarArtists(similarArtists);
  };

  const fetchArtistAlbums = async () => {
    if(!artist){
      return;
    }
    const albums = await getArtistAlbums(artist.id);
    setAlbums(albums);
  };

    return (
      <>
        {artist && <> <div className={style.artistHeaderContainer} style={ {backgroundImage:`url(${artist.images &&(artist.images.length > 0
          ? artist.images[0].url : 'https://i.ibb.co/1JchXTW/kiwi-default.png')})`, backgroundSize:`100%`, backgroundPosition: `center`
          } }>
          <div className={style.headerContainer} >
            <img
              src={
                artist.images &&(
                artist.images.length > 0
                  ? artist.images[0].url
                  : 'https://i.ibb.co/1JchXTW/kiwi-default.png')
              }
            />
            <p className={style.artistName}>{artist.name}</p>
            <div className={style.gradientWrapper} style={{background:`linear-gradient(${hexToRgba(backgroundColor, 0.4)} 0% ,rgba(22, 22, 22, 1) 100%`}}>
            <div onClick={handlePlayButton} className={style.playContainer} style={ {color: `${invertHexColor(backgroundColor)}`} } >
              {playToggle ?
               <FontAwesomeIcon className={style.playIcon}
               icon={faCirclePlay}
                style={{color: `${invertHexColor(backgroundColor)}`}} />:
               <FontAwesomeIcon className={style.playIcon}
                icon={faCircleStop}
                 style={{color: `${invertHexColor(backgroundColor)}`}} 
                />
              }
            </div>
          </div>
          </div>
        </div>
        <div className={style.artistMainContainer}>
          <div className={style.popularTracksContainer}>
            <ArtistTopTracks id={artist.id}
              topTracks={topTracks}
              tracksUris={tracksUris}
              player={player}
              setPlayToggle={setPlayToggle}
              onTrackSelect={onTrackSelect}
              ></ArtistTopTracks>
          </div>
          <div>
            <ArtistAlbums artistAlbums={albums} onAlbumSelect={onAlbumSelect}></ArtistAlbums>
          </div>
          <div>
            <SimilarArtists similarArtists={similarArtists}
            onArtistSelect={onArtistSelect}
            />
          </div>
        </div>
      </>}</>
    );
};

export default Artist;
import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/artistStyle.module.scss';
import {getImageColors, invertHexColor} from '../../helpers/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import ArtistTopTracks from '../ArtistTopTracks/ArtistTopTracks';
import { playTracks, getArtistAlbums, fetchArtistsTopTracks, getArtistRelatedArtists } from '../../api/spotifyApiClient';
import { CurrentPlayerTrack, ISpotifyTopTracks, ISpotifySimilarArtists, ISpotifyArtist} from '../../types/types';
import { hexToRgba } from '../../helpers/colors';
import SimilarArtists from '../SimilarArtists/SimilarArtists';
import ArtistAlbums from '../ArtistAlbums/ArtistAlbums';

type Props = {
    artist: ISpotifyArtist;
    onArtistSelect: (artistId: string) => void;
    onAlbumSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
    currentPlayerTrack: CurrentPlayerTrack;
    isPlayerPaused: boolean;
    deviceId: string;
    playerContext: string;
  };

const Artist = ({artist, onTrackSelect, player, currentPlayerTrack, isPlayerPaused, deviceId, playerContext, onArtistSelect, onAlbumSelect}:Props) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [topTracks, setTopTracks] = useState<ISpotifyTopTracks[]>([]);
  const [tracksUris, setTracksUris] = useState<string[]>([]);
  const [playToggle, setPlayToggle] = useState<boolean|null>(true);
  const [similarArtists, setSimilarArtists] = useState<ISpotifySimilarArtists>([]);
  const [albums, setAlbums] = useState<ISpotifyArtist[]>([]);

  useEffect(()=>{
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
        if(!tracksUris.includes(currentPlayerTrack.uri)){
          console.log('!tracksUris.includes(currentPlayerTrack.uri) setPlayToggle(true)');
          setPlayToggle(true);
        }
        else{
            if(isPlayerPaused){
              console.log('isPlayerPaused, ', isPlayerPaused);
              setPlayToggle(true)
            }
            else{
              console.log('isPlayerPaused, ', isPlayerPaused);
              setPlayToggle(false);
            }
        }
      }
    }
  },[tracksUris])

  useEffect(()=>{
    if(playerContext==='' || playerContext==='-'){
      if(tracksUris.includes(currentPlayerTrack?.uri)){
        if(!isPlayerPaused){
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
  },[isPlayerPaused])


  function handlePlayButton(){
    if(playerContext===''|| playerContext==='-'){
      if(!playToggle){
        if(tracksUris.includes(currentPlayerTrack.uri)){
          player.togglePlay();
        }
        else{
          playTracks(tracksUris,0, deviceId);
        }
      }
      else{
        if(!tracksUris.includes(currentPlayerTrack.uri)){
          playTracks(tracksUris,0, deviceId);
        }
        else{
          player.togglePlay();
        }
      }
    }
    else{
      playTracks(tracksUris,0, deviceId);
    }
    setPlayToggle(prev=>!prev);
  }
  

  const fetchTopTracks = async () => {
      const nextTracks = await fetchArtistsTopTracks(artist.id);
      setTopTracks(nextTracks.tracks);
  };

  const fetchSimilarArtists = async () => {
      const similarArtists = await getArtistRelatedArtists(artist.id);
      setSimilarArtists(similarArtists);
  };

  const fetchArtistAlbums = async () => {
      const albums = await getArtistAlbums(artist.id);
      setAlbums(albums);
  };

    return (
      artist && <>
        <div className={style.artistHeaderContainer} style={ {backgroundImage:`url(${artist.images &&(artist.images.length > 0
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
              isPlayerPaused={isPlayerPaused}
              currentPlayerTrack={currentPlayerTrack?.id}
              deviceId ={deviceId}
              playerContext={playerContext}
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
      </>
    );
};

export default Artist;
import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/albumStyle.module.scss';
import {getImageColors, invertHexColor} from '../../helpers/colorsUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop, faClock } from '@fortawesome/free-solid-svg-icons';
import { getAlbum, playTrack } from '../../api/spotifyApiClient';
import { ISpotifyAlbum} from '../../types/types';
import TrackButton from '../TrackButton/TrackButton';
import {formatMillisecondsToTime} from '../../helpers/utils';
import { useParams } from 'react-router-dom';
import { getAlbumImage } from '../../helpers/spotifyUtils';

type Props = {
    onArtistSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
  };

const Album = ({onArtistSelect, onTrackSelect,  player}:Props) => {
    const [albumColor, setAlbumColor] = useState<string>('');
    const [playToggle, setPlayToggle] = useState<boolean|null>(null);
    const {playerInstance, deviceId, isPaused, isActive, currentTrack, playerContext, playerState} = player;
    const [album, setAlbum] = useState<ISpotifyAlbum>();
    let { id } = useParams();
    useEffect(()=>{
        if(!id){
            return;
        }
        const fetchAlbum = async (albumId: string) => {
            try {
              const res = await getAlbum(albumId);
              setAlbum(res);
            } catch (error) {
              console.error('Error fetching artist:', error);
            }
          }
          
          fetchAlbum(id);  
    },[id]);

    useEffect(()=>{
        if(!album){
            return;
        }
        if(currentTrack.album.uri===album.uri && playerContext.uri!==''  && playerContext.uri!=='-'){
            isPaused ? setPlayToggle(true) : setPlayToggle(false);}
        else{
            setPlayToggle(true);
        }
        getImageColors(album.images[0].url).then(col=>{
            setAlbumColor(col as string);
            return col;
        })
    }, [album]);

    useEffect(()=>{
        if(album){
            if(currentTrack?.album?.uri===album?.uri){
                isPaused ? setPlayToggle(true) : setPlayToggle(false);}
        }
    }, [isPaused]);

    function handlePlayButton(){
        if(!album){
            return;
        }
        if(currentTrack.album.uri===album.uri  && playerContext.uri!==''  && playerContext.uri!=='-'){
            playerInstance.togglePlay();
        }else{
            playTrack(album.uri, 0, deviceId);
        }
        setPlayToggle(prev=>!prev);
    }

    function handlePlayTrack(offset:number, trackId: string){
        if(!album){
            return;
        }
        if(trackId===currentTrack.id && playerContext.uri!==''  && playerContext.uri!=='-'){
            playerInstance.togglePlay();
        }
        else{
            playTrack(album.uri, offset, deviceId);
            setPlayToggle(false);
        }
    }

    return (
    <>{ album &&
      <div className={style.albumComponentContainer} style={{background:`linear-gradient(${albumColor} 0vh,#121212 90vh`}}>
        <div className={style.albumHeaderContainer}>
            <div className={style.imageWrapper}>
                <img
                src={getAlbumImage(album)}
                ></img>
            </div>
            <div className={style.infoWrapper}>
              <p className={style.textShadow}>Album</p>
              <p id={style["title"]} className={`${style.title} ${style.textShadow}`}><span>{album?.name}</span></p>
              <div className={style.textShadow} id={style["playlistDetails"]}>
                <div>
                    {album.artists.map((el,i)=> {
                        if(i!==album.artists.length-1){
                            return <span key={i} onClick={()=>onArtistSelect(el.id)}><span className={style.artistSpan} >{el.name}</span>, </span> 
                        }
                        else{
                        return <span key={i} onClick={()=>onArtistSelect(el.id)}><span className={style.artistSpan} >{el.name}</span></span> 
                        }
                    })
                    }
                    <span> • </span>
                    <span>{album.release_date+' • '}</span>
                    {album.total_tracks>1 ?
                     <span>{album.total_tracks+' songs'}</span>
                     : <span>{album.total_tracks+' song'}</span>}
                </div>
            </div>
          </div>
        </div>
      <div className={style.playContainer} style={ {color: `${invertHexColor(albumColor)}`} } >
              {playToggle ?
               <FontAwesomeIcon onClick={handlePlayButton} className={style.playIcon}
               icon={faCirclePlay}
                style={{color: `${invertHexColor(albumColor)}`}} />:
               <FontAwesomeIcon onClick={handlePlayButton}  className={style.playIcon}
                icon={faCircleStop}
                 style={{color: `${invertHexColor(albumColor)}`}} 
                />
              }
      </div>
      <div className={style.albumTracksContainer}>
        <div className={style.firstRow}>
              <p>#</p>
              <p className={style.headerColumnStyle}>&nbsp;Title</p>
              <p><FontAwesomeIcon icon={faClock} /></p>
        </div>
        <ul>
        {
            album.tracks.items.map((el,i)=>{
                return <li key={i}>
                    <span className={style.button}>
                     <TrackButton
                              trackId={el.id}
                              trackNumber={i+1}
                              onTogglePlay={()=>handlePlayTrack(i, el.id)}
                              contextId={album.id}
                              currentPlayerTrack={currentTrack}
                              isPlayerPaused = {isPaused}
                              playerContext = {playerContext}
                              contextType='album'
                            />
                    </span>
                    <span className={style.trackName} onClick={()=>{onTrackSelect(el.id)}}>{el.name}</span>
                    <span>{formatMillisecondsToTime(el.duration_ms)}</span>
                </li>
            })
        }
        </ul>
      </div>
    </div>
    }</>
    );
};

export default Album;
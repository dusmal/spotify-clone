import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/albumStyle.module.scss';
import {getImageColors, invertHexColor} from '../../helpers/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop, faClock } from '@fortawesome/free-solid-svg-icons';
import { playTrack } from '../../api/spotifyApiClient';
import { CurrentPlayerTrack, ISpotifyAlbum} from '../../types/types';
import TrackButton from '../TrackButton/TrackButton';
import {convertMs} from '../../helpers/sharedFunctions';

type Props = {
    album: ISpotifyAlbum;
    onArtistSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
    currentPlayerTrack: CurrentPlayerTrack;
    isPlayerPaused: boolean;
    deviceId: string;
    playerContext: string;
  };

const Album = ({album, onArtistSelect, onTrackSelect,  player, currentPlayerTrack, isPlayerPaused, deviceId, playerContext}:Props) => {
    const [albumColor, setAlbumColor] = useState<string>('');
    const [playToggle, setPlayToggle] = useState<boolean|null>(null);

    useEffect(()=>{
        if(currentPlayerTrack.album.uri===album.uri && playerContext!==''  && playerContext!=='-'){
            isPlayerPaused ? setPlayToggle(true) : setPlayToggle(false);}
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
            if(currentPlayerTrack.album?.uri===album?.uri){
                isPlayerPaused ? setPlayToggle(true) : setPlayToggle(false);}
        }
    }, [isPlayerPaused]);

    function handlePlayButton(){
        if(currentPlayerTrack.album.uri===album.uri  && playerContext!==''  && playerContext!=='-'){
            player.togglePlay();
        }else{
            playTrack(album.uri, 0, deviceId);
        }
        setPlayToggle(prev=>!prev);
    }

    function handlePlayTrack(offset:number, trackId: string){
        if(trackId===currentPlayerTrack.id && playerContext!==''  && playerContext!=='-'){
            player.togglePlay();
        }
        else{
            playTrack(album.uri, offset, deviceId);
            setPlayToggle(false);
        }
    }

    return (
      <div className={style.albumComponentContainer} style={{background:`linear-gradient(${albumColor} 0vh,#121212 90vh`}}>
        <div className={style.albumHeaderContainer}>
            <div className={style.imageWrapper}>
                <img
                src={
                    album.images &&(
                        album.images.length > 0
                    ? album.images[0].url
                    : 'https://i.ibb.co/1JchXTW/kiwi-default.png')
                }
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
                              currentPlayerTrack={currentPlayerTrack?.id}
                              isPlayerPaused = {isPlayerPaused}
                              playerContext = {playerContext}
                              contextType='album'
                            />
                    </span>
                    <span className={style.trackName} onClick={()=>{onTrackSelect(el.id)}}>{el.name}</span>
                    <span>{convertMs(el.duration_ms)}</span>
                </li>
            })
        }
        </ul>
      </div>
    </div>
    );
};

export default Album;
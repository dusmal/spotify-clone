import React from 'react';
import {useEffect, useState} from 'react';
import style from '../../assets/styles/trackStyle.module.scss';
import {getImageColors, invertHexColor} from '../../helpers/colors';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCirclePlay, faCircleStop} from '@fortawesome/free-solid-svg-icons';
import {getTrackRecommendation,playTrackWithoutContext} from '../../api/spotifyApiClient';
import {CurrentPlayerTrack,ISpotifyTrack} from '../../types/types';
import {convertMs} from '../../helpers/sharedFunctions';

type Props = {
    track: ISpotifyTrack;
    onArtistSelect: (artistId: string) => void;
    onAlbumSelect: (albumId: string) => void;
    onTrackSelect: (albumId: string) => void;
    player: any;
    currentPlayerTrack: CurrentPlayerTrack;
    isPlayerPaused: boolean;
    deviceId: string;
    playerContext: string;
  };

const Track = ({track, onArtistSelect, onAlbumSelect, onTrackSelect,  player, currentPlayerTrack, isPlayerPaused, deviceId, playerContext}:Props) => {
    const [trackColor, setTrackColor] = useState<string>('');
    const [playToggle, setPlayToggle] = useState<boolean|null>(true);
    const [recommenededTracks, setRecommendedTracks] = useState<ISpotifyTrack[]>([])

    useEffect(()=>{
        const artistIds=track.artists.map(el=>el.id).join(',');
        getTrackRecommendation(track.id,artistIds).then(res=>setRecommendedTracks(res));
        getImageColors(track.album.images[0].url).then(col=>{
            setTrackColor(col as string);
            return col;
        })
        if(track.uri===currentPlayerTrack.uri){
            isPlayerPaused? setPlayToggle(true) : setPlayToggle(false); 
        }
        else{
            setPlayToggle(true);
        }
        console.log(playerContext);
    }, [track]);

    useEffect(()=>{
        if(track.uri===currentPlayerTrack.uri){
            isPlayerPaused? setPlayToggle(true) : setPlayToggle(false); 
        }
        else{
            setPlayToggle(true);
        }
    }, [isPlayerPaused]);

    useEffect(()=>{
        if(track){
            if(track.uri===currentPlayerTrack.uri){
                isPlayerPaused? setPlayToggle(true) : setPlayToggle(false); 
            }
            else{
                setPlayToggle(true);
            }
        }
    },[currentPlayerTrack])

    function handlePlay(){
        if(currentPlayerTrack.uri===track.uri){
            player.togglePlay();
        }else{
            playTrackWithoutContext(track.id, deviceId);
        }
        setPlayToggle(prev=>!prev);

    }

    return (
      track &&<div className={style.trackComponentContainer} style={{background:`linear-gradient(${trackColor} 0vh,#121212 90vh`}}>
      <div className={style.trackHeaderContainer}>
          <div className={style.imageWrapper}>
              <img
              src={
                  track.album.images &&(
                    track.album.images.length > 0
                  ? track.album.images[0].url
                  : 'https://i.ibb.co/1JchXTW/kiwi-default.png')
              }
              ></img>
          </div>
          <div className={style.infoWrapper}>
            <p className={style.textShadow}>Song</p>
            <p id={style["title"]} className={`${style.title} ${style.textShadow}`}><span>{track?.name}</span></p>
            <div className={style.textShadow} id={style["playlistDetails"]}>
              <div>
                 {track.artists.map((el,i)=> {
                        if(i<track.artists.length-1 && track.artists.length!==1){
                            return <span key={i} onClick={()=>onArtistSelect(el.id)}><span className={style.artistSpan} >{el.name}</span>, </span> 
                        }
                        else{
                        return <span key={i} onClick={()=>onArtistSelect(el.id)}><span className={style.artistSpan} >{el.name}</span></span> 
                        }
                    })
                }
                  <span> • </span>
                  <span>{track.album.release_date}</span>
                  <span> • </span>
                  <span>{convertMs(track.duration_ms)}</span>
                  <span> • </span>
                  <span className={style.albumName} onClick={()=>onAlbumSelect(track.album.id)}>{track.album.name}</span>
              </div>
          </div>
        </div>
      </div>
      <div className={style.playContainer} style={ {color: `${invertHexColor(trackColor)}`} } >
              {playToggle ?
               <FontAwesomeIcon onClick={handlePlay} className={style.playIcon}
               icon={faCirclePlay}
                style={{color: `${invertHexColor(trackColor)}`}} />:
               <FontAwesomeIcon onClick={handlePlay}  className={style.playIcon}
                icon={faCircleStop}
                 style={{color: `${invertHexColor(trackColor)}`}} 
                />
              }
      </div>
      <div className={style.recommendationsContainer}>
              <div className={style.header}>
                <h3>Recommended</h3>
                <p>Based on this song</p>
              </div>
              <div className={style.recommendedTracksContainer}>
                {
                    recommenededTracks.map(track=>{
                        return <div key={track.id}>
                            <img onClick={()=>{onTrackSelect(track.id)}} src={track.album.images &&(
                                track.album.images.length > 0
                            ? track.album.images[0].url
                            : 'https://i.ibb.co/1JchXTW/kiwi-default.png')} />
                            <p onClick={()=>{onTrackSelect(track.id)}} className={style.trackName}>{track.name}</p>
                            <p className={style.artistName}>{track.album.artists.map((el,i)=> {
                                    if(i<track.artists.length-1 && track.artists.length!==1){
                                        return <span key={i} onClick={()=>onArtistSelect(el.id)}><span className={style.artistSpan} >{el.name}</span>, </span> 
                                    }
                                    else{
                                      return <span key={i} onClick={()=>onArtistSelect(el.id)}><span className={style.artistSpan} >{el.name}</span></span> 
                                    }
                                })
                            }</p>
                        </div>
                    })
                }
              </div>
      </div>
      </div>
    );
};

export default Track;
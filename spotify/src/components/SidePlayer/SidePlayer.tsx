import React from 'react';
import style from '../../assets/styles/sidePlayerStyle.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faStop} from '@fortawesome/free-solid-svg-icons';
import {faForward} from '@fortawesome/free-solid-svg-icons';
import {faBackward} from '@fortawesome/free-solid-svg-icons';

type Props = {
    player: any,
    is_active: any,
    current_track: any,
    is_paused: any,
    contextDescription: any,
    contextUri: string,
    onArtistSelect: (artistId: string) => void;
    onPlaylistSelect: (playlistId: string) => void;
    onTrackSelect: (albumId: string) => void; 
};

function SidePlayer({player, is_active, current_track, is_paused,contextDescription,contextUri, onArtistSelect, onPlaylistSelect, onTrackSelect} : Props) {

    function handleContextTypeClick(context:any){
        const match = context.match(/spotify:(artist|track|playlist|album):([^:]+)/);
        if(match[1]==='playlist'){
            if (match) {
            onPlaylistSelect(match[2]);
            } else {
            console.error("No match found for the given URI");
            }
        }
        if(match[1]==='album'){
            console.log('handle album component display later')
        }
        if(match[1]==='artist'){
            console.log('handle artist component display later')
        }
        if(match[1]==='track'){
            onTrackSelect(current_track.id)
        }
    }
    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            (player && current_track?.id) && <>
                <div className={style.sidePlayerContainer}>
                    <div>
                        <div className={style.contextDescription} onClick={()=>handleContextTypeClick(contextUri)}><h4>{contextDescription}</h4></div>
                        <img className={style.playerImage} src={current_track.album.images[0].url}/>
                        <div >

                            <div className={style.trackName} onClick={()=>handleContextTypeClick(current_track.uri)}><h3>{current_track.name}</h3></div>
                            <div className={style.artists}>{
                                current_track.artists.map((el:any, index:number)=>{
                                    if(index!==current_track.artists.length-1){
                                        return <span key={el.uri+index}  onClick={() =>{onArtistSelect(el.uri.match(/spotify:(artist|playlist|album):([^:]+)/)[2])}}><span className={style.artistName}>{el.name}</span><span>, </span></span>
                                    }
                                    else{
                                        return <span key={el.uri+index} onClick={() =>{onArtistSelect(el.uri.match(/spotify:(artist|playlist|album):([^:]+)/)[2])}} className={style.artistName}>{el.name}</span>
                                    }
                                })
                            }</div>
                            <div className={style.buttonsContainer}>
                                <div className={style.button} onClick={() => { player.previousTrack() }} >
                                    <FontAwesomeIcon icon={faBackward}/>
                                </div>

                                <div className={style.button} onClick={() => { player.togglePlay() }} >
                                    { is_paused ? <FontAwesomeIcon icon={faPlay}/> : <FontAwesomeIcon icon={faStop}/> }
                                </div>

                                <div className={style.button} onClick={() => { player.nextTrack() }} >
                                    <FontAwesomeIcon icon={faForward}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
 }
 
 export default SidePlayer;
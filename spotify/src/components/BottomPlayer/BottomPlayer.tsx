import React, { useEffect, useState} from 'react';
import style from '../../assets/styles/bottomPlayerStyle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay,faStop,faForward,faBackward,faCirclePlus,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {getImageColors} from '../../helpers/colorsUtils';
import { checkSavedTracks, saveTrack, fetchPlaylists,fetchAllTracksFromPlaylist } from '../../api/spotifyApiClient';
import AddToPlaylists from '../AddToPlaylists/AddToPlaylists';
import { ISpotifyPlaylistTracksItems,ISpotifyPlaylist } from '../../types/types';
import TrackProgressBar from '../TrackProgressBar/TrackProgressBar';
import Volume from '../Volume/Volume';

type Props = {
    player: any,
};
  
function BottomPlayer({player} : Props) {
 
    const [likedSong, setLikedSong] = useState<boolean>();
    const [likeIconHovered, setLikeIconHovered] = useState<boolean>(false);
    const [showAddToPlaylistsComponent, setShowAddToPlaylistsComponent] = useState<boolean>(false);
    const [addToPlaylistToggle, setAddToPlaylistToggle] = useState<boolean>(true);
    const [tracksPerPlaylists, setTracksPerPlaylist] = useState<{[key:string]:any[]}>({});
    const [accentColor, setAccentColor] = useState<string>('white')
    const {playerInstance, deviceId, isPaused, isActive, currentTrack, playerContext, playerState} = player;

    useEffect(() => {
        fetchTracksForPlaylists();
    }, []);

    function checkIfTrackLiked(trackId:string){
        checkSavedTracks(trackId).then((res)=>{
            setLikedSong(res[0]);
        })
    }

    useEffect(() => {
        if(currentTrack?.id){
            getImageColors(currentTrack.album.images[0].url).then((color:any)=>{
                setAccentColor(color)
            })
            checkIfTrackLiked(currentTrack.id);
            setShowAddToPlaylistsComponent(false);
            setLikeIconHovered(false)
        }
    }, [currentTrack?.id]);
    
    function handleOnMouseLikeIconHoveredLeave(){
        if(showAddToPlaylistsComponent){
            setLikeIconHovered(true);
        }
        else{
            setLikeIconHovered(false);
        }
    }

    function handleSongLike(){
        saveTrack(currentTrack.id).then((res)=>{
            checkIfTrackLiked(currentTrack.id);
        });
    }

    function handleAddToPlaylistClick(){
        setAddToPlaylistToggle(prev=>!prev);
        if(addToPlaylistToggle){
            setShowAddToPlaylistsComponent(true);
        }
        else{
            setShowAddToPlaylistsComponent(false);
        }
    }

    function handleCloseComponent(changed:boolean, likedSong:boolean){
        setLikeIconHovered(false);
        setShowAddToPlaylistsComponent(false);
        setLikedSong(likedSong);
        setAddToPlaylistToggle(prev=>!prev);
        if(changed){
            fetchTracksForPlaylists();
        }
    }

    const fetchTracksForPlaylists = async () =>{
        const loggedUserId = sessionStorage.getItem('user_id');
        const res = await fetchPlaylists();
        const usersPlaylists = res.filter((el: ISpotifyPlaylist) => el.owner.id === loggedUserId);

        const trackPromises = usersPlaylists.map(async (playlist:any)=>{
            const tracks = await fetchAllTracksFromPlaylist(playlist.id);
            return {
                id: playlist.id,
                name: playlist.name,
                tracks: tracks.map((track: ISpotifyPlaylistTracksItems) => track.track.id)}
        });

        const allTracks = await Promise.all(trackPromises);
        const tracksPerPlaylist: { [key: string]: any } = {};

        allTracks.forEach(({id,name,tracks}) =>{
            tracksPerPlaylist[id] = { name, tracks };
        })
        setTracksPerPlaylist(tracksPerPlaylist);
    }

    if (!isActive) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <p> Instance not active. Transfer your playback using your Spotify app </p>
                    </div>
                </div>
            </>)
    } else {
        return (
            <div className={style.componentContainer} style={ {borderTop: `solid ${accentColor} 1px`}}>

                {playerState && <div className={style.bottomPlayerContainer}>
                    <div className={style.buttonsContainer}>
                                        <div className={style.button} onClick={() => { playerInstance.previousTrack() }} >
                                            <FontAwesomeIcon icon={faBackward}/>
                                        </div>

                                        <div className={style.button} style={{color: 'white'}} onClick={() => { playerInstance.togglePlay() }} >
                                            { isPaused ? <FontAwesomeIcon icon={faPlay}/> : <FontAwesomeIcon icon={faStop}/> }
                                        </div>

                                        <div className={style.button} onClick={() => { playerInstance.nextTrack() }} >
                                            <FontAwesomeIcon icon={faForward}/>
                                        </div>
                        </div>
                    <div className={style.row}>
                       <div className={style.likeSongContainer}>
                            <div className={style.trackInfo}>
                                <p>{currentTrack?.name}</p>
                            </div>

                            <div onMouseEnter={() => setLikeIconHovered(true)} onMouseLeave={() => handleOnMouseLikeIconHoveredLeave()} className={style.likeIconContainer}>
                            {likedSong?<FontAwesomeIcon style={{color: 'white'}} icon={faCircleCheck} onClick={()=>handleAddToPlaylistClick()}/> : <FontAwesomeIcon icon={faCirclePlus} onClick={handleSongLike}/>}
                            {likeIconHovered && (likedSong? <div id='likeWrapper' className={`${style.likeText}  ${showAddToPlaylistsComponent ? '' : style.boxStyle}`}>{showAddToPlaylistsComponent ?
                             <div>
                                <div className={style.addToPlaylistsContainer}>
                                    <AddToPlaylists current_track={currentTrack}
                                    tracksPerPlaylists={tracksPerPlaylists}
                                    handleCloseComponent={handleCloseComponent}
                                />
                            </div>
                            </div>:  'Add to Playlist'}</div> :<div className={`${style.likeText} ${style.boxStyle}`}>Add to Liked Songs</div>)}
                           </div>

                        </div>
                        <TrackProgressBar
                            player={player}
                            accentColor={accentColor}
                        />
                        <Volume deviceId={deviceId}/>
                    </div>
                </div >}
            </div>
        );
    }
 }
 
 export default BottomPlayer;
import React, { useEffect, useState, useRef } from 'react';
import style from '../../assets/styles/addToPlaylistsStyle.module.scss';
import { removeSavedTrack,saveTrack, checkSavedTracks, addItemsToPlaylist, removePlaylistItems } from '../../api/spotifyApiClient';

type Props = {
    current_track: any,
    handleCloseComponent: (change: boolean, likedSong:boolean) => void;
    tracksPerPlaylists: {[key:string]: any}
};

function AddToPlaylists({current_track, handleCloseComponent, tracksPerPlaylists} : Props) {
    const [initialPlaylistsChecked, setInitialPlaylistsChecked] = useState<string[]>([]);
    const [changeToPlaylists, setChangeToPlaylists] = useState<boolean>(false);
    const [currentlyCheckedPlaylists, setCurrentlyCheckedPlaylists] = useState<string[]>([]);
    const [check, setCheck] = useState<boolean>();
    const [checkedPlaylistId, setCheckedPlaylistId] = useState<string>('');
    const [likedSong, setLikedSong] = useState<boolean>();

    useEffect(()=>{
        Object.keys(tracksPerPlaylists).forEach(key=>{
            if(tracksPerPlaylists[key].tracks.includes(current_track.id)){
                setInitialPlaylistsChecked(prev=>[...prev,key]);
                setCurrentlyCheckedPlaylists(prev=>[...prev,key]);
            }
        })
        checkSavedTracks(current_track.id).then(res=>{
            setLikedSong(res[0]);
        });
    },[])
    
    useEffect(()=>{
        const arrayOfPlaylistsToAddTrack = currentlyCheckedPlaylists.filter(el => !initialPlaylistsChecked.includes(el));
        const arrayOfPlaylistsToRemoveTrack = initialPlaylistsChecked.filter(el=> !currentlyCheckedPlaylists.includes(el))
        if(arrayOfPlaylistsToAddTrack.length > 0 || arrayOfPlaylistsToRemoveTrack.length>0 ){
            setChangeToPlaylists(true);
        }
        else{
            setChangeToPlaylists(false);
        }
    },[check, checkedPlaylistId, likedSong]);

    const handlePlaylistChange = (playlistId: string, isChecked: boolean)=>{
        if(isChecked){
            setCurrentlyCheckedPlaylists((prev)=>{
                if(!currentlyCheckedPlaylists.includes(playlistId)){
                    return [...prev, playlistId];
                }
                else{
                    return [...prev];
                }
            })
            setCheck(true);
        }
        else{
            setCurrentlyCheckedPlaylists((prev)=>prev.filter(el=>el!==playlistId) )
            setCheck(false);
        }
        setCheckedPlaylistId(playlistId);
    }

    const handleLikeSong = (isChecked:boolean)=>{
        if(isChecked){
            setLikedSong(true);
        }
        else{
            setLikedSong(false);
        }
    }

    function updateTrackToPlaylists(){
        const addResult = currentlyCheckedPlaylists.filter(el => !initialPlaylistsChecked.includes(el));
        console.log('addResult ',addResult);
        addResult.forEach(el=>{
            addItemsToPlaylist(el, current_track.id);

        });
        const removeResult = initialPlaylistsChecked.filter(el=> !currentlyCheckedPlaylists.includes(el));
        console.log('remove result ', removeResult);
        removeResult.forEach(el=>{
            removePlaylistItems(el, current_track.id);
        })
        if(likedSong){
            saveTrack(current_track.id);
        }
        else{
            removeSavedTrack(current_track.id);
        }

        if(likedSong!==undefined){
            handleCloseComponent(true, likedSong);
        }
    }

    function buttonsHtml(){
        if(changeToPlaylists){
            return <div className={style.button} onClick={()=>updateTrackToPlaylists()}>Done</div>;
        }
        else{
            if(!likedSong && likedSong!==undefined){
                return <div className={style.button} onClick={()=>updateTrackToPlaylists()}>Done</div>
            }
            else if(likedSong!==undefined){
                return <div className={style.buttonCancel} onClick={()=>handleCloseComponent(false, likedSong)}>Cancel</div> ;
            }
            else{
                return <div className={style.buttonCancel} onClick={()=>handleCloseComponent(false, false)}>Cancel</div> 
            }
        }
    }

    return (
            <div className={style.addToPlaylistsContainer}>
                <h4>Add to playlist</h4>
                <div className={style.playlistsContainer}>
                    <ul>
                    <li key={'liked'}>Liked Songs
                        <input
                                type="checkbox"
                                id={`likedTracks`}
                                value={'Liked song'}
                                checked={likedSong}
                                onChange={(e) => handleLikeSong(e.target.checked)}
                        />
                    </li>
                    {Object.keys(tracksPerPlaylists).map(function(key, index) {
                    return <li key={key}><span>{tracksPerPlaylists[key].name}</span>
                        <input
                            type="checkbox"
                            id={`playlist-${key}`}
                            value={key}
                            defaultChecked={tracksPerPlaylists[key].tracks.includes(current_track.id)}
                            onChange={(e) => handlePlaylistChange(key, e.target.checked)}
                        />
                    </li>;
                    })
                    }
                    </ul>
                </div>
                <div> 
                    <div className={style.buttonsContainer}>
                       {buttonsHtml()}
                    </div>
                </div>
            </div>
    );
}

 
 export default AddToPlaylists;
import React from 'react';
import {useEffect, useState} from 'react';
import {fetchTracks, playTrack} from '../../api/spotifyApiClient';
import style from '../../assets/styles/playlistStyle.module.scss';
import {getImageColors} from '../../helpers/colors';
import {convertMs} from '../../helpers/sharedFunctions';
import {displayDate} from '../../helpers/sharedFunctions';
import TrackButton from '../TrackButton/TrackButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import {parseMs} from '../../helpers/sharedFunctions';
import {ISpotifyPlaylist, ISpotifyPlaylistTracksItems, CurrentPlayerTrack} from '../../types/types';

type Props = {
  playlist: ISpotifyPlaylist;
  onArtistSelect: (artistId: string) => void;
  onAlbumSelect: (artistId: string) => void;
  onTrackSelect: (trackId: string) => void;
  player: any;
  currentPlayerTrack: CurrentPlayerTrack;
  isPlayerPaused: boolean;
  deviceId: string;
  playerContext: string;
};


const Playlist = ({ playlist,onArtistSelect,onAlbumSelect, onTrackSelect, player, currentPlayerTrack, isPlayerPaused, deviceId, playerContext }: Props) => {
  const [tracks, setTracks] = useState<ISpotifyPlaylistTracksItems[]>([]);
  const [newTracks, setNewTracks] = useState<ISpotifyPlaylistTracksItems[]>([]);
  const [nextToken, setNextToken] = useState<string>('');
  const [playlistColor, setPlaylistColor] = useState<string>('');
  const [firstPlaylistLoad, setFirstPlaylistLoad] = useState<boolean>(false);

  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [trackId, setTrackId] = useState<number>(1);
  const [contextId, setContextId] = useState<string>('');
  const [toggleButtonClicked, setToggleButtonClicked] = useState<boolean>(false);

  useEffect(()=>{
    if(firstPlaylistLoad){
      if(toggleButtonClicked){
        if(selectedTrack===currentPlayerTrack?.id && `spotify:playlist:${contextId}`===playerContext){
          player.togglePlay();
        }
      }
      else{
          if(selectedTrack===currentPlayerTrack?.id && `spotify:playlist:${contextId}`===playerContext){
            player.togglePlay();
          }
      }
    }
  },[toggleButtonClicked]);

  useEffect(()=>{
    setTracks((oldTracks)=>[...oldTracks, ...newTracks])
  },[nextToken]);

  useEffect(() => {
    if (selectedTrack !== '' && contextId !== '') {
      const playSelectedTrack = async () => {
        try {
          await playTrack(`spotify:playlist:${contextId}`, trackId - 1, deviceId);
          console.log('Playback started for selected track');
        } catch (error) {
          console.error('Error playing track:', error);
        }
      };
  
      playSelectedTrack();
    }
  }, [selectedTrack, contextId])

  useEffect(()=>{
    setTracks(playlist.tracks.items);
    setNextToken(playlist.tracks.next);
    let firstTrackUrl = '';

    // to avoid getting colors from playlists with mosaic picture
    if(playlist.images && playlist.images.length===1){
      firstTrackUrl = playlist.images[0].url;
    }
    else{
      firstTrackUrl = playlist.tracks.items.length>0 &&(
      playlist.tracks.items[0].track?.album.images.length > 0 ? playlist.tracks.items[0].track?.album.images[0].url : 'https://i.ibb.co/1JchXTW/kiwi-default.png')
    }

    getImageColors(firstTrackUrl).then(col=>{
      setPlaylistColor(col as string);
      return col;
    })
    setSelectedTrack(currentPlayerTrack.id);
    setFirstPlaylistLoad(true);
  }, [playlist]);


  const handleTogglePlay = (trackNumber:string, trackId:any, contextId: string) => {
    setSelectedTrack(trackNumber);
    setTrackId(trackId);
    setContextId(contextId);
    setToggleButtonClicked(prev=>!prev);
  };

  const handleScroll = (e:any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight+1;
    if (bottom) { 
        if(nextToken){
          fetchNextTracks();
        } 
    }
  };

  const fetchNextTracks = async () => {
    let offset = nextToken.replace('https://api.spotify.com/v1/playlists/','');
    const nextTracks = await fetchTracks(offset);
    setNextToken(nextTracks.next);
    setNewTracks(nextTracks.items);
  };

  function renderArtistTracks(track: ISpotifyPlaylistTracksItems){
    return track.track?.artists.map((el:any, i:number)=>{

      if(i!==track.track.artists.length-1){
        return  <span key={i} className={style.artistSpan} onClick={() => {
          onArtistSelect(el?.id);
        }}>{el.name}<span>, </span></span>
      }
      else{
        return <span  className={style.artistSpan} onClick={() => {
          onArtistSelect(el?.id);
        }} key={i}>{el.name}</span>
      }
    })
  }

  function countTime(playlist:any){
    let totalMs = 0;
    let approximation=false;
    playlist.tracks.items.forEach((el:any)=>{
      totalMs+=el.track?.duration_ms;
    });

    if(playlist.tracks.items.length>100){
      totalMs *= playlist.tracks.total/100;
      approximation=true;
    }

    return parseMs(totalMs, approximation);
  }

  return (
    <div className={style.playlistComponentContainer} style={{background:`linear-gradient(${playlistColor} 0vh,#121212 90vh`}}>
          <div className={style.playlistHeaderContentContainer}>
           <div className={style.imageWrapper}>
            <img
              src={
                playlist.images &&(
                playlist.images.length > 0
                  ? playlist.images[0].url
                  : 'https://i.ibb.co/1JchXTW/kiwi-default.png')
              }></img>
            </div>
            <div className={style.infoWrapper}>
              <p className={style.textShadow}>Playlist</p>
              <p id={style["title"]} className={`${style.title} ${style.textShadow}`}><span>{playlist?.name}</span></p>
              <p className={style.textShadow} id={style["description"]}>{playlist.description}</p>
              <div className={style.textShadow} id={style["playlistDetails"]}>
                <a href={playlist.owner.external_urls.spotify} target="_blank">
                {playlist.owner.display_name}&nbsp; •
                </a>
              <p>
                {playlist.tracks.total > 1
                  ? `${playlist.tracks.total} tracks`
                  : `${playlist.tracks.total} track`}&nbsp;•
                </p>
              <p>{countTime(playlist)}</p></div>
            </div>
            </div>
        <div className={style.playlistContainer}>
          <div onScroll={handleScroll} className={style.playlistScrollContainer}>
            <div className={style.firstRow}>
              <p>#</p>
              <p className={style.headerColumnStyle}>&nbsp;Title</p>
              <p></p>
              <p className={style.headerColumnStyle}>Album</p>
              <p>Date added</p>
              <p><FontAwesomeIcon icon={faClock} /></p>
            </div>
            <ul>
              {tracks.map((track: ISpotifyPlaylistTracksItems, i:number) => {
                if(track.track){
                  let url = track.track.album.images.length === 3
                  ? track.track?.album.images[2].url
                : 'https://i.ibb.co/1JchXTW/kiwi-default.png';
                return <li key={i} >
                  <p className={style.playTrack}>
                    {
                      <TrackButton
                              trackId={track.track?.id}
                              trackNumber={i+1}
                              onTogglePlay={handleTogglePlay}
                              contextId={playlist.id}
                              currentPlayerTrack={currentPlayerTrack?.id}
                              isPlayerPaused = {isPlayerPaused}
                              playerContext = {playerContext}
                              contextType='playlist'
                            />
                    }
                  </p>
                  <img src={url}></img>
                  <div className={style.columnStyle}>
                    <p className={style.trackName} onClick={()=>onTrackSelect(track.track.id)}>{track.track.name}</p>
                    <div>{renderArtistTracks(track)}</div>
                  </div>
                  <p className={`${style.columnStyle} ${style.albumName}`} onClick={()=>onAlbumSelect(track.track.album.id)}>{track.track.album.name}</p>
                  <p>{displayDate(track.added_at)}</p>
                  <p>{convertMs(track.track.duration_ms)}</p>
                </li>;
                }
              })}
            </ul>
          </div>
      </div>
    </div>
  );
};

export default Playlist;

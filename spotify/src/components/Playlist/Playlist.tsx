import React from 'react';
import { useEffect, useState } from 'react';
import { fetchNextTracksFromToken, fetchPlaylist, playTrack } from '../../api/spotifyApiClient';
import style from '../../assets/styles/playlistStyle.module.scss';
import { getImageColors } from '../../helpers/colorsUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { ISpotifyPlaylist, ISpotifyPlaylistTracksItems } from '../../types/types';
import { useParams } from 'react-router-dom';
import PlaylistHeader from './PlaylistHeader/PlaylistHeader';
import PlaylistTrackItem from './PlaylistTrackItem/PlaylistTrackItem';

type Props = {
  onArtistSelect: (artistId: string) => void;
  onAlbumSelect: (artistId: string) => void;
  onTrackSelect: (trackId: string) => void;
  player: any;
};


const Playlist = ({ onArtistSelect,
                    onAlbumSelect,
                    onTrackSelect,
                    player }: Props) => {

  const [playlist, setPlaylist] = useState<ISpotifyPlaylist>();
  const [tracks, setTracks] = useState<ISpotifyPlaylistTracksItems[]>([]);
  const [newTracks, setNewTracks] = useState<ISpotifyPlaylistTracksItems[]>([]);
  const [nextToken, setNextToken] = useState<string>('');
  const [playlistColor, setPlaylistColor] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [trackId, setTrackId] = useState<number>(1);
  const [contextId, setContextId] = useState<string>('');
  const [toggleButtonClicked, setToggleButtonClicked] = useState<boolean>(false);
  const { playerInstance, deviceId, isPaused, currentTrack, playerContext } = player;
  let { id } = useParams();
  const isContextMatching = `spotify:playlist:${contextId}` === playerContext.uri;
  const isTrackMatching = selectedTrack === currentTrack.id;

  useEffect(() => {
    if (!id) {
      return;
    }
    getPlaylist(id);
    setTracks([]);
  }, [id]);

  useEffect(() => {
    // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // console.log(' `spotify:playlist:${contextId}` ',  `spotify:playlist:${contextId}`);
    // console.log('playerContext.uri ',playerContext.uri)
    // console.log('selectedTrack ',  selectedTrack);
    // console.log('currentTrack.id ', currentTrack.id)
    if (isContextMatching && isTrackMatching) {
      // console.log('TOGGLE PLAY')
      playerInstance.togglePlay();
    }
  }, [toggleButtonClicked]);

  useEffect(() => {
    setTracks((oldTracks) => [...oldTracks, ...newTracks])
  }, [newTracks]);

  useEffect(() => {
    playSelectedTrack();
  }, [selectedTrack])

  useEffect(() => {
    if (!playlist) {
      return;
    }

    setTracks(playlist.tracks.items);
    setNextToken(playlist.tracks.next);
    setSelectedTrack(currentTrack.id);
    getPlaylistBackgroundColor(playlist).then(res => {
      setPlaylistColor(res);
    });
  }, [playlist]);


  const handleTogglePlay = (trackNumber: string, trackId: any, contextId: string) => {
    setSelectedTrack(trackNumber);
    setTrackId(trackId);
    setContextId(contextId);
    setToggleButtonClicked(prev => !prev);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const hasScrolledBottom = target.scrollHeight - target.scrollTop < target.clientHeight + 1;
    if (hasScrolledBottom && nextToken) {
      fetchNextTracks();
    }
  };

  const fetchNextTracks = async () => {
    try{
      const nextTracks = await fetchNextTracksFromToken(nextToken);
      setNextToken(nextTracks.next);
      setNewTracks(nextTracks.items);
    }catch(e){
      console.log('error fetching next tracks ',e);
    }
  };

  const playSelectedTrack = async () => {
    try {
      await playTrack(`spotify:playlist:${contextId}`, trackId - 1, deviceId);
      console.log('Playback started for selected track');
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const getPlaylist = async (playlistId: string) => {
    try {
      const res = await fetchPlaylist(playlistId);
      setPlaylist(res);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  }

  const getPlaylistBackgroundColor = async (playlist: ISpotifyPlaylist) => {

    const firstTrackImageUrl = playlist.tracks.items[0]?.track.album.images[0].url;

    if (!firstTrackImageUrl) {
      return 'white';
    }

    const hasSinglePicture = playlist.images && playlist.images.length === 1;
    const playlistImageUrl = hasSinglePicture ? playlist.images[0].url : firstTrackImageUrl;
    const backgroundColor = await getImageColors(playlistImageUrl) as string;

    return backgroundColor;
  }

  if (!playlist) {
    return null;
  }

  return (
    <div className={style.playlistComponentContainer} style={{ background: `linear-gradient(${playlistColor} 0vh,#121212 90vh` }}>
      <PlaylistHeader playlist={playlist} />
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
          <div>
            <ul>
              {tracks.map((track: ISpotifyPlaylistTracksItems, i: number) => {
                if (track.track) {
                  return <PlaylistTrackItem key={playlist.id+i}
                    playlist={playlist}
                    track={track}
                    handleTogglePlay={handleTogglePlay}
                    currentTrack={currentTrack}
                    isPaused={isPaused}
                    playerContext={playerContext}
                    onAlbumSelect={onAlbumSelect}
                    onArtistSelect={onArtistSelect}
                    onTrackSelect={onTrackSelect}
                    index={i}
                  />;
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;

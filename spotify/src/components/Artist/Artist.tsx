import React from 'react';
import { useEffect, useState } from 'react';
import style from '../../assets/styles/artistStyle.module.scss';
import { getImageColors, invertHexColor } from '../../helpers/colorsUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ArtistTopTracks from '../ArtistTopTracks/ArtistTopTracks';
import { playTracks, getArtistAlbums, fetchArtistsTopTracks, getArtistRelatedArtists, fetchArtist } from '../../api/spotifyApiClient';
import { ISpotifyTopTracks, ISpotifySimilarArtists, ISpotifyArtist } from '../../types/types';
import { hexToRgba } from '../../helpers/colorsUtils';
import SimilarArtists from '../SimilarArtists/SimilarArtists';
import ArtistAlbums from '../ArtistAlbums/ArtistAlbums';
import { useParams } from 'react-router-dom';
import { getArtistImage } from '../../helpers/spotifyUtils';
import { getPlayPauseCircleIcon } from '../../helpers/utils';

type Props = {
  onArtistSelect: (artistId: string) => void;
  onAlbumSelect: (artistId: string) => void;
  onTrackSelect: (albumId: string) => void;
  player: any;
};

const Artist = ({ onTrackSelect, player, onArtistSelect, onAlbumSelect }: Props) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [artist, setArtist] = useState<ISpotifyArtist>();
  const [topTracks, setTopTracks] = useState<ISpotifyTopTracks[]>([]);
  const [tracksUris, setTracksUris] = useState<string[]>([]);
  const [topTracksPlayToggle, setTopTracksPlayToggle] = useState<boolean | null>(true);
  const [similarArtists, setSimilarArtists] = useState<ISpotifySimilarArtists>([]);
  const [albums, setAlbums] = useState<ISpotifyArtist[]>([]);
  const { playerInstance, deviceId, isPaused, currentTrack, playerContext, playerState } = player;
  let { id } = useParams();
  const isArtistPlayerContext = playerContext.uri === '' || playerContext.uri === '-';

  useEffect(() => {
    if (!id) {
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

  }, [id]);

  useEffect(() => {
    if (!artist) {
      return;
    }
    getImageColors(getArtistImage(artist)).then(col => {
      setBackgroundColor(col as string);
      return col;
    });
    fetchTopTracks();
    fetchSimilarArtists();
    fetchArtistAlbums();
  }, [artist]);

  useEffect(() => {
    if (!topTracks) {
      return;
    }
    const uris = topTracks.map(el => el.uri);
    setTracksUris(uris);
  }, [topTracks])

  useEffect(() => {
    if (!isArtistPlayerContext || tracksUris.length < 0) {
      return;
    }
    checkIfTopTrack() ? setTopTracksPlayToggle(isPaused) : setTopTracksPlayToggle(true);
  }, [tracksUris, isPaused])


  function handleTopTracksPlay() {
    setTopTracksPlayToggle(prev => !prev);
    if (!isArtistPlayerContext) {
      playTracks(tracksUris, 0, deviceId);
    }
    else {
      checkIfTopTrack() ? playerInstance.togglePlay() : playTracks(tracksUris, 0, deviceId);
    }
  }


  const fetchTopTracks = async () => {
    if (!artist) {
      return;
    }
    const nextTracks = await fetchArtistsTopTracks(artist.id);
    setTopTracks(nextTracks.tracks);
  };

  const fetchSimilarArtists = async () => {
    if (!artist) {
      return;
    }
    const similarArtists = await getArtistRelatedArtists(artist.id);
    setSimilarArtists(similarArtists);
  };

  const fetchArtistAlbums = async () => {
    if (!artist) {
      return;
    }
    const albums = await getArtistAlbums(artist.id);
    setAlbums(albums);
  };

  const checkIfTopTrack = () => {
    return tracksUris.includes(currentTrack.uri);
  }

  if (!artist) {
    return null;
  }

  return (
    <> <div className={style.artistHeaderContainer} style={{
      backgroundImage: `url(${getArtistImage(artist)})`, backgroundSize: `100%`, backgroundPosition: `center`
    }}>
      <div className={style.headerContainer} >
        <img
          src={getArtistImage(artist)}
        />
        <p className={style.artistName}>{artist.name}</p>
        <div className={style.gradientWrapper} style={{ background: `linear-gradient(${hexToRgba(backgroundColor, 0.4)} 0% ,rgba(22, 22, 22, 1) 100%` }}>
          <div onClick={handleTopTracksPlay} className={style.playContainer} style={{ color: `${invertHexColor(backgroundColor)}` }} >
            <FontAwesomeIcon className={style.playIcon}
              icon={getPlayPauseCircleIcon(topTracksPlayToggle)}
              style={{ color: `${invertHexColor(backgroundColor)}` }} />
          </div>
        </div>
      </div>
    </div>
      <div className={style.artistMainContainer}>
        <div className={style.popularTracksContainer}>
          <ArtistTopTracks artistId={artist.id}
            topTracks={topTracks}
            tracksUris={tracksUris}
            player={player}
            setTopTracksPlayToggle={setTopTracksPlayToggle}
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
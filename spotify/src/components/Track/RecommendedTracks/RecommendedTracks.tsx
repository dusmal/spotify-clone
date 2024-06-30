import React from 'react';
import style from '../../../assets/styles/trackStyle.module.scss';
import ListArtists from '../../ListArtists/ListArtists';
import { ISpotifyTrack } from '../../../types/types';
import { getTrackImage } from '../../../helpers/spotifyUtils';

type Props = {
    recommendedTracks: ISpotifyTrack[],
    onArtistSelect: (artistId: string) => void;
    onTrackSelect: (albumId: string) => void;
};


const RecommendedTracks = ({ recommendedTracks,
                             onArtistSelect,
                             onTrackSelect
                         }: Props) => {

    return <div className={style.recommendationsContainer}>
        <div className={style.header}>
            <h3>Recommended</h3>
            <p>Based on this song</p>
        </div>
        <div className={style.recommendedTracksContainer}>
            {
                recommendedTracks.map(track => {
                    return <div key={track.id}>
                        <img onClick={() => { onTrackSelect(track.id) }} src={getTrackImage(track)} />
                        <p onClick={() => { onTrackSelect(track.id) }} className={style.trackName}>{track.name}</p>
                        <p className={style.artistName}>
                            <ListArtists artists={track.album.artists} onArtistSelect={onArtistSelect} />
                        </p>
                    </div>
                })
            }
        </div>
    </div>
};

export default RecommendedTracks
    ;
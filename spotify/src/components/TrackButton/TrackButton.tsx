import React, { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faStop } from '@fortawesome/free-solid-svg-icons';

type Props = {
  trackId: string;
  onTogglePlay: (trackNumber: string, trackId: any, contextId: string) => void;
  trackNumber: number;
  contextId: string;
  currentPlayerTrack: any;
  isPlayerPaused: boolean;
  playerContext: any;
  contextType: string;
};

const TrackButton = ({ trackId, 
                       trackNumber, 
                       onTogglePlay, 
                       contextId, 
                       currentPlayerTrack, 
                       isPlayerPaused, 
                       playerContext, 
                       contextType }: Props) => {
                        
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => onTogglePlay(trackId, trackNumber, contextId);

  const isCurrentTrack = currentPlayerTrack?.id === trackId;
  const isInArtistContext = contextType === 'artist';
  const isPlayingContext = playerContext.uri === `spotify:${contextType}:${contextId}`;
  const isEmptyArtistContext = playerContext.uri === '' || playerContext.uri === '-';
  const isPlayableContext = isPlayingContext || (isInArtistContext && isEmptyArtistContext);

  const getIcon = () => {
    if(isCurrentTrack){
      return isPlayerPaused ? faPlay : faStop;
    }
    return faPlay;
  }

  const shouldShowIcon = () =>{
    return isHovered || (isPlayableContext && isCurrentTrack);
  }

  // function renderPlayToggleButton() {
  //   if (contextType === 'artist') {
  //     return (playerContext.uri === '' || playerContext.uri === '-') ? ((currentPlayerTrack?.id === trackId ? (isPlayerPaused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />) :
  //       (isHovered ? <FontAwesomeIcon icon={faPlay} /> : trackNumber))) : (isHovered ? <FontAwesomeIcon icon={faPlay} /> : trackNumber);
  //   } else {
  //     return `spotify:${contextType}:${contextId}` === playerContext.uri ?
  //       (currentPlayerTrack?.id === trackId ? (isPlayerPaused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />) :
  //         (isHovered ? <FontAwesomeIcon icon={faPlay} /> : trackNumber)) :
  //       isHovered ? <FontAwesomeIcon icon={faPlay} /> : trackNumber;
  //   }
  // }

  return (
    <span
      key={trackId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {
        // renderPlayToggleButton()
        shouldShowIcon() ? <FontAwesomeIcon icon={getIcon()} /> : trackNumber
      }

    </span>
  );
};
export default TrackButton;
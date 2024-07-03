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
  const isArtistContextType = contextType === `artist`;
  const isContextMatching = playerContext.uri === `spotify:${contextType}:${contextId}`;
  const isArtistPlayerContext = playerContext.uri === '' || playerContext.uri === '-';
  const isPlayableContext = isContextMatching || (isArtistContextType && isArtistPlayerContext);

  const getIcon = () => {
    if( isCurrentTrack && isPlayableContext){
      return isPlayerPaused ? faPlay : faStop;
    }
    return faPlay;
  }

  const shouldShowIcon = () =>{
    return isHovered || (isPlayableContext && isCurrentTrack);
  }
  return (
    <span
      key={trackId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {
        shouldShowIcon() ? <FontAwesomeIcon icon={getIcon()} /> : trackNumber
      }

    </span>
  );
};
export default TrackButton;
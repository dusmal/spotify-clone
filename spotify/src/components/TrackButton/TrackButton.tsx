import React from 'react';
import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faStop} from '@fortawesome/free-solid-svg-icons';

type Props = {
  trackId: string;
  onTogglePlay: (trackNumber: string, trackId: any, contextId: string) => void;
  trackNumber: number;
  contextId: string;
  currentPlayerTrack: string;
  isPlayerPaused: boolean;
  playerContext: string;
  contextType: string;
};

const TrackButton = ({ trackId,trackNumber, onTogglePlay,contextId, currentPlayerTrack, isPlayerPaused, playerContext, contextType }: Props) => {
    const [isHovered, setIsHovered] = useState(false);

    function renderPlayToggleButton(){
      if(contextType==='artist'){
        return (playerContext==='' || playerContext==='-')? ( (currentPlayerTrack===trackId ? (isPlayerPaused ? <FontAwesomeIcon icon={faPlay}/> : <FontAwesomeIcon icon={faStop}/>) : 
        (isHovered ? <FontAwesomeIcon icon={faPlay}/> : trackNumber))): (isHovered ? <FontAwesomeIcon icon={faPlay}/> : trackNumber) ;
      }else{
        return `spotify:${contextType}:${contextId}`===playerContext ?
        (currentPlayerTrack===trackId ? (isPlayerPaused ? <FontAwesomeIcon icon={faPlay}/> : <FontAwesomeIcon icon={faStop}/>) : 
        (isHovered ? <FontAwesomeIcon icon={faPlay}/> : trackNumber)) :
        isHovered ? <FontAwesomeIcon icon={faPlay}/> : trackNumber;
      }
    }

    return (
      <span
        key={trackId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onTogglePlay(trackId,trackNumber,contextId)}
      >
        {
          renderPlayToggleButton()
        }
        
      </span>
    );
  };
export default TrackButton;
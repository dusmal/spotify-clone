import React, { useEffect, useState, useRef } from 'react';
import style from '../../assets/styles/volumeStyle.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faVolumeLow,faVolumeOff,faVolumeHigh} from '@fortawesome/free-solid-svg-icons';
import {changeVolumne} from '../../api/spotifyApiClient';

type Props = {
    deviceId: string;
};
  
function Volume({deviceId} : Props) {
    const [volume, setVolume] = useState<string>('50'); 
    const [visibleVolume, setVisibleVolume] = useState<number>(50); 
    const [volumeIconClicked, setVolumneIconClicked] = useState<boolean>(false);
    const volumeSliderRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<number | undefined>(undefined);
    
    useEffect(()=>{
        if(volumeIconClicked){
            setVolume('0');
            setVisibleVolume(0);
        }
        else{
            if(volumeSliderRef.current){
                setVolume(`${volumeSliderRef.current.value}`);
                setVisibleVolume(parseInt(volumeSliderRef.current.value));
            }
        }
    }, [volumeIconClicked]);

    useEffect(()=>{
        changeVolumne(deviceId,volume);
    }, [volume])


    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if(value!==''){
            debounce(()=>setVolume(value),500);
        }
        setVisibleVolume(parseInt(value));
    };

    const handleVolumeIconClick = ()=>{
        setVolumneIconClicked(prev=>!prev);
    }

    const debounce = (func: Function, delay: number) => {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = window.setTimeout(func, delay);
    }

   
   return  <div className={style.volumeContainer}>
        <div className={style.volumeIcon} onClick={handleVolumeIconClick}>
        {visibleVolume === 0 ? 
            <FontAwesomeIcon icon={faVolumeOff}/> : 
            ((visibleVolume < 50 )  ?
             <FontAwesomeIcon icon={faVolumeLow}/>
              : <FontAwesomeIcon icon={faVolumeHigh}/>  )}
        </div>
        <input
            id="volumeSlider"
            type="range"
            min="0"
            max="100"
            ref={volumeSliderRef}
            onChange={handleVolumeChange}
            className={style.slider}
        />
    </div>
}
 
 export default Volume;
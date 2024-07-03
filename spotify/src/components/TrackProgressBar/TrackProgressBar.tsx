import React, { useEffect, useState, useRef } from 'react';
import style from '../../assets/styles/trackProgressBarStyle.module.scss';
import { formatMillisecondsToTime } from '../../helpers/utils';

type Props = {
    player: any,
    accentColor: string;
};

function TrackProgressBar({ player,
                            accentColor }: Props) {

    const [seconds, setSeconds] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState<number>(0);
    const progressWrapperRef = useRef<HTMLInputElement>(null);

    const {playerInstance, deviceId, isPaused, isActive, currentTrack, playerContext, playerState} = player;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (!isPaused) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        } else if (isPaused && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        if (!currentTrack?.id) {
            return;
        }
        setSeconds(0);
        setProgressBarWidth(0);
    }, [currentTrack?.id]);

    useEffect(() => {
        if (!playerState) {
            return;
        }       
        let width = 100 / (playerState.duration / 1000);
        setProgressBarWidth(seconds * width);
    }, [seconds]);

    useEffect(() => {
        if (!playerState) {
            return;
        }
        setSeconds(Math.round(playerState.position / 1000));
    }, [playerState?.position]);

    const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const progressWrapper = progressWrapperRef.current!;
        const rect = progressWrapper.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickPercentage = (clickX / rect.width) * 100;
        player.seek((playerState.duration * clickPercentage) / 100)
    };

    return <>
        <div>{formatMillisecondsToTime(seconds * 1000)}</div>
        <div className={style.progressWrapper} ref={progressWrapperRef} onClick={handleProgressBarClick}>
            <div
                style={{ width: `${progressBarWidth}%`, backgroundColor: accentColor, }}
                className={style.progressBar}
            />
        </div>
        <div>{formatMillisecondsToTime(playerState.duration)}</div></>
}
export default TrackProgressBar;
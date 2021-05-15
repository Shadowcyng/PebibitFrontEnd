import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import 'react-jinke-music-player/assets/index.css';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import io from 'socket.io-client';
import axios from 'axios';
import songs from '../utils/songs';
import { duration } from '@material-ui/core';

const Player = ({ songIndex, setSongIndex }) => {
	let socket;
	const music = useRef();
	const bar = useRef();
	const [playing, setPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(music.current?.currentTime);
	const [duration, setDuration] = useState();
	// const [songIndex, setSongIndex] = useState(0)

	const token = window.location.search.split('=')[1];
	// useEffect(() => {
	// 	socket = io('http://localhost:5000');

	// 	console.log('token', token);

	// 	socket.emit('join', { token }, () => {
	// 		console.log('connected');
	// 	});

	// 	socket.on('user', (user) => {
	// 		console.log('user', user);
	// 	});
	// 	return () => {
	// 		socket.disconnect();
	// 		socket.off();
	// 	};
	// }, [token]);
	useEffect(() => {
		console.log(`music`, music);
		// socket = io('http://localhost:5000');
		music.current.autoplay = playing ? true : false;
	}, [songIndex]);

	const handlePlay = (e) => {
		e.preventDefault();
		setPlaying(false);
		music.current.pause();
	};
	const handlePause = (e) => {
		e.preventDefault();
		setPlaying(true);
		music.current.play();
	};

	const handleNext = (e) => {
		e?.preventDefault();
		// setCurrentTime(music.current?.currentTime);
		// setDuration(music.current?.duration);
		setSongIndex((songIndex + 1) % songs.length);
		playing
			? (music.current.autoplay = true)
			: (music.current.autoplay = false);
		setCurrentTime(music.current?.currentTime);
		setDuration(music.current?.duration);
	};
	const handlePrev = (e) => {
		e.preventDefault();
		setSongIndex((songIndex - 1 + songs.length) % songs.length);
		console.log('previous', music);
		playing
			? (music.current.autoplay = true)
			: (music.current.autoplay = false);
		// socket.emit('prev', { songIndex, token }, () => {});
		setCurrentTime(music.current?.currentTime);
		setDuration(music.current?.duration);
	};
	const handleTime = (e) => {
		setCurrentTime(e.target.currentTime);
		bar.current.style.width = Math.abs((currentTime / duration) * 100);
		console.log(bar.current.style);
	};

	return (
		<div className='player'>
			<div className='card'>
				<div className='card__header'>
					<div className='player__title'>
						{songs[songIndex]['title'].toUpperCase()}
					</div>
					<div className='player__artist'>
						{songs[songIndex]['artist'].toUpperCase()}
					</div>
				</div>
				<div className='player__image'>
					<img
						className={playing ? 'anime' : 'image'}
						src={songs[songIndex]['imgsrc']}
						width='100px'
						height='100px'
						alt='media image'
					/>
				</div>
				<div className='progress__time'>
					<div>{(Number(currentTime) / 60).toFixed(2)}</div>
					<div>{(Number(duration) / 60).toFixed(2)}</div>
				</div>
				<div class='progress__bar_container'>
					<div ref={bar} className='progress__bar'></div>
				</div>
				<div className='player__controls'>
					<audio
						ref={music}
						src={songs[songIndex]['songsrc']}
						controls
						onTimeUpdate={(e) => handleTime(e)}
					></audio>
					<SkipPreviousIcon
						className='icon'
						fontSize='large'
						onClick={(e) => handlePrev(e)}
					/>
					{playing ? (
						<PauseCircleFilledIcon
							className='icon'
							fontSize='large'
							onClick={(e) => handlePlay(e)}
						/>
					) : (
						<PlayCircleFilledIcon
							className='icon'
							fontSize='large'
							onClick={(e) => handlePause(e)}
						/>
					)}
					<SkipNextIcon
						className='icon'
						fontSize='large'
						onClick={(e) => handleNext(e)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Player;

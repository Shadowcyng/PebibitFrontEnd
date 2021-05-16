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
var socket = null;
const Player = () => {
	var token = localStorage.getItem('token');
	const music = useRef();
	const bar = useRef();
	const [playing, setPlaying] = useState(false);
	const [activeAt, setActiveAt] = useState('');
	const [songIndex, setSongIndex] = useState(0);
	const [currentTime, setCurrentTime] = useState(0.0);
	const [duration, setDuration] = useState(0.0);

	useEffect(() => {
		if (socket == null) {
			socket = io('http://localhost:5000');
			socket.emit('join', {}, () => {
				console.log(socket.id);
			});

			socket.on('event', ({ type, ...args }) => {
				switch (type) {
					case 'init':
						if (args.activeAt) setActiveAt(args.activeAt);
						setSongIndex(args.songIndex);
						break;
					case 'change':
						setSongIndex(args.songIndex);
						break;
					case 'playPause':
						setActiveAt(args.activeAt);
						if (args.status == 'pause') {
							if (music.current) {
								setPlaying(false);
								music.current.pause();
							}
						} else {
							if (music.current) {
								setPlaying(true);
								music.current.play();
							}
						}
						break;
				}
			});
		}

		music.current.autoplay = playing ? true : false;
	});

	const socketEmitter = (value, type) => {
		socket.emit('event', { type: type, value: value, token: token });
	};
	const handlePlay = (e) => {
		e.preventDefault();
		setPlaying(false);
		music.current.pause();
		socketEmitter('pause', 'clientPlayPauseChange');
		setDuration(music.current?.duration);
		setCurrentTime(music.current?.currentTime);
	};
	const handlePause = (e) => {
		e.preventDefault();
		setPlaying(true);
		music.current.play();
		socketEmitter('play', 'clientPlayPauseChange');
		setDuration(music.current?.duration);
		setCurrentTime(music.current?.currentTime);
	};

	const handleNext = (e) => {
		e.preventDefault();
		let newIdx = (songIndex + 1) % songs.length;
		setSongIndex(newIdx);
		socketEmitter(newIdx, 'clientRequestChange');
		setDuration(music.current?.duration);
		setCurrentTime(music.current?.currentTime);
		playing
			? (music.current.autoplay = true)
			: (music.current.autoplay = false);
	};

	const handlePrev = (e) => {
		e.preventDefault();
		let newIdx = songIndex - 1;
		if (newIdx < 0) {
			newIdx = songs.length - 1;
		}
		setSongIndex(newIdx);
		socketEmitter(newIdx, 'clientRequestChange');
		setDuration(music.current?.duration);
		setCurrentTime(music.current?.currentTime);
		playing
			? (music.current.autoplay = true)
			: (music.current.autoplay = false);
	};

	const handleUpdate = (e) => {
		setCurrentTime(e.target.currentTime);
		bar.current.style.width = `${(currentTime / duration) * 100}%`;
	};

	return (
		<div className='player'>
			<div className='player__activeAt'>
				<div>
					{!playing && <span>Active At:</span>} {playing ? '' : activeAt}
				</div>
			</div>
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
					<div>{(currentTime / 60).toFixed(2)}</div>
					<div>{(duration / 60).toFixed(2)}</div>
				</div>
				<div className='progress__bar_wrapper'>
					<div ref={bar} className='progress__bar'></div>
				</div>
				<div className='player__controls'>
					<audio
						ref={music}
						src={songs[songIndex]['songsrc']}
						controls
						onTimeUpdate={(e) => handleUpdate(e)}
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

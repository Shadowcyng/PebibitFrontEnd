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
	const [playing, setPlaying] = useState(false);
	const [activeAt, setActiveAt] = useState('');
	const [songIndex, setSongIndex] = useState(0);
	const music = useRef();

	useEffect(() => {
		if (socket == null) {
			socket = io('http://localhost:5000');
			socket.emit('join', { token }, () => {
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
	};
	const handlePause = (e) => {
		e.preventDefault();
		setPlaying(true);
		music.current.play();
		socketEmitter('play', 'clientPlayPauseChange');
	};

	const handleNext = (e) => {
		e.preventDefault();
		let newIdx = (songIndex + 1) % songs.length;
		setSongIndex(newIdx);
		socketEmitter(newIdx, 'clientRequestChange');
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
		playing
			? (music.current.autoplay = true)
			: (music.current.autoplay = false);
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
					<div className='player__title'>{songs[songIndex]['title']}</div>
					<div className='player__artist'>{songs[songIndex]['artist']}</div>
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
				<div className='player__controls'>
					<audio ref={music} src={songs[songIndex]['songsrc']} controls></audio>
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

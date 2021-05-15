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

const Player = ({ songIndex, setSongIndex }) => {
	let socket, token;
	const [playing, setPlaying] = useState(false);
	// const [songIndex, setSongIndex] = useState(0)
	const music = useRef();

	socket = io('http://localhost:5000');
	useEffect(() => {
		token = window.location.search.split('=')[1];
		console.log('token', token);
		socket.emit('join', { token }, () => {});
		socket.on('user', (user) => {
			console.log(user);
		});
		return () => {
			// socket.emit('disconnect')
			socket.off();
		};
	}, [token]);
	useEffect(() => {
		music.current.autoplay = playing ? true : false;
		console.log(playing);
		socket.on('previous', ({ songIndex }) => {
			console.log('Triggered');
			setSongIndex(songIndex);
		});
	}, []);

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
		e.preventDefault();
		setSongIndex((songIndex + 1) % songs.length);
		playing
			? (music.current.autoplay = true)
			: (music.current.autoplay = false);
	};
	const handlePrev = (e) => {
		e.preventDefault();
		setSongIndex((songIndex - 1 + songs.length) % songs.length);
		socket.emit('prev', { songIndex, token }, () => {
			// console.log(music);
			playing
				? (music.current.autoplay = true)
				: (music.current.autoplay = false);
		});
	};

	return (
		<div className='player'>
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

import React from 'react';
import songs from '../utils/songs';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import axios from 'axios';

import '../App.css';

const Sidebar = ({ songIndex, setSongIndex }) => {
	const handleClick = (e, song) => {
		e.preventDefault();
		setSongIndex(song.id);
	};
	const handleLogout = (e) => {
		const token = localStorage.getItem('token');
		axios.get(`http://localhost:5000/logout/${token}`).then((res) => {
			localStorage.removeItem('token');
			window.location = 'http://localhost:3000/login';
		});
	};
	return (
		<div className='sidebar'>
			<div className='user__logout'>
				<button onClick={(e) => handleLogout(e)}>Logout</button>
			</div>
			<ul>
				{songs.map((song) => {
					return (
						<li key={song.id} className='song__list'>
							<div
								className='song__list_wrapper'
								onClick={(e) => handleClick(e, song)}
							>
								<MusicNoteIcon className='musicicon' />
								<div className='song__title'>{song.title}</div>
								<div className='song__artist'>{song.artist}</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Sidebar;

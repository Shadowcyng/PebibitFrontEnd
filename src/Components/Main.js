import React, { Fragment, useEffect } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';

const Main = ({ songIndex, setSongIndex }) => {
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			window.location = 'http://localhost:5000/login';
		}
	}, [token]);
	return (
		<Fragment>
			<Sidebar songIndex={songIndex} setSongIndex={setSongIndex} />
			<Player songIndex={songIndex} setSongIndex={setSongIndex} />
		</Fragment>
	);
};

export default Main;

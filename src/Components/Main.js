import React, { Fragment, useEffect } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';

const Main = ({ songIndex, setSongIndex }) => {
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			window.location = 'http://localhost:3000/login';
		}
	}, [token]);
	return (
		<Fragment>
			<Sidebar />
			<Player />
		</Fragment>
	);
};

export default Main;

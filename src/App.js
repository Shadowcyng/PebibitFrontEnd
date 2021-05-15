import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import { useState } from 'react';
import Main from './Components/Main';

function App() {
	const [songIndex, setSongIndex] = useState(0);
	return (
		<div className='App'>
			<Router>
				<Switch>
					<Route exact path='/login' component={Login} />
					<Route exact path='/'>
						<Main songIndex={songIndex} setSongIndex={setSongIndex} />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Signup = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState({});
	const inputF = useRef();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (token) {
			window.location = `http://localhost:3000?token=${token}`;
		} else {
			inputF.current.focus();
		}
	}, [token]);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (username.trim() !== '' && password.trim() !== '') {
			axios
				.post('http://localhost:5000/login', {
					username,
					password,
				})

				.then((res) => {
					localStorage.setItem('token', res.data);
					window.location = `http://localhost:3000?token=${res.data}`;
					setError({ message: '' });
				})
				.catch((e) => {
					console.log(e.response);
					if (e.response) {
						setError({ message: e.response.data.message });
					}
				});
		} else {
			setError({ message: 'All fields are required' });
		}
	};
	return (
		<div className='login'>
			<div className='login__form'>
				<div className='login__form_heading'>Please Sign in</div>
				<div className='login__form_element'>
					<label htmlFor='username'>Username</label>
					<input
						ref={inputF}
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className='login__form_element'>
					<label htmlFor='username'>Password</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className='login__form_button'>
					<button onClick={(e) => handleSubmit(e)}>Submit</button>
				</div>
				<div className='login__form_error'>{error.message}</div>
			</div>
		</div>
	);
};

export default Signup;

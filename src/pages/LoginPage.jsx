import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('error');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:8000/api/v1/users/login', formData);
			if (response.status === 200 && response.data.success) {
				// Save tokens to localStorage/sessionStorage
				// localStorage.setItem('authToken', response.headers['accessToken']);
				// localStorage.setItem('refreshToken', response.headers['refreshToken']);
				localStorage.setItem('authToken', response.data.data.accessToken);
				localStorage.setItem('refreshToken', response.data.data.refreshToken);

				showModal(setModalMessage, setModalType, setIsModalOpen, 'Login successful! Redirecting to home page...', 'success');
			} else {
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Login failed. Please check your credentials.', 'error');
			}
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'An error occurred during login.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate('/home');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 mb-2" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						Login
					</button>
				</form>
				<p className="mt-4 text-center text-gray-600">
					Don't have an account?{' '}
					<Link to="/signup" className="text-blue-500 hover:underline">
						Sign Up
					</Link>
				</p>
			</div>
			<Modal
				isOpen={isModalOpen}
				message={modalMessage}
				type={modalType}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default Login;

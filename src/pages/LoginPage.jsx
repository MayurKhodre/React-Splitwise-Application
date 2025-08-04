import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/Api'; // Use the new api instance
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Import Heroicons for password visibility toggle

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
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
			// Use api instance instead of axios
			const response = await api.post('/users/login', formData);
			if (response.status === 200 && response.data.success) {
				const { accessToken, refreshToken, user } = response.data.data;

				// Store tokens and user details in localStorage
				localStorage.setItem('authToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('userEmail', user.email);
				localStorage.setItem('userId', user._id);

				// Show success modal and redirect to home
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
			navigate('/home'); // Redirect to home after successful login
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 p-8 rounded-xl shadow-lg">
				<h2 className="text-2xl font-semibold mb-6 text-blue-900 dark:text-blue-200 text-center">Login to Splitwise</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-5">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-6 relative">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="password">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								name="password"
								className="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
								placeholder="Enter your password"
								value={formData.password}
								onChange={handleChange}
								required
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeSlashIcon className="h-5 w-5 text-blue-400" />
								) : (
									<EyeIcon className="h-5 w-5 text-blue-400" />
								)}
							</button>
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-700 dark:bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-800 transition"
					>
						Login
					</button>
				</form>
				<p className="mt-5 text-center text-blue-700 dark:text-blue-300">
					Don't have an account?{' '}
					<Link to="/signup" className="font-semibold hover:underline">
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

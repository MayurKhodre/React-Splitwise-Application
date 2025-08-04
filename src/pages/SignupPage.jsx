import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';
import api from '../utils/Api';

function Signup() {
	const [formData, setFormData] = useState({
		userName: '',
		fullName: '',
		email: '',
		password: '',
		avatar: null,
		coverImage: null,
	});


	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('success');

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'avatar' || name === 'coverImage') {
			setFormData({ ...formData, [name]: files[0] });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		for (const key in formData) {
			formDataToSend.append(key, formData[key]);
		}

		try {
			const response = await api.post('/users/register', formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (response.data.success) {
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Signup successful! Redirecting to login...', 'success');
			} else {
				showModal(setModalMessage, setModalType, setIsModalOpen, `Signup failed: ${response.data.message}`, 'error');
			}
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'An error occurred during signup.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate('/login');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 p-8 rounded-xl shadow-lg">
				<h2 className="text-2xl font-semibold mb-6 text-blue-900 dark:text-blue-200 text-center">Sign Up for Splitwise</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="userName">
							Username
						</label>
						<input
							type="text"
							id="userName"
							name="userName"
							className="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
							placeholder="Enter your userName"
							value={formData.userName}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="fullName">
							Full Name
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							className="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
							placeholder="Enter your full name"
							value={formData.fullName}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
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
					<div className="mb-4">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="avatar">
							Avatar Image
						</label>
						<div className="flex items-center">
							<label className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg cursor-pointer shadow">
								<span>Upload Avatar</span>
								<input
									type="file"
									id="avatar"
									name="avatar"
									className="hidden"
									onChange={handleChange}
									required
								/>
							</label>
							<span className="ml-3 text-blue-600 text-xs">{formData.avatar ? formData.avatar.name : 'No file chosen'}</span>
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-blue-900 dark:text-blue-200 mb-1 font-medium" htmlFor="coverImage">
							Cover Image (Optional)
						</label>
						<div className="flex items-center">
							<label className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg cursor-pointer shadow">
								<span>Upload Cover</span>
								<input
									type="file"
									id="coverImage"
									name="coverImage"
									className="hidden"
									onChange={handleChange}
								/>
							</label>
							<span className="ml-3 text-blue-600 text-xs">{formData.coverImage ? formData.coverImage.name : 'No file chosen'}</span>
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-700 dark:bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-800 transition"
					>
						Sign Up
					</button>
				</form>
				<p className="mt-5 text-blue-700 dark:text-blue-300 text-center">
					Already have an account?{' '}
					<Link to="/login" className="font-semibold hover:underline">
						Login
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
}

export default Signup;

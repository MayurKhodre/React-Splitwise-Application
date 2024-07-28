// src/Signup.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
	const [formData, setFormData] = useState({
		username: '',
		fullname: '',
		email: '',
		password: '',
		avatar: null,
		coverImage: null,
	});

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
			const response = await axios.post('YOUR_API_ENDPOINT', formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Sign Up</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="username">
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your username"
							value={formData.username}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="fullname">
							Full Name
						</label>
						<input
							type="text"
							id="fullname"
							name="fullname"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your full name"
							value={formData.fullname}
							onChange={handleChange}
							required
						/>
					</div>
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
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="avatar">
							Avatar Image
						</label>
						<div className="flex items-center">
							<label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer">
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
							<span className="ml-2">{formData.avatar ? formData.avatar.name : 'No file chosen'}</span>
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="coverImage">
							Cover Image (Optional)
						</label>
						<div className="flex items-center">
							<label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer">
								<span>Upload Cover</span>
								<input
									type="file"
									id="coverImage"
									name="coverImage"
									className="hidden"
									onChange={handleChange}
								/>
							</label>
							<span className="ml-2">{formData.coverImage ? formData.coverImage.name : 'No file chosen'}</span>
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						Sign Up
					</button>
				</form>
				<p className="mt-4 text-gray-600 text-center">
					Already have an account?{' '}
					<Link to="/login" className="text-blue-500 hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Signup;

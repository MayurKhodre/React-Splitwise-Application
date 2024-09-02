import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.get('http://localhost:8000/api/v1/user/profile', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});
				setUser(response.data.data);
			} catch (error) {
				console.error('Failed to fetch user profile:', error);
			}
		};

		fetchUserProfile();
	}, []);

	return (
		<div className="profile-page min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
			{user ? (
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">User Details</h2>
					<p><strong>Username:</strong> {user.username}</p>
					<p><strong>Full Name:</strong> {user.fullName}</p>
					<p><strong>Email:</strong> {user.email}</p>
					<p><strong>Avatar:</strong> <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full" /></p>
					{/* Add more user details as needed */}
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default ProfilePage;

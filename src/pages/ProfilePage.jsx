import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../utils/Api';

const ProfilePage = () => {
	const [user, setUser] = useState(null);
	const userEmail = localStorage.getItem('userEmail');

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await api.get(`/users/get-user/${userEmail}`, {
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
		<div className="min-h-screen bg-gray-100">
			<Header />
			<div className="profile-page p-6 max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

				{user ? (
					<div className="bg-white shadow rounded-lg p-6">
						{/* Cover Image (optional) */}
						{user.coverImage && (
							<div className="mb-4">
								<img
									src={user.coverImage}
									alt="Cover"
									className="w-full h-48 object-cover rounded-lg shadow-md"
								/>
							</div>
						)}

						<div className="flex items-center space-x-4">
							<img
								src={user.avatar}
								alt="Avatar"
								className="w-24 h-24 rounded-full shadow-lg border-4 border-gray-300"
							/>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-gray-900 mb-2">{user.fullName}</h2>
								<p className="text-gray-600 text-lg"><strong>Email:</strong> {user.email}</p>
							</div>
						</div>
					</div>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;

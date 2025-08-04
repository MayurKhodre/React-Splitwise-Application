import React, { useEffect, useState } from 'react';
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
		<div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
			<div className="profile-page p-6 max-w-3xl mx-auto">
				<h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-200 mb-8 text-center drop-shadow">Profile</h1>
				{user ? (
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-blue-100 dark:border-gray-700 animate-fadeIn">
						{user.coverImage && (
							<div className="mb-6">
								<img
									src={user.coverImage}
									alt="Cover"
									className="w-full h-52 object-cover rounded-xl shadow-lg border border-blue-200 dark:border-gray-700"
								/>
							</div>
						)}
						<div className="flex items-center space-x-8">
							<img
								src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
								alt="Avatar"
								className="w-28 h-28 rounded-full shadow-xl border-4 border-blue-200 dark:border-gray-700"
							/>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">{user.fullName}</h2>
								<p className="text-blue-700 dark:text-blue-200 text-lg"><strong>Email:</strong> {user.email}</p>
							</div>
						</div>
					</div>
				) : (
					<p className="text-center text-blue-400 dark:text-blue-300">Loading...</p>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;

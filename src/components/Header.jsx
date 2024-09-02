import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/Auth';
import { UserIcon } from '@heroicons/react/24/outline';

const Header = () => {
	return (
		<header className="bg-blue-600 text-white shadow-md">
			<div className="container mx-auto flex justify-between items-center py-4 px-6">
				{/* Logo */}
				<Link to="/home" className="text-2xl font-bold hover:text-gray-300">
					Splitwise
				</Link>

				{/* Navigation Links */}
				<nav className="flex items-center space-x-6">
					<Link to="/home" className="hover:text-gray-300">
						Home
					</Link>

					{/* Profile Link */}
					<Link to="/profile" className="flex items-center hover:text-gray-300">
						<UserIcon className="h-6 w-6 mr-2" />
						<span>Profile</span>
					</Link>

					{/* Logout Button */}
					<button
						onClick={logout}
						className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
					>
						Logout
					</button>
				</nav>
			</div>
		</header>
	);
};

export default Header;

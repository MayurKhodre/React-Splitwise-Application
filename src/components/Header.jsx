import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/Auth';
import Tooltip from '@mui/material/Tooltip';
import { HomeIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

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
					{/* Home Icon with Tooltip */}
					<Tooltip title="Home" placement="bottom">
						<Link to="/home">
							<HomeIcon className="h-6 w-6 text-white hover:text-gray-300 transition duration-200" />
						</Link>
					</Tooltip>

					{/* Profile Icon with Tooltip */}
					<Tooltip title="Profile" placement="bottom">
						<Link to="/profile">
							<UserIcon className="h-6 w-6 text-white hover:text-gray-300 transition duration-200" />
						</Link>
					</Tooltip>

					{/* Logout Icon with Tooltip */}
					<Tooltip title="Logout" placement="bottom">
						<button onClick={logout} className="focus:outline-none">
							<ArrowLeftOnRectangleIcon className="h-6 w-6 text-white hover:text-gray-300 transition duration-200" />
						</button>
					</Tooltip>
				</nav>
			</div>
		</header>
	);
};

export default Header;

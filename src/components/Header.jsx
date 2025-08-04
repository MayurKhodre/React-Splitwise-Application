import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/Auth';
import Tooltip from '@mui/material/Tooltip';
import { HomeIcon, UserIcon, ArrowLeftOnRectangleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

// Use a ref to avoid hydration mismatch and always sync with <html>
const getInitialTheme = () => {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark') return true;
		if (stored === 'light') return false;
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	return false;
};

const Header = () => {
	const location = useLocation();
	const isFirstRender = useRef(true);
	const [darkMode, setDarkMode] = React.useState(getInitialTheme);

	// Always set <html> class and localStorage on mount and when darkMode changes
	useEffect(() => {
		const root = window.document.documentElement;
		if (darkMode) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [darkMode]);

	// On mount, sync state with <html> class if user toggled theme elsewhere
	useEffect(() => {
		if (!isFirstRender.current) return;
		isFirstRender.current = false;
		const root = window.document.documentElement;
		const isDark = root.classList.contains('dark');
		if (isDark !== darkMode) {
			setDarkMode(isDark);
		}
		const onStorage = (e) => {
			if (e.key === 'theme') {
				const newTheme = e.newValue;
				if (newTheme === 'dark') setDarkMode(true);
				if (newTheme === 'light') setDarkMode(false);
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
		// eslint-disable-next-line
	}, []);

	const toggleDarkMode = () => {
		setDarkMode((prev) => !prev);
	};

	const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

	return (
		<header className="bg-white/80 dark:bg-gray-900/90 backdrop-blur border-b border-blue-100 dark:border-gray-800 shadow-sm sticky top-0 z-40">
			<div className="container mx-auto flex justify-between items-center py-3 px-6">
				<Link to="/home" className="flex items-center gap-2 group">
					<img
						src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
						alt="Splitwise Logo"
						className="h-8 w-8 rounded shadow group-hover:scale-105 transition"
					/>
					<span className="text-xl font-semibold text-blue-800 dark:text-white tracking-tight group-hover:text-blue-600 transition">Splitwise</span>
				</Link>
				<nav className="flex items-center space-x-4">
					{/* Theme Toggle always visible */}
					<Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} placement="bottom">
						<button
							type="button"
							onClick={toggleDarkMode}
							className="focus:outline-none p-1 rounded hover:bg-blue-100 dark:hover:bg-gray-800 transition"
							aria-label="Toggle dark mode"
						>
							{darkMode ? (
								<SunIcon className="h-6 w-6 text-yellow-400" />
							) : (
								<MoonIcon className="h-6 w-6 text-blue-700" />
							)}
						</button>
					</Tooltip>
					{/* Only show navigation if not on login/signup */}
					{!isAuthPage && (
						<>
							{location.pathname !== '/home' && (
								<Tooltip title="Home" placement="bottom">
									<Link to="/home">
										<HomeIcon className="h-6 w-6 text-blue-700 dark:text-white hover:text-blue-900 dark:hover:text-blue-300 transition" />
									</Link>
								</Tooltip>
							)}
							{location.pathname !== '/profile' && (
								<Tooltip title="Profile" placement="bottom">
									<Link to="/profile">
										<UserIcon className="h-6 w-6 text-blue-700 dark:text-white hover:text-blue-900 dark:hover:text-blue-300 transition" />
									</Link>
								</Tooltip>
							)}
							<Tooltip title="Logout" placement="bottom">
								<button onClick={logout} className="focus:outline-none">
									<ArrowLeftOnRectangleIcon className="h-6 w-6 text-blue-700 dark:text-white hover:text-blue-900 dark:hover:text-blue-300 transition" />
								</button>
							</Tooltip>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;

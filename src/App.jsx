import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/LoginPage"
import Signup from "./pages/SignupPage"
import HomePage from './components/HomePage';
import PrivateRoute from './utils/PrivateRoute.jsx';

function App() {
	return (
		<Router>
			<div>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Login />} />
					<Route element={<PrivateRoute />}>
						<Route path="/home" element={<HomePage />} />
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;


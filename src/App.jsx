import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import HomePage from './components/HomePage';
import ExpenseForm from './components/ExpenseForm';
import PrivateRoute from './utils/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import CreateGroup from './pages/CreateGroup'; // Assuming you have a CreateGroup component
import GroupList from './pages/GroupList'; // Assuming you have a GroupList component
import GroupExpense from './pages/GroupExpense'; // Assuming you have a GroupExpense component

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
						<Route path="/expenses/create" element={<ExpenseForm mode="create" />} />
						<Route path="/expenses/:id/edit" element={<ExpenseForm mode="edit" />} />
						<Route path="/expenses/:id/view" element={<ExpenseForm mode="view" />} />
						<Route path="/profile" element={<ProfilePage />} />

						{/* Routes for groups */}
						<Route path="/create-group" element={<CreateGroup />} />
						<Route path="/groups" element={<GroupList />} />
						<Route path="/groups/:groupId/expenses" element={<GroupExpense />} />
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;

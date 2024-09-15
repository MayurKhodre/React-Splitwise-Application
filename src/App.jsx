import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import HomePage from './components/HomePage';
import ExpenseForm from './components/ExpenseForm';
import PrivateRoute from './utils/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import CreateGroup from './pages/CreateGroup';
import GroupList from './pages/GroupList';
import GroupExpense from './pages/GroupExpense';
import SelectMembersForGroup from './components/SelectMembersForGroup';
import GroupExpenseList from './components/GroupExpenseList';
import GroupExpenseForm from './components/GroupExpenseForm';

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
						<Route path="/groups/create" element={<SelectMembersForGroup />} />
						<Route path="/groups" element={<GroupList />} />
						<Route path="/groups/:groupId/expenses" element={<GroupExpense />} />
						<Route path="/group/:groupId/expenses" element={<GroupExpenseList />} />
						<Route path="/group/:groupId/expenses" element={<GroupExpenseList />} />
						<Route path="/group/:groupId/expenses/create" element={<GroupExpenseForm mode="create" />} />
						<Route path="/group/:groupId/expenses/:expenseId/edit" element={<GroupExpenseForm mode="edit" />} />
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;

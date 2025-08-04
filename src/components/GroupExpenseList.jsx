import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';

const GroupExpenseList = () => {
	const { groupId } = useParams();
	const [expenses, setExpenses] = useState([]);
	const [groupMembers, setGroupMembers] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchGroupExpenses();
		fetchGroupMembers();
	}, []);

	const fetchGroupExpenses = async () => {
		try {
			const response = await api.get(`/groups/${groupId}/expenses`);
			setExpenses(response.data.data);
		} catch (error) {
			console.error('Error fetching group expenses', error);
		}
	};

	const fetchGroupMembers = async () => {
		try {
			const response = await api.get(`/groups/${groupId}/members`);
			setGroupMembers(response.data.data);
		} catch (error) {
			console.error('Error fetching group members', error);
		}
	};

	const deleteExpense = async (expenseId) => {
		try {
			await api.delete(`/groups/${groupId}/delete/${expenseId}`);
			fetchGroupExpenses();
		} catch (error) {
			console.error('Error deleting expense', error);
		}
	};

	const getMemberNames = (memberIds) => {
		return memberIds
			.map((id) => {
				const member = groupMembers.find((member) => member._id === id);
				return member ? member.userName : 'Unknown';
			})
			.join(', ');
	};

	return (
		<div className="max-w-4xl mx-auto p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center">
					<button
						onClick={() => navigate('/groups')}
						className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400 focus:outline-none"
					>
						<ArrowLeftIcon className="h-6 w-6" />
					</button>
					<h1 className="text-3xl font-extrabold text-blue-800 dark:text-blue-200 ml-4 drop-shadow">Group Expenses</h1>
				</div>
				<button
					onClick={() => navigate(`/group/${groupId}/expenses/create`)}
					className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-xl shadow font-bold text-lg transition"
				>
					+ Add Group Expense
				</button>
			</div>
			{expenses.length === 0 ? (
				<div className="text-center text-blue-400 dark:text-blue-300 text-lg font-medium py-10">
					<p>No expenses found.</p>
					<p>Click "Add Group Expense" to get started!</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{expenses.map((expense) => (
						<div
							key={expense._id}
							className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-md border border-blue-100 dark:border-gray-700 hover:shadow-xl transition"
						>
							<h2 className="text-xl font-bold text-blue-900 dark:text-blue-200">{expense.description}</h2>
							<p className="text-blue-700 dark:text-blue-300 mt-1">Total Amount: <span className="font-semibold">₹{expense.amount}</span></p>
							<p className="text-blue-700 dark:text-blue-300 mt-1">Amount per person: <span className="font-semibold">₹{(expense.amount / expense.splitBetween.length).toFixed(2)}</span></p>
							<p className="text-blue-700 dark:text-blue-300 mt-1">
								Members involved: <span className="font-semibold">{getMemberNames(expense.splitBetween)}</span>
							</p>
							<div className="mt-4 flex space-x-4">
								<Link
									to={`/group/${groupId}/expenses/${expense._id}/edit`}
									className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
								>
									Edit
								</Link>
								<button
									onClick={() => deleteExpense(expense._id)}
									className="bg-gradient-to-r from-red-500 to-red-700 dark:from-red-800 dark:to-red-900 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default GroupExpenseList;

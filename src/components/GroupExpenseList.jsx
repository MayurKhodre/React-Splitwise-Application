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
		<div className="max-w-4xl mx-auto p-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center">
					<button
						onClick={() => navigate('/groups')}
						className="text-gray-600 hover:text-gray-900 focus:outline-none"
					>
						<ArrowLeftIcon className="h-6 w-6" />
					</button>
					<h1 className="text-3xl font-bold text-gray-800 ml-4">Group Expenses</h1>
				</div>
				<button
					onClick={() => navigate(`/group/${groupId}/expenses/create`)}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition duration-200"
				>
					+ Add Group Expense
				</button>
			</div>

			{expenses.length === 0 ? (
				<div className="text-center text-gray-500">
					<p className="text-lg">No expenses found.</p>
					<p>Click "Add Expense" to get started!</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6">
					{expenses.map((expense) => (
						<div
							key={expense._id}
							className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
						>
							<h2 className="text-xl font-semibold text-gray-800">{expense.description}</h2>
							<p className="text-gray-600 mt-1">Total Amount: <span className="font-medium">₹{expense.amount}</span></p>
							<p className="text-gray-600 mt-1">Amount per person: <span className="font-medium">₹{(expense.amount / expense.splitBetween.length).toFixed(2)}</span></p>
							<p className="text-gray-600 mt-1">
								Members involved: <span className="font-medium">{getMemberNames(expense.splitBetween)}</span>
							</p>
							<div className="mt-4 flex space-x-4">
								<Link
									to={`/group/${groupId}/expenses/${expense._id}/edit`}
									className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm shadow-sm transition duration-200"
								>
									Edit
								</Link>
								<button
									onClick={() => deleteExpense(expense._id)}
									className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm shadow-sm transition duration-200"
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

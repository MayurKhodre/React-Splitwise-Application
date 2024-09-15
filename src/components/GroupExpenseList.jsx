import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';  // Import ArrowLeftIcon
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
			console.log('GroupExpenseList response: ', response.data.data);
			setExpenses(response.data.data);
		} catch (error) {
			console.error("Error fetching group expenses", error);
		}
	};

	const fetchGroupMembers = async () => {
		try {
			const response = await api.get(`/groups/${groupId}/members`);
			setGroupMembers(response.data.data);
		} catch (error) {
			console.error("Error fetching group members", error);
		}
	};

	const deleteExpense = async (expenseId) => {
		try {
			await api.delete(`/expense/delete/${expenseId}`);
			fetchGroupExpenses();
		} catch (error) {
			console.error("Error deleting expense", error);
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
			<div className="flex items-center mb-6">
				<button onClick={() => navigate('/groups')} className="text-gray-700 hover:text-gray-900">
					<ArrowLeftIcon className="h-6 w-6" /> {/* Back button */}
				</button>
				<h1 className="text-3xl font-bold ml-4">Group Expenses</h1>
			</div>

			<button
				onClick={() => navigate(`/group/${groupId}/expenses/create`)}
				className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
			>
				Add New Expense
			</button>

			{expenses.length === 0 ? (
				<div>No expenses found.</div>
			) : (
				<ul className="space-y-4">
					{expenses.map((expense) => (
						<li key={expense._id} className="p-4 bg-gray-100 rounded-md shadow-sm">
							<h2 className="text-lg font-semibold">{expense.description}</h2>
							<p>Amount: ₹{expense.amount}</p>
							<p>Members involved: {getMemberNames(expense.splitBetween)}</p>
							<div className="mt-2">
								<Link to={`/group/${groupId}/expenses/${expense._id}/edit`} className="text-blue-500">Edit</Link>
								<button
									onClick={() => deleteExpense(expense._id)}
									className="text-red-500 ml-4"
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default GroupExpenseList;

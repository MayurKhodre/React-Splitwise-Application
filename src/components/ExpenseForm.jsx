import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import api from '../utils/Api';

const ExpenseForm = ({ mode = 'create' }) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [expense, setExpense] = useState({ description: '', amount: '' });
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			const fetchExpense = async () => {
				try {
					const response = await api.get(`http://localhost:8000/api/v1/expense/get-expense/${id}`);
					const fetchedExpense = response.data.data;
					setExpense({
						description: fetchedExpense.description || '',
						amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
					});
				} catch (error) {
					console.error('Error fetching expense:', error);
				}
			};

			fetchExpense();
		}
	}, [id, mode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setExpense((prevExpense) => ({
			...prevExpense,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (mode === 'create') {
				await api.post('http://localhost:8000/api/v1/expense/add-expense', expense);
			} else if (mode === 'edit') {
				await api.put(`http://localhost:8000/api/v1/expense/edit-expense/${id}`, expense);
			}
			navigate('/home');
		} catch (error) {
			console.error('Error submitting form:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
			<div className="flex items-center justify-between mb-6">
				<button onClick={() => navigate('/home')} className="text-gray-700 hover:text-gray-900">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-semibold text-center">
					{mode === 'create' ? 'Create Expense' : mode === 'edit' ? 'Edit Expense' : 'View Expense'}
				</h1>
				<div></div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex flex-col">
					<label htmlFor="description" className="text-gray-700 font-medium mb-2">Description</label>
					<input
						id="description"
						type="text"
						name="description"
						value={expense.description}
						onChange={handleChange}
						disabled={mode === 'view'}
						className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="amount" className="text-gray-700 font-medium mb-2">Amount</label>
					<input
						id="amount"
						type="number"
						name="amount"
						value={expense.amount}
						onChange={handleChange}
						disabled={mode === 'view'}
						className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{mode !== 'view' && (
					<button
						type="submit"
						disabled={isLoading}
						className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
					</button>
				)}
			</form>
		</div>
	);
};

export default ExpenseForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const ExpenseForm = ({ mode = 'create' }) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [expense, setExpense] = useState({ description: '', amount: '' });
	const [originalExpense, setOriginalExpense] = useState(null); // For edit mode to track changes
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('error');
	const [isFormModified, setIsFormModified] = useState(false); // Tracks if the form has been modified

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			const fetchExpense = async () => {
				try {
					const response = await api.get(`/expense/get-expense/${id}`);
					const fetchedExpense = response.data.data;
					setExpense({
						description: fetchedExpense.description || '',
						amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
					});
					setOriginalExpense({
						description: fetchedExpense.description || '',
						amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
					});
				} catch (error) {
					console.error('Error fetching expense:', error);
					showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch the expense.', 'error');
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

		if (mode === 'edit') {
			// Check if form values differ from original values
			setIsFormModified(
				value !== originalExpense[name]
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (mode === 'create') {
				await api.post('/expense/add-expense', expense);
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense created successfully!', 'success');
			} else if (mode === 'edit') {
				await api.put(`/expense/edit-expense/${id}`, expense);
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense updated successfully!', 'success');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to submit the expense. Please try again.', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	const isSubmitDisabled = () => {
		if (mode === 'create') {
			return !expense.description || !expense.amount;
		}
		if (mode === 'edit') {
			return !isFormModified; // Disabled until the form is modified
		}
		return false;
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate('/home');
		}
	};

	return (
		<div className="max-w-md mx-auto mt-12 p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
			<div className="flex items-center justify-between mb-8">
				<button onClick={() => navigate('/home')} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center drop-shadow">
					{mode === 'create' ? 'Create Expense' : mode === 'edit' ? 'Edit Expense' : 'View Expense'}
				</h1>
				<div></div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="flex flex-col">
					<label htmlFor="description" className="text-blue-700 dark:text-blue-200 font-semibold mb-2">Description</label>
					<input
						id="description"
						type="text"
						name="description"
						value={expense.description}
						onChange={handleChange}
						disabled={mode === 'view'}
						className="px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="amount" className="text-blue-700 dark:text-blue-200 font-semibold mb-2">Amount</label>
					<input
						id="amount"
						type="number"
						name="amount"
						value={expense.amount}
						onChange={handleChange}
						disabled={mode === 'view'}
						className="px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
					/>
				</div>
				{mode !== 'view' && (
					<button
						type="submit"
						disabled={isSubmitDisabled() || isLoading}
						className={`w-full px-4 py-3 text-white rounded-xl font-bold text-lg ${isSubmitDisabled() || isLoading
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition'
							}`}
					>
						{isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
					</button>
				)}
			</form>
			<Modal
				isOpen={isModalOpen}
				message={modalMessage}
				type={modalType}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default ExpenseForm;

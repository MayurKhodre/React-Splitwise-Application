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
					const response = await api.get(`http://localhost:8000/api/v1/expense/get-expense/${id}`);
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
				await api.post('http://localhost:8000/api/v1/expense/add-expense', expense);
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense created successfully!', 'success');
			} else if (mode === 'edit') {
				await api.put(`http://localhost:8000/api/v1/expense/edit-expense/${id}`, expense);
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
						disabled={isSubmitDisabled() || isLoading} // Disable based on form state
						className={`w-full px-4 py-2 text-white rounded-lg ${isSubmitDisabled() || isLoading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
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

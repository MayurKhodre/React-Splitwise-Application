import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpenseListItem from './ExpenseListItem';
import Modal from './Modal';
import { showModal } from '../utils/ModalUtils';
import api from '../utils/Api';
import Header from './Header';

const HomePage = () => {
	const [expenses, setExpenses] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('success');
	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	useEffect(() => {
		fetchExpenses();
	}, []);

	const fetchExpenses = async () => {
		try {
			const response = await api.get('/expense', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			setExpenses(response.data.data);
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch expenses.', 'error');
		}
	};

	const confirmDelete = (expenseId) => {
		setConfirmDeleteId(expenseId);
		setIsConfirmModalOpen(true);
	};

	const handleDelete = async () => {
		try {
			await api.delete(`/expense/delete-expense/${confirmDeleteId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense deleted successfully!', 'success');
			setIsConfirmModalOpen(false);
			fetchExpenses();
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to delete expense.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleCloseConfirmModal = () => {
		setIsConfirmModalOpen(false);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Header />

			<div className="container mx-auto p-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold text-gray-800">Your Expenses</h1>
					<div className="flex space-x-4">
						<Link
							to="/expenses/create"
							className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
						>
							Create New Expense
						</Link>

						{/* Link to Create Group */}
						<Link to="/groups/create" className="ml-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
							Create Group
						</Link>

						{/* Link to View Groups */}
						<Link
							to="/groups"
							className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
						>
							View Groups
						</Link>
					</div>
				</div>

				{expenses.length === 0 ? (
					<div className="text-center text-gray-500 text-lg">No expenses found.</div>
				) : (
					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<ul className="divide-y divide-gray-200">
							{expenses.map((expense) => (
								<ExpenseListItem
									key={expense._id}
									expense={expense}
									onDelete={() => confirmDelete(expense._id)}
								/>
							))}
						</ul>
					</div>
				)}

				<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />

				{isConfirmModalOpen && (
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
							<h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this expense?</h2>
							<div className="flex justify-end space-x-4">
								<button
									onClick={handleCloseConfirmModal}
									className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleDelete}
									className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;

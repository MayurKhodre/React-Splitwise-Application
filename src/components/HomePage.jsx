import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpenseListItem from './ExpenseListItem';
import Modal from './Modal';
import { showModal } from '../utils/ModalUtils';
import api from '../utils/Api';

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
		<div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-200 drop-shadow">Your Expenses</h1>
					<div className="flex space-x-3">
						<Link
							to="/expenses/create"
							className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-5 rounded-xl shadow hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition"
						>
							+ New Expense
						</Link>
						<Link
							to="/groups/create"
							className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-5 rounded-xl shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition"
						>
							+ New Group
						</Link>
						<Link
							to="/groups"
							className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-5 rounded-xl shadow hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 transition"
						>
							View Groups
						</Link>
					</div>
				</div>
				<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
					{expenses.length === 0 ? (
						<div className="text-center text-blue-400 dark:text-blue-300 text-lg font-medium py-10">No expenses found.</div>
					) : (
						<ul className="divide-y divide-blue-100 dark:divide-gray-700">
							{expenses.map((expense) => (
								<ExpenseListItem
									key={expense._id}
									expense={expense}
									onDelete={() => confirmDelete(expense._id)}
								/>
							))}
						</ul>
					)}
				</div>
				<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
				{isConfirmModalOpen && (
					<Modal
						isOpen={isConfirmModalOpen}
						message="Are you sure you want to delete this expense?"
						type="warning"
						onClose={handleCloseConfirmModal}
						onConfirm={handleDelete}
					/>
				)}
			</div>
		</div>
	);
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ExpenseListItem from './ExpenseListItem';
import Modal from './Modal';
import { showModal } from '../utils/ModalUtils';

const HomePage = () => {
	const [expenses, setExpenses] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('success');
	const navigate = useNavigate();

	useEffect(() => {
		fetchExpenses();
	}, []);

	const fetchExpenses = async () => {
		try {
			console.log('authToken: ', localStorage.getItem('authToken'));
			const response = await axios.get('http://localhost:8000/api/v1/expense', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			// console.log('response of fetchExpenses: ', response.data.data);
			setExpenses(response.data.data);
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch expenses.', 'error');
		}
		console.log('fetchExpensed called');
	};

	const handleDelete = async (expenseId) => {
		try {
			await axios.delete(`/api/expenses/${expenseId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			});
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense deleted successfully!', 'success');
			fetchExpenses(); // Refresh the list after deletion
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to delete expense.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Your Expenses</h1>
			<div className="flex justify-end mb-4">
				<Link
					to="/expenses/create"
					className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
				>
					Create New Expense
				</Link>
			</div>
			<div className="bg-white shadow overflow-hidden sm:rounded-lg">
				<ul className="divide-y divide-gray-200">
					{expenses.map((expense) => (
						<ExpenseListItem
							key={expense.id}
							expense={expense}
							onDelete={handleDelete}
						/>
					))}
				</ul>
			</div>
			<Modal
				isOpen={isModalOpen}
				message={modalMessage}
				type={modalType}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default HomePage;

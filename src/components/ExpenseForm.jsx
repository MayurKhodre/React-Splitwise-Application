import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from './Modal';
import { showModal } from '../utils/ModalUtils';

const ExpenseForm = ({ mode = 'create' }) => {
	const [formData, setFormData] = useState({
		name: '',
		amount: '',
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('success');
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (mode === 'edit') {
			fetchExpense();
		}
	}, [mode, id]);

	const fetchExpense = async () => {
		try {
			const response = await axios.get(`/api/expenses/${id}`);
			setFormData(response.data.expense);
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch expense details.', 'error');
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (mode === 'create') {
				await axios.post('/api/expenses', formData);
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense created successfully!', 'success');
			} else {
				await axios.put(`/api/expenses/${id}`, formData);
				showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense updated successfully!', 'success');
			}
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to save expense.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate('/home');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">{mode === 'create' ? 'Create' : 'Edit'} Expense</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="name">
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter expense name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 mb-2" htmlFor="amount">
							Amount
						</label>
						<input
							type="number"
							id="amount"
							name="amount"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter amount"
							value={formData.amount}
							onChange={handleChange}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						{mode === 'create' ? 'Create' : 'Save'} Expense
					</button>
				</form>
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

export default ExpenseForm;

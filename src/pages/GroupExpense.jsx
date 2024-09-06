import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const GroupExpense = () => {
	const { groupId } = useParams();
	const navigate = useNavigate();

	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('error');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await api.post(`/group/${groupId}/create-expense`, {
				description,
				amount,
			});
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Expense added successfully!', 'success');
			setTimeout(() => {
				navigate(`/group/${groupId}/expenses`);
			}, 2000);
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to add expense. Please try again.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate(`/group/${groupId}/expenses`);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
			<div className="flex items-center justify-between mb-6">
				<button onClick={() => navigate('/home')} className="text-gray-700 hover:text-gray-900">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-semibold text-center">Add Expense</h1>
				<div></div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="description" className="block text-gray-700 font-medium">Description</label>
					<input
						id="description"
						type="text"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter expense description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="amount" className="block text-gray-700 font-medium">Amount</label>
					<input
						id="amount"
						type="number"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
					Add Expense
				</button>
			</form>

			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default GroupExpense;

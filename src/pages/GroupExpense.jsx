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
		<div className="max-w-md mx-auto mt-12 p-10 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 animate-fadeIn">
			<div className="flex items-center justify-between mb-8">
				<button onClick={() => navigate('/home')} className="text-blue-600 hover:text-blue-800">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-extrabold text-blue-800 text-center drop-shadow">Add Expense</h1>
				<div></div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-8">
				<div>
					<label htmlFor="description" className="block text-blue-700 font-semibold mb-2">Description</label>
					<input
						id="description"
						type="text"
						className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
						placeholder="Enter expense description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="amount" className="block text-blue-700 font-semibold mb-2">Amount</label>
					<input
						id="amount"
						type="number"
						className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
						placeholder="Enter amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition">
					Add Expense
				</button>
			</form>
			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default GroupExpense;

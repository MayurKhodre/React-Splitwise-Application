// GroupExpenseList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const GroupExpenseList = () => {
	const { groupId } = useParams();
	const navigate = useNavigate();
	const [expenses, setExpenses] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('error');

	useEffect(() => {
		fetchGroupExpenses();
	}, [groupId]);

	const fetchGroupExpenses = async () => {
		try {
			const response = await api.get(`/groups/${groupId}/expenses`);
			setExpenses(response.data.data);
			console.log('groupExpenses: ', response.data.data);
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch group expenses.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
			<div className="flex items-center justify-between mb-6">
				<button onClick={() => navigate('/home')} className="text-gray-700 hover:text-gray-900">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-3xl font-semibold text-center">Group Expenses</h1>
				<div></div>
			</div>

			{expenses.length === 0 ? (
				<div className="text-center text-gray-500">No expenses found for this group.</div>
			) : (
				<ul className="space-y-4">
					{expenses.map((expense) => (
						<li key={expense._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
							<h2 className="text-xl font-semibold">{expense.description}</h2>
							<p>Amount: ₹{expense.amount}</p>
						</li>
					))}
				</ul>
			)}

			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default GroupExpenseList;

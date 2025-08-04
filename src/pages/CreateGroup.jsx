import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const CreateGroup = () => {
	const [groupName, setGroupName] = useState('');
	const [memberIds, setMemberIds] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('error');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const membersArray = memberIds.split(',').map((id) => id.trim());

		try {
			await api.post('/group/create-group', {
				name: groupName,
				members: membersArray,
			});
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Group created successfully!', 'success');
			setTimeout(() => {
				navigate('/groups');
			}, 2000);
		} catch (error) {
			showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to create group. Please try again.', 'error');
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate('/groups');
		}
	};

	return (
		<div className="max-w-md mx-auto mt-12 p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
			<div className="flex items-center justify-between mb-8">
				<button onClick={() => navigate('/home')} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center drop-shadow">Create a New Group</h1>
				<div></div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="groupName" className="block text-blue-700 dark:text-blue-200 font-semibold mb-2">Group Name</label>
					<input
						id="groupName"
						type="text"
						className="w-full px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
						placeholder="Enter group name"
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="memberIds" className="block text-blue-700 dark:text-blue-200 font-semibold mb-2">Member IDs (comma-separated)</label>
					<input
						id="memberIds"
						type="text"
						className="w-full px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
						placeholder="Enter member IDs"
						value={memberIds}
						onChange={(e) => setMemberIds(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition">
					Create Group
				</button>
			</form>
			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default CreateGroup;

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
		<div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
			<div className="flex items-center justify-between mb-6">
				<button onClick={() => navigate('/home')} className="text-gray-700 hover:text-gray-900">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-semibold text-center">Create a New Group</h1>
				<div></div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="groupName" className="block text-gray-700 font-medium">Group Name</label>
					<input
						id="groupName"
						type="text"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter group name"
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="memberIds" className="block text-gray-700 font-medium">Member IDs (comma-separated)</label>
					<input
						id="memberIds"
						type="text"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter member IDs"
						value={memberIds}
						onChange={(e) => setMemberIds(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
					Create Group
				</button>
			</form>

			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default CreateGroup;

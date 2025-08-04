import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';

const SelectMembersForGroup = () => {
	const navigate = useNavigate();
	const [members, setMembers] = useState([]);
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [groupName, setGroupName] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('success');

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const response = await api.get('/users/get-all-users', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				});
				setMembers(response.data.data);
				console.log('token: ', localStorage.getItem('authToken'));
				console.log('member list: ', response);
			} catch (error) {
				console.error('Error fetching members:', error);
			}
		};

		fetchMembers();
	}, []);

	const handleMemberToggle = (id) => {
		setSelectedMembers((prev) =>
			prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
		);
	};

	const handleCreateGroup = async () => {
		if (groupName && selectedMembers.length >= 2) {
			console.log('selectedMembers: ', selectedMembers);
			try {
				await api.post('/groups', {
					name: groupName,
					memberIds: selectedMembers,
				});
				setModalMessage('Group created successfully!');
				setModalType('success');
				setIsModalOpen(true);
			} catch (error) {
				console.error('Error creating group:', error);
				setModalMessage('Failed to create group.');
				setModalType('error');
				setIsModalOpen(true);
			}
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (modalType === 'success') {
			navigate('/home');
		}
	};

	return (
		<div className="max-w-lg mx-auto mt-12 p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
			<div className="flex items-center justify-between mb-8">
				<button onClick={() => navigate('/home')} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center drop-shadow">Create Group</h1>
				<div></div>
			</div>
			<div className="mb-6">
				<label className="block text-blue-700 dark:text-blue-200 mb-2 font-semibold" htmlFor="groupName">Group Name</label>
				<input
					type="text"
					id="groupName"
					className="w-full px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
					placeholder="Enter group name"
				/>
			</div>
			<div className="mb-8">
				<h2 className="text-lg font-bold text-blue-700 dark:text-blue-200 mb-4">Select Members</h2>
				<ul className="divide-y divide-blue-100 dark:divide-gray-700 max-h-60 overflow-y-auto bg-blue-50 dark:bg-gray-900 rounded-xl p-2">
					{members.map((member) => (
						<li key={member._id} className="flex items-center justify-between py-2 px-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded transition">
							<span className="font-medium text-blue-900 dark:text-blue-100">{member.userName}</span>
							<input
								type="checkbox"
								checked={selectedMembers.includes(member._id)}
								onChange={() => handleMemberToggle(member._id)}
								className="form-checkbox h-5 w-5 text-blue-600"
							/>
						</li>
					))}
				</ul>
			</div>
			<button
				onClick={handleCreateGroup}
				disabled={!groupName || selectedMembers.length < 2}
				className={`w-full py-3 text-white rounded-xl font-bold text-lg ${!groupName || selectedMembers.length < 2
					? 'bg-gray-400 cursor-not-allowed'
					: 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition'
					}`}
			>
				Create Group
			</button>
			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default SelectMembersForGroup;

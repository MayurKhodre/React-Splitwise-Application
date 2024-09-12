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
		<div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
			<div className="flex items-center justify-between mb-6">
				<button onClick={() => navigate('/home')} className="text-gray-700 hover:text-gray-900">
					<ArrowLeftIcon className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-semibold text-center">Create Group</h1>
				<div></div>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700 mb-2" htmlFor="groupName">Group Name</label>
				<input
					type="text"
					id="groupName"
					className="w-full px-4 py-2 border rounded-lg"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
					placeholder="Enter group name"
				/>
			</div>

			<div className="mb-6">
				<h2 className="text-lg font-semibold text-gray-700 mb-4">Select Members</h2>
				<ul className="divide-y divide-gray-200">
					{members.map((member) => (
						<li key={member._id} className="flex items-center justify-between py-2">
							<span>{member.userName}</span>
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
				className={`w-full py-2 text-white rounded-lg ${!groupName || selectedMembers.length < 2
					? 'bg-gray-400 cursor-not-allowed'
					: 'bg-blue-500 hover:bg-blue-600 transition'
					}`}
			>
				Create Group
			</button>

			<Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
		</div>
	);
};

export default SelectMembersForGroup;

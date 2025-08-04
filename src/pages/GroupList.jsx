import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('error');
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const userEmail = localStorage.getItem('userEmail');
        try {
            const response = await api.get(`/groups/${userEmail}`);
            setGroups(response.data.data);
        } catch (error) {
            showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch groups.', 'error');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/home')}
                    className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-semibold text-center">Your Groups</h1>
                <div></div>
            </div>
            {groups.length === 0 ? (
                <div className="text-center text-gray-500">No groups found. Create a group to get started!</div>
            ) : (
                <ul className="space-y-4">
                    {groups.map((group) => (
                        <li
                            key={group._id}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
                                <p className="text-gray-600 text-sm">Members: {group.members?.length || 0}</p>
                            </div>
                            <Link
                                to={`/group/${group._id}/expenses`}
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition"
                            >
                                <EyeIcon className="h-5 w-5" />
                                <span>View Expenses</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <Modal isOpen={isModalOpen} message={modalMessage} type={modalType} onClose={handleCloseModal} />
        </div>
    );
};

export default GroupList;

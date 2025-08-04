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
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/home')}
                    className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400 flex items-center gap-2"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-extrabold text-blue-800 dark:text-blue-200 text-center drop-shadow">Your Groups</h1>
                <div></div>
            </div>
            {groups.length === 0 ? (
                <div className="text-center text-blue-400 dark:text-blue-300 font-medium py-10">No groups found. Create a group to get started!</div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups.map((group) => (
                        <li
                            key={group._id}
                            className="flex flex-col justify-between p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-md border border-blue-100 dark:border-gray-700 hover:shadow-xl transition"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200">{group.name}</h2>
                                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Members: {group.members?.length || 0}</p>
                            </div>
                            <Link
                                to={`/group/${group._id}/expenses`}
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400 mt-4 font-semibold transition"
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

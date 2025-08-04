import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const GroupExpenseForm = ({ mode = 'create' }) => {
    const { groupId, expenseId } = useParams();
    const navigate = useNavigate();

    const [expense, setExpense] = useState({ description: '', amount: '', members: [] });
    const [originalExpense, setOriginalExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('error');
    const [isFormModified, setIsFormModified] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await api.get(`/groups/${groupId}/members`);
                setGroupMembers(response.data.data);
            } catch (error) {
                showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch group members.', 'error');
            }
        };

        if (mode === 'edit' || mode === 'view') {
            const fetchExpense = async () => {
                try {
                    const response = await api.get(`/groups/${groupId}/${expenseId}`); // Use expenseId here
                    const fetchedExpense = response.data.data;
                    setExpense({
                        description: fetchedExpense.description || '',
                        amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
                        members: fetchedExpense.splitBetween || [],
                    });
                    setOriginalExpense({
                        description: fetchedExpense.description || '',
                        amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
                        members: fetchedExpense.splitBetween || [],
                    });
                } catch (error) {
                    console.error('Error fetching expense:', error);
                    showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch the expense.', 'error');
                }
            };
            fetchExpense();
        }

        fetchGroupMembers();
    }, [groupId, expenseId, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense((prevExpense) => ({
            ...prevExpense,
            [name]: name === 'amount' ? parseFloat(value) : value,  // Convert amount to a number
        }));

        if (mode === 'edit') {
            setIsFormModified(
                value !== originalExpense[name]
            );
        }
    };

    const handleMemberChange = (memberId) => {
        setExpense((prevExpense) => {
            const isChecked = prevExpense.members.includes(memberId);
            return {
                ...prevExpense,
                members: isChecked
                    ? prevExpense.members.filter((id) => id !== memberId)
                    : [...prevExpense.members, memberId],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Assuming you have the logged-in user's ID stored in localStorage (or any other place)
        const userId = localStorage.getItem('userId'); // Replace this with your actual logic to get the user's ID

        try {
            // Rename members to splitBetween for the request payload
            const expenseData = {
                ...expense,
                paidBy: userId,  // Add the paidBy field
                splitBetween: expense.members  // Rename members to splitBetween
            };

            // Remove the original members key if it should not be sent
            delete expenseData.members;

            if (mode === 'create') {
                console.log('group expense: ', expenseData);
                await api.post(`/groups/${groupId}/expenses`, expenseData);
                showModal(setModalMessage, setModalType, setIsModalOpen, 'Group expense created successfully!', 'success');
            } else if (mode === 'edit') {
                await api.put(`/groups/${groupId}/edit/${expenseId}`, expenseData); 
                showModal(setModalMessage, setModalType, setIsModalOpen, 'Group expense updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to submit the expense. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = () => {
        if (mode === 'create') {
            return !expense.description || isNaN(expense.amount) || expense.members.length === 0;
        }
        if (mode === 'edit') {
            return !isFormModified;
        }
        return false;
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (modalType === 'success') {
            navigate(`/group/${groupId}/expenses`);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-blue-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(`/group/${groupId}/expenses`)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center drop-shadow">
                    {mode === 'create' ? 'Create Group Expense' : mode === 'edit' ? 'Edit Group Expense' : 'View Group Expense'}
                </h1>
                <div></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-blue-700 dark:text-blue-200 font-semibold mb-2">Description</label>
                    <input
                        id="description"
                        type="text"
                        name="description"
                        value={expense.description}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="amount" className="text-blue-700 dark:text-blue-200 font-semibold mb-2">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={expense.amount}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="px-4 py-3 border-2 border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-900 dark:text-gray-100"
                        step="0.01"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-blue-700 dark:text-blue-200 font-semibold mb-2">Select Members</label>
                    <div className="border-2 border-blue-200 dark:border-gray-700 rounded-xl max-h-60 overflow-y-auto px-4 py-2 bg-blue-50 dark:bg-gray-900">
                        {groupMembers.length > 0 ? (
                            groupMembers.map((member) => (
                                <div key={member._id} className="flex items-center py-2 border-b last:border-none border-gray-200 dark:border-gray-700">
                                    <input
                                        type="checkbox"
                                        id={`member-${member._id}`}
                                        name="members"
                                        checked={expense.members.includes(member._id)}
                                        onChange={() => handleMemberChange(member._id)}
                                        disabled={mode === 'view'}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label
                                        htmlFor={`member-${member._id}`}
                                        className="ml-2 text-blue-900 dark:text-blue-100"
                                    >
                                        {member.userName}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="text-blue-400 dark:text-blue-300">No members available.</p>
                        )}
                    </div>
                </div>
                {mode !== 'view' && (
                    <button
                        type="submit"
                        disabled={isSubmitDisabled() || isLoading}
                        className={`w-full px-4 py-3 text-white rounded-xl font-bold text-lg ${isSubmitDisabled() || isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition'
                            }`}
                    >
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
                    </button>
                )}
            </form>
            <Modal
                isOpen={isModalOpen}
                message={modalMessage}
                type={modalType}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default GroupExpenseForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../utils/Api';
import Modal from '../components/Modal';
import { showModal } from '../utils/ModalUtils';

const GroupExpenseForm = ({ mode = 'create' }) => {
    const { groupId } = useParams();
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
                    const response = await api.get(`/expense/get-expense/${groupId}`);
                    const fetchedExpense = response.data.data;
                    setExpense({
                        description: fetchedExpense.description || '',
                        amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
                        members: fetchedExpense.members || [],
                    });
                    setOriginalExpense({
                        description: fetchedExpense.description || '',
                        amount: fetchedExpense.amount !== undefined ? fetchedExpense.amount : 0,
                        members: fetchedExpense.members || [],
                    });
                } catch (error) {
                    console.error('Error fetching expense:', error);
                    showModal(setModalMessage, setModalType, setIsModalOpen, 'Failed to fetch the expense.', 'error');
                }
            };
            fetchExpense();
        }

        fetchGroupMembers();
    }, [groupId, mode]);

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
                await api.put(`/expense/edit-expense/${groupId}`, expenseData);
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
        <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate(`/group/${groupId}/expenses`)} className="text-gray-700 hover:text-gray-900">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-semibold text-center">
                    {mode === 'create' ? 'Create Group Expense' : mode === 'edit' ? 'Edit Group Expense' : 'View Group Expense'}
                </h1>
                <div></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-gray-700 font-medium mb-2">Description</label>
                    <input
                        id="description"
                        type="text"
                        name="description"
                        value={expense.description}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="amount" className="text-gray-700 font-medium mb-2">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={expense.amount}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.01"  // Allows decimal input
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-2">Select Members</label>
                    <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto px-4 py-2">
                        {groupMembers.length > 0 ? (
                            groupMembers.map((member) => (
                                <div key={member._id} className="flex items-center py-2 border-b last:border-none">
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
                                        className="ml-2 text-gray-700"
                                    >
                                        {member.userName}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No members available.</p>
                        )}
                    </div>
                </div>

                {mode !== 'view' && (
                    <button
                        type="submit"
                        disabled={isSubmitDisabled() || isLoading}
                        className={`w-full px-4 py-2 text-white rounded-lg ${isSubmitDisabled() || isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
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

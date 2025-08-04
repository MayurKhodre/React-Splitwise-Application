import React from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Tooltip from '@mui/material/Tooltip';

const ExpenseListItem = ({ expense, onDelete }) => {
	return (
		<li className="px-6 py-4 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-blue-100 dark:border-gray-700 rounded-xl mb-4 shadow hover:shadow-lg transition">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">{expense.description}</h3>
					<p className="text-blue-700 dark:text-blue-300 text-sm font-medium">₹{expense.amount}</p>
				</div>
				<div className="flex items-center space-x-3">
					<Tooltip title="View">
						<Link to={`/expenses/${expense._id}/view`}>
							<EyeIcon className="h-6 w-6 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition" />
						</Link>
					</Tooltip>
					<Tooltip title="Edit">
						<Link to={`/expenses/${expense._id}/edit`}>
							<PencilIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-300 hover:text-yellow-700 dark:hover:text-yellow-400 transition" />
						</Link>
					</Tooltip>
					<Tooltip title="Delete">
						<button
							onClick={() => onDelete(expense._id)}
							className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
						>
							<TrashIcon className="h-6 w-6" />
						</button>
					</Tooltip>
				</div>
			</div>
		</li>
	);
};

export default ExpenseListItem;

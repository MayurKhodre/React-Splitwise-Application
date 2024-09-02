import React from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import Heroicons
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip from Material-UI

const ExpenseListItem = ({ expense, onDelete }) => {
	return (
		<li className="px-4 py-4 sm:px-6 bg-gray-50 border border-gray-200 rounded-lg mb-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
					<p className="text-gray-700 text-sm">₹{expense.amount}</p>
				</div>
				<div className="flex items-center space-x-4">
					<Tooltip title="View">
						<Link to={`/expenses/${expense._id}/view`}>
							<EyeIcon className="h-6 w-6 text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out" />
						</Link>
					</Tooltip>
					<Tooltip title="Edit">
						<Link to={`/expenses/${expense._id}/edit`}>
							<PencilIcon className="h-6 w-6 text-yellow-600 hover:text-yellow-800 transition duration-150 ease-in-out" />
						</Link>
					</Tooltip>
					<Tooltip title="Delete">
						<button
							onClick={() => onDelete(expense._id)}
							className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
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

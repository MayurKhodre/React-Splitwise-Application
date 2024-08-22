import React from 'react';
import { Link } from 'react-router-dom';

const ExpenseListItem = ({ expense, onDelete }) => {
	return (
		<li className="px-4 py-4 sm:px-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-medium text-gray-900">{expense.name}</h3>
					<p className="text-gray-600">${expense.amount}</p>
				</div>
				<div className="flex items-center">
					<Link to={`/expenses/${expense.id}`} className="text-blue-500 hover:underline mr-4">
						View
					</Link>
					<Link to={`/expenses/${expense.id}/edit`} className="text-yellow-500 hover:underline mr-4">
						Edit
					</Link>
					<button onClick={() => onDelete(expense.id)} className="text-red-500 hover:underline">
						Delete
					</button>
				</div>
			</div>
		</li>
	);
};

export default ExpenseListItem;

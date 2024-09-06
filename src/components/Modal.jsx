import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, message, type, onClose, onConfirm }) => {
	if (!isOpen) return null;

	// Modal styles for different types
	const getModalStyle = (type) => {
		switch (type) {
			case 'success':
				return 'bg-green-100 text-green-800';
			case 'error':
				return 'bg-red-100 text-red-800';
			case 'warning':
				return 'bg-yellow-100 text-yellow-800';
			case 'info':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${getModalStyle(type)}`}>
				{/* Modal Message */}
				<h2 className="text-xl font-semibold mb-4">{message}</h2>

				{/* Confirm Modal Actions (if it's a confirmation modal) */}
				{onConfirm ? (
					<div className="flex justify-end space-x-4">
						<button
							className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
							onClick={onConfirm}
						>
							Confirm
						</button>
					</div>
				) : (
					<div className="flex justify-end">
						<button
							className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
							onClick={onClose}
						>
							Close
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func, // Optional for confirmation modals
};

export default Modal;

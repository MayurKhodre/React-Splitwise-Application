import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const iconMap = {
	success: <CheckCircleIcon className="h-10 w-10 text-green-500 mb-2" />,
	error: <ExclamationCircleIcon className="h-10 w-10 text-red-500 mb-2" />,
	warning: <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500 mb-2" />,
	info: <InformationCircleIcon className="h-10 w-10 text-blue-500 mb-2" />,
};

const bgMap = {
	success: 'bg-green-50 dark:bg-green-900',
	error: 'bg-red-50 dark:bg-red-900',
	warning: 'bg-yellow-50 dark:bg-yellow-900',
	info: 'bg-blue-50 dark:bg-blue-900',
	default: 'bg-gray-50 dark:bg-gray-800',
};

const Modal = ({ isOpen, message, type, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 transition-all duration-300">
			<div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border ${bgMap[type] || bgMap.default} animate-fadeIn`}>
				<div className="flex flex-col items-center">
					{iconMap[type] || iconMap.info}
					<h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">{message}</h2>
				</div>
				{onConfirm ? (
					<div className="flex justify-end space-x-4 mt-6">
						<button
							className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-2 px-5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							className="bg-blue-600 dark:bg-blue-800 text-white py-2 px-5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition"
							onClick={onConfirm}
						>
							Confirm
						</button>
					</div>
				) : (
					<div className="flex justify-end mt-6">
						<button
							className="bg-blue-600 dark:bg-blue-800 text-white py-2 px-5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition"
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
	onConfirm: PropTypes.func,
};

export default Modal;

import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, message, type, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm w-full">
				<div className={`p-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
					<h2 className="text-white text-lg font-bold">
						{type === 'success' ? 'Success' : 'Error'}
					</h2>
				</div>
				<div className="p-4">
					<p className="text-gray-700">{message}</p>
				</div>
				<div className="p-4 text-right">
					<button
						onClick={onClose}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['success', 'error']).isRequired,
	onClose: PropTypes.func.isRequired,
};

export default Modal;

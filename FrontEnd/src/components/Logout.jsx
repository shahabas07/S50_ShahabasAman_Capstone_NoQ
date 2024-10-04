import React from 'react';

function LogoutModal({ onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[1100]">
            <div className="bg-white p-2 rounded-lg shadow-lg dark:bg-surface-dark">
                <h2 className="text-md font-semibold m-6 text-white dark:text-black">
                    Are you sure you want to log out?
                </h2>
                <div className="flex justify-between px-8 mb-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg mr-2 border border-gray-800 text-gray-800 hover:bg-gray-200 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Log-Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutModal;

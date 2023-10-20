import React from 'react';
import './LoadingModal.scss';

const LoadingModal = () => {
    return (
        <div style={{ display: 'flex' }} className="loading-modal">
            <div className="loading-modal-content">
                <div className="loading-loader"></div>
                <div className="loading-modal-text">Loading...</div>
            </div>
        </div>
    );
};

export default LoadingModal;

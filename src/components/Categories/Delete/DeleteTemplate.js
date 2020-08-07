import React from 'react';
import { Modal } from 'antd';

const DeleteTemplateModal = ({ visibility, setVisibility, deleteTemplate }) => {

    const handleOk = e => {
        deleteTemplate()
        setVisibility(false)
    };

    const handleCancel = e => {
        setVisibility(false)
    };

    return (
        <Modal
            title="Confirm to remove Template"
            visible={visibility}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p>Are you sure you want to delete this Template?</p>
        </Modal>
    )
}

export default DeleteTemplateModal;

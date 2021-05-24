import React from 'react';
import { Modal } from 'antd';

const DeleteCategoryModal = ({ visibility, setVisibility, deleteCategory }) => {

    const handleOk = e => {
        deleteCategory(true)
        setVisibility(false)
    };

    const handleCancel = e => {
        setVisibility(false)
    };

    return (
        <Modal
            title="Confirm to delete Category"
            visible={visibility}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p>Are you sure you want to delete this Category?</p>
        </Modal>
    )
}

export default DeleteCategoryModal

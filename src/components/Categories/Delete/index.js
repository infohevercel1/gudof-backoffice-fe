import React, { useState } from 'react';
import { Modal, Input } from 'antd';

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
            title="Add Category Name"
            visible={visibility}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p>Are you sure you want to delete this Category?</p>
        </Modal>
    )
}

export default DeleteCategoryModal

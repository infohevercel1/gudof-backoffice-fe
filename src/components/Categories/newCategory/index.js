import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const NewCategoryModal = ({ visibility, setVisibility, saveNewCategory }) => {

    let [name, setName] = useState('')

    const showModal = () => {
        setVisibility(true)
    };

    const handleOk = e => {
        saveNewCategory(name)
        setVisibility(false)
    };

    const handleCancel = e => {
        console.log(e);
        setVisibility(false)
    };

    return (
        <Modal
            title="Add Category Name"
            visible={visibility}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Input size="large" placeholder="large size" onChange={e => setName(e.target.value)}/>
        </Modal>
    )
}

export default NewCategoryModal

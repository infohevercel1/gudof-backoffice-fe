import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const NewCategoryModal = ({ visibility, setVisibility, saveNewCategory }) => {

    let [name, setName] = useState('')

    const showModal = () => {
        setVisibility(true)
    };

    const handleOk = e => {
        let newName = name
        setName('inp') // Clear input
        saveNewCategory(newName)
        setVisibility(false)
        console.log(name)
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
            <Input size="large" placeholder="Enter category" onChange={e => setName(e.target.value)} defaultValue=''/>
        </Modal>
    )
}

export default NewCategoryModal

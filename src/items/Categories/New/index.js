import React, { useState } from 'react';
import { Modal, Input, Form } from 'antd';

const NewCategoryModal = ({ visibility, setVisibility, saveNewCategory }) => {

    let [name, setName] = useState('')
    let [image, setImage] = useState('')

    const handleOk = e => {
        let newName = name;
        let newImage = image;
        setName('');
        setImage('');
        saveNewCategory(newName,newImage);
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
            destroyOnClose
        >
            <Form preserve={false}>
                <Input size="large" placeholder="Enter category" onChange={e => setName(e.target.value)} defaultValue=''/>
                <Input size="large" placeholder="Enter category" onChange={e => setImage(e.target.value)} defaultValue=''/>

            </Form>
        </Modal>
    )
}

export default NewCategoryModal

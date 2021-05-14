import React, { useState,useEffect } from 'react';
import { Modal, Input, Form } from 'antd';

const NewCategoryModal = ({ visibility, setVisibility, saveNewCategory }) => {

    let [name, setName] = useState('')
    let [image, setImage] = useState('')
    let [loading,setLoading]=useState(false)
    const handleOk = e => {
        setLoading(true)
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
            confirmLoading={loading}
            onCancel={handleCancel}
            destroyOnClose
        >
            <Form preserve={false}>
                <Input size="large" placeholder="Enter Category" onChange={e => setName(e.target.value)} defaultValue=''/>
                <Input size="large" placeholder="Enter Category icon link" onChange={e => setImage(e.target.value)} defaultValue=''/>

            </Form>
        </Modal>
    )
}

export default NewCategoryModal

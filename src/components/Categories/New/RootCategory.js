import React from 'react';
import { Button } from 'antd';

const NewRootCategory = ({onClick}) => {
    return (
        <Button
            type="primary"
            onClick={onClick}
        >
            Add New Category
        </Button>
    )
}

export default NewRootCategory;
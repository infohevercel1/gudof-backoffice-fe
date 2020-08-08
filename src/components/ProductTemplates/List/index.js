import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Modal } from 'antd';

import { instance as api } from '../../../axios';
import './list.css';

const List = () => {

    const [data, setData] = useState()
    const [tableColumns, setColumns] = useState()

    useEffect(() => {
        (async () => {
            try {
                let { data: templates } = await api.get('/templates')
                templates = templates.filter(el => el.category_id !== null);
                templates = templates.map((el) => {
                    return {
                        name: el.name,
                        category: el.category_id.name,
                        key: el._id,
                        category_id: el.category_id._id
                    };
                });
                setData(templates)
                const columns = [
                    {
                        title: 'Template Name',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Category',
                        dataIndex: 'category',
                        key: 'category'
                    },
                    {
                        title: 'View/Edit',
                        key: 'view/edit',
                        fixed: 'right',
                        render: (item) => {
                            console.log(item)
                            return (<Button
                                href={`/template?category=${item.category_id}&template=${item.key}`}
                            >
                                View/Edit
                            </Button>)
                        }
                    }
                ]
                setColumns(columns);
            } catch (e) {
                console.log(e);
                notification['error']({
                    message: 'An Error Occurred',
                    description: 'There was an error while displaying products.'
                })
            }
        })();
    }, [])
    return (
        <div className="container main-container">
            <h3>Listing all Templates</h3>
            <Table dataSource={data} columns={tableColumns} />
        </div>
    )
}

export default List;
import React, { useState } from "react";
import { notification, Button, Spin, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { instance as api } from "../../axios";

export default function (props) {
    const [loading, setLoading] = useState(false);
    const { category_id } = props;
    const handleUpload = async (file) => {
        console.log(category_id);
        const formData = new FormData();
        formData.append("file", file, file.name);
        try {
            setLoading(true);
            const {data: { json, formSchema }} = await api.post("user/fileupload", formData);
            notification["success"]({
                message: "file uploaded successfully",
            });
            console.log(formSchema);
            const response = await api.post('/user/bulk_edit',{category_id,formSchema,json})
            notification["success"]({
                message: response.data.message,
            });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            notification["error"]({
                message:
                    err.response.data === undefined
                        ? err.message
                        : err.response.data.message,
            });
        }
    };
    const prop = {
        name: "file",
        action: handleUpload,
        headers: {
            authorization: "authorization-text",
        },
        showUploadList: false,
    };
    return (
        <div>
            <Upload {...prop}>
                <Button
                    icon={<CloudUploadOutlined />}
                    disabled={loading}
                    loading={loading}
                >
                    Uploaded Edited CSV
                </Button>
            </Upload>
        </div>
    );
}
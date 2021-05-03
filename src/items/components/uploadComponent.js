import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { instance as api } from "../../axios";
import { notification } from "antd";

export default function () {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);
    try{
        const {data: { formSchema, json },} = await api.post("user/fileupload",formData);
        console.log(formSchema)
        console.log(json)
        notification['success']({
            message:"file uploaded successfully"
        })
    }
    catch(err){
        notification['error']({
            message:"file upload failed"
        })
    }
  };
  const handleUploadButtonClick = () => {
      const button = document.getElementById('uploadBtn')
      button.click()
  };
  return (
    <div>
      <Button icon={<UploadOutlined />} onClick={handleUploadButtonClick}>Upload CSV</Button>
      <input
        type="file"
        id="uploadBtn"
        hidden={true}
        onChange={handleUpload}
      ></input>
    </div>
  );
}

import React,{useState} from "react";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { instance as api } from "../../axios";
import { notification,Spin} from "antd";

export default function (props) {
  const { category_id } = props;
  const [loading,setLoading]=useState(false)
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);
    try {
      setLoading(true)
      const {data:{json,formSchema}} = await api.post("user/fileupload",formData);

      notification["success"]({
        message: "file uploaded successfully",
      });
      const response = await api.post("user/insert_data_to_subcategory", {
        category_id,
        json,
        formSchema,
      });
      console.log(response)
      notification["success"]({
        message: response.data.message,
      });
      setLoading(false)

    } catch (err) {
      setLoading(false)
      notification["error"]({
        message:err.response.data.message===undefined?err.message:err.response.data.message,
      });
    }
  };
  const handleUploadButtonClick = () => {
    const button = document.getElementById("uploadBtn");
    button.click();
  };
  return (
    <div>
      <Button icon={<UploadOutlined />} onClick={handleUploadButtonClick} disabled={loading}>
        {!loading?null:<Spin/>}
        Upload CSV
      </Button>
      <input
        type="file"
        id="uploadBtn"
        hidden={true}
        onChange={handleUpload}
      ></input>
    </div>
  );
}

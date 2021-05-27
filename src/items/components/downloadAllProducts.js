import React from "react";
import { Button, notification } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { instance as api } from "../../axios";
import download from 'downloadjs'

export default function (props) {
  const { category_id,name } = props;
  const handleDownload = async () => {
    try {
      const res=await api.post("user/download_category_products", { category_id });
      const blob= await res.data
      download(blob,`${name}_products.csv`)
      notification["info"]({
        message: "file is downloading",
      });
    } catch (err) {
      notification["error"]({
        message: "something went wrong!!",
      });
      console.log(err);
    }
  };
  return (
    <div>
      <Button icon={<DownloadOutlined />} onClick={handleDownload}>
        Download all Products
      </Button>
    </div>
  );
}

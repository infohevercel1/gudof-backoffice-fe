import React from 'react'
import { Popover, Button } from "antd";
import DownloadButton from "../components/downloadAllProducts";
import EditProducts from "../components/uploadEditedCSV";

export default function (props) {
    const {category_id,name} =props
    const content = (
        <div>
            <EditProducts category_id={category_id}/>
            <DownloadButton category_id={category_id} name={name}/>
        </div>
      );
  return (
    <div>
      <Popover content={content}>
        <Button type="default" >Bulk Edit</Button>
      </Popover>
    </div>
  );
}

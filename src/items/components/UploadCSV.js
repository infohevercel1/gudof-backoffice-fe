import React from "react";


import { instance as api } from "../../axios";
import { Button,notification, Input ,Row,Col, Alert} from "antd";
import Modal from "antd/lib/modal/Modal";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");
  const [fileName, setFilename] = React.useState("");
  const [file, setFile] = React.useState(Object);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [snackStatus, setSnackStatus] = React.useState(false);
  const [searchable, setSearchable] = React.useState("");
  const [stringFacets,setStringFacets]=React.useState("")
  const [numberFacets,setNumberFacets]=React.useState("")
  const handleClickOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    setCategoryName("");
    setFilename("");
    setSearchable('')
    setNumberFacets('')
    setStringFacets('')
    setFile(Object);
    setSnackStatus(false);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setSnackStatus(false);
  };
  const handleUploadButtonClick = () => {
    const button = document.getElementById("uploadBtn");
    button.click();
  };
  const handleUpload = (e) => {
    const file = e.target.files[0];
    setFilename(file.name);
    const formData = new FormData();
    formData.append("file", file, file.name);
    setFile(formData);
  };
  const textboxStyle={width:300,margin:10,marginLeft:0}
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const {data:{formSchema,json}} = await api.post(`/user/fileupload/${categoryName}`,file);
      const res = await api.post('/user/insertDataTodb',{formSchema,json,searchable,numberFacets,stringFacets,categoryName})
      setLoading(false);
      setMessage("Uploded successfully");
      setStatus("success");
      setSnackStatus(true);
    } catch (err) {
      setMessage("Uplod failed");
      setStatus("error");
      setSnackStatus(true);
      handleClose();
      setLoading(false);
      console.log(err);
    }
  };
  const showNotification =( msg,status) => {
    return notification['success']({
      message: msg,
      description: 'This csv is uploaded in the database.'
  })
  }
  return (
    <div>
      <br/>
      <Row  gutter={{lg:4,md:4,sm:3,xs:2}}>
        <Col span={16}></Col>
        <Col >
          <Button
            variant="contained"
            type="primary"
            onClick={handleClickOpen}
            size="large"
          >
            Upload CSV
          </Button>
          {snackStatus && showNotification(message,status)}
          <Modal
          okButtonProps={{disabled:
            categoryName.length === 0 || fileName.length === 0 || loading
          }}
            title="Upload CSV file"
            visible={open}
            onOk={handleSubmit}
            onCancel={handleClose}
            maxWidth="md"
            okText="Submit"
          >
            {loading && <LoadingOutlined/>}
         
              <Input
                variant="outlined"
                placeholder="Category Name"
                style={textboxStyle}
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
              />
              <Row style={textboxStyle}>
                <Col item>
                  <Input
                    variant="outlined"
                    placeholder="File Name"
                    value={fileName}
                  />
                </Col>
                <Col item>
                  
                  <Button icon={<UploadOutlined/>} 
                  type="primary" onClick={handleUploadButtonClick}></Button>
                  <input
                    type="file"
                    id="uploadBtn"
                    hidden={true}
                    onChange={handleUpload}
                  ></input>
                </Col>
              </Row>
              <Col>
                <Row>
                  <Input
                    variant="outlined"
                    value={searchable}
                    onChange={(e) => setSearchable(e.target.value)}
                    placeholder='Searchable - same attribute as in CSV'
                    style={textboxStyle}
                  />
                </Row>
                <Row item>
                  <Input
                    variant="outlined"
                    value={stringFacets}
                    onChange={(e) => setStringFacets(e.target.value)}
                    placeholder='StringFacets - same attribute as in CSV'
                    style={textboxStyle}
                  />
                </Row>
                <Row item>
                  <Input
                    variant="outlined"
                    value={numberFacets}
                    onChange={(e) => setNumberFacets(e.target.value)}
                    placeholder='Number Facet - same attribute as in CSV'
                    style={textboxStyle}
                  />
                </Row>
              </Col>
          </Modal>
        </Col>
      </Row>
    </div>
  );
}

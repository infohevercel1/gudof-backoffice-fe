import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import { instance as api } from "../../axios";
import Snackbar from "./SnackBar";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(4),
    },
  },
  button: {
    marginLeft: theme.spacing(10),
    alignSelf: "center",
  },
  dialog: {},
  textBox: {
    marginRight: theme.spacing(20),
    width: "35ch",
    marginBottom: theme.spacing(2),
  },
  icon: {
    fontSize: theme.spacing(3),
  },
  SubmitAndCancel: {
    margin: theme.spacing(3),
  },
}));

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");
  const [fileName, setFilename] = React.useState("");
  const [file, setFile] = React.useState(Object);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [snackStatus, setSnackStatus] = React.useState(false);
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    setCategoryName("");
    setFilename("");
    setFile(Object)
    setSnackStatus(false)
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
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await api.post(`/user/fileupload/${categoryName}`, file);
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
  return (
    <div className={classes.root}>
      <Grid container spacing={5}>
        <Grid item lg={4} md={4} sm={3} xs={2}></Grid>
        <Grid item lg={4} md={4} sm={3} xs={2}></Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            size="large"
            className={classes.button}
          >
            Upload CSV
          </Button>
          {snackStatus && <Snackbar message={message} status={status} />}
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            className={classes.dialog}
          >
            {loading && <LinearProgress color="secondary" />}
            <DialogTitle id="form-dialog-title">
              <Typography variant="h4">Upload CSV file</Typography>
            </DialogTitle>
            <DialogContent>
              <TextField
                variant="outlined"
                label={<Typography variant="h5">Category Name</Typography>}
                className={classes.textBox}
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
              />
              <Grid container direction="row">
                <Grid item>
                  <TextField
                    variant="outlined"
                    label={<Typography variant="h5">File Name</Typography>}
                    value={fileName}
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    color="secondary"
                    onClick={handleUploadButtonClick}
                  >
                    <CloudUploadIcon className={classes.icon} />
                  </IconButton>
                  <input
                    type="file"
                    id="uploadBtn"
                    hidden={true}
                    onChange={handleUpload}
                  ></input>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.SubmitAndCancel}>
              <Button
                onClick={handleClose}
                color="primary"
                variant="outlined"
                size="large"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                size="large"
                disabled={
                  categoryName.length == 0 || fileName.length == 0 || loading
                }
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}

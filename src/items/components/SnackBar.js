import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
   
  },
  messgage:{
    color:"#ffff",
  }
}));

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const vertical='top'
  const horizontal='center'
  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}  anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleClose} severity={props.status} className={classes.messgage}>
          <Typography variant='h5' className={classes.messgage} >{props.message}</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}
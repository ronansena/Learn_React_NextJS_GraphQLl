import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {  Typography } from '@mui/material';

export interface ConfirmationDialogRawProps {
  
  id:string;
  keepMounted: boolean;  
  open: boolean;
  onClose: (value?: string) => void;
  handlePurge: (id:number) => void;
  idNumber:number;
 
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, open, ...other } = props;

  const handleEntering = () => {

  };

  const handleCancel = () => {
  
    onClose();
    
  };

  const handleOk = () => {
    //console.log(props.idNumber)
    props.handlePurge(props.idNumber);
    onClose();  
 
  };


  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Alerta!</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" color="inherit" component="div">
            Deseja realmente excluir o(s) registro(s)? 
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default (ConfirmationDialogRaw);
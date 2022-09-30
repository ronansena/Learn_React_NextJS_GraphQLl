import React, { useEffect, useState } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import { handleTotalSleep  } from "../../../utils/CustomLib";

export interface SleepTotalDialogProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: string) => void;
  param: any;
}

function SleepTotalDialog(props: SleepTotalDialogProps) {
  const [totalSleep, setTotalSleep] = useState("");
  const { onClose, open, ...other } = props;

  const handleCancel = () => {

    onClose();

  };


  useEffect(() => {
    if(props.param !== undefined)
    setTotalSleep(handleTotalSleep(props.param.dtFallAsleep,props.param.dtWakeUp))
    
  }, [open,props.param])

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': {} }}
      maxWidth="xs"
      open={open}
      {...other}
      onBackdropClick={handleCancel}
    >
      <DialogTitle variant="h4">Total Sleep!</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h3" color="inherit" component="div">
          {totalSleep}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default (SleepTotalDialog);
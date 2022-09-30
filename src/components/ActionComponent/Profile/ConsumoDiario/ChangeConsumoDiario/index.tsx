import React, { useEffect, useState ,useRef} from "react";
import Button from "@material-ui/core/Button";
import { useMutation, } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import { useForm, Resolver } from "react-hook-form";
import { makeStyles, createStyles } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { AppBar, Toolbar, IconButton, Typography, Checkbox, Tooltip, Box, Menu, MenuItem } from '@mui/material';
import { UPDATE_CONSUMO_DIARIO } from "../../../../../queries/Profile/ConsumoDiario";
import Autocomplete from '@mui/material/Autocomplete';
import { useStyles } from '../../../../../../styles/useStyles';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import Stack from '@mui/material/Stack';
import DescricaoAlimento from "../../../../GetDataComponent/DescricaoAlimento";
import {TimeZoneCustom,convertCommaToDot, onBlurField,convertFixNumber,SlideTransition,convertDateTime,convertUTCDateToLocalDate } from "../../../../../utils/CustomLib";



type FormValues = {
  __typename: string;
  idConsumoNutricionalDiario: number;
  descricaoAlimento: string;
  
  qtdePesoConsumidaExec: string;
  dtConsumoExec: string;
};

interface RowsData {

  __typename: string;
  idConsumoNutricionalDiario: number;
  idAlimento: number;
  descricaoAlimento: string;
  
  qtdePesoConsumidaExec: string;
  dtConsumoExec: string;

}

const ChangeConsumoDiario = ({
  tabelaNutricionalData,
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  idSelectRow,
  descricaoAlimentoSelectRow,
  qtdePesoConsumidaExecSelectRow,
  dtConsumoExecSelectRow,
  idAlimentoSelectRow,
}: { tabelaNutricionalData: any, showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, idSelectRow: number, descricaoAlimentoSelectRow: string, qtdePesoConsumidaExecSelectRow: string, dtConsumoExecSelectRow: string, idAlimentoSelectRow: number }
) => {

  //console.log(idSelectRow);
  // console.log(descricaoAlimentoSelectRow);
    //console.log(idAlimentoSelectRow);


  //const [open3, setOpen3] = React.useState(false)
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [idConsumoNutricionalDiarioPage, setIdConsumoNutricionalDiarioPage] = useState(0);
  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState("");
  const [qtdePesoConsumidaExecPage, setQtdePesoConsumidaExecPage] = useState("");
  const [updateConsumoDiarioPage] = useMutation(UPDATE_CONSUMO_DIARIO);
  const [idAlimentoPage, setIdAlimentoPage] = useState(idAlimentoSelectRow);  
  const [dtConsumoExecPage, setDtConsumoExecPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const buttonRef = useRef<any>();
  const atualizaPage = () => {

    //console.log(descricaoAlimentoPage + "------" + fatorConversaoPage  + "------" + parseInt(idConsumoNutricionalDiarioPage) ),
     console.log(qtdePesoConsumidaExecPage + "------" + descricaoAlimentoPage + "------" + idConsumoNutricionalDiarioPage )

    if (qtdePesoConsumidaExecPage !==  "" && idConsumoNutricionalDiarioPage !== 0) {
      
      //ATENÇÃO: falta incluir idmetadiaria e idprofile
      let hash: RowsData = Object.create(null);
      hash["__typename"] = "ConsumoDiario";
      hash["idConsumoNutricionalDiario"] = idConsumoNutricionalDiarioPage;
      hash["descricaoAlimento"] = descricaoAlimentoPage;
      hash["idAlimento"] = idAlimentoPage;      
      hash["qtdePesoConsumidaExec"] = qtdePesoConsumidaExecPage;
      hash["dtConsumoExec"] = dtConsumoExecPage;
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      

      //setDescricaoAlimentoPage("")
      // setQtdePesoConsumidaExecPage("")
      //console.log("rowsDataTemp");
      //console.log(rowsDataTemp)

      //eliminar o registro antigo que foi atualizado antes de inserir os novos valores  

      if (Array.isArray(rowsDataTemp)) {

        var filteredRowsDataTemp = rowsDataTemp.filter(unidadeMedida => unidadeMedida.idConsumoNutricionalDiario !== idConsumoNutricionalDiarioPage);

        //retira quaisquer registro com idConsumoNutricionalDiario = 0
        filteredRowsDataTemp = filteredRowsDataTemp.filter(function (el: RowsData) { return el.idConsumoNutricionalDiario !== 0 });

        //console.log("filteredRowsDataTemp");
        //console.log(filteredRowsDataTemp)


        //console.log("hash");
        //console.log(hash)

        const arr3 = Array.isArray(filteredRowsDataTemp) ? filteredRowsDataTemp.concat(hash) : [];
        //   console.log("arr3");
        //     console.log(arr3)

        const uniqueIds: any = [];

        if (arr3 != undefined) {

          const unique = arr3.filter(element => {
            const isDuplicate = uniqueIds.includes(element.idConsumoNutricionalDiario);

            if (!isDuplicate) {

              uniqueIds.push(element);
              //console.log("isDuplicate" + true);
              return true;
            }
          });


          //ordenar o array pelo campo escolhido(nomeUnidademedida) antes de atualizar a tela
          unique.sort(function (a, b) {
            return a.dtConsumoExec < b.dtConsumoExec ? -1 : a.dtConsumoExec > b.dtConsumoExec ? 1 : 0;
          });

          setRowsDataTemp(unique.reverse());
          //  console.log("unique");
          // console.log(unique);

        }
      }
    }
    handleClose()
  }

  useEffect(() => {

    setIdConsumoNutricionalDiarioPage(idSelectRow);
    setDescricaoAlimentoPage(descricaoAlimentoSelectRow);
    setDtConsumoExecPage(dtConsumoExecSelectRow);
    setQtdePesoConsumidaExecPage(qtdePesoConsumidaExecSelectRow);
    setIdAlimentoPage(idAlimentoSelectRow);    
    
  }, [open2,descricaoAlimentoSelectRow, dtConsumoExecSelectRow, idAlimentoSelectRow, idSelectRow, qtdePesoConsumidaExecSelectRow]);

  const {
    register,
    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
    //} = useForm<FormValues>({ resolver: resolver, mode: 'onChange' });
  } = useForm<FormValues>({ mode: 'onChange' });

  const onSubmit = () => { 

    if (descricaoAlimentoPage != "" && idConsumoNutricionalDiarioPage !== 0) {

      updateConsumoDiarioPage({
        variables: {
          idConsumoNutricionalDiario: idConsumoNutricionalDiarioPage,
          idAlimento: idAlimentoPage,
          idMetaDiaria: 1,
          idProfileUser: 1,          
          qtdePesoConsumidaExec: convertFixNumber(qtdePesoConsumidaExecPage),
          dtConsumoExec:TimeZoneCustom(dtConsumoExecPage)
        },
      }).then(function (response) {
        if (response.data.updateConsumoDiario === true) {

          showMessage("Registro alterado com sucesso!", SlideTransition);
          atualizaPage();

        }
      }).catch((e) => {

        handleClose()
        showMessage("Falha ao tentar alterar! Mensagem do servidor: " + e, SlideTransition);

      });
    }

  };

  const handleClickOpen = () => {

    setOpen2(true);

  };

  const handleClose = () => {

    setOpen2(false);

  };


  const handleChange = (newValue: any | null) => {

    setDtConsumoExecPage(convertDateTime(newValue));
    //setDtConsumoExecPage(convertUTCDateToLocalDate(newValue));

  };

  return (

    <div className={classes.root}>
      <Dialog
        //disableEscapeKeyDown={false}
        //fullScreen={false}
        onBackdropClick={handleClose}
        open={open2}
      >
        <div className={classes.root}>
          <DialogTitle >
            Alteração
          </DialogTitle>
        </div>
        <DialogContent >
          <div className={classes.root}>
            <DialogContentText>Informe os campos:</DialogContentText>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)} id="formlogin">
          <Box
              sx={{
                width: "auto",
                height: "auto",
                border: 1,
                padding: "15px",

              }}
            >
              <div className={classes.root}>
                <Stack spacing={2} >
                 

            <DescricaoAlimento  descricaoAlimentoPage={descricaoAlimentoPage} setDescricaoAlimentoPage={setDescricaoAlimentoPage} setIdAlimentoPage={setIdAlimentoPage} showMessage={showMessage} />
            
              <TextField
                required
                variant="standard"
                id="standard-basic"
                autoComplete='off'
                //className="input"
                //type="text"
                //placeholder="fator conversão"
                // name="qtdePesoConsumidaExecPage"
                label="Quantidade Consumida"
                //label="Informe o fator de conversão:"                
                value={qtdePesoConsumidaExecPage}            
                inputRef={(input) => {
                  if (input !== null && idAlimentoPage !== 0 && input.value === "") {
                    console.log(input)
                    input.focus();
                  }
                }}
                onBlur={() => onBlurField(buttonRef)}
                onChange={(e) => {
                
                    setQtdePesoConsumidaExecPage(convertCommaToDot(e.target.value));
                
                }}
              />
              
           
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker 
                      showTodayButton
                      placeholder='dd/MM/yyyy HH:mm'
                      format='dd/MM/yyyy HH:mm'
                      label="Data e Hora"
                      value={dtConsumoExecPage}
                      onChange={handleChange}
                      ampm={false}
                    />
                  </MuiPickersUtilsProvider>
                  </Stack>
            </div>
            </Box>
            <div className={classes.root}>
              <DialogActions >
                <Button size="medium" variant="contained"
                  onClick={handleClose} endIcon={<CancelIcon />}>
                  Cancel
                </Button>
                <Button ref={buttonRef} type="submit" size="medium" variant="contained" 
                  endIcon={<AddIcon />}>
                  Alterar
                </Button>
              </DialogActions>
              
            </div>
        
          </form>
        </DialogContent>

      </Dialog>

      <IconButton onClick={handleClickOpen}  >
        <ChangeCircleIcon sx={[
          { fontSize: 40, },
          (theme) => ({
            [theme.breakpoints.down('sm')]: {

              fontSize: 20,
            }
          }
          ),
        ]} color="warning" />
      </IconButton>
    </div>
  );
};

export default ChangeConsumoDiario;

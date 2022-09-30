import React, { useEffect, useRef,useState, useCallback, useLayoutEffect } from "react";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller, useForm, Resolver } from "react-hook-form";
import { makeStyles, createStyles } from "@material-ui/core";
import Box from '@mui/material/Box';
import { TimeZoneCustom, convertCommaToDot, convertFixNumber, SlideTransition, onBlurField, convertUTCDateToLocalDate } from "../../../../../utils/CustomLib";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
//import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { useStyles } from '../../../../../../styles/useStyles';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import {
  ADD_MASSA_CORPORAL,
  GET_LAST_MASSA_CORPORAL,
} from "../../../../../queries/Profile/MassaCorporal";



type FormValues = {

  idMassaCorporal: number;
  idProfileUser: number;
  massaCorporalCadastrada: number;
  dataMassaCorporal: string;
  idWorkout: number;

};
interface RowsData {

  __typename: string;
  idMassaCorporal: number;
  idProfileUser: number;
  massaCorporalCadastrada: number;
  dataMassaCorporal: string;
  idWorkout: number;
}



const AddMassaCorporal = ({
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  setCheckboxSelection,
  checkboxSelection
}: { showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, setCheckboxSelection: any, checkboxSelection: any }
) => {
  //console.log(rowsDataTemp); 

  let conuntTemp3: number = 0;  
  const buttonRef = useRef<any>();
  const [idWorkoutPage, setIdWorkoutPage] = useState(9);
  const [massaCorporalCadastradaPage, setMassaCorporalCadastradaPage] = useState<string>("");
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [createMassaCorporalPage] = useMutation(ADD_MASSA_CORPORAL);
  //  const [idMassaCorporalPage, setidMassaCorporalPage] = useState(0);

  const [dataMassaCorporalPage, setDataMassaCorporalPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [atualizaPage] = useLazyQuery(GET_LAST_MASSA_CORPORAL, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {

      let lastItemMassaCorporal = data.getLastMassaCorporal[0];

      let hash: RowsData = Object.create(null);
      hash["__typename"] = "MassaCorporal";
      hash["idMassaCorporal"] = parseInt(
        lastItemMassaCorporal.idMassaCorporal
      );
      hash["idProfileUser"] = 1;
      hash["massaCorporalCadastrada"] = convertFixNumber(massaCorporalCadastradaPage);
      hash["dataMassaCorporal"] = lastItemMassaCorporal.dataMassaCorporal;
      hash["idWorkout"] = lastItemMassaCorporal.idWorkout;
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      setIdWorkoutPage(0);
      setMassaCorporalCadastradaPage("");
      //   console.log("rowsDataTemp");
      //  console.log(rowsDataTemp)
      //  console.log("hash");
      //  console.log(hash)

      const arr3 = Array.isArray(rowsDataTemp) ? rowsDataTemp.concat(hash) : [];
      //   console.log("arr3");
      //     console.log(arr3)

      const uniqueIds: any = [];

      if (arr3 != undefined) {

        const unique = arr3.filter(element => {
          const isDuplicate = uniqueIds.includes(element.idMassaCorporal);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
     //ordenar o array pelo campo escolhido(nomeUnidademedida) antes de atualizar a tela
          unique.sort(function (a: RowsData, b: RowsData) {
            return a.dataMassaCorporal < b.dataMassaCorporal ? -1 : a.dataMassaCorporal > b.dataMassaCorporal ? 1 : 0;
          });
     
        conuntTemp3++
        if (conuntTemp3 === 1) {

          setRowsDataTemp(unique.reverse());

              console.log("unique");
               console.log(unique);
        }

      }

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    },
  });


  const handleClickOpen = () => {

    setOpen2(true);
    //  console.log("estoy handleClickOpen => " + open)


  };

  const handleClose = () => {

    setOpen2(false);
    setIdWorkoutPage(0);
    setMassaCorporalCadastradaPage("");
  };



  const {
    register,
    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });


  function convertDateTime(date: any) {

    //console.log("convertDateTime")
    //console.log(date)
    let newDate = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];
    //console.log(newDate)
    return newDate;
  }

  const onSubmit = () => {
    //e.preventDefault();

    //  console.log(rowsDataTemp)
    // console.log(idOrigemDadoNutricionalPage + "------" + idStatusCadastroPage +"------" + idMassaCorporalPage)
    if (massaCorporalCadastradaPage != "") {

      createMassaCorporalPage({
        variables: {

          idProfileUser: 1,
          massaCorporalCadastrada: convertFixNumber(massaCorporalCadastradaPage),
          dataMassaCorporal: convertDateTime(new Date),
          idWorkout: idWorkoutPage
        },

      }).then(function (response) {

        if (response.data.createMassaCorporal === true) {

          atualizaPage();
          showMessage("Registro cadastrado com sucesso!", SlideTransition);


        }
      }).catch((e) => {

        handleClose()
        showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

      });
    }
  };


  const handleChange = (newValue: any | null) => {
    // console.log("newValue")
    //  console.log(newValue)
    setDataMassaCorporalPage(convertDateTime(newValue));
    //setDtConsumoExecPage(convertUTCDateToLocalDate(newValue));

  };

  function onSelectHandle(idWorkout: string) {

    if (idWorkout === "Rest") {

      setIdWorkoutPage(0);

    } else if (idWorkout === "Inline Skate") {

      setIdWorkoutPage(1);

    } else if (idWorkout === "Gym") {


      setIdWorkoutPage(2);

    } else if (idWorkout === "ROAD BIKE") {

      setIdWorkoutPage(3);

    } else if (idWorkout === "Mountain Bike(asfalto)") {


      setIdWorkoutPage(4);

    } else if (idWorkout === "Mountain Bike(trilha)") {

      setIdWorkoutPage(5);

    } else if (idWorkout === "Run") {


      setIdWorkoutPage(6);

    } else if (idWorkout === "Sick") {

      setIdWorkoutPage(7);

    } else if (idWorkout === "Workout") {

      setIdWorkoutPage(8);

    }
  }

  const options = ["Rest", "Inline Skate", "Gym", "ROAD BIKE", "Mountain Bike(asfalto)", "Mountain Bike(trilha)", "Run", "Sick", "Workout"];

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
            Cadastro
          </DialogTitle>
        </div>
        <DialogContent >
          <div className={classes.root}>
            <DialogContentText>Informe os campos:</DialogContentText>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)} id="formlogin">
            <Box
              sx={{
                padding: '10px 0px 20px 15px',
                border: 1,
              }}
            >
              <div className={classes.root}>

              <Autocomplete
                  onChange={(event, newValue) => {
                    onSelectHandle(newValue)
                  }}
                  autoSelect
                  id="auto-complete"
                  disableClearable
                  options={options}                  
                  renderInput={(params) => <TextField
                    required
                    {...params}
                    variant="standard"
                    className="input"
                    type="text"                    
                    autoFocus
                    id="standard-basic"
                    label="Work-out"
                  />}
                />

                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Massa Corporal"                    
                  className="input"             
                  type="text"                                         
                  value={massaCorporalCadastradaPage}   
                  inputRef={(input) => {
                    if (input !== null && idWorkoutPage !== 9 && input.value === "") {
                      console.log(input)
                      input.focus();
                    }
                  }}
                  onBlur={() => onBlurField(buttonRef)}      
                  onChange={(e) => {
                    setMassaCorporalCadastradaPage(convertCommaToDot(e.target.value));
                  }}
                />                

           
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker 
                    showTodayButton
                    placeholder='dd/MM/yyyy HH:mm'
                    format='dd/MM/yyyy HH:mm'
                    label="Data e Hora"
                    value={dataMassaCorporalPage}
                    onChange={handleChange}     
                    ampm={false}               
                  />
                </MuiPickersUtilsProvider>
              </div>
            </Box>
            <div className={classes.root}>
              <DialogActions >
                <Button size="medium" variant="contained"
                  onClick={handleClose} endIcon={<CancelIcon />}>
                  Cancel
                </Button>
                <Button type="submit" size="medium" variant="contained" ref={buttonRef}
                  endIcon={<AddIcon />}>
                  Add
                </Button>
              </DialogActions>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Stack className={classes.root} direction="row" spacing={2}>
        <Button size="large" variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen}>
          Add Items
        </Button>
      </Stack>
    </div >

  );
};

export default AddMassaCorporal;


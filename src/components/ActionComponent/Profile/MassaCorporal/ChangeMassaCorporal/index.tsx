import React, { useEffect, useRef, useState } from "react";
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
import { TimeZoneCustom, convertCommaToDot, convertDateTime, convertFixNumber, SlideTransition, onBlurField, convertUTCDateToLocalDate } from "../../../../../utils/CustomLib";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { AppBar, Toolbar, IconButton, Typography, Checkbox, Tooltip, Box, Menu, MenuItem } from '@mui/material';
import { UPDATE_MASSA_CORPORAL } from "../../../../../queries/Profile/MassaCorporal";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
//import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useStyles } from '../../../../../../styles/useStyles';


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

const ChangeMassaCorporal = ({
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  idSelectRow,
  massaCorporalCadastradaSelectRow,
  dataMassaCorporalSelectRow
}: { showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, idSelectRow: number, massaCorporalCadastradaSelectRow: string, dataMassaCorporalSelectRow: string }
) => {

  let conuntTemp3: number = 0;
  const buttonRef = useRef<any>();
  const [idWorkoutPage, setIdWorkoutPage] = useState(9);
  const [massaCorporalCadastradaPage, setMassaCorporalCadastradaPage] = useState<string>("");
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);  
  const [updateMassaCorporalPage] = useMutation(UPDATE_MASSA_CORPORAL);
  const [idMassaCorporalPage, setIdMassaCorporalPage] = useState(0);
  const [dataMassaCorporalPage, setDataMassaCorporalPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());


  const atualizaPage = () => {

    //console.log(nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage  + "------" + parseInt(idOrigemDadoNutricionalPage) ),
    // console.log(nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage  + "------" + parseInt(idOrigemDadoNutricionalPage) )

    if (massaCorporalCadastradaPage != "") {

      let hash: RowsData = Object.create(null);

      hash["__typename"] = "MassaCorporal";
      hash["idMassaCorporal"] = idMassaCorporalPage;
      hash["idProfileUser"] = 1;
      hash["massaCorporalCadastrada"] = convertFixNumber(massaCorporalCadastradaPage);
      hash["dataMassaCorporal"] = dataMassaCorporalPage;
      hash["idWorkout"] = idWorkoutPage;

      if (Array.isArray(rowsDataTemp)) {

        var filteredRowsDataTemp = rowsDataTemp.filter(OrigemDadoNutricional => OrigemDadoNutricional.idMassaCorporal !== idMassaCorporalPage);

        //retira quaisquer registro com idOrigemDadoNutricional = 0
        filteredRowsDataTemp = filteredRowsDataTemp.filter(function (el: RowsData) { return el.idMassaCorporal !== 0 });

        const arr3 = Array.isArray(filteredRowsDataTemp) ? filteredRowsDataTemp.concat(hash) : [];
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

          //ordenar o array pelo campo escolhido(nomeOrigemDadoNutricional) antes de atualizar a tela
          unique.sort(function (a, b) {
            return a.idMassaCorporal < b.idMassaCorporal ? -1 : a.idMassaCorporal > b.idMassaCorporal ? 1 : 0;
          });

          setRowsDataTemp(unique);
          //  console.log("unique");
          // console.log(unique);
        }
      }
    }
    handleClose()
  }

  useEffect(() => {

    setIdMassaCorporalPage(idSelectRow);
    setMassaCorporalCadastradaPage(massaCorporalCadastradaSelectRow);
    setDataMassaCorporalPage(dataMassaCorporalSelectRow)

  }, [open2,dataMassaCorporalSelectRow,idSelectRow,massaCorporalCadastradaSelectRow]);

  const {
    register,
    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });
  //} = useForm<FormValues>({ resolver: resolver, mode: 'onChange' });

  const onSubmit = () => {

    //e.preventDefault();
    //console.log("onSubmit ==>" + nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage + "------" + idOrigemDadoNutricionalPage)
    if (massaCorporalCadastradaPage != "") {

      updateMassaCorporalPage({
        variables: {
          idMassaCorporal:idMassaCorporalPage,
          idProfileUser: 1,
          massaCorporalCadastrada: convertFixNumber(massaCorporalCadastradaPage),
          dataMassaCorporal: TimeZoneCustom(dataMassaCorporalPage),
          idWorkout: idWorkoutPage
        },
      }).then(function (response) {
        if (response.data.updateMassaCorporal === true) {

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

  const handleChange = (newValue: any | null) => {
    // console.log("newValue")
    //  console.log(newValue)
    setDataMassaCorporalPage(convertDateTime(newValue));
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
                    autoFocus

                    className="input"
                    type="text"                
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
                  Alterar
                </Button>
              </DialogActions>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <IconButton >
        <ChangeCircleIcon sx={[
          { fontSize: 40, },
          (theme) => ({
            [theme.breakpoints.down('sm')]: {

              fontSize: 20,
            }
          }
          ),
        ]} color="warning" onClick={handleClickOpen} />
      </IconButton>
    </div>


  );
};

export default ChangeMassaCorporal;

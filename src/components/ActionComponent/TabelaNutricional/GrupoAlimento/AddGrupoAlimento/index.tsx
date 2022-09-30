import React, { useEffect, useState, useCallback,useLayoutEffect } from "react";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import { Controller, useForm, Resolver } from "react-hook-form";
import { makeStyles, createStyles } from "@material-ui/core";
import {TimeZoneCustom,convertCommaToDot, convertFixNumber,SlideTransition } from "../../../../../utils/CustomLib";
import {
  ADD_GRUPO_ALIMENTO,
  DELETE_GRUPO_ALIMENTO,
  GET_GRUPO_ALIMENTO,
  GET_LAST_GRUPO_ALIMENTO,
} from "../../../../../queries/TabelaNutricional/GrupoAlimento";
import { useStyles } from '../../../../../../styles/useStyles'



type FormValues = {
  nomeGrupoAlimento: string;
  
};
interface RowsData {

  __typename: string;
  idGrupoAlimento: number;
  nomeGrupoAlimento: string;
  

}



const AddGrupoAlimento = ({
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  setCheckboxSelection,
  checkboxSelection
}: { showMessage:any,setRowsDataTemp:any,rowsDataTemp:any,setCheckboxSelection:any,checkboxSelection:any }
) => {
  //console.log(rowsDataTemp); 

  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  
  const [nomeGrupoAlimentoPage, setNomeGrupoAlimentoPage] = useState("");
  
  const [createGrupoAlimentoPage] = useMutation(ADD_GRUPO_ALIMENTO);
  let conuntTemp3:number = 0;

        
  const [atualizaPage] = useLazyQuery(GET_LAST_GRUPO_ALIMENTO, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {  
      
      //console.log(data.getLastGrupoAlimento[0].idGrupoAlimento)
    //  console.log(nomeGrupoAlimentoPage + "------" + fatorConversaoPage)
      let hash:RowsData = Object.create(null);
      hash["__typename"] = "GrupoAlimento";
      hash["idGrupoAlimento"] = parseInt(
        data.getLastGrupoAlimento[0].idGrupoAlimento
      );
      hash["nomeGrupoAlimento"] = nomeGrupoAlimentoPage;
      
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      setNomeGrupoAlimentoPage("")
      
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
          const isDuplicate = uniqueIds.includes(element.idGrupoAlimento);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
        conuntTemp3++
        if (conuntTemp3 === 1) {

          setRowsDataTemp(unique);
          
     //     console.log("unique");
     //     console.log(unique);
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

  };

  const resolver: Resolver<FormValues> = async (values) => {
    return {
      values: !values.nomeGrupoAlimento ? {} : values,
      errors: !values.nomeGrupoAlimento
        ? {
          nomeGrupoAlimento: {
            type: "required",
            message: "This is required."
          }
        }
        : {}
    };
  };

  const {
    register,
    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ resolver: resolver, mode: 'onChange' });



  const onSubmit = () => {
    //e.preventDefault();
    //console.log(nomeGrupoAlimentoPage + "------" + fatorConversaoPage)
    if (nomeGrupoAlimentoPage != "" ) {
      createGrupoAlimentoPage({
        variables: {
          nomeGrupoAlimento: nomeGrupoAlimentoPage,
          
        },
       
      }).then(function (response) {
        
        if (response.data.createGrupoAlimento === true) {         
          
          atualizaPage();
        
          showMessage("Registro cadastrado com sucesso!", SlideTransition);
        
          
        }
      }).catch((e) => {

        handleClose()
        showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

      });
    }
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
            Cadastro
          </DialogTitle>
        </div>
        <DialogContent >
          <div className={classes.root}>
            <DialogContentText>Informe os campos:</DialogContentText>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)} id="formlogin">

            <div className={classes.root}>

              <TextField
                required
                variant="standard"
                id="standard-basic"
                label="Nome do grupo de alimento"
                autoComplete='off'
                //className="input"
                //type="text"
                //placeholder="nome grupo de alimento"
                //name="nomeGrupoAlimentoPage"
                //label="Informe a grupo de alimento:"
                value={nomeGrupoAlimentoPage}
                {...register("nomeGrupoAlimento", {
                  required: true,
                })}

                onChange={(e) => {
                  setNomeGrupoAlimentoPage(e.target.value);
                }}
              />
              {errors?.nomeGrupoAlimento && <p>{errors.nomeGrupoAlimento.message}</p>}
             
            </div>
            <div className={classes.root}>
              <DialogActions >
                <Button size="medium" variant="contained"
                  onClick={handleClose} endIcon={<CancelIcon />}>
                  Cancel
                </Button>
                <Button type="submit" size="medium" variant="contained"
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
      </div>

  );
};

export default AddGrupoAlimento;

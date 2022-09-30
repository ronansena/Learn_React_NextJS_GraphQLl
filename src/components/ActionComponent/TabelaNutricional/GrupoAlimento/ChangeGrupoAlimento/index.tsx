import React, { useEffect, useState } from "react";
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
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { AppBar, Toolbar, IconButton, Typography, Checkbox, Tooltip, Box, Menu, MenuItem } from '@mui/material';
import { UPDATE_GRUPO_ALIMENTO } from "../../../../../queries/TabelaNutricional/GrupoAlimento";
import {TimeZoneCustom,convertCommaToDot, convertFixNumber,SlideTransition } from "../../../../../utils/CustomLib";
import { useStyles } from '../../../../../../styles/useStyles'

type FormValues = {
  nomeGrupoAlimento: string;
  
};

interface RowsData {

  __typename: string;
  idGrupoAlimento: number;
  nomeGrupoAlimento: string;
  

}

const ChangeGrupoAlimento = ({
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  idSelectRow,
  nomeGrupoAlimentoSelectRow,
  
}: { showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, idSelectRow: number, nomeGrupoAlimentoSelectRow: string }
) => {

  //console.log(idSelectRow);
  // console.log(nomeGrupoAlimentoSelectRow);
  //  console.log(fatorConversaoSelectRow);


  //const [open3, setOpen3] = React.useState(false)
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [idGrupoAlimentoPage, setIdGrupoAlimentoPage] = useState(0);
  const [nomeGrupoAlimentoPage, setNomeGrupoAlimentoPage] = useState("");
  
  const [updateGrupoAlimentoPage] = useMutation(UPDATE_GRUPO_ALIMENTO);

  const atualizaPage = () => {

    //console.log(nomeGrupoAlimentoPage + "------" + fatorConversaoPage  + "------" + parseInt(idGrupoAlimentoPage) ),
    // console.log(nomeGrupoAlimentoPage + "------" + fatorConversaoPage  + "------" + parseInt(idGrupoAlimentoPage) )

    if (nomeGrupoAlimentoPage != ""  && idGrupoAlimentoPage !== 0) {

      let hash: RowsData = Object.create(null);
      hash["__typename"] = "GrupoAlimento";
      hash["idGrupoAlimento"] = idGrupoAlimentoPage;
      hash["nomeGrupoAlimento"] = nomeGrupoAlimentoPage;      
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      

      //setNomeGrupoAlimentoPage("")
      // setFatorConversaoPage("")
      //console.log("rowsDataTemp");
      //console.log(rowsDataTemp)

      //eliminar o registro antigo que foi atualizado antes de inserir os novos valores  

      if (Array.isArray(rowsDataTemp)) {

        var filteredRowsDataTemp = rowsDataTemp.filter(GrupoAlimento => GrupoAlimento.idGrupoAlimento !== idGrupoAlimentoPage);

        //retira quaisquer registro com idGrupoAlimento = 0
        filteredRowsDataTemp = filteredRowsDataTemp.filter(function (el: RowsData) { return el.idGrupoAlimento !== 0 });

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
            const isDuplicate = uniqueIds.includes(element.idGrupoAlimento);

            if (!isDuplicate) {

              uniqueIds.push(element);
              //console.log("isDuplicate" + true);
              return true;
            }
          });


          //ordenar o array pelo campo escolhido(nomeGrupoAlimento) antes de atualizar a tela
          unique.sort(function (a, b) {
            return a.nomeGrupoAlimento < b.nomeGrupoAlimento ? -1 : a.nomeGrupoAlimento > b.nomeGrupoAlimento ? 1 : 0;
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

    setIdGrupoAlimentoPage(idSelectRow);
    setNomeGrupoAlimentoPage(nomeGrupoAlimentoSelectRow);
    

  }, [open2,idSelectRow,nomeGrupoAlimentoSelectRow]);

  // console.log("state variables");
  // console.log(idGrupoAlimentoPage);
  // console.log(nomeGrupoAlimentoPage);
  // console.log(fatorConversaoPage);


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
    //console.log("onSubmit ==>" + nomeGrupoAlimentoPage + "------" + fatorConversaoPage + "------" + idGrupoAlimentoPage)
    if (nomeGrupoAlimentoPage != ""  && idGrupoAlimentoPage !== 0) {

      updateGrupoAlimentoPage({
        variables: {
          idGrupoAlimento: idGrupoAlimentoPage,
          nomeGrupoAlimento: nomeGrupoAlimentoPage,
          
        },
      }).then(function (response) {
        if (response.data.updateGrupoAlimento === true) {

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
                  //console.log(e)
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

export default ChangeGrupoAlimento;

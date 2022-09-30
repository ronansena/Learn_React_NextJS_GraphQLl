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
import {TimeZoneCustom,convertCommaToDot, convertFixNumber,SlideTransition } from "../../../../../utils/CustomLib";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { AppBar, Toolbar, IconButton, Typography, Checkbox, Tooltip, Box, Menu, MenuItem } from '@mui/material';
import { UPDATE_META_DIARIA } from "../../../../../queries/Profile/MetaDiaria";
import NomeGrupoAlimento from '../../../../GetDataComponent/NomeGrupoAlimento';
import { useStyles } from '../../../../../../styles/useStyles'


type FormValues = {
  nomeOrigemDadoNutricional: string;
  linkFonte:string;
};

interface RowsData {

  __typename: string;
  idOrigemDadoNutricional: number;
  nomeOrigemDadoNutricional: string;
  linkFonte:string;

}

const ChangeMetaDiaria = ({
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  idSelectRow,
  descricaoAlimentoSelectRow,
  nomeGrupoAlimentoSelectRow,
  linkFonteSelectRow
}: { nomeGrupoAlimentoSelectRow:any,showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, idSelectRow: number, descricaoAlimentoSelectRow: string,linkFonteSelectRow:string }
) => {

  //console.log(idSelectRow);
  // console.log(descricaoAlimentoSelectRow);
  //  console.log(fatorConversaoSelectRow);


  //const [open3, setOpen3] = React.useState(false)
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [idOrigemDadoNutricionalPage, setIdOrigemDadoNutricionalPage] = useState(0);
  const [nomeOrigemDadoNutricionalPage, setNomeOrigemDadoNutricionalPage] = useState("");
  const [linkFontePage, setLinkFontePage] = useState("");
  const [updateOrigemDadoNutricionalPage] = useMutation(UPDATE_META_DIARIA);
  const [nomeGrupoAlimentoPage, setNomeGrupoAlimentoPage] = useState("");
  
  const [idGrupoAlimentoPage, setIdGrupoAlimentoPage] = useState(0);

  const atualizaPage = () => {

    //console.log(nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage  + "------" + parseInt(idOrigemDadoNutricionalPage) ),
    // console.log(nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage  + "------" + parseInt(idOrigemDadoNutricionalPage) )

    if (nomeOrigemDadoNutricionalPage != ""  && idOrigemDadoNutricionalPage !== 0) {

      let hash: RowsData = Object.create(null);
      hash["__typename"] = "OrigemDadoNutricional";
      hash["idOrigemDadoNutricional"] = idOrigemDadoNutricionalPage;
      hash["nomeOrigemDadoNutricional"] = nomeOrigemDadoNutricionalPage;      
      hash["linkFonte"] = linkFontePage; 
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      

      //setNomeOrigemDadoNutricionalPage("")
      // setFatorConversaoPage("")
      //console.log("rowsDataTemp");
      //console.log(rowsDataTemp)

      //eliminar o registro antigo que foi atualizado antes de inserir os novos valores  

      if (Array.isArray(rowsDataTemp)) {

        var filteredRowsDataTemp = rowsDataTemp.filter(OrigemDadoNutricional => OrigemDadoNutricional.idOrigemDadoNutricional !== idOrigemDadoNutricionalPage);

        //retira quaisquer registro com idOrigemDadoNutricional = 0
        filteredRowsDataTemp = filteredRowsDataTemp.filter(function (el: RowsData) { return el.idOrigemDadoNutricional !== 0 });

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
            const isDuplicate = uniqueIds.includes(element.idOrigemDadoNutricional);

            if (!isDuplicate) {

              uniqueIds.push(element);
              //console.log("isDuplicate" + true);
              return true;
            }
          });


          //ordenar o array pelo campo escolhido(nomeOrigemDadoNutricional) antes de atualizar a tela
          unique.sort(function (a, b) {
            return a.nomeOrigemDadoNutricional < b.nomeOrigemDadoNutricional ? -1 : a.nomeOrigemDadoNutricional > b.nomeOrigemDadoNutricional ? 1 : 0;
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

    setIdOrigemDadoNutricionalPage(idSelectRow);
    setNomeOrigemDadoNutricionalPage(descricaoAlimentoSelectRow);
    setLinkFontePage(linkFonteSelectRow)

  }, [open2,descricaoAlimentoSelectRow,idSelectRow,linkFonteSelectRow]);

  // console.log("state variables");
  // console.log(idOrigemDadoNutricionalPage);
  // console.log(nomeOrigemDadoNutricionalPage);
  // console.log(fatorConversaoPage);


  const resolver: Resolver<FormValues> = async (values) => {
    return {
      values: !values.nomeOrigemDadoNutricional ? {} : values,
      errors: !values.nomeOrigemDadoNutricional
        ? {
          nomeOrigemDadoNutricional: {
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
    //console.log("onSubmit ==>" + nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage + "------" + idOrigemDadoNutricionalPage)
    if (nomeOrigemDadoNutricionalPage != ""  && idOrigemDadoNutricionalPage !== 0) {

      updateOrigemDadoNutricionalPage({
        variables: {
          idOrigemDadoNutricional: idOrigemDadoNutricionalPage,
          nomeOrigemDadoNutricional: nomeOrigemDadoNutricionalPage,
          linkFonte: linkFontePage
        },
      }).then(function (response) {
        if (response.data.updateOrigemDadoNutricional === true) {

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
            Alteração
          </DialogTitle>
        </div>
        <DialogContent >
          <div className={classes.root}>
            <DialogContentText>Informe os campos:</DialogContentText>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)} id="formlogin">

            <div className={classes.root}>

            <NomeGrupoAlimento setNomeGrupoAlimentoPage={setNomeGrupoAlimentoPage} nomeGrupoAlimentoPage={nomeGrupoAlimentoPage} setIdGrupoAlimentoPage={setIdGrupoAlimentoPage} showMessage={showMessage}/>                
              <TextField
                required
                variant="standard"
                id="standard-basic"
                label="Nome da Origem do Dado Nutricional"
                //className="input"
                //type="text"
                //placeholder="nome Origem do Dado Nutricional"
                //name="nomeOrigemDadoNutricionalPage"
                //label="Informe a Origem do Dado Nutricional:"
                value={nomeOrigemDadoNutricionalPage}
                {...register("nomeOrigemDadoNutricional", {
                  required: true,
                })}

                onChange={(e) => {
                  //console.log(e)
                  setNomeOrigemDadoNutricionalPage(e.target.value);
                }}
              />
              {errors?.nomeOrigemDadoNutricional && <p>{errors.nomeOrigemDadoNutricional.message}</p>}            
              <TextField
                //required
                variant="standard"
                id="standard-basic"
                label="Link Fonte Nutricional"
                //className="input"
                //type="text"
                //placeholder="nome Origem do Dado Nutricional"
                //name="nomeOrigemDadoNutricionalPage"
                //label="Informe a Origem do Dado Nutricional:"
                value={linkFontePage}
                //{...register("linkFonte", {
              //    required: true,
              //  })}

                onChange={(e) => {
                  setLinkFontePage(e.target.value);
                }}
              />
              {//errors?.linkFontePage && <p>{errors.linkFontePage.message}</p>
              }
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

export default ChangeMetaDiaria;

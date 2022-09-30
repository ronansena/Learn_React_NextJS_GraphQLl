import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useMutation, useLazyQuery } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import { useForm, Resolver } from "react-hook-form";
import {SlideTransition } from "../../../../../utils/CustomLib";
import {
  ADD_ORIGEM_DADO_NUTRICIONAL,
  GET_LAST_ORIGEM_DADO_NUTRICIONAL,
} from "../../../../../queries/TabelaNutricional/OrigemDadoNutricional";
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



const AddOrigemDadoNutricional = ({
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
  
  const [nomeOrigemDadoNutricionalPage, setNomeOrigemDadoNutricionalPage] = useState("");
  const [linkFontePage, setLinkFontePage] = useState("");
  
  const [createOrigemDadoNutricionalPage] = useMutation(ADD_ORIGEM_DADO_NUTRICIONAL);
  let conuntTemp3:number = 0;

        
  const [atualizaPage] = useLazyQuery(GET_LAST_ORIGEM_DADO_NUTRICIONAL, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {  
      
      //console.log(data.getLastOrigemDadoNutricional[0].idOrigemDadoNutricional)
    //  console.log(nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage)
      let hash:RowsData = Object.create(null);
      hash["__typename"] = "OrigemDadoNutricional";
      hash["idOrigemDadoNutricional"] = parseInt(
        data.getLastOrigemDadoNutricional[0].idOrigemDadoNutricional
      );
      hash["nomeOrigemDadoNutricional"] = nomeOrigemDadoNutricionalPage;
      hash["linkFonte"] = linkFontePage;
      
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      setNomeOrigemDadoNutricionalPage("")
      setLinkFontePage("")
      
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
          const isDuplicate = uniqueIds.includes(element.idOrigemDadoNutricional);

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
    //console.log(nomeOrigemDadoNutricionalPage + "------" + fatorConversaoPage)
    if (nomeOrigemDadoNutricionalPage != "" ) {
      createOrigemDadoNutricionalPage({
        variables: {
          nomeOrigemDadoNutricional: nomeOrigemDadoNutricionalPage,
          linkFonte: linkFontePage,
          
        },
       
      }).then(function (response) {
        
        if (response.data.createOrigemDadoNutricional === true) {         
          
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

export default AddOrigemDadoNutricional;

import React, { useRef, useState } from "react";
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
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import {  
  ADD_TABELA_NUTRICIONAL,
  GET_LAST_TABELA_NUTRICIONAL,
} from "../../../../../queries/TabelaNutricional/TabelaNutricional";
import { convertCommaToDot, convertDateTime, convertFixNumber, SlideTransition, onBlurField } from "../../../../../utils/CustomLib";
import NomeGrupoAlimento from "../../../../GetDataComponent/NomeGrupoAlimento";
import NomeOrigemDadoNutricional from "../../../../GetDataComponent/NomeOrigemDadoNutricional";
import { useStyles } from '../../../../../../styles/useStyles'


type FormValues = {
  idAlimento: number;
  numeroAlimento: number;
  nomeGrupoAlimento: string;
  nomeOrigemDadoNutricional: string;
  descricaoAlimento: string;
  qtdeConsumoSugerida: number;
  proteina: number;
  lipideos: number;
  carboidrato: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  energiaKcal: number;
  created_at: string;
}
interface RowsData {

  __typename: string;
  idAlimento: number;
  numeroAlimento: number;
  nomeGrupoAlimento: string;
  nomeOrigemDadoNutricional: string;
  descricaoAlimento: string;
  qtdeConsumoSugerida: number;
  proteina: number;
  lipideos: number;
  carboidrato: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  energiaKcal: number;
  created_at: string;

}

const AddTabelaNutricional = ({
  origemDadoNutricionalData,
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  setCheckboxSelection,
  checkboxSelection,
  nomeGrupoAlimentoSelectRow,
 
}: {  nomeGrupoAlimentoSelectRow: any, origemDadoNutricionalData: any, showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, setCheckboxSelection: any, checkboxSelection: any }
) => {
  //console.log(rowsDataTemp); 

  let conuntTemp3: number = 0;
  const buttonRef = useRef<any>();
  const [idOrigemDadoNutricionalPage, setIdOrigemDadoNutricionalPage] = useState<number>();
  //const [nomeOrigemDadoNutricionalPage, setNomeOrigemDadoNutricionalPage] = useState("");
  const [nomeOrigemDadoNutricionalPage, setNomeOrigemDadoNutricionalPage] = useState("");
  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState("");
  const [qtdeConsumoSugeridaPage, setQtdeConsumoSugeridaPage] = useState<string>("");  
  const [energiaKcalPage, setEnergiaKcalPage] = useState<string>("");  
  const [energiaKcalResultOperation, setEnergiaKcalResultOperation] = useState<string>("");  
  const [proteinaPage, setProteinaPage] = useState<string>("");
  const [proteinaResultOperation, setProteinaResultOperation] = useState<string>("");
  const [lipideosPage, setLipideosPage] = useState<string>("");
  const [lipideosResultOperation, setLipideosResultOperation] = useState<string>("");
  const [carboidratoPage, setCarboidratoPage] = useState<string>("");
  const [carboidratoResultOperation, setCarboidratoResultOperation] = useState<string>("");
  const [fibraAlimentarPage, setFibraAlimentarPage] = useState<string>("");
  const [fibraAlimentarResultOperation, setFibraAlimentarResultOperation] = useState<string>("");
  const [calcioPage, setCalcioPage] = useState<string>("");
  const [calcioResultOperation, setCalcioResultOperation] = useState<string>("");
  const [sodioPage, setSodioPage] = useState<string>("");
  const [sodioResultOperation, setSodioResultOperation] = useState<string>("");
  const [qtdeProporcionalTnPage, setQtdeProporcionalTnPage] = useState<string>("");
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [createTabelaNutricionalPage] = useMutation(ADD_TABELA_NUTRICIONAL);
  const [idGrupoAlimentoPage, setIdGrupoAlimentoPage] = useState(0);
  const [nomeGrupoAlimentoPage, setNomeGrupoAlimentoPage] = useState<string>(nomeGrupoAlimentoSelectRow);
  const [atualizaPage] = useLazyQuery(GET_LAST_TABELA_NUTRICIONAL, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {

      let lastItemTabelaNutricional = data.getLastTabelaNutricional[0];

      let nomeOrigemDadoNutricional = origemDadoNutricionalData.filter((item: any) => {

        let nomeOrigemDadoNutricionalTemp = item.idOrigemDadoNutricional === idOrigemDadoNutricionalPage ? item.nomeOrigemDadoNutricional : "Dado não encontrado";

        return nomeOrigemDadoNutricionalTemp;

      });

      let hash: RowsData = Object.create(null);
      hash["__typename"] = "TabelaNutricional";
      hash["idAlimento"] = parseInt(
        lastItemTabelaNutricional.idAlimento
      );
      hash["numeroAlimento"] = parseInt(
        lastItemTabelaNutricional.numeroAlimento
      );
      hash["nomeGrupoAlimento"] = lastItemTabelaNutricional.nomeGrupoAlimento;
      hash["nomeOrigemDadoNutricional"] = nomeOrigemDadoNutricional[0].nomeOrigemDadoNutricional;
      hash["descricaoAlimento"] = descricaoAlimentoPage;
      hash["qtdeConsumoSugerida"] =    isNaN(convertFixNumber(qtdeConsumoSugeridaPage)) ? 0:convertFixNumber(qtdeConsumoSugeridaPage) ,   
      //hash["energiaKcal"] =  isNaN(convertFixNumber(energiaKcalResultOperation)) ? 0:convertFixNumber(energiaKcalResultOperation) ,   
      hash["energiaKcal"] =  lastItemTabelaNutricional.energiaKcal;
      //hash["proteina"] =  isNaN(convertFixNumber(proteinaResultOperation)) ? 0:convertFixNumber(proteinaResultOperation) ,  
      hash["proteina"] =  lastItemTabelaNutricional.proteina;
      //hash["lipideos"] =  isNaN(convertFixNumber(lipideosResultOperation)) ? 0:convertFixNumber(lipideosResultOperation) ,  
      hash["lipideos"] =  lastItemTabelaNutricional.lipideos;  
      //hash["carboidrato"] =  isNaN(convertFixNumber(carboidratoResultOperation)) ? 0:convertFixNumber(carboidratoResultOperation) ,
      hash["carboidrato"] =  lastItemTabelaNutricional.carboidrato; 
      //hash["fibraAlimentar"] =  isNaN(convertFixNumber(fibraAlimentarResultOperation)) ? 0:convertFixNumber(fibraAlimentarResultOperation) , 
      hash["fibraAlimentar"] =  lastItemTabelaNutricional.fibraAlimentar; 
      //hash["calcio"] =  isNaN(convertFixNumber(calcioResultOperation)) ? 0:convertFixNumber(calcioResultOperation) ,
      hash["calcio"] = lastItemTabelaNutricional.calcio; 
      //hash["sodio"] =  isNaN(convertFixNumber(sodioResultOperation)) ? 0:convertFixNumber(sodioResultOperation) ,   
      hash["sodio"] = lastItemTabelaNutricional.sodio; 
      hash["created_at"] = lastItemTabelaNutricional.created_at;

      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      setDescricaoAlimentoPage("");
      setQtdeConsumoSugeridaPage("");
      setEnergiaKcalResultOperation("");
      setProteinaResultOperation("");
      setLipideosResultOperation("");
      setCarboidratoResultOperation("");
      setFibraAlimentarResultOperation("");
      setCalcioResultOperation("");
      setSodioResultOperation("");
      setEnergiaKcalPage("");
      setProteinaPage("");
      setCalcioPage("");
      setCarboidratoPage("");
      setSodioPage("");
      setFibraAlimentarPage("");
      setLipideosPage("");
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
          const isDuplicate = uniqueIds.includes(element.idAlimento);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });

        unique.sort(function (a: RowsData, b: RowsData) {
          return a.idAlimento < b.idAlimento ? -1 : a.idAlimento > b.idAlimento ? 1 : 0;
        });

        conuntTemp3++
        if (conuntTemp3 === 1) {

          setRowsDataTemp(unique.reverse());
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

  const {
    register,
    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });

  const onSubmit = () => {
    console.log("commit rowsDataTemp")
    console.log(rowsDataTemp[0].idAlimento)
    createTabelaNutricionalPage({
      variables: {
        idGrupoAlimento: idGrupoAlimentoPage,
        idOrigemDadoNutricional: idOrigemDadoNutricionalPage,
        descricaoAlimento: descricaoAlimentoPage,
        numeroAlimento: parseInt(rowsDataTemp[0].idAlimento) + 1,
        qtdeConsumoSugerida: isNaN(convertFixNumber(qtdeConsumoSugeridaPage)) ? 0:convertFixNumber(qtdeConsumoSugeridaPage) ,
        energiaKcal:isNaN(convertFixNumber(energiaKcalResultOperation)) ? 0:convertFixNumber(energiaKcalResultOperation) ,
        proteina:isNaN(convertFixNumber(proteinaResultOperation)) ? 0:convertFixNumber(proteinaResultOperation) ,
        lipideos: isNaN(convertFixNumber(lipideosResultOperation)) ? 0:convertFixNumber(lipideosResultOperation) ,
        carboidrato: isNaN(convertFixNumber(carboidratoResultOperation)) ? 0:convertFixNumber(carboidratoResultOperation) ,
        fibraAlimentar: isNaN(convertFixNumber(fibraAlimentarResultOperation)) ? 0:convertFixNumber(fibraAlimentarResultOperation) ,
        calcio: isNaN(convertFixNumber(calcioResultOperation)) ? 0:convertFixNumber(calcioResultOperation) ,
        sodio: isNaN(convertFixNumber(sodioResultOperation)) ? 0:convertFixNumber(sodioResultOperation) ,        
        created_at: convertDateTime(new Date),
        updated_at: convertDateTime(new Date),
      },
    }).then(function (response) {

      if (response.data.createTabelaNutricional === true) {
        atualizaPage();
        showMessage("Registro cadastrado com sucesso!", SlideTransition);

      }
    }).catch((e) => {

      handleClose()
      showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

    });

  };


  return (

    <div className={classes.root}>
      <Dialog
        //disableEscapeKeyDown={false}
        //fullScreen={true}
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
              component="form"
              sx={{
                padding: '15px',
                display: 'flex',
                width: "auto",
                height: "auto",
                border: 1
              }}
            >
              <div className={classes.root}>
                <>
                <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Quantidade Proporcional TN:"
                    autoFocus={true}                    
                    sx={{ width: '230px', padding: '15px 0px 0px 0px', display: 'flex' }}
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"
                    value={qtdeProporcionalTnPage}              
                    onChange={(e) => {
                      setQtdeProporcionalTnPage(e.target.value);
                    }}
                  />
                  <NomeGrupoAlimento nomeGrupoAlimentoPage={nomeGrupoAlimentoPage} setIdGrupoAlimentoPage={setIdGrupoAlimentoPage} showMessage={showMessage} setNomeGrupoAlimentoPage={setNomeGrupoAlimentoPage} />
                  <NomeOrigemDadoNutricional showMessage={showMessage} setIdOrigemDadoNutricionalPage={setIdOrigemDadoNutricionalPage} setNomeOrigemDadoNutricionalPage={setNomeOrigemDadoNutricionalPage} nomeOrigemDadoNutricionalPage={nomeOrigemDadoNutricionalPage} />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Descrição alimento"
                    autoFocus={true}
                    sx={{ width: '230px', padding: '15px 0px 0px 0px', display: 'flex' }}
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"
                    value={descricaoAlimentoPage}
                    onChange={(e) => {
                      setDescricaoAlimentoPage(e.target.value);
                    }}
                  />
                 <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Qtde. Consumo Sugerida"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"
                    value={qtdeConsumoSugeridaPage}
                    onChange={(e) => {
                      setQtdeConsumoSugeridaPage(convertCommaToDot(e.target.value));                      
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Energia Kcal"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={energiaKcalPage}
                    onChange={(e) => {
                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setEnergiaKcalResultOperation(resultOperation);
                      setEnergiaKcalPage(convertCommaToDot(e.target.value));
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Carboidrato"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={carboidratoPage}
                    onChange={(e) => {
                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setCarboidratoResultOperation(resultOperation);
                      setCarboidratoPage(convertCommaToDot(e.target.value));
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Proteína"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={proteinaPage}
                    onChange={(e) => {

                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setProteinaResultOperation(resultOperation);

                      setProteinaPage(convertCommaToDot(e.target.value));
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Lipídeos"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={lipideosPage}
                    onChange={(e) => {
                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setLipideosResultOperation(resultOperation);

                      setLipideosPage(convertCommaToDot(e.target.value));
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Fibra Alimentar"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={fibraAlimentarPage}
                    onChange={(e) => {
                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setFibraAlimentarResultOperation(resultOperation);

                      setFibraAlimentarPage(convertCommaToDot(e.target.value));
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Sódio(mg)"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={sodioPage}                    
                    onChange={(e) => {
                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setSodioResultOperation(resultOperation);

                      setSodioPage(convertCommaToDot(e.target.value));
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Cálcio(mg)"
                    className="input"
                    type="text"
                    //placeholder="nome Origem do Dado Nutricional"
                    //name="nomeOrigemDadoNutricionalPage"
                    //label="Informe a Origem do Dado Nutricional:"                  
                    value={calcioPage}

                    onBlur={() => onBlurField(buttonRef)}
                    onChange={(e) => {
                      let valDigitado = convertCommaToDot(e.target.value);
                      let resultOperation = ((Number(valDigitado) * 100) / Number(qtdeProporcionalTnPage)).toString();
                      setCalcioResultOperation(resultOperation);

                      setCalcioPage(convertCommaToDot(e.target.value));
                    }}
                  />
                </>
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
    </div>
  );
};

export default AddTabelaNutricional;


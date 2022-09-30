import React, { useEffect, useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import { useMutation, } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Fade from '@mui/material/Fade';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { convertCommaToDot, convertDateTime, convertFixNumber, SlideTransition, onBlurField } from "../../../../../utils/CustomLib";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { IconButton, Box } from '@mui/material';
import { UPDATE_TABELA_NUTRICIONAL } from "../../../../../queries/TabelaNutricional/TabelaNutricional";
import NomeGrupoAlimento from '../../../../GetDataComponent/NomeGrupoAlimento';
import { TabelaNutricionalData } from '../../../../../pages/Search/TabelaNutricional/TabelaNutricional';
import NomeOrigemDadoNutricional from "../../../../GetDataComponent/NomeOrigemDadoNutricional";
import { TransitionProps } from '@mui/material/transitions';
import { useStyles } from '../../../../../../styles/useStyles'

type FormValues = {
  nomeOrigemDadoNutricional: string;

};

interface RowsData {

  __typename: string;
  idOrigemDadoNutricional: number;
  nomeOrigemDadoNutricional: string;
  nomeGrupoAlimento: any;
  descricaoAlimento: string;
  sodio: any;
  calcio: any;
  fibraAlimentar: any;
  carboidrato: any;
  lipideos: any;
  proteina: any;
  energiaKcal: any;
  qtdeConsumoSugerida: any;
  updated_at: any;
  numeroAlimento: any;
  idAlimento: any;

}

interface SnackbarMessage {
  message: string;
  key: number;
}

//const ChangeTabelaNutricional = (props: TabelaNutricionalData) => {

const ChangeTabelaNutricional = ({
  grupoAlimentoData,
  origemDadoNutricionalData,
  nomeGrupoAlimentoSelectRow,
  setRowsDataTemp,
  rowsDataTemp,
  idSelectRow,
  descricaoAlimentoSelectRow,
  sodioSelectRow,
  calcioSelectRow,
  fibraAlimentarSelectRow,
  carboidratoSelectRow,
  lipideosSelectRow,
  proteinaSelectRow,
  energiaKcalSelectRow,
  qtdeConsumoSugeridaSelectRow,
  nomeOrigemDadoNutricionalSelectRow,
  numeroAlimentoSelectRow,
  idOrigemDadoNutricionalSelectRow,
  idGrupoAlimentoSelectRow,

}: {
  grupoAlimentoData: any,
  origemDadoNutricionalData: any,
  nomeGrupoAlimentoSelectRow: any,
  setRowsDataTemp: any,
  rowsDataTemp: any,
  idSelectRow: any,
  descricaoAlimentoSelectRow: string,
  sodioSelectRow: any,
  calcioSelectRow: any,
  fibraAlimentarSelectRow: any,
  carboidratoSelectRow: any,
  lipideosSelectRow: any,
  proteinaSelectRow: any,
  energiaKcalSelectRow: any,
  qtdeConsumoSugeridaSelectRow: any,
  nomeOrigemDadoNutricionalSelectRow: any,
  numeroAlimentoSelectRow: any,
  idOrigemDadoNutricionalSelectRow: any,
  idGrupoAlimentoSelectRow: any;

}
) => {

  // console.log(descricaoAlimentoSelectRow);
  //  console.log(fatorConversaoSelectRow);
  //const [open3, setOpen3] = React.useState(false)
  const buttonRef = useRef<any>();
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  //const [open2, setOpen2] = React.useState(false);
  const [idOrigemDadoNutricionalPage, setIdOrigemDadoNutricionalPage] = useState(0);
  const [nomeOrigemDadoNutricionalPage, setNomeOrigemDadoNutricionalPage] = useState("");
  const [updateTabelaNutricionalPage] = useMutation(UPDATE_TABELA_NUTRICIONAL);
  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState("");
  const [idAlimentoPage, setIdAlimentoPage] = useState();
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
  const [nomeGrupoAlimentoPage, setNomeGrupoAlimentoPage] = useState("");
  //  const [origemDadoNutricionalData, setOrigemDadoNutricionalData] = useState(origemDadoNutricionalData);
  const [numeroAlimentoPage, setNumeroAlimentoPage] = useState("");
  const [idGrupoAlimentoPage, setIdGrupoAlimentoPage] = useState(0);
  const [qtdeProporcionalTnPage, setQtdeProporcionalTnPage] = useState<string>("");
  const [rowsDataTempChange, setRowsDataTempChange] = useState<Array<RowsData>>([]);

  //console.log("fora rowsDataTrowsDataTempChangeemp");
  //console.log(rowsDataTempChange)

  const atualizaPage = () => {
    console.log("cheguei aqui")

    let hash: RowsData = Object.create(null);

    hash["__typename"] = "TabelaNutricional";
    hash["idAlimento"] = idAlimentoPage;
    hash["numeroAlimento"] = numeroAlimentoPage;
    hash["nomeGrupoAlimento"] = nomeGrupoAlimentoPage;
    hash["nomeOrigemDadoNutricional"] = nomeOrigemDadoNutricionalPage;
    hash["descricaoAlimento"] = descricaoAlimentoPage;
    hash["qtdeConsumoSugerida"] = convertFixNumber(qtdeConsumoSugeridaPage);
    hash["energiaKcal"] = convertFixNumber(energiaKcalResultOperation);
    hash["proteina"] = convertFixNumber(proteinaResultOperation);
    hash["lipideos"] = convertFixNumber(lipideosResultOperation);
    hash["carboidrato"] = convertFixNumber(carboidratoResultOperation);
    hash["fibraAlimentar"] = convertFixNumber(fibraAlimentarResultOperation);
    hash["calcio"] = convertFixNumber(calcioResultOperation);
    hash["sodio"] = convertFixNumber(sodioResultOperation);
    hash["updated_at"] = convertDateTime(new Date);



    //console.log(hash)
    //console.log(rowsDataTemp.concat(hash));      

    //setNomeOrigemDadoNutricionalPage("")
    // setFatorConversaoPage("")
    //  console.log("dentro Array.isArray(rowsDataTempChange)");
    //   console.log(Array.isArray(rowsDataTempChange))

    //eliminar o registro antigo que foi atualizado antes de inserir os novos valores  

    if (Array.isArray(rowsDataTempChange)) {

      var filteredRowsDataTemp = rowsDataTempChange.filter((element: any) => element.idAlimento !== idAlimentoPage);

      //retira quaisquer registro com idOrigemDadoNutricional = 0
      filteredRowsDataTemp = filteredRowsDataTemp.filter(function (el: RowsData) { return el.idAlimento !== 0 });

      //  console.log("filteredRowsDataTemp");
      //   console.log(filteredRowsDataTemp)


      //console.log("hash");
      //console.log(hash)

      const arr3 = Array.isArray(filteredRowsDataTemp) ? filteredRowsDataTemp.concat(hash) : [];
      // console.log("arr3");
      //   console.log(arr3)

      const uniqueIds: any = [];

      if (arr3 !== undefined) {

        const unique = arr3.filter(element => {
          const isDuplicate = uniqueIds.includes(element.idAlimento);

          if (!isDuplicate) {

            uniqueIds.push(element);
            // console.log("isDuplicate" + true);
            return true;
          }
        });

        unique.sort(function (a: RowsData, b: RowsData) {
          return a.idAlimento < b.idAlimento ? -1 : a.idAlimento > b.idAlimento ? 1 : 0;
        });

        console.log("unique");
        console.log(unique);
        setRowsDataTemp(unique.reverse());

      }

    }

  }




  const [state, setState] = React.useState<{
    open: boolean;
    vertical: string,
    horizontal: string,
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: Fade,
    vertical: 'top',
    horizontal: 'right',
  });
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);

  function showMessage(message: string, Transition: React.ComponentType<
    TransitionProps & {
      children: React.ReactElement<any, any>;
    }>) {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    setState({
      open: true,
      Transition,
      vertical: 'top',
      horizontal: 'right'
    });

  }

  const {

    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });
  //console.log(energiaKcalPage)
  const onSubmit = () => {
    console.log("onSubmit")
    console.log(idAlimentoPage)
    console.log(energiaKcalPage)
    
    updateTabelaNutricionalPage({
      variables: {
        idAlimento: idAlimentoPage,
        idGrupoAlimento: idGrupoAlimentoPage,
        idOrigemDadoNutricional: idOrigemDadoNutricionalPage,
        descricaoAlimento: descricaoAlimentoPage,
        qtdeConsumoSugerida: isNaN(convertFixNumber(qtdeConsumoSugeridaPage)) ? 0 : convertFixNumber(qtdeConsumoSugeridaPage),
        //energiaKcal: isNaN(convertFixNumber(energiaKcalResultOperation)) ? 0 : convertFixNumber(energiaKcalResultOperation),
        energiaKcal: (Number(energiaKcalPage) * 100) / Number(qtdeProporcionalTnPage) ,
        //proteina: isNaN(convertFixNumber(proteinaResultOperation)) ? 0 : convertFixNumber(proteinaResultOperation),
        proteina:  (Number(proteinaPage) * 100) / Number(qtdeProporcionalTnPage),
        //lipideos: isNaN(convertFixNumber(lipideosResultOperation)) ? 0 : convertFixNumber(lipideosResultOperation),
        lipideos:  (Number(lipideosPage) * 100) / Number(qtdeProporcionalTnPage),
        //carboidrato: isNaN(convertFixNumber(carboidratoResultOperation)) ? 0 : convertFixNumber(carboidratoResultOperation),
        carboidrato: (Number(carboidratoPage) * 100) / Number(qtdeProporcionalTnPage),
        //fibraAlimentar: isNaN(convertFixNumber(fibraAlimentarResultOperation)) ? 0 : convertFixNumber(fibraAlimentarResultOperation),
        fibraAlimentar: (Number(fibraAlimentarPage) * 100) / Number(qtdeProporcionalTnPage),
        //calcio: isNaN(convertFixNumber(calcioResultOperation)) ? 0 : convertFixNumber(calcioResultOperation),
        calcio: (Number(calcioPage) * 100) / Number(qtdeProporcionalTnPage),
        //sodio: isNaN(convertFixNumber(sodioResultOperation)) ? 0 : convertFixNumber(sodioResultOperation),
        sodio: (Number(sodioPage) * 100) / Number(qtdeProporcionalTnPage),
        updated_at: convertDateTime(new Date),
      },
    }).then(function (response) {
      if (response.data.updateTabelaNutricional === true) {

        showMessage("Registro alterado com sucesso!", SlideTransition);
        atualizaPage();


      }
    }).catch((e) => {

      showMessage("Falha ao tentar alterar! Mensagem do servidor: " + e, SlideTransition);
      //console.log(e)
      //handleClose()
    });
    // }

  };

  const handleClose = () => {

    setOpen2(false);

  };
  //console.log(open2)

  const handleClickOpen = () => {

    setOpen2(true);

  };

  useEffect(() => { 

    if (idAlimentoPage === undefined) {

      console.log("exe aqui idSelectRow");
      console.log(idSelectRow);

      setEnergiaKcalResultOperation(energiaKcalSelectRow)
      setCarboidratoResultOperation(carboidratoSelectRow);
      setProteinaResultOperation(proteinaSelectRow);
      setLipideosResultOperation(lipideosSelectRow);
      setFibraAlimentarResultOperation(fibraAlimentarSelectRow);
      setCalcioResultOperation(calcioSelectRow);
      setSodioResultOperation(sodioSelectRow);
      setIdAlimentoPage(idSelectRow);
      setNomeOrigemDadoNutricionalPage(nomeOrigemDadoNutricionalSelectRow);
      setDescricaoAlimentoPage(descricaoAlimentoSelectRow)
      setEnergiaKcalPage(energiaKcalSelectRow);
      setProteinaPage(proteinaSelectRow);
      setLipideosPage(lipideosSelectRow);
      setCarboidratoPage(carboidratoSelectRow);
      setFibraAlimentarPage(fibraAlimentarSelectRow);
      setCalcioPage(calcioSelectRow);
      setSodioPage(sodioSelectRow);
      setQtdeConsumoSugeridaPage(qtdeConsumoSugeridaSelectRow);
      //setOrigemDadoNutricionalData(origemDadoNutricionalData);
      setNomeGrupoAlimentoPage(nomeGrupoAlimentoSelectRow);
      setNumeroAlimentoPage(numeroAlimentoSelectRow);
      setIdGrupoAlimentoPage(idGrupoAlimentoSelectRow);
      setIdOrigemDadoNutricionalPage(idOrigemDadoNutricionalSelectRow);
      setRowsDataTempChange(rowsDataTemp);
    }
  //, [open2,rowsDataTemp,calcioSelectRow, carboidratoSelectRow, descricaoAlimentoSelectRow, energiaKcalSelectRow, fibraAlimentarSelectRow, idGrupoAlimentoSelectRow, idOrigemDadoNutricionalSelectRow, idSelectRow, lipideosSelectRow, nomeGrupoAlimentoSelectRow, nomeOrigemDadoNutricionalSelectRow, numeroAlimentoSelectRow, origemDadoNutricionalData, proteinaSelectRow, qtdeConsumoSugeridaSelectRow, sodioSelectRow])
  }, [open2])

  return (

    <div className={classes.root}>
      <Dialog
        //disableEscapeKeyDown={false}
        //fullScreen={true}
        //onBackdropClick={handleClose}
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
                  <NomeGrupoAlimento setNomeGrupoAlimentoPage={setNomeGrupoAlimentoPage} nomeGrupoAlimentoPage={nomeGrupoAlimentoPage} setIdGrupoAlimentoPage={setIdGrupoAlimentoPage} showMessage={showMessage} />
                  <NomeOrigemDadoNutricional showMessage={showMessage} setIdOrigemDadoNutricionalPage={setIdOrigemDadoNutricionalPage} setNomeOrigemDadoNutricionalPage={setNomeOrigemDadoNutricionalPage} nomeOrigemDadoNutricionalPage={nomeOrigemDadoNutricionalPage} />
                  <TextField
                    required
                    variant="standard"
                    id="standard-basic"
                    label="Descrição alimento"
                    autoFocus={true}
                    sx={{ width: '200px', padding: '15px 0px 0px 0px', display: 'flex' }}
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
                  onClick={handleClose}
                  endIcon={<AddIcon />}>
                  Change
                </Button>
              </DialogActions>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <IconButton onClick={handleClickOpen}>

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

export default ChangeTabelaNutricional;

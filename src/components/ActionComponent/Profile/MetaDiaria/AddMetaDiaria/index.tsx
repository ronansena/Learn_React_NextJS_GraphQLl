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
import Autocomplete from '@mui/material/Autocomplete';
//import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import {
  ADD_META_DIARIA,
  GET_LAST_META_DIARIA,
} from "../../../../../queries/Profile/MetaDiaria";
import { Typography } from "@mui/material";
import MassaCorporal from "../../../../../pages/Search/Profile/MassaCorporal";
import { useStyles } from '../../../../../../styles/useStyles'


type FormValues = {
  idMetaDiaria: number;
  idProfileUser: number;
  idStatusCadastro: number;
  custoMensalPrevisto: number;
  proteina: number;
  lipideos: number;
  carboidrato: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  ferro: number;
  energiaKcal: number;
  dtCadastro: string;
  qtdeConsumoSugerida: number;


};
interface RowsData {

  __typename: string;
  idMetaDiaria: number;
  idProfileUser: number;
  idStatusCadastro: number;
  custoMensalPrevisto: number;
  proteina: number;
  lipideos: number;
  carboidrato: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  ferro: number;
  energiaKcal: number;
  dtCadastro: string;
  qtdeConsumoSugerida: number;

}



const AddMetaDiaria = ({
  cachedData,
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  setCheckboxSelection,
  checkboxSelection
}: { cachedData: any, showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, setCheckboxSelection: any, checkboxSelection: any }
) => {
  //console.log(rowsDataTemp); 

  let conuntTemp3: number = 0;
  const buttonRef = useRef<any>();
  const [idStatusCadastroPage, setidStatusCadastroPage] = useState("");
  const [custoMensalPrevistoPage, setCustoMensalPrevistoPage] = useState<string>("");
  const [energiaKcalPage, setEnergiaKcalPage] = useState<string>("");
  const [proteinaPage, setProteinaPage] = useState<string>("");
  const [qtdeConsumoSugeridaPage, setQtdeConsumoSugeridaPage] = useState<string>("");
  const [lipideosPage, setLipideosPage] = useState<string>("");
  const [carboidratoPage, setCarboidratoPage] = useState<string>("");
  const [fibraAlimentarlPage, setFibraAlimentarPage] = useState<string>("");
  const [calcioPage, setCalcioPage] = useState<string>("");
  const [sodioPage, setSodioPage] = useState<string>("");
  const [ferroPage, setFerroPage] = useState<string>("");
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [createMetaDiariaPage] = useMutation(ADD_META_DIARIA);
  //  const [idMetaDiariaPage, setidMetaDiariaPage] = useState(0);

  const [dtCadastroPage, setDtCadastroPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [atualizaPage] = useLazyQuery(GET_LAST_META_DIARIA, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {

      let lastItemMetaDiaria = data.getLastMetaDiaria[0];

      let hash: RowsData = Object.create(null);
      hash["__typename"] = "MetaDiaria";
      hash["idMetaDiaria"] = parseInt(
        lastItemMetaDiaria.idMetaDiaria
      );
      hash["idStatusCadastro"] = Number(idStatusCadastroPage);
      hash["custoMensalPrevisto"] = convertFixNumber(custoMensalPrevistoPage);
      hash["energiaKcal"] = convertFixNumber(energiaKcalPage);
      hash["proteina"] = convertFixNumber(proteinaPage);
      hash["lipideos"] = convertFixNumber(lipideosPage);
      hash["carboidrato"] = convertFixNumber(carboidratoPage);
      hash["fibraAlimentar"] = convertFixNumber(fibraAlimentarlPage);
      hash["calcio"] = convertFixNumber(calcioPage);
      hash["sodio"] = convertFixNumber(sodioPage);
      hash["ferro"] = convertFixNumber(ferroPage);
      hash["dtCadastro"] = lastItemMetaDiaria.dtCadastro;

      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      setidStatusCadastroPage("");
      setCustoMensalPrevistoPage("");
      setEnergiaKcalPage("");
      setProteinaPage("");
      setLipideosPage("");
      setCarboidratoPage("");
      setFibraAlimentarPage("");
      setCalcioPage("");
      setSodioPage("");
      setFerroPage("");
      setQtdeConsumoSugeridaPage("");
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
          const isDuplicate = uniqueIds.includes(element.idMetaDiaria);

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
    setidStatusCadastroPage("");
    setCustoMensalPrevistoPage("");
    setEnergiaKcalPage("");
    setProteinaPage("");
    setLipideosPage("");
    setCarboidratoPage("");
    setFibraAlimentarPage("");
    setCalcioPage("");
    setSodioPage("");
    setFerroPage("");
    setQtdeConsumoSugeridaPage("");

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
    // console.log(idOrigemDadoNutricionalPage + "------" + idStatusCadastroPage +"------" + idMetaDiariaPage)
    if (energiaKcalPage != "") {

      createMetaDiariaPage({
        variables: {
          idProfileUser: 1,
          idStatusCadastro: 1,
          custoMensalPrevisto: convertFixNumber(custoMensalPrevistoPage),
          qtdeConsumoSugerida: convertFixNumber(qtdeConsumoSugeridaPage),
          energiaKcal: convertFixNumber(energiaKcalPage),
          proteina: convertFixNumber(proteinaPage),
          lipideos: convertFixNumber(lipideosPage),
          carboidrato: convertFixNumber(carboidratoPage),
          fibraAlimentar: convertFixNumber(fibraAlimentarlPage),
          calcio: convertFixNumber(calcioPage),
          sodio: convertFixNumber(sodioPage),
          ferro: convertFixNumber(ferroPage),
          dtCadastro: convertDateTime(new Date),
        },

      }).then(function (response) {

        if (response.data.createMetaDiaria === true) {

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

    setDtCadastroPage(convertDateTime(newValue));
    //setDtConsumoExecPage(convertUTCDateToLocalDate(newValue));

  };

  const lastMassaCorporal = cachedData.getLastMassaCorporal[0].massaCorporalCadastrada;
  const gastoEnergeticoBasalHomem30a60Anos = (11.472 * Number(lastMassaCorporal)) + 873.1;
  const fatorDeAtividadeLeveCaloria = 1.55; // Leve: fator médio de 1,55: considera atividades como cozinhar, cuidar de crianças; trabalhar 8 horas sentado e caminhadas de até 1 hora por dia;
  const fatorDeAtividadeModeradoCaloria = 1.84; //Moderada: fator médio de 1,84: inclui atividades como fazer uma hora diária de exercícios como corrida, ciclismo, natação ou dança, trabalhar como operário de construção,  garçom, vendedor de porta em porta, carteiro o entregador de mercadorias leves;
  const fatorDeAtividadeIntensoCaloria = 2.2;//Intensa: fator médio de 2,2: considera atividades como natação, corrida, andar de bicicleta ou dançar duas horas por dia; trabalhadores rurais não mecanizados (que trabalham com instrumentos manuais e caminham longas distâncias, várias horas por dia) ou entregador de objetos pesados.
  const fatorDeAtividadeLeveProteina = 0.8; //Não pratica atividade física necessita de 0,8 g de proteína por cada kg de peso;
  const fatorDeAtividadeModeradoProteina = 1.1; // Pratica atividade física leve precisa de 1,1 a 1,6 g de proteína por kg de peso;
  const fatorDeAtividadeIntensoProteina = 1.5; //Pratica musculação necessita de 1,5 a 2 g de proteína por kg de peso.
  const fatorDeAtividadeLeveCarboidrato = 5;
  const fatorDeAtividadeModeradoCarboidrato = 6;//Se o paciente se exercita com a mesma intensidade durante 1 hora ou menos, uma dieta que forneça 6 g de carboidrato / kg de peso corporal / dia é suficiente para repor os estoques de glicogênio muscular.
  const fatorDeAtividadeIntensoCarboidrato = 12; //Para praticantes de exercícios a recomendação diária fica em torno de 5 a 8 g de carboidrato / kg de peso corporal / dia, podendo chegar a 12 g para atletas que praticam atividades intensas durante várias horas por dia.
  const fatorDeAtividadeLeveLipideo = 1;//Iniciantes: 1 g por quilo de peso.
  const fatorDeAtividadeModeradoLipideo = 1.6; //  Treino de resistência: 1,6 g por quilo de peso.
  const fatorDeAtividadeIntensoLipideo = 2;// Treino de hipertrofia: 2 g por quilo de peso.
  const fatorDeAtividadeLeveFibra = 25;
  const fatorDeAtividadeModeradoFibra = 30;
  const fatorDeAtividadeIntensoFibra = 35;

  function calcularCaloriaNecessariasDiarias(fator: number) {

    let gastoCaloricoTotal = (gastoEnergeticoBasalHomem30a60Anos * fator).toFixed(2);
    setEnergiaKcalPage(gastoCaloricoTotal)

    // fonte: https://www.tuasaude.com/como-calcular-o-gasto-calorico/

  }

  function calcularProteinaNecessariaDiarias(fator: number) {

    let proteinaTotalDiaria = (lastMassaCorporal * fator).toFixed(2);
    setProteinaPage(proteinaTotalDiaria)

    return Number(proteinaTotalDiaria);

    // fontes:https://www.tuasaude.com/beneficios-das-proteinas/

  }

  function calcularCarboidratoNecessariaDiarias(fator: number) {

    let carboidratoTotalDiaria = (lastMassaCorporal * fator).toFixed(2);
    setCarboidratoPage(carboidratoTotalDiaria)

    return Number(carboidratoTotalDiaria);

    //https://www.drnutricao.com.br/Recomendacoes/macronutrientes

  }

  function calcularLipideoNecessariaDiarias(fator: number) {

    let lipideosTotalDiaria = (lastMassaCorporal * fator).toFixed(2);
    setLipideosPage(lipideosTotalDiaria)

    return Number(lipideosTotalDiaria);

    //https://www.efdeportes.com/efd185/proteina-recomendada-para-hipertrofia-muscular.htm

  }

  const optionsFatorAtividade = ["Leve", "Moderada", "Intensa"];

  function onSelectHandle(fatorAtividade: string) {

    if (fatorAtividade === "Leve") {

      //calcularCaloriaNecessariasDiarias(fatorDeAtividadeLeveCaloria);
      let proteina = calcularProteinaNecessariaDiarias(fatorDeAtividadeLeveProteina);
      let carboidrato = calcularCarboidratoNecessariaDiarias(fatorDeAtividadeLeveCarboidrato);
      let lipideos = calcularLipideoNecessariaDiarias(fatorDeAtividadeLeveLipideo);
      setFibraAlimentarPage(String(fatorDeAtividadeLeveFibra));
      setCalcioPage("1000");
      setSodioPage("2000");//Organização Mundial de Saúde (OMS)
      setFerroPage("10");

      let caloriaTotalDiaria = ((proteina * 4) + (lipideos * 9) + (carboidrato * 4) + (fatorDeAtividadeLeveFibra * 2)).toFixed(2);
      setEnergiaKcalPage(caloriaTotalDiaria);

      //https://alimentossemmitos.com.br/calorias
      //https://g1.globo.com/bemestar/noticia/2011/09/gordura-tem-mais-calorias-que-proteina-e-carboidrato-explica-medico.html

    } else if (fatorAtividade === "Moderada") {

      //calcularCaloriaNecessariasDiarias(fatorDeAtividadeModeradoCaloria);
      let proteina = calcularProteinaNecessariaDiarias(fatorDeAtividadeModeradoProteina);
      let carboidrato = calcularCarboidratoNecessariaDiarias(fatorDeAtividadeModeradoCarboidrato);
      let lipideos = calcularLipideoNecessariaDiarias(fatorDeAtividadeModeradoLipideo)
      setFibraAlimentarPage(String(fatorDeAtividadeModeradoFibra));
      setCalcioPage("1000");
      setSodioPage("2000");//Organização Mundial de Saúde (OMS)
      setFerroPage("10");

      let caloriaTotalDiaria = ((proteina * 4) + (lipideos * 9) + (carboidrato * 4) + (fatorDeAtividadeModeradoFibra * 2)).toFixed(2);
      setEnergiaKcalPage(caloriaTotalDiaria);

      //https://alimentossemmitos.com.br/calorias
      //https://g1.globo.com/bemestar/noticia/2011/09/gordura-tem-mais-calorias-que-proteina-e-carboidrato-explica-medico.html

    } else if (fatorAtividade === "Intensa") {

      //calcularCaloriaNecessariasDiarias(fatorDeAtividadeIntensoCaloria);
      let proteina = calcularProteinaNecessariaDiarias(fatorDeAtividadeIntensoProteina);
      let carboidrato = calcularCarboidratoNecessariaDiarias(fatorDeAtividadeIntensoCarboidrato);
      let lipideos = calcularLipideoNecessariaDiarias(fatorDeAtividadeIntensoLipideo)
      setFibraAlimentarPage(String(fatorDeAtividadeIntensoFibra));
      setCalcioPage("1000");
      setSodioPage("2000");//Organização Mundial de Saúde (OMS)
      setFerroPage("10");

      let caloriaTotalDiaria = ((proteina * 4) + (lipideos * 9) + (carboidrato * 4) + (fatorDeAtividadeIntensoFibra * 2)).toFixed(2);
      setEnergiaKcalPage(caloriaTotalDiaria);

      //https://alimentossemmitos.com.br/calorias
      //https://g1.globo.com/bemestar/noticia/2011/09/gordura-tem-mais-calorias-que-proteina-e-carboidrato-explica-medico.html

    }
  }

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
                width: '500px', padding: '10px 0px 20px 15px', display: 'flex',
                border: 1
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
                  options={optionsFatorAtividade}
                  renderInput={(params) => <TextField
                    required
                    {...params}
                    variant="standard"
                    className="input"
                    type="text"
                    autoFocus
                    id="standard-basic"
                    label="Fator Atividade"
                  />}
                />

                <TextField variant="standard"
                  id="standard-basic"
                  label="Massa Corporal"
                  className="input"
                  disabled
                  type="text"
                  value={lastMassaCorporal}
                />


                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Qtde. consumo sugerida (g)"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"
                  value={qtdeConsumoSugeridaPage}
                  onChange={(e) => {
                    setQtdeConsumoSugeridaPage(e.target.value);
                  }}
                />


                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Custo Mensal Previsto"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"
                  value={custoMensalPrevistoPage}
                  onChange={(e) => {
                    setCustoMensalPrevistoPage(convertCommaToDot(e.target.value));
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
                    setEnergiaKcalPage(convertCommaToDot(e.target.value));
                  }}
                />


                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Proteína(g)"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"                  
                  value={proteinaPage}
                  onChange={(e) => {
                    setProteinaPage(convertCommaToDot(e.target.value));
                  }}
                />


                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Lipídeos(g)"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"                  
                  value={lipideosPage}
                  onChange={(e) => {
                    setLipideosPage(convertCommaToDot(e.target.value));
                  }}
                />

                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Carboidrato(g)"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"                  
                  value={carboidratoPage}
                  onChange={(e) => {
                    setCarboidratoPage(convertCommaToDot(e.target.value));
                  }}
                />



                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Fibra Alimentar(g)"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"                  
                  value={fibraAlimentarlPage}
                  onChange={(e) => {
                    setFibraAlimentarPage(convertCommaToDot(e.target.value));
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
                  onChange={(e) => {
                    setCalcioPage(convertCommaToDot(e.target.value));
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
                    setSodioPage(convertCommaToDot(e.target.value));
                  }}
                />


                <TextField
                  required
                  variant="standard"
                  id="standard-basic"
                  label="Ferro(mg)"
                  className="input"
                  type="text"
                  //placeholder="nome Origem do Dado Nutricional"
                  //name="nomeOrigemDadoNutricionalPage"
                  //label="Informe a Origem do Dado Nutricional:"                  
                  value={ferroPage}
                  onChange={(e) => {
                    setFerroPage(convertCommaToDot(e.target.value));
                  }}
                />


                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker 
                    showTodayButton
                    placeholder='dd/MM/yyyy HH:mm'
                    format='dd/MM/yyyy HH:mm'
                    label="Data e Hora"
                    value={dtCadastroPage}
                    onChange={handleChange}
                    ampm={false}
                  />
                </MuiPickersUtilsProvider>


              </div>
            </Box>
            <Box
            
            >
              <div className={classes.root} >
              <DialogActions>
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
            </Box>
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

export default AddMetaDiaria;

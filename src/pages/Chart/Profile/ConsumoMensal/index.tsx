import Chart from "chart.js";
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { useStyles } from '../../../../../styles/useStyles';
import { useLazyQuery } from "@apollo/client";
import { GET_CONSUMO_DIARIO_BY_DATE_INICIAL_FINAL } from '../../../../queries/Profile/ConsumoDiario';
import { GET_META_DIARIA } from '../../../../queries/Profile/MetaDiaria';
import { TransitionProps } from '@mui/material/transitions';
import { TimeZoneCustom, getConfig, convertDateTime, convertUTCDateToLocalDate, SlideTransition } from "../../../../utils/CustomLib";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import $, { isEmptyObject } from 'jquery';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Fade from '@mui/material/Fade';

interface RowsData {

  dtConsumoExec: string;
  __typename: string;
  idConsumoNutricionalDiario: number;
  descricaoAlimento: string;
  fatorConversao: number;
  qtdePesoConsumidaExec: number;
  proteina: number;
  idAlimento: number;
  carboidrato: number;
  lipideos: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  energiaKcal: number;
  preco: number;
  pesoEmbalagem: number;
  idMetaDiaria: number;

}

interface SnackbarMessage {
  message: string;
  key: number;
}

//declare global {
//  interface Window { myLine: any; }
//}

//window.myLine = window.myLine || {};

function ConsumoDiario() {

  const classes = useStyles();
  const [consumoDiarioData, setConsumoDiarioData] = useState([]);
  const [metaDiariaData, setMetaDiariaData] = useState<any>([]);
  const [nutrientePage, setNutrientePage] = useState<string>("proteina");
  const [dtConsumoExecInicialPage, setDataConsumoDiarioInicialPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [dtConsumoExecFinalPage, setDataConsumoDiarioFinalPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]); const [state, setState] = React.useState<{
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

  const [loadGetMetaDiariaData] = useLazyQuery(GET_META_DIARIA, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setMetaDiariaData(data.getAllMetaDiaria);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  const [loadGetConsumoDiarioData, { called, loading, data }] = useLazyQuery(GET_CONSUMO_DIARIO_BY_DATE_INICIAL_FINAL, {
    variables: {
      dtConsumoExecInicial: TimeZoneCustom(dtConsumoExecInicialPage),
      dtConsumoExecFinal: TimeZoneCustom(dtConsumoExecFinalPage)
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setConsumoDiarioData(data.getConsumoByDateInicialFinal);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  const handleChangeInicial = (newValue: any | null) => {

    //setDataConsumoDiarioInicialPage(newValue.toISOString("pt-BR"));
    setDataConsumoDiarioInicialPage(newValue);

  };

  const handleChangeFinal = (newValue: any | null) => {

    setDataConsumoDiarioFinalPage(newValue);

  };

  const handleClickListItem = () => {

    loadGetMetaDiariaData();
    loadGetConsumoDiarioData();

  };

  let qtdePesoConsumidaExecTotal = 0;
  let proteinaTotal = 0;
  let lipideosTotal = 0;
  let fibraAlimentarTotal = 0;
  let carboidratoTotal = 0;
  let energiaKcalTotal = 0;
  let calcioTotal = 0;
  let sodioTotal = 0;
  let custoTotal = 0;

  React.useEffect(() => {

    let arrayDataConsumoDiario = consumoDiarioData.map((e: RowsData) => {

      let date = new Date(e.dtConsumoExec).toLocaleDateString("pt-BR");
      let ano = date.substring(6, 10);
      let mes = date.substring(3, 5);
      let dia = date.substring(0, 2);
      let newDate = ano + "-" + mes + "-" + dia;
      //console.log(newDate);
      e.dtConsumoExec = newDate;
      return e;
    });
    //let semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    const uniqueIds: any = [];
    const uniqueTotais: any = [];
    const metaDiariaLeve: any = [];
    const metaDiariaModerada: any = [];
    const metaDiariaIntensa: any = [];

    let i: number = 0;

    if (arrayDataConsumoDiario != undefined) {

      const unique = arrayDataConsumoDiario.filter(element => {

        const isDuplicate = uniqueIds.some((e: RowsData) => e.dtConsumoExec === element.dtConsumoExec);

        if(!isDuplicate){

          uniqueIds.push(element);
          metaDiariaLeve.push(
            [{
              "proteina": metaDiariaData[0].proteina,
              "carboidrato": metaDiariaData[0].carboidrato,
              "energiaKcal": metaDiariaData[0].energiaKcal,
              "fibraAlimentar": metaDiariaData[0].fibraAlimentar,
              "lipideo": metaDiariaData[0].lipideos,
              "sodio": (Number(metaDiariaData[0].sodio) / 1000),
              "calcio": (Number(metaDiariaData[0].calcio) / 1000),
              "qtdePesoConsumidaExec": metaDiariaData[0].qtdePesoConsumidaExec
            }]
          );
          metaDiariaModerada.push(
            [{
              "proteina": metaDiariaData[1].proteina,
              "carboidrato": metaDiariaData[1].carboidrato,
              "energiaKcal": metaDiariaData[1].energiaKcal,
              "fibraAlimentar": metaDiariaData[1].fibraAlimentar,
              "lipideo": metaDiariaData[1].lipideos,
              "sodio": (Number(metaDiariaData[1].sodio) / 1000),
              "calcio": (Number(metaDiariaData[1].calcio) / 1000),
              "qtdePesoConsumidaExec": metaDiariaData[1].qtdePesoConsumidaExec
            }]
          );
          metaDiariaIntensa.push(
            [{
              "proteina": metaDiariaData[2].proteina,
              "carboidrato": metaDiariaData[2].carboidrato,
              "energiaKcal": metaDiariaData[2].energiaKcal,
              "fibraAlimentar": metaDiariaData[2].fibraAlimentar,
              "lipideo": metaDiariaData[2].lipideos,
              "sodio": (Number(metaDiariaData[2].sodio) / 1000),
              "calcio": (Number(metaDiariaData[2].calcio) / 1000),
              "qtdePesoConsumidaExec": metaDiariaData[2].qtdePesoConsumidaExec
            }]
          );
          return true;
        }

      });

      let sizeArraDataConsumoDiario = arrayDataConsumoDiario.length;

      uniqueIds.map((e: RowsData) => {

        for (i = 0; i < sizeArraDataConsumoDiario; i++) {

          if(e.dtConsumoExec === arrayDataConsumoDiario[i].dtConsumoExec) {

            if(arrayDataConsumoDiario[i].pesoEmbalagem === 0 || arrayDataConsumoDiario[i].preco === 0) {
              
              custoTotal = Number(custoTotal) + 0;

            } else {
              //custoTotal = Number(custoTotal) + (Number(arrayDataConsumoDiario[i].preco)/Number(arrayDataConsumoDiario[i].pesoEmbalagem)*Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec));
              custoTotal = isNaN(Number((Number(arrayDataConsumoDiario[i].preco) / Number(arrayDataConsumoDiario[i].pesoEmbalagem) * Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec)))) ? Number(custoTotal) + 0 : Number(custoTotal) + (Number(arrayDataConsumoDiario[i].preco) / Number(arrayDataConsumoDiario[i].pesoEmbalagem) * Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec));

            }
            qtdePesoConsumidaExecTotal = Number(qtdePesoConsumidaExecTotal) + Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec);
            proteinaTotal = proteinaTotal + Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100) * Number(arrayDataConsumoDiario[i].proteina)));
            lipideosTotal = lipideosTotal + Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100) * Number(arrayDataConsumoDiario[i].lipideos)));
            fibraAlimentarTotal = fibraAlimentarTotal + Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100) * Number(arrayDataConsumoDiario[i].fibraAlimentar)));
            carboidratoTotal = carboidratoTotal + Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100) * Number(arrayDataConsumoDiario[i].carboidrato)));
            energiaKcalTotal = energiaKcalTotal + Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100) * Number(arrayDataConsumoDiario[i].energiaKcal)));
            calcioTotal = calcioTotal + Number(Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100)) / 1000 * Number(arrayDataConsumoDiario[i].calcio)));
            sodioTotal = sodioTotal + Number(Number(Number(Number(arrayDataConsumoDiario[i].qtdePesoConsumidaExec / 100)) / 1000 * Number(arrayDataConsumoDiario[i].sodio)));

          }

        }
        //console.log(proteinaTotal)
        uniqueTotais.push(
          [{
            "proteina": proteinaTotal.toFixed(2),
            "custoTotal": custoTotal.toFixed(2),
            "carboidrato": carboidratoTotal.toFixed(2),
            "energiaKcal": energiaKcalTotal.toFixed(2),
            "fibraAlimentar": fibraAlimentarTotal.toFixed(2),
            "lipideo": lipideosTotal.toFixed(2),
            "sodio": sodioTotal.toFixed(2),
            "calcio": calcioTotal.toFixed(2),
            "qtdePesoConsumidaExec": qtdePesoConsumidaExecTotal.toFixed(2)
          }]
        );

        custoTotal = 0;
        qtdePesoConsumidaExecTotal = 0;
        energiaKcalTotal = 0;
        lipideosTotal = 0;
        carboidratoTotal = 0;
        calcioTotal = 0;
        sodioTotal = 0;
        proteinaTotal = 0;
        fibraAlimentarTotal = 0;
      });

      let nutriente = [];
      let myLine: any = null;

      if (nutrientePage !== "") { //caso selecione um nutriente

        nutriente[0] = nutrientePage;

        //apaga gráficos gerados anteriormente caso exista
        for (i = 0; i <= 8; i++) {
          $('#line-chart' + i).remove(); // this is my <canvas> element         

          if (myLine != null) {
            myLine.destroy();
          }
        }

      } else {//caso selecione Mostrar Todos

        //apaga gráficos gerados anteriormente caso exista
        for (i = 0; i <= 8; i++) {
          $('#line-chart' + i).remove(); // this is my <canvas> element         

          if (myLine != null) {
            myLine.destroy();
          }
        }

        nutriente = [

          "custoTotal", "qtdePesoConsumidaExec", "calcio", "carboidrato", "energiaKcal", "fibraAlimentar", "lipideo", "proteina", "sodio"

        ];

      }

      nutriente.forEach((element, index) => {

        let config = getConfig(element, unique, uniqueTotais, metaDiariaLeve, metaDiariaModerada, metaDiariaIntensa);

        $('#chart').append('<canvas  id="line-chart' + index + '"><canvas>');

        let canvas: any = document.getElementById('line-chart' + index)!;
        let ctx = canvas.getContext("2d");

        // @ts-ignore
        myLine = new Chart(ctx, config);

      });
      
    }
  
  }, [consumoDiarioData, metaDiariaData, nutrientePage]);

  function handleClickMostrarTodos() {

    setNutrientePage("");
    loadGetMetaDiariaData();
    loadGetConsumoDiarioData();

  }

  let options = [

    "Custo Total", "Quantidade", "Cálcio", "Carboidratos", "Energia Kcal", "Fibra Alimentar", "Lipídeo", "Proteína", "Sódio"

  ];

  function onSelectHandle(nutriente: string) {

    switch (nutriente) {

      case "Custo Total":
        return setNutrientePage("custoTotal");

      case "Quantidade":
        return setNutrientePage("qtdePesoConsumidaExec");

      case "Proteína":
        return setNutrientePage("proteina");

      case "Energia Kcal":
        return setNutrientePage("energiaKcal");

      case "Lipídeo":
        return setNutrientePage("lipideo");

      case "Sódio":
        return setNutrientePage("sodio");

      case "Cálcio":
        return setNutrientePage("calcio");

      case "Fibra Alimentar":
        return setNutrientePage("fibraAlimentar");

      case "Carboidratos":
        return setNutrientePage("carboidrato");

      default:
        return setNutrientePage("qtdePesoConsumidaExec");

    }
  }

  return (
    <>
      <main>
        <form>
          {//"troca a cor de background somente para uma tela específica"

          }
          <style >{`
             body {
             background: #222222;
            }           
          `}</style>
          <Link prefetch={false} href="/Landing"        >
            <a>
              <div className={classes.appBar}>
                <AppBar position="static">
                  <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                      Consumo Diário - Gráfico
                    </Typography>
                  </Toolbar>
                </AppBar>
              </div>
            </a>
          </Link>
          <div className={classes.root}>
            <AppBar position="sticky" sx={{ bgcolor: "white" }}>
              <Toolbar >
                <Stack direction="row" spacing={3} >
                  <Autocomplete sx={{ margin: "-15px 5px 15px 15px", width: "150px" }}
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
                      sx={{ fontSize: "10px" }}
                      autoFocus
                      id="standard-basic"
                      label="Selecione o nutriente"
                    />}
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                    showTodayButton
                      placeholder='dd/MM/yyyy'
                      format='dd/MM/yyyy'
                      label="Data Inicial"
                      value={dtConsumoExecInicialPage}
                      onChange={handleChangeInicial}
                      
                    />
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                    showTodayButton
                      placeholder='dd/MM/yyyy'
                      format='dd/MM/yyyy'
                      label="Data Final"
                      value={dtConsumoExecFinalPage}
                      onChange={handleChangeFinal}
                      
                    />
                  </MuiPickersUtilsProvider>
                  <IconButton onClick={handleClickListItem} >
                    <SearchIcon color="secondary" />
                  </IconButton>
                  <Button onClick={handleClickMostrarTodos} variant="contained">Mostrar todos</Button>
                </Stack>
              </Toolbar>
            </AppBar>
          </div>
          <div className={classes.root}>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
              <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                  </div>
                </div>
              </div>
              <Box sx={{ margin: "30px" }} >
                <div className="p-4 flex-auto">
                  {/* Chart */}
                  <div id="chart" className="relative h-50-px w-25 px">
                  </div>
                </div>
              </Box>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
export default ConsumoDiario;

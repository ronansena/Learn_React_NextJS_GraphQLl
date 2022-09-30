import Chart from "chart.js";
import PageHeader from '../../../../components/ScreenGenericComponent/PageHeader';
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { useStyles } from '../../../../../styles/useStyles';
import { useLazyQuery } from "@apollo/client";
import { GET_MASSA_CORPORAL_BY_DATE } from '../../../../queries/Profile/MassaCorporal';
import { TransitionProps } from '@mui/material/transitions';
import { TimeZoneCustom, convertDateTime, convertUTCDateToLocalDate, SlideTransition } from "../../../../utils/CustomLib";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import SearchIcon from "@material-ui/icons/Search";
import $ from 'jquery';

import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Fade from '@mui/material/Fade';

interface RowsData {

  __typename: string;
  idMassaCorporal: number;
  idProfileUser: number;
  massaCorporalCadastrada: number;
  dataMassaCorporal: string;
  idWorkout: number;

}

interface SnackbarMessage {
  message: string;
  key: number;
}

//declare global {
//  interface Window { myLine: any; }
//}

//window.myLine = window.myLine || {};

function MassaCorporal() {



  const classes = useStyles();
  const [massaCorporalData, setMassaCorporalData] = useState([]);
  const [dataMassaCorporalInicialPage, setDataMassaCorporalInicialPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [dataMassaCorporalFinalPage, setDataMassaCorporalFinalPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
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

  // load the datagrid information  
  const [loadGetMassaCorporalData, { called, loading, data }] = useLazyQuery(GET_MASSA_CORPORAL_BY_DATE, {
    variables: {
      dataMassaCorporalInicial: TimeZoneCustom(dataMassaCorporalInicialPage),
      dataMassaCorporalFinal: TimeZoneCustom(dataMassaCorporalFinalPage)
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setMassaCorporalData(data.getMassaCorporalByDate);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  const handleChangeInicial = (newValue: any | null) => {

    setDataMassaCorporalInicialPage(convertDateTime(newValue));

  };

  const handleChangeFinal = (newValue: any | null) => {

    setDataMassaCorporalFinalPage(convertDateTime(newValue));

  };

  const handleClickListItem = () => {
    loadGetMassaCorporalData()
  };

  
  
  React.useEffect(() => {
    
    let semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    var config = {
      type: "line",
      data: {
        labels: massaCorporalData.map((e: RowsData) => {
          let d = new Date(e.dataMassaCorporal);

          let data = e.dataMassaCorporal;
          let ano = data.substring(0, 4);
          let mes = data.substring(5, 7);
          let dia = data.substring(8, 10);
          let indexDay = d.getUTCDay();

          return semana[indexDay] + " - " + dia + "/" + mes + "/" + ano;


        }),
        datasets: [
          {
            //label: new Date().getFullYear() - 1,
            label: "Massa Corporal",
            fill: false,
            //backgroundColor: "#edf2f7",
            backgroundColor: ["#a1a7b3", "#a1a7b3", "#a1a7b3", "#a1a7b3", "#a1a7b3"],
            borderColor: "#edf2f7",
            data: massaCorporalData.map((e: RowsData) => {
              return e.massaCorporalCadastrada;
            }),
          },
        ],
      },
      options: {
        aspectRatio: 3,
        maintainAspectRatio: true,
        responsive: true,
        title: {
          display: false,
          text: "Massa Corporal",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Data de Registro",
                fontColor: "white",
              },
              gridLines: {
                display: true,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Peso",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: true,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };

    //trecho necessário para apagar deletar o gráfico gerado para a consulta anterior
    $('#line-chart').remove(); // this is my <canvas> element
    $('#chart').append('<canvas  id="line-chart"><canvas>');

    let myLine: any = null;

    if (myLine != null) {
      myLine.destroy();
    }

    var canvas: any = document.getElementById("line-chart")!;
    var ctx = canvas.getContext("2d");
    // @ts-ignore
    myLine = new Chart(ctx, config);
  }, [massaCorporalData]); 


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
                      Massa Corporal - Gráfico
                    </Typography>
                  </Toolbar>
                </AppBar>
              </div>
            </a>
          </Link>

          <div className={classes.root}>

            <AppBar position="sticky" sx={{ bgcolor: "white" }}>
              <Toolbar >

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                  showTodayButton
                    placeholder='dd/MM/yyyy'
                    format='dd/MM/yyyy'
                    label="Data Inicial"
                    value={dataMassaCorporalInicialPage}
                    onChange={handleChangeInicial}
                    
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                  showTodayButton
                    placeholder='dd/MM/yyyy'
                    format='dd/MM/yyyy'
                    label="Data Final"
                    value={dataMassaCorporalFinalPage}
                    onChange={handleChangeFinal}
                  />
                </MuiPickersUtilsProvider>
                <IconButton onClick={handleClickListItem} >
                  <SearchIcon color="secondary" />
                </IconButton>
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
                    <canvas id="line-chart"></canvas>
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

export default MassaCorporal;

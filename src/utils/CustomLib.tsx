import Slide, { SlideProps } from '@mui/material/Slide';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Fade from '@mui/material/Fade';
//import Grow, { GrowProps } from '@mui/material/Grow';

function TimeZoneCustom(dtValue: string) {

  let myDate: any = new Date(dtValue).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  let time = myDate.substring(10)
  myDate = myDate.substring(0, 10).split("/");
  let newDate = myDate[2] + "-" + myDate[1] + "-" + myDate[0];

  return newDate + time;
}


function convertCommaToDot(value: string) {

  let number = "";

  const re = new RegExp(/^[0-9,]*\.?[0-9,]*$/)

  if (value === "" || re.test(value)) {

    number = (value.replace(/,/g, '.'))
  }

  return number;

}

function convertFixNumber(value: string) {

  return parseFloat(parseFloat(value).toFixed(2));

}


function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function convertDateTime(date: any) {
  
  let newDate = date.toISOString().split('T')[0] + ' '
    + date.toTimeString().split(' ')[0];
    
  return newDate;
}

function convertUTCDateToLocalDate(date: any) {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset());
  return newDate;
}


function onBlurField(buttonRef: any) {

  //(buttonRef.current || '').focus(); is the same of the solution on line  804
  buttonRef.current?.focus() || ''

}

function handleTotalSleep(dtStart: any, dtEnd: any) {

  if (dtStart !== null && dtEnd !== null) {

    var dtPartida = dtStart;
    var dtChegada = dtEnd;

    var date1 = new Date(dtPartida.slice(0, 4), dtPartida.slice(5, 7), dtPartida.slice(8, 10), dtPartida.slice(11, 13), dtPartida.slice(14, 16)),
      date2 = new Date(dtChegada.slice(0, 4), dtChegada.slice(5, 7), dtChegada.slice(8, 10), dtChegada.slice(11, 13), dtChegada.slice(14, 16));

    var diffMs = (Number(date2) - Number(date1));
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    var diff = diffHrs + 'h ' + diffMins + 'm';
    //console.log(diff);
    return (diff)

  } else {
    return ("")
  }


}

function handleNumberMysql(value: any, massa: string) {

  if (value != null) {

    let newValue: any = parseFloat(value.toFixed(2));

    if (isNaN(newValue)) {

      newValue = 0;

    }

    if (massa === "mg") {

      newValue = newValue / 1000;

    }

    return newValue;

  }
}
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


function getConfig(nutrientePage: any, unique: any, uniqueTotais: any, metaDiariaLeve: any, metaDiariaModerada: any, metaDiariaIntensa: any) {

  let semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

  //console.log(uniqueTotais);
  let config = {
    
    type: "line",
    data: {
      labels: unique.map((e: RowsData) => {
        let d = new Date(e.dtConsumoExec);

        let data = e.dtConsumoExec;
        let ano = data.substring(0, 4);
        let mes = data.substring(5, 7);
        let dia = data.substring(8, 11);
        let indexDay = d.getUTCDay();
        return semana[indexDay] + " - " + dia + "/" + mes + "/" + ano;

      }),
      datasets: [
        {
          //label: new Date().getFullYear() - 1,
          label: "Consumo Diário",
          fill: false,
          //backgroundColor: "#edf2f7",
          backgroundColor: ["#a1a7b3"],
          borderColor: "#edf2f7",
          data: uniqueTotais.map((e: any) => {

            switch (nutrientePage) {

              case "custoTotal":
                return e[0].custoTotal;

              case "qtdePesoConsumidaExec":
                return e[0].qtdePesoConsumidaExec;

              case "proteina":
                return e[0].proteina;

              case "energiaKcal":
                return e[0].energiaKcal;

              case "lipideo":
                return e[0].lipideo;

              case "sodio":
                return e[0].sodio;

              case "calcio":
                return e[0].calcio;

              case "fibraAlimentar":
                return e[0].fibraAlimentar;

              case "carboidrato":
                return e[0].carboidrato;

              default:
                return e[0].qtdePesoConsumidaExec;
            }
          }),
        },
        {
          //label: new Date().getFullYear() - 1,
          label: "Meta Diária Leve",
          fill: false,
          //backgroundColor: "#edf2f7",
          backgroundColor: ["#55ff33"],
          borderColor: "#55ff33",
          data: metaDiariaLeve.map((e: any) => {

            switch (nutrientePage) {
              case "qtdePesoConsumidaExec":
                return e[0].qtdePesoConsumidaExec;

              case "proteina":
                return e[0].proteina;

              case "energiaKcal":
                return e[0].energiaKcal;

              case "lipideo":
                return e[0].lipideo;

              case "sodio":
                return e[0].sodio;

              case "calcio":
                return e[0].calcio;

              case "fibraAlimentar":
                return e[0].fibraAlimentar;

              case "carboidrato":
                return e[0].carboidrato;

              default:
                return e[0].qtdePesoConsumidaExec;
            }
          }),
        },
        {
          //label: new Date().getFullYear() - 1,
          label: "Meta Diária Moderada",
          fill: false,
          //backgroundColor: "#edf2f7",
          backgroundColor: ["#fff033"],
          borderColor: "#fff033",
          data: metaDiariaModerada.map((e: any) => {

            switch (nutrientePage) {
              case "qtdePesoConsumidaExec":
                return e[0].qtdePesoConsumidaExec;

              case "proteina":
                return e[0].proteina;

              case "energiaKcal":
                return e[0].energiaKcal;

              case "lipideo":
                return e[0].lipideo;

              case "sodio":
                return e[0].sodio;

              case "calcio":
                return e[0].calcio;

              case "fibraAlimentar":
                return e[0].fibraAlimentar;

              case "carboidrato":
                return e[0].carboidrato;

              default:
                return e[0].qtdePesoConsumidaExec;
            }
          }),
        },
        {
          //label: new Date().getFullYear() - 1,
          label: "Meta Diária Intensa",
          fill: false,
          //backgroundColor: "#edf2f7",
          backgroundColor: ["#ff333f"],
          borderColor: "#ff333f",
          data: metaDiariaIntensa.map((e: any) => {

            switch (nutrientePage) {
              case "qtdePesoConsumidaExec":
                return e[0].qtdePesoConsumidaExec;

              case "proteina":
                return e[0].proteina;

              case "energiaKcal":
                return e[0].energiaKcal;

              case "lipideo":
                return e[0].lipideo;

              case "sodio":
                return e[0].sodio;

              case "calcio":
                return e[0].calcio;

              case "fibraAlimentar":
                return e[0].fibraAlimentar;

              case "carboidrato":
                return e[0].carboidrato;

              default:
                return e[0].qtdePesoConsumidaExec;
            }

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
        text: "Consumo Diário",
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
              labelString: nutrientePage,
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

  return config;
}


export { handleNumberMysql, handleTotalSleep, TimeZoneCustom, convertCommaToDot, convertFixNumber, SlideTransition, convertDateTime, convertUTCDateToLocalDate, onBlurField, getConfig }



/*
function GrowTransition(props: GrowProps) {
 return <Grow {...props} />;
}

const handleChangeCheckAll = (e: ChangeEvent<HTMLInputElement> & { target: Element }) => {
 
 //console.log(checkboxRef)
 //console.log(apiRef.current)
 //checkboxRef.current.click();
 
 if ((e.target as HTMLInputElement).checked === true) {
   //        setSelectionModel(params.idConsumoDiario)
   //      setCheckboxSelection(true);
   let checkboxes = document.querySelectorAll("#selectOne") as NodeListOf<HTMLInputElement>;
 
   checkboxes.forEach(id => {
     //  console.log("aqui true " + id.checked)
     if (id.checked === false)
       id.click();
 
   });
 
 } else {
 
   let checkboxes = document.querySelectorAll("#selectOne") as NodeListOf<HTMLInputElement>;
   checkboxes.forEach(id => {
     //  console.log("aqui false " + id.checked)
     if (id.checked === true)
       id.click();
   });
   setDeletedRows([]);
 }
 
};
 
 
function removeItemOnce(arr: Array<number>, value: number) {
 var index = arr.indexOf(value);
 if (index > -1) {
   arr.splice(index, 1);
 }
 return arr;
}
 
function handleConfirmChange(clickedRow: GridSelectionModel) {
 // console.log("clickedRow =>" + clickedRow)
 // rowsDataTemp.map((x) => {
 // console.log("handleConfirmChange event.target.checked: " + event.target.checked)
 //  console.log("handleConfirmChange checked: " + checked)
 
 //  if (x.idConsumoDiario === clickedRow) {
 console.log("x=> " + clickedRow)
 
 
 selectedRows.push(e);
 
 
 console.log(selectedRows)
 //    if(!deletedRows.includes(x.idConsumoDiario) && checked === true) {   
 
 if ((event.target as HTMLInputElement).checked === true) {
 
   setDeletedRows(deletedRows.concat(selectedRows));
   // console.log("aqui if deletedRows: " + deletedRows)
   //  console.log("aqui if selectedRows: " + selectedRows)
   //  console.log(selectedRows)
 } else {
 
   removeItemOnce(selectedRows, clickedRow)
   removeItemOnce(deletedRows, clickedRow)
   // console.log("aqui else selectedRows: " + selectedRows)
   //  console.log("aqui else deletedRows: " + deletedRows)
   // implementar para retirar o id que foi desmarcado
 }
 
}
*/

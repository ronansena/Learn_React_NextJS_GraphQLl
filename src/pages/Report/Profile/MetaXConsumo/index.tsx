import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { makeStyles, createStyles } from '@material-ui/core';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
//import style from "./styles.module.scss";
import MenuIcon from "@material-ui/icons/Menu";
import NutritionLabel from '../../../../components/ScreenGenericComponent/NutritionLabel';
import { TimeZoneCustom, convertDateTime, convertUTCDateToLocalDate } from "../../../../utils/CustomLib";
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import Link from "next/link";
import { useLazyQuery } from "@apollo/client";
import { GET_META_DIARIA } from '../../../../queries/Profile/MetaDiaria';
import { GET_CONSUMO_DIARIO_BY_DATE } from '../../../../queries/Profile/ConsumoDiario';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useStyles } from '../../../../../styles/useStyles';




type Order = 'asc' | 'desc';


interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [

  {
    id: 'descricaoAlimento',
    numeric: false,
    disablePadding: true,
    label: 'Descrição Alimento',
  },
  {
    id: 'horaConsumo',
    numeric: false,
    disablePadding: true,
    label: 'Hora',
  },
  {
    id: 'qtdePesoConsumidaExec',
    numeric: false,
    disablePadding: true,
    label: 'Qtde. Consumida',
  },
  {
    id: 'custo',
    numeric: false,
    disablePadding: true,
    label: 'Custo',
  },
  {
    id: 'proteina',
    numeric: false,
    disablePadding: true,
    label: 'Proteína',
  },
  {
    id: 'carboidrato',
    numeric: false,
    disablePadding: true,
    label: 'Carboidrato',
  },
  {
    id: 'lipideos',
    numeric: false,
    disablePadding: true,
    label: 'Lipídeos',
  },
  {
    id: 'fibraAlimentar',
    numeric: false,
    disablePadding: true,
    label: 'Fibra Alimentar',
  },
  {
    id: 'calcio',
    numeric: false,
    disablePadding: true,
    label: 'Cálcio',
  },
  {
    id: 'sodio',
    numeric: false,
    disablePadding: true,
    label: 'Sódio',
  },
  {
    id: 'energiaKcal',
    numeric: false,
    disablePadding: true,
    label: 'Energia Kcal',
  },
  {
    id: 'blankColumn',
    numeric: false,
    disablePadding: true,
    label: '',
  }



];


interface EnhancedTableProps {
  numSelected: number;
  order: Order;
  orderBy: string;
  rowCount: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:"#424242",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#212121",
    color: theme.palette.common.white,
    fontSize: 10,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function EnhancedTableHead(props: EnhancedTableProps) {


  return (
    <TableHead>
      <StyledTableRow 
>
        <StyledTableCell padding="checkbox">

        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell style={{ fontWeight: "bolder" }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          //sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
            //active={orderBy === headCell.id}
            // direction={orderBy === headCell.id ? order : 'asc'}
            //onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
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

}


export default function MetaXConsumo() {



  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof RowsData>('descricaoAlimento');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [progress, setProgress] = React.useState(10);
  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  const classes = useStyles();
  const [consumoDiarioData, setConsumoDiarioData] = useState([]);
  const [metaDiariaData, setMetaDiariaData] = useState<any>([]);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const rowsData = consumoDiarioData;
  const [dtConsumoExecPage, setDtConsumoExecPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());

  const [energiaKcalPage, setEnergiaKcalPage] = useState<string>("");
  const [proteinaPage, setProteinaPage] = useState<string>("");
  const [pesoEmbalagemPage, setPesoEmbalagemPage] = useState<string>("");
  const [lipideosPage, setLipideosPage] = useState<string>("");
  const [carboidratoPage, setCarboidratoPage] = useState<string>("");
  const [fibraAlimentarlPage, setFibraAlimentarPage] = useState<string>("");
  const [calcioPage, setCalcioPage] = useState<string>("");
  const [sodioPage, setSodioPage] = useState<string>("");
  const [precoPage, setPrecoPage] = useState<string>("");
  const [qtdeConsumidaExecPage, setQtdeConsumidaExecPage] = useState<number>(0);  
  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState<string>("");
  const [open2, setOpen2] = React.useState(false);
  
  const [loadConsumoDiario, { called, loading, data }] = useLazyQuery(GET_CONSUMO_DIARIO_BY_DATE, {
    variables: { dtConsumoExec: TimeZoneCustom(dtConsumoExecPage) },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setConsumoDiarioData(data.getConsumoByDate);

    },
    onError: (error) => {

    }
  })

  const [loadMetaDiaria, { data: dataR }] = useLazyQuery(GET_META_DIARIA, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setMetaDiariaData(data.getAllMetaDiaria);

    },
    onError: (error) => {

    }
  })

  useEffect(() => {

    loadConsumoDiario()

  }, [dtConsumoExecPage,loadConsumoDiario])


  useEffect(() => {

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {

          const isDuplicate = uniqueIds.includes(element.idConsumoNutricionalDiario);

          if (!isDuplicate) {

            uniqueIds.push(element);
            return true;

          }
        });

        //ordenar o array antes de atualizar a tela   
        //console.log(unique);
        setRowsDataTemp(unique);
        setRowsPerPage(unique.length)


      }
    }
  }, [consumoDiarioData,rowsData]);


  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rowsDataTemp.map((n) => n.idConsumoNutricionalDiario);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  
  const isSelected = (idConsumoNutricionalDiario: number) => selected.indexOf(idConsumoNutricionalDiario) !== -1;

  const handleClick = (event: React.MouseEvent<unknown>, idConsumoNutricionalDiario: number) => {
    const selectedIndex = selected.indexOf(idConsumoNutricionalDiario);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, idConsumoNutricionalDiario);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }


    rowsDataTemp.filter((e) => {
      if (e.idConsumoNutricionalDiario === idConsumoNutricionalDiario) {

        setEnergiaKcalPage(e.energiaKcal.toFixed(2))
        setCarboidratoPage(e.carboidrato.toFixed(2))
        setCalcioPage(e.calcio.toFixed(2))
        setSodioPage(e.sodio.toFixed(2))
        setProteinaPage(e.proteina.toFixed(2))
        setFibraAlimentarPage(e.fibraAlimentar.toFixed(2))
        setLipideosPage(e.lipideos.toFixed(2))
        setPesoEmbalagemPage(e.pesoEmbalagem === null ? "0" : e.pesoEmbalagem.toFixed(0))
        setPrecoPage(e.preco === null ? "0" : e.preco.toFixed(2))
        setDescricaoAlimentoPage(e.descricaoAlimento)
        setQtdeConsumidaExecPage(e.qtdePesoConsumidaExec)
      }
    })
    setOpen2(true);

    setSelected(newSelected);
  };


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsDataTemp.length) : 0;

  //console.log(rowsDataTemp)

 

  const handleChange = (newValue: any | null) => {

    setRowsDataTemp([]);
    setConsumoDiarioData([]);
    setDtConsumoExecPage(newValue.toISOString("pt-BR"));

  };


  useEffect(() => {

    loadMetaDiaria()

  }, [loadMetaDiaria])

  const [divStyleProteina, setDivStyleProteina] = useState<any>();
  const [divStyleCarboidrato, setDivStyleCarboidrato] = useState<any>();
  const [divStyleLipideo, setDivStyleLipideo] = useState<any>();
  const [divStyleCalcio, setDivStyleCalcio] = useState<any>();
  const [divStyleSodio, setDivStyleSodio] = useState<any>();
  const [divStyleEnergiaKcal, setDivStyleEnergiaKcal] = useState<any>();
  const [divStyleFibraAlimentar, setDivStyleFibraAlimentar] = useState<any>();

  useEffect(() => {  
  
    let qtdePesoConsumidaExecTotalColor = 0;
    let proteinaTotalColor = 0;
    let lipideoTotalColor = 0;
    let fibraAlimentarTotalColor = 0;
    let carboidratoTotalColor = 0;
    let energiaKcalTotalColor = 0;
    let calcioTotalColor = 0;
    let sodioTotalColor = 0;  

    rowsDataTemp.map((row, index) => {

      qtdePesoConsumidaExecTotalColor = qtdePesoConsumidaExecTotalColor + row.qtdePesoConsumidaExec;
      proteinaTotalColor = proteinaTotalColor + Number(((row.qtdePesoConsumidaExec / 100) * row.proteina));
      lipideoTotalColor = lipideoTotalColor + Number(((row.qtdePesoConsumidaExec / 100) * row.lipideos));
      fibraAlimentarTotalColor = fibraAlimentarTotalColor + Number(((row.qtdePesoConsumidaExec / 100) * row.fibraAlimentar));
      carboidratoTotalColor = carboidratoTotalColor + Number(((row.qtdePesoConsumidaExec / 100) * row.carboidrato));
      energiaKcalTotalColor = energiaKcalTotalColor + Number(((row.qtdePesoConsumidaExec / 100) * row.energiaKcal));
      calcioTotalColor = calcioTotalColor + Number((((row.qtdePesoConsumidaExec / 100)) / 1000 * row.calcio));
      sodioTotalColor = sodioTotalColor + Number((((row.qtdePesoConsumidaExec / 100)) / 1000 * row.sodio));

    })

    if (metaDiariaData[0] !== undefined) {
      console.log(metaDiariaData[0])

      let proteinaColorLeve = Number(metaDiariaData[0].proteina)
      let proteinaColorIntensa = Number(metaDiariaData[2].proteina)

      if (proteinaTotalColor < proteinaColorLeve) {

        setDivStyleProteina('yellow')

      } else if (proteinaTotalColor >= proteinaColorLeve && proteinaTotalColor < proteinaColorIntensa) {

        setDivStyleProteina('green')

      } else if (proteinaTotalColor >= proteinaColorIntensa) {

        setDivStyleProteina('red')

      }

      let carboidratoColorLeve = Number(metaDiariaData[0].carboidrato)
      let carboidratoColorIntensa = Number(metaDiariaData[2].carboidrato)

      if (carboidratoTotalColor < carboidratoColorLeve) {

        setDivStyleCarboidrato('yellow')

      } else if (carboidratoTotalColor >= carboidratoColorLeve && carboidratoTotalColor < carboidratoColorIntensa) {

        setDivStyleCarboidrato('green')

      } else if (carboidratoTotalColor >= carboidratoColorIntensa) {

        setDivStyleCarboidrato('red')

      }

      let lipideoColorLeve = Number(metaDiariaData[0].lipideos)
      let lipideoColorIntensa = Number(metaDiariaData[2].lipideos)

      if (lipideoTotalColor < lipideoColorLeve) {

        setDivStyleLipideo('yellow')

      } else if (lipideoTotalColor >= lipideoColorLeve && lipideoTotalColor < lipideoColorIntensa) {

        setDivStyleLipideo('green')

      } else if (lipideoTotalColor >= lipideoColorIntensa) {

        setDivStyleLipideo('red')

      }

      let calcioColorLeve = Number(metaDiariaData[0].calcio)
      let calcioColorIntensa = Number(metaDiariaData[2].calcio)

      if (calcioTotalColor < calcioColorLeve) {

        setDivStyleCalcio('yellow')

      } else if (calcioTotalColor >= calcioColorLeve && calcioTotalColor < calcioColorIntensa) {

        setDivStyleCalcio('green')

      } else if (calcioTotalColor >= calcioColorIntensa) {

        setDivStyleCalcio('red')

      }


      let sodioColorLeve = Number(metaDiariaData[0].sodio)
      let sodioColorIntensa = Number(metaDiariaData[2].sodio)

      if (sodioTotalColor < sodioColorLeve) {

        setDivStyleSodio('yellow')

      } else if (sodioTotalColor >= sodioColorLeve && sodioTotalColor < sodioColorIntensa) {

        setDivStyleSodio('green')

      } else if (sodioTotalColor >= sodioColorIntensa) {

        setDivStyleSodio('red')

      }

      let energiaKcalColorLeve = Number(metaDiariaData[0].energiaKcal)
      let energiaKcalColorIntensa = Number(metaDiariaData[2].energiaKcal)

      if (energiaKcalTotalColor < energiaKcalColorLeve) {

        setDivStyleEnergiaKcal('yellow')

      } else if (energiaKcalTotalColor >= energiaKcalColorLeve && energiaKcalTotalColor < energiaKcalColorIntensa) {

        setDivStyleEnergiaKcal('green')

      } else if (energiaKcalTotalColor >= energiaKcalColorIntensa) {

        setDivStyleEnergiaKcal('red')

      }

      let fibraAlimentarColorLeve = Number(metaDiariaData[0].fibraAlimentar)
      let fibraAlimentarColorIntensa = Number(metaDiariaData[2].fibraAlimentar)

      if (fibraAlimentarTotalColor < fibraAlimentarColorLeve) {

        setDivStyleFibraAlimentar('yellow')

      } else if (fibraAlimentarTotalColor >= fibraAlimentarColorLeve && fibraAlimentarTotalColor < fibraAlimentarColorIntensa) {

        setDivStyleFibraAlimentar('green')

      } else if (fibraAlimentarTotalColor >= fibraAlimentarColorIntensa) {

        setDivStyleFibraAlimentar('red')

      }

    }

  }, [rowsDataTemp, metaDiariaData, consumoDiarioData])

  let qtdePesoConsumidaExecTotal = 0;
  let proteinaTotal = 0;
  let lipideosTotal = 0;
  let fibraAlimentarTotal = 0;
  let carboidratoTotal = 0;
  let energiaKcalTotal = 0;
  let calcioTotal = 0;
  let sodioTotal = 0;
  let countRows = 0;
  let custoTotal = 0;
  
  return (
    <>
      <>

        <div>
          <Link prefetch={false} href="/Landing"        >
            <a>
              <div className={classes.appBar}>
                <AppBar position="static">
                  <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                      Meta X Consumo Diário X Tabela Nutricional
                    </Typography>
                  </Toolbar>
                </AppBar>
              </div>
            </a>
          </Link>
        </div>  
        
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
              showTodayButton
                className={classes.root}
                placeholder='dd/MM/yyyy'
                format='dd/MM/yyyy'
                label="Data"
                value={dtConsumoExecPage}
                onChange={handleChange}
              />
            </MuiPickersUtilsProvider>

            <TableContainer elevation={2} component={Paper}>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'small'}                
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  order={order}
                  orderBy={orderBy}
                  //onRequestSort={handleRequestSort}
                  rowCount={rowsDataTemp.length + 5}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                  {              
                  
                  rowsDataTemp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idConsumoNutricionalDiario);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      qtdePesoConsumidaExecTotal = qtdePesoConsumidaExecTotal + row.qtdePesoConsumidaExec;
                      proteinaTotal = proteinaTotal + Number(((row.qtdePesoConsumidaExec / 100) * row.proteina).toFixed(2));
                      lipideosTotal = lipideosTotal + Number(((row.qtdePesoConsumidaExec / 100) * row.lipideos).toFixed(2));
                      fibraAlimentarTotal = fibraAlimentarTotal + Number(((row.qtdePesoConsumidaExec / 100) * row.fibraAlimentar).toFixed(2));
                      carboidratoTotal = carboidratoTotal + Number(((row.qtdePesoConsumidaExec / 100) * row.carboidrato).toFixed(2));
                      energiaKcalTotal = energiaKcalTotal + Number(((row.qtdePesoConsumidaExec / 100) * row.energiaKcal).toFixed(2));
                      calcioTotal = calcioTotal + Number((((row.qtdePesoConsumidaExec / 100)) / 1000 * row.calcio).toFixed(2));
                      sodioTotal = sodioTotal + Number((((row.qtdePesoConsumidaExec / 100)) / 1000 * row.sodio).toFixed(2));
                      let custoItem = 0;
                      if (row.pesoEmbalagem === 0) {
                        custoItem = 0
                      } else {
                        custoItem = isNaN(Number(((row.preco / row.pesoEmbalagem) * row.qtdePesoConsumidaExec).toFixed(2))) ? 0 : Number(((row.preco / row.pesoEmbalagem) * row.qtdePesoConsumidaExec).toFixed(2));
                      }
                      //isFinite(custoItem) ? custoItem=0: custoItem;
                      //console.log(custoItem)
                      custoTotal = custoTotal + custoItem;
                      countRows++;

                      return (


                        <StyledTableRow 

                          hover
                          onClick={(event) => handleClick(event, row.idConsumoNutricionalDiario)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.idConsumoNutricionalDiario}
                          selected={isItemSelected}
                        >
                          <StyledTableCell padding="checkbox">
                            {countRows}
                          </StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"120"}
                          //align="right"
                          >{row.descricaoAlimento}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          //align="right"
                          >{TimeZoneCustom(row.dtConsumoExec).substring(11, 16)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          //align="right"
                          >{row.qtdePesoConsumidaExec}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          //align="right"
                          >{custoItem}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{((row.qtdePesoConsumidaExec / 100) * row.proteina).toFixed(2)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{((row.qtdePesoConsumidaExec / 100) * row.carboidrato).toFixed(2)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{((row.qtdePesoConsumidaExec / 100) * row.lipideos).toFixed(2)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{((row.qtdePesoConsumidaExec / 100) * row.fibraAlimentar).toFixed(2)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{(((row.qtdePesoConsumidaExec / 100) * row.calcio) / 1000).toFixed(2)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{(((row.qtdePesoConsumidaExec / 100) * row.sodio) / 1000).toFixed(2)}</StyledTableCell>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            width={"10"}
                          //align="right"
                          >{((row.qtdePesoConsumidaExec / 100) * row.energiaKcal).toFixed(2)}</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  <StyledTableRow 
 >
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }} >Totais:</StyledTableCell>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    ></StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{qtdePesoConsumidaExecTotal.toFixed(2)}</StyledTableCell>

                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >R$ {custoTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder", color:'black', background: divStyleProteina }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{proteinaTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder", color:'black',background: divStyleCarboidrato }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{carboidratoTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder",color:'black', background: divStyleLipideo }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{lipideosTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder",color:'black', background: divStyleFibraAlimentar }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{fibraAlimentarTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder", color:'black',background: divStyleCalcio }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{calcioTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder",color:'black', background: divStyleSodio }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{sodioTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder",color:'black', background: divStyleEnergiaKcal }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{energiaKcalTotal.toFixed(2)}</StyledTableCell>
                    <StyledTableCell ></StyledTableCell>
                  </StyledTableRow>
                  {metaDiariaData.map((rowMeta: any, indexMeta: any) => {
                    //console.log(metaDiariaData)                       
                    const labelId = `enhanced-table-checkbox-${indexMeta}`;
                    const labelMeta = ["Meta Leve:", "Meta Moderada:", "Meta Intensa:"]
                    return (
                      <StyledTableRow 

                        key={rowMeta.idMetaDiaria}
                      >
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{ }</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{labelMeta[indexMeta]}</StyledTableCell>
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{ }</StyledTableCell>
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{ }</StyledTableCell>
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{ }</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{(rowMeta.proteina).toFixed(2)}</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{(rowMeta.carboidrato).toFixed(2)}</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{(rowMeta.lipideos).toFixed(2)}</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{(rowMeta.fibraAlimentar).toFixed(2)}</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{((rowMeta.calcio) / 1000).toFixed(2)}</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{((rowMeta.sodio) / 1000).toFixed(2)}</StyledTableCell>
                        <StyledTableCell style={{ fontWeight: "bolder" }}
                          component="th"
                          id={labelId}
                          scope="rowMeta"
                          padding="none"
                          width={"10"}
                        //align="right"
                        >{(rowMeta.energiaKcal).toFixed(2)}</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </StyledTableRow>

                    )
                  })}
                  <StyledTableRow >
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}>Estimativa de Custo Mensal:</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >{"R$ " + (custoTotal * 31).toFixed(2)}</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    ></StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >Proteína</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >Carboidrato</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >Lipídeo</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >Fibra Alimentar</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >Cálcio</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"
                      width={"10"}
                    >Sódio</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: "bolder" }}
                      component="th"
                      scope="row"
                      padding="none"

                    >Energia Kcal</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
                  {emptyRows > 0 && (
                    <StyledTableRow 

                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <StyledTableCell colSpan={6} />
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>          
          <NutritionLabel opcaoPage={"Meta_Consumo"} open2={open2} setOpen2={setOpen2} qtdeConsumidaExecPage={qtdeConsumidaExecPage} descricaoAlimentoPage={descricaoAlimentoPage} precoPage={precoPage} pesoEmbalagem={pesoEmbalagemPage} servingsPerContainer={'100g'} calories={energiaKcalPage} totalFat={lipideosPage} sodium={sodioPage} totalCarbohydrate={carboidratoPage} dietaryFiber={fibraAlimentarlPage} calcio={calcioPage} protein={proteinaPage} vitamins={[]} />
       

      </>
    </>
  );
}


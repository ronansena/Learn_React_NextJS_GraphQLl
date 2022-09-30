import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import NutritionLabel from '../../../../components/ScreenGenericComponent/NutritionLabel';
import { TimeZoneCustom, convertUTCDateToLocalDate } from "../../../../utils/CustomLib";
import Link from "next/link";
import { useLazyQuery } from "@apollo/client";
import { GET_CONSUMO_BY_DATE_INICIAL_FINAL } from '../../../../queries/Report/Profile/ConsumoMensal';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useStyles } from '../../../../../styles/useStyles';

interface Data {
  custo: number;
  quantidadeTotalConsumida: number;
  descricaoAlimento: string;
}

function createData(
  custo: number,
  quantidadeTotalConsumida: number,
  descricaoAlimento: string,
): Data {
  return {
    custo,
    quantidadeTotalConsumida,
    descricaoAlimento
  };
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
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
    id: 'quantidadeTotalConsumida',
    numeric: false,
    disablePadding: true,
    label: 'Qtde. Total Consumida',
  },
  {
    id: 'custo',
    numeric: false,
    disablePadding: true,
    label: 'Custo',
  }

];

interface EnhancedTableProps {

  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;  
  order: Order;
  orderBy: string;
  rowCount: number;

}

interface RowsData {
  dtConsumoExec: string;
  __typename: string;
  qtdePesoConsumidaExec: number;
  idAlimento: string;
  preco: number;
  pesoEmbalagem: number;
  idConsumoNutricionalDiario: number;
  fatorConversao: number;
  proteina: number;
  carboidrato: number;
  lipideos: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  energiaKcal: number;
  custo: number;
  quantidadeTotalConsumida: number;
  descricaoAlimento: string;
  custoItem: number;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
  backgroundColor: "#424242",
  color: theme.palette.common.white,
},
[`&.${tableCellClasses.body}`]: {
  backgroundColor: "#212121",
  color: theme.palette.common.white,
  fontSize: 10,
},
}));


function EnhancedTableHead(props: EnhancedTableProps) {

  const {  order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return ( 

        <TableHead>
          <StyledTableRow>
            <StyledTableCell >              
            </StyledTableCell>
            {headCells.map((headCell) => (
              <StyledTableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>  
  );
}

export default function ComsumoMensal() {

  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('descricaoAlimento');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [consumoDiarioData, setConsumoDiarioData] = useState([]);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const rowsData = consumoDiarioData;
  const [dtConsumoExecInicialPage, setDtConsumoExecInicialPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [dtConsumoExecFinalPage, setDtConsumoExecFinalPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [quantidadeTotalConsumidaPage, setQuantidadeTotalConsumidaPage] = useState<number>(0);
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
  const [loadConsumoDiario, { called, loading, data }] = useLazyQuery(GET_CONSUMO_BY_DATE_INICIAL_FINAL, {
    variables: {
      dtConsumoExecInicial: TimeZoneCustom(dtConsumoExecInicialPage),
      dtConsumoExecFinal: TimeZoneCustom(dtConsumoExecFinalPage)
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
    
      setConsumoDiarioData(data.getConsumoReportQuant);

    },
    onError: (error) => {

    }
  })


  useEffect(() => {

    loadConsumoDiario()

  }, [dtConsumoExecInicialPage, dtConsumoExecFinalPage])


  useEffect(() => {

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {

          const isDuplicate = uniqueIds.includes(element.idAlimento);

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
  }, [consumoDiarioData, rowsData]);


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeInicial = (newValue: any | null) => {

    setRowsDataTemp([]);
    setConsumoDiarioData([]);
    setDtConsumoExecInicialPage(newValue.toISOString("pt-BR"));

  };

  const handleChangeFinal = (newValue: any | null) => {

    setRowsDataTemp([]);
    setConsumoDiarioData([]);
    setDtConsumoExecFinalPage(newValue.toISOString("pt-BR"));

  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rowsDataTemp.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsDataTemp.length) : 0;

  let qtdePesoConsumidaExecTotal = 0;
  let countRows = 0;
  let custoTotal = 0;

  return (
    <><>
      <div>
        <Link prefetch={false} href="/Landing">
          <a>
            <div className={classes.appBar}>
              <AppBar position="static">
                <Toolbar variant="dense">
                  <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" color="inherit" component="div">
                    Consumo Mensal
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
          label="Data Inicial"
          value={dtConsumoExecInicialPage}
          onChange={handleChangeInicial}
        />
      </MuiPickersUtilsProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
        showTodayButton
          className={classes.root}
          placeholder='dd/MM/yyyy'
          format='dd/MM/yyyy'
          label="Data Final"
          value={dtConsumoExecFinalPage}
          onChange={handleChangeFinal}
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
            order={order}
            orderBy={orderBy}
            //onSelectAllClick={}
            onRequestSort={handleRequestSort}
            rowCount={rowsDataTemp.length}
          />
          <TableBody>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rowsDataTemp.slice().sort(getComparator(order, orderBy)) */}
            {stableSort(rowsDataTemp, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.idAlimento);
                const labelId = `enhanced-table-checkbox-${index}`;

                qtdePesoConsumidaExecTotal = qtdePesoConsumidaExecTotal + row.quantidadeTotalConsumida;
                let custoItem = 0;

                if (row.pesoEmbalagem === 0) {
                  custoItem = 0
                } else {
                  custoItem = isNaN(Number(((row.preco / row.pesoEmbalagem) * Number(row.quantidadeTotalConsumida)).toFixed(2))) ? 0 : Number(((row.preco / row.pesoEmbalagem) * Number(row.quantidadeTotalConsumida)).toFixed(2));
                }
                //isFinite(custoItem) ? custoItem=0: custoItem;
                //console.log(custoItem)
                custoTotal = custoTotal + custoItem;
                countRows++;

                return (

                  <StyledTableRow
                    hover
                    onClick={(event) => handleClick(event, row.idAlimento)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.idAlimento}
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
                      width={"250"}
                    //align="right"
                    >{row.descricaoAlimento}</StyledTableCell>

                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    //align="right"
                    >{row.quantidadeTotalConsumida}</StyledTableCell>
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    //align="right"
                    >{custoItem.toFixed(2)}</StyledTableCell>
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    //align="right"
                    ></StyledTableCell>
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    //align="right"
                    ></StyledTableCell>

                  </StyledTableRow>
                  
                );
              })}
              
            <StyledTableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bolder" }} >Totais:</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bolder" }}
                component="th"
                scope="row"
                padding="none"
                width={"100"}
              >{qtdePesoConsumidaExecTotal.toFixed(2)}</StyledTableCell>

              <StyledTableCell style={{ fontWeight: "bolder" }}
                component="th"
                scope="row"
                padding="none"
                width={"100"}
              >R$ {custoTotal.toFixed(2)}</StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bolder" }}
                component="th"
                scope="row"
                padding="none"
                width={"1000"}
              ></StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bolder" }}
                component="th"
                scope="row"
                padding="none"
                width={"1000"}
              ></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow >
              <StyledTableCell></StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bolder" }}></StyledTableCell>
              <StyledTableCell style={{ fontWeight: "bolder" }}
                component="th"
                scope="row"
                padding="none"
                width={"100"}
              >{ }</StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell
                component="th"
                scope="row"
                padding="none"
                width={"100"}
              ></StyledTableCell>
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
      <NutritionLabel opcaoPage={"Meta_Consumo"} open2={open2} setOpen2={setOpen2} qtdeConsumidaExecPage={quantidadeTotalConsumidaPage} descricaoAlimentoPage={descricaoAlimentoPage} precoPage={precoPage} pesoEmbalagem={pesoEmbalagemPage} servingsPerContainer={'100g'} calories={energiaKcalPage} totalFat={lipideosPage} sodium={sodioPage} totalCarbohydrate={carboidratoPage} dietaryFiber={fibraAlimentarlPage} calcio={calcioPage} protein={proteinaPage} vitamins={[]} />

    </></>
  );

}

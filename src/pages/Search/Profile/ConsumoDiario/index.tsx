import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from "@apollo/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinearProgress from '@mui/material/LinearProgress';
import {
  DataGrid, GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridColDef,
  GridSelectionModel,
  GridToolbarDensitySelector,
  GridSortModel
} from '@mui/x-data-grid';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Button } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Snackbar from "@mui/material/Snackbar";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import PageHeader from '../../../../components/ScreenGenericComponent/PageHeader';
import AddConsumoDiario from "../../../../components/ActionComponent/Profile/ConsumoDiario/AddConsumoDiario";
import ChangeConsumoDiario from "../../../../components/ActionComponent/Profile/ConsumoDiario/ChangeConsumoDiario";
import { GET_CONSUMO_DIARIO_BY_DATE, DELETE_CONSUMO_DIARIO } from '../../../../queries/Profile/ConsumoDiario';
import { GET_TABELA_NUTRICIONAL } from '../../../../queries/TabelaNutricional/TabelaNutricional';
import Link from "next/link";
import { useStyles } from '../../../../../styles/useStyles';
import ConfirmationDialogRaw from '../../../../components/ScreenGenericComponent/ConfirmationDialogRaw';
import LinearProgressWithLabel from '../../../../components/ScreenGenericComponent/LinearProgressWithLabel';
import { TimeZoneCustom, convertDateTime, convertUTCDateToLocalDate, SlideTransition } from "../../../../utils/CustomLib";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import NutritionLabel from '../../../../components/ScreenGenericComponent/NutritionLabel';
interface SnackbarMessage {
  message: string;
  key: number;
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

let idSelectRow: number = 0;
let descricaoAlimentoSelectRow: string = "";
let qtdePesoConsumidaExecSelectRow: string = "";
let dtConsumoExecSelectRow: string = "";
let idAlimentoSelectRow: number;

function ConsumoDiario() {


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

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const classes = useStyles();
  const [consumoDiarioData, setConsumoDiarioData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletedRows, setDeletedRows] = React.useState<GridSelectionModel>([]);
  const [deleteConsumoDiarioPage] = useMutation(DELETE_CONSUMO_DIARIO);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const [checkboxSelection, setCheckboxSelection] = useState(true);
  const rowsData = consumoDiarioData;
  const [open, setOpen] = React.useState(false);
  const [dtConsumoExecPage, setDtConsumoExecPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
    undefined,
  );
  const [open4, setopen4] = React.useState(false);
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
  const [tabelaNutricionalData, setTabelaNutricionalData] = useState([]);


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


  // handle for close the message

  const handleCloseSnackBar = () => {

    setState({
      ...state,
      open: false,
    });

  };

  // handle for reset the message after it close
  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const [loadTabelaNutricional] = useLazyQuery(GET_TABELA_NUTRICIONAL, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setTabelaNutricionalData(data.getAllTabelaNutricional);


    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })
  // load the datagrid information  
  const [loadConsumoDiario, { called, loading, data }] = useLazyQuery(GET_CONSUMO_DIARIO_BY_DATE, {
    variables: { dtConsumoExec: TimeZoneCustom(dtConsumoExecPage) },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setConsumoDiarioData(data.getConsumoByDate);;
      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })


  // handle for delete rows from datagrid
  const handlePurge = (
    idConsumoNutricionalDiario: number | undefined
  ) =>
    () => {

      //console.log("cheguei no handlePurge" + idConsumoNutricionalDiario)
      if (idConsumoNutricionalDiario != undefined) {

        while (deletedRows.length > 0) {
          deletedRows.pop();
        }
        deletedRows.push(idConsumoNutricionalDiario);

      }

      //console.log(deletedRows);
      if (deletedRows.length > 0) {

        deleteConsumoDiarioPage({ variables: { idConsumoNutricionalDiario: deletedRows } }).then(

          async function (response) {

            if (response.data.deleteConsumoDiario === true) {

              //alert("Registro deletado com sucesso!");
              //console.log("aqui" + Object.values(deletedRows));

              // remove os elementos do array deletedRows2 do array rows a atribui a uma nova variável newRows
              const newRows = rowsDataTemp.filter(function (x) {

                return deletedRows.indexOf(x.idConsumoNutricionalDiario) < 0;
              })
              setDeletedRows([]);
              //  console.log(newRows);
              setRowsDataTemp(newRows);

              let checkBoxesAll = document.querySelectorAll("#selectAll") as NodeListOf<HTMLInputElement>;
              checkBoxesAll.forEach(id => {
                if (id.checked === true)
                  id.click();
              });

              //      setCheckboxSelection(true);
              let checkboxes = document.querySelectorAll("#selectOne") as NodeListOf<HTMLInputElement>;
              checkboxes.forEach(id => {
                if (id.checked === true)
                  id.click();
              });

              showMessage("Registro deletado com sucesso!", SlideTransition);

              //setMessageInfo(undefined);

              //console.log("estoy handleClickOpenSnackBar => " + open)
              // selectedRows = selectedRows.filter(function (x) {
              //  return deletedRows.indexOf(x) < 0;
              // })
              // console.log(arrayConsumoDiario);
              //console.log("newRows: => " + newRows.map(function (x) { console.log(x.idConsumoDiario) }));
              //console.log("AtualRows: " + rowsDataTemp.map(function (x) { console.log(x.idConsumoDiario) }));
            }

          }
        ).catch((e) => {

          showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

        });
      } else {

        //message = "Selecione um registro para deletar!";        
        showMessage("Selecione um registro para deletar!", SlideTransition);
        setMessageInfo(undefined);
      }

    }

  useEffect(() => {

    loadConsumoDiario()
    loadTabelaNutricional()

  }, [dtConsumoExecPage, loadTabelaNutricional, loadConsumoDiario])

  useEffect(() => {

    setDtConsumoExecPage(convertUTCDateToLocalDate(new Date).toISOString())

  }, [])


  useEffect(() => {

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {
          const isDuplicate = uniqueIds.includes(element.idConsumoNutricionalDiario);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;

          }
        });

        setRowsDataTemp(unique);

      }
    }
  }, [consumoDiarioData, rowsData]);


  const handleCloseConfirmationDialog = () => {

    setOpen(false);
  };

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleChange = (newValue: any | null) => {
    setRowsDataTemp([]);
    setDtConsumoExecPage(newValue.toISOString("pt-BR"));
    //setDtConsumoExecPage(convertUTCDateToLocalDate(newValue));

  };

  const matches = useMediaQuery("(max-width:450px)");

  function CustomToolbar() {
    return (
      <>

        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </GridToolbarContainer>

      </>


    );
  }

  let columns: GridColDef[] = [

    {
      field: 'descricaoAlimento', width: 200, headerName: 'Nome Alimento', headerClassName: 'super-app-theme--header',
      headerAlign: 'left'
    },
    {
      field: 'qtdePesoConsumidaExec', width: 120, headerName: 'Qtde. Consumida', headerClassName: 'super-app-theme--header',
      headerAlign: 'left',
    },
    {
      field: 'dtConsumoExec', width: 200, type: 'string', valueGetter: (params) => new Date(params.row.dtConsumoExec).toLocaleString('pt-BR'),
      headerName: 'Data', headerClassName: 'super-app-theme--header', headerAlign: 'left',
    },
    {
      field: 'delete', width: 110, headerName: "Deletar", renderCell: (params) => (
        <div className={classes.root}>
          <IconButton onClick={handleClickListItem} >
            <DeleteIcon color="secondary"
              sx={[
                { fontSize: 40, },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: {

                    fontSize: 20,
                  }
                }
                ),
              ]}

            //onClick={handlePurge(params.row.idConsumoNutricionalDiario)} 

            >


            </DeleteIcon>

          </IconButton>
          <ConfirmationDialogRaw
            // id={params.row.idConsumoNutricionalDiario}
            id="ringtone-menu"
            keepMounted
            open={open}
            onClose={handleCloseConfirmationDialog}
            handlePurge={handlePurge(idSelectRow)}
            idNumber={idSelectRow}
          //value={params.row.idConsumoNutricionalDiario}
          />
        </div>
      ),

    },
    {
      field: 'change', width: 110, headerName: "Alterar", renderCell: () => (

        <ChangeConsumoDiario tabelaNutricionalData={tabelaNutricionalData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} qtdePesoConsumidaExecSelectRow={qtdePesoConsumidaExecSelectRow} dtConsumoExecSelectRow={dtConsumoExecSelectRow} idAlimentoSelectRow={idAlimentoSelectRow} />

      ),

    },

  ];


  if (matches) {

    columns = [

      {
        field: 'descricaoAlimento', width: 120, headerName: 'Nome Alimento', headerClassName: 'super-app-theme--header',
        headerAlign: 'left'
      },
      {
        field: 'qtdePesoConsumidaExec', width: 50, headerName: 'Qtde. Consumida', headerClassName: 'super-app-theme--header',
        headerAlign: 'left',
      },
      {
        field: 'dtConsumoExec', width: 120, type: 'string', valueGetter: (params) => new Date(params.row.dtConsumoExec).toLocaleString('pt-BR'),
        headerName: 'Data', headerClassName: 'super-app-theme--header', headerAlign: 'left',
      },
      {
        field: 'delete', width: 50, headerName: "Deletar", renderCell: (params) => (
          <div className={classes.root}>
            <IconButton onClick={handleClickListItem} >
              <DeleteIcon color="secondary"
                sx={[
                  { fontSize: 40, },
                  (theme) => ({
                    [theme.breakpoints.down('sm')]: {

                      fontSize: 20,
                    }
                  }
                  ),
                ]}

              //onClick={handlePurge(params.row.idConsumoNutricionalDiario)} 
              >


              </DeleteIcon>

            </IconButton>
            <ConfirmationDialogRaw
              id="ringtone-menu"
              keepMounted
              open={open}
              onClose={handleCloseConfirmationDialog}
              handlePurge={handlePurge(idSelectRow)}
              idNumber={idSelectRow}
            />
          </div>
        ),

      },
      {
        field: 'change', width: 50, headerName: "Alterar", renderCell: () => (

          <ChangeConsumoDiario tabelaNutricionalData={tabelaNutricionalData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} qtdePesoConsumidaExecSelectRow={qtdePesoConsumidaExecSelectRow} dtConsumoExecSelectRow={dtConsumoExecSelectRow} idAlimentoSelectRow={idAlimentoSelectRow} />

        ),

      },

    ]

  }


  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {

      // console.log("useEffectsnackPackIF")
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setopen4(true);
    } else if (snackPack.length && messageInfo && open4) {
      // Close an active snack when a new one is added
      //   console.log("useEffectsnackPackelse")
      setopen4(false);
    }
  }, [snackPack, messageInfo, open4]);

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'dtConsumoExec',
      sort: 'desc',
    },
  ]);

  const [progress, setProgress] = React.useState(10);
  /*
 
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

*/


  const handleClick = (idConsumoNutricionalDiario: number, field: string) => {

    rowsDataTemp.filter((e) => {
      if (e.idConsumoNutricionalDiario === idConsumoNutricionalDiario && e.idMetaDiaria !== undefined) {
        console.log(e)
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
    if (field === "descricaoAlimento")
      setOpen2(true);

  };

  return (
    <>
      {loadingData === false ? (

        <Box sx={{ width: '100%' }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      ) : (
        <div>

          {matches === false ? (

            <PageHeader
              title="Informe os dados para o pesquisa:"
            />
          ) : ("")}

          <main>
            <form>
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
                            Consumo Diário
                          </Typography>
                        </Toolbar>
                      </AppBar>
                    </div>
                  </a>
                </Link>

              </div>
              <div className={classes.root} >
                <Stack className={classes.root} padding={"12px 10px 0px 20px"} direction="row" spacing={2}>
                  <Button onClick={handlePurge(undefined)} variant="outlined"
                    startIcon={<DeleteIcon />}>
                    Deletar
                  </Button>

                  <AddConsumoDiario descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} tabelaNutricionalData={tabelaNutricionalData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} setCheckboxSelection={setCheckboxSelection} checkboxSelection={checkboxSelection} />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      showTodayButton
                      placeholder='dd/MM/yyyy'
                      format='dd/MM/yyyy'
                      label="Data"
                      value={dtConsumoExecPage}
                      onChange={handleChange}

                    />
                  </MuiPickersUtilsProvider>
                </Stack>
              </div>
              <div className={classes.root} >

                <DataGrid
                  rows={rowsDataTemp}
                  getRowId={(row) => row.idConsumoNutricionalDiario}
                  columns={columns}
                  //rowsPerPageOptions={5}               
                  autoHeight={true}
                  //autoWidth={true}
                  showColumnRightBorder={true}
                  //headerHeight={75}
                  rowHeight={65}
                  cellWidth={80}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  //hideFooterSelectedRowCount={false}
                  checkboxSelection
                  onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                    console.log(newSelectionModel)
                    setDeletedRows(newSelectionModel)
                  }}
                  selectionModel={selectionModel}
                  localeText={
                    {
                      toolbarColumns: "",
                      toolbarFilters: "",
                      toolbarDensity: "",
                      toolbarExport: ""
                    }}
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,

                  }}
                  onCellClick={(params) => {
                    //console.log(params)
                    handleClick(params.row.idConsumoNutricionalDiario, params.field);
                  }}
                  onRowClick={(params, event) => {
                    //handleClick(params.row.idConsumoNutricionalDiario);
                    idSelectRow = params.row.idConsumoNutricionalDiario;
                    descricaoAlimentoSelectRow = params.row.descricaoAlimento;
                    qtdePesoConsumidaExecSelectRow = params.row.qtdePesoConsumidaExec;
                    dtConsumoExecSelectRow = params.row.dtConsumoExec;
                    idAlimentoSelectRow = params.row.idAlimento;
                    // console.log("push -> /roles/" + params.row.nomeUnidadeMedida);

                    //console.log(idSelectRow)              
                  }}
                  {...data
                  }
                //sortModel={sortModel}
                //onSortModelChange={(model) => setSortModel(model)}

                />
              </div>
              <div className={classes.root}>
                <Snackbar
                  key={messageInfo ? messageInfo.key : undefined}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={state.open}
                  onClose={handleCloseSnackBar}
                  TransitionProps={{ onExited: handleExited }}
                  TransitionComponent={state.Transition}
                  message={messageInfo ? messageInfo.message : undefined}
                  //message="Registro deletado com sucesso!"         

                  autoHideDuration={3000}
                />

              </div>
            </form>
          </main>
          <NutritionLabel opcaoPage={"Consumo_Diario"} open2={open2} setOpen2={setOpen2} qtdeConsumidaExecPage={qtdeConsumidaExecPage} descricaoAlimentoPage={descricaoAlimentoPage} precoPage={precoPage} pesoEmbalagem={pesoEmbalagemPage} servingsPerContainer={'100g'} calories={energiaKcalPage} totalFat={lipideosPage} sodium={sodioPage} totalCarbohydrate={carboidratoPage} dietaryFiber={fibraAlimentarlPage} calcio={calcioPage} protein={proteinaPage} vitamins={[]} />
        </div>

      )
      }
    </>

  );

}

export default (ConsumoDiario);


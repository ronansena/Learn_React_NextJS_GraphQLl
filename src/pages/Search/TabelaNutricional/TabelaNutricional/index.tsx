import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../components/ScreenGenericComponent/PageHeader';
import { useMutation, useLazyQuery } from "@apollo/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinearProgress from '@mui/material/LinearProgress';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import {
  DataGrid, GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridColDef,
  GridSelectionModel,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Button } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import AddTabelaNutricional from "../../../../components/ActionComponent/TabelaNutricional/TabelaNutricional/AddTabelaNutricional";
import ChangeTabelaNutricional from "../../../../components/ActionComponent/TabelaNutricional/TabelaNutricional/ChangeTabelaNutricional";
import Snackbar from "@mui/material/Snackbar";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import { GET_TABELA_NUTRICIONAL, DELETE_TABELA_NUTRICIONAL } from '../../../../queries/TabelaNutricional/TabelaNutricional';
import { GET_GRUPO_ALIMENTO } from '../../../../queries/TabelaNutricional/GrupoAlimento';
import { GET_ORIGEM_DADO_NUTRICIONAL } from '../../../../queries/TabelaNutricional/OrigemDadoNutricional';
import Link from "next/link";
import LinearProgressWithLabel from '../../../../components/ScreenGenericComponent/LinearProgressWithLabel';
import { handleNumberMysql, SlideTransition } from "../../../../utils/CustomLib";
import NutritionLabel from '../../../../components/ScreenGenericComponent/NutritionLabel';
import { useStyles } from '../../../../../styles/useStyles';

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

}

//style override


export interface TabelaNutricionalData {
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
  idGrupoAlimentoSelectRow: any,
  open2: boolean,
  setOpen2: any
}

let nomeGrupoAlimentoSelectRow: string = "";
function TabelaNutricional() {

  let props: TabelaNutricionalData = Object.create(null);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const classes = useStyles();
  const [tabelaNutricionalData, setTabelaNutricionalData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletedRows, setDeletedRows] = React.useState<GridSelectionModel>([]);
  const [deleteTabelaNutricionalPage] = useMutation(DELETE_TABELA_NUTRICIONAL);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const [checkboxSelection, setCheckboxSelection] = useState(true);
  const rowsData = tabelaNutricionalData;
  const matches = useMediaQuery("(max-width:450px)");
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

  // load the datagrid information  
  const [loadGetTabelaNutricional, { called, loading, data }] = useLazyQuery(GET_TABELA_NUTRICIONAL, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setTabelaNutricionalData(data.getAllTabelaNutricional);
      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })


  // segmento responsável por retornar o nome da Origem do Dado Nutricional para ser usado em parent and child components
  const [origemDadoNutricionalData, setOrigemDadoNutricionalData] = useState([]);
  //const [loadingDataGetGrupoAlimento, setLoadingDataGetGrupoAlimento] = useState(false);

  const [loadGetOrigemDadoNutricional] = useLazyQuery(GET_ORIGEM_DADO_NUTRICIONAL, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setOrigemDadoNutricionalData(data.getAllOrigemDadoNutricional);

      //setLoadingDataGetGrupoAlimento(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })


  // segmento responsável por retornar o nome da Origem do Dado Nutricional para ser usado em parent and child components
  const [grupoAlimentoData, setGrupoAlimentoData] = useState([]);
  //const [loadingDataGetGrupoAlimento, setLoadingDataGetGrupoAlimento] = useState(false);

  const [loadGetGrupoAlimento] = useLazyQuery(GET_GRUPO_ALIMENTO, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setGrupoAlimentoData(data.getAllGrupoAlimento);



    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  // handle for delete rows from datagrid
  const handlePurge = (
    idAlimento: number | undefined
  ) =>
    () => {


      if (idAlimento != undefined) {

        while (deletedRows.length > 0) {
          deletedRows.pop();
        }
        deletedRows.push(idAlimento);

      }

      //console.log(deletedRows);
      if (deletedRows.length > 0) {

        deleteTabelaNutricionalPage({ variables: { idAlimento: deletedRows } }).then(

          async function (response) {

            if (response.data.deleteTabelaNutricional === true) {

              //alert("Registro deletado com sucesso!");
              //console.log("aqui" + Object.values(deletedRows));

              // remove os elementos do array deletedRows2 do array rows a atribui a uma nova variável newRows
              const newRows = rowsDataTemp.filter(function (x) {

                return deletedRows.indexOf(x.idAlimento) < 0;
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
              // console.log(arrayTabelaNutricional);
              //console.log("newRows: => " + newRows.map(function (x) { console.log(x.idAlimento) }));
              //console.log("AtualRows: " + rowsDataTemp.map(function (x) { console.log(x.idAlimento) }));
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

  const handleClickOpen = () => {

    setOpen2(true);

  };


  let columns: GridColDef[] = [

    { field: 'numeroAlimento', width: 10, headerName: 'Nº', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'nomeGrupoAlimento', width: 200, headerName: 'Grupo Alimento', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    {
      field: 'descricaoAlimento', width: 210, headerName: 'Descricao Alimento', headerClassName: 'super-app-theme--header',
      headerAlign: 'left'
    },
    { field: 'energiaKcal', width: 100, valueGetter: (params) => handleNumberMysql(params.row.energiaKcal, "g"), headerName: 'Energia Kcal', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'proteina', width: 100, valueGetter: (params) => handleNumberMysql(params.row.proteina, "g"), headerName: 'Proteína(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'carboidrato', width: 100, valueGetter: (params) => handleNumberMysql(params.row.carboidrato, "g"), headerName: 'Carboidrato(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'lipideos', width: 100, valueGetter: (params) => handleNumberMysql(params.row.lipideos, "g"), headerName: 'Lipídios(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'fibraAlimentar', width: 100, valueGetter: (params) => handleNumberMysql(params.row.fibraAlimentar, "g"), headerName: 'Fibra Alimentar(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'calcio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.calcio, "mg"), headerName: 'Cálcio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'sodio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.sodio, "mg"), headerName: 'Sódio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    {
      field: 'created_at', width: 250, type: 'string', valueGetter: (params) => new Date(params.row.created_at).toLocaleString('pt-BR')
      , headerName: 'Dt. Criação', headerAlign: 'left', headerClassName: 'super-app-theme--header'
    },

    {
      field: 'delete', width: 110, headerName: "Deletar", renderCell: (params) => (
        <div className={classes.root}>
          <IconButton onClick={handlePurge(params.row.idAlimento)} >
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

            ></DeleteIcon>
          </IconButton>
        </div>
      ),

    },
    {
      field: 'change', width: 110, headerName: "Alterar", renderCell: () => (

        // <ChangeTabelaNutricional grupoAlimentoData={grupoAlimentoData} origemDadoNutricionalData={origemDadoNutricionalData} nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} sodioSelectRow={sodioSelectRow} calcioSelectRow={calcioSelectRow} fibraAlimentarSelectRow={fibraAlimentarSelectRow} carboidratoSelectRow={carboidratoSelectRow} lipideosSelectRow={lipideosSelectRow} proteinaSelectRow={proteinaSelectRow} energiaKcalSelectRow={energiaKcalSelectRow} qtdeConsumoSugeridaSelectRow={qtdeConsumoSugeridaSelectRow} nomeOrigemDadoNutricionalSelectRow={nomeOrigemDadoNutricionalSelectRow} numeroAlimentoSelectRow={numeroAlimentoSelectRow} idOrigemDadoNutricionalSelectRow={idOrigemDadoNutricionalSelectRow} idGrupoAlimentoSelectRow={idGrupoAlimentoSelectRow}   />
 
        <ChangeTabelaNutricional {...props} />
      ),

    },

  ];

  if (matches) {

    let columns: GridColDef[] = [

      { field: 'numeroAlimento', width: 10, headerName: 'Nº', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'nomeGrupoAlimento', width: 200, headerName: 'Grupo Alimento', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      {
        field: 'descricaoAlimento', width: 210, headerName: 'Descricao Alimento', headerClassName: 'super-app-theme--header',
        headerAlign: 'left'
      },
      { field: 'energiaKcal', width: 100, valueGetter: (params) => handleNumberMysql(params.row.energiaKcal, "g"), headerName: 'Energia Kcal', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'proteina', width: 100, valueGetter: (params) => handleNumberMysql(params.row.proteina, "g"), headerName: 'Proteína(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'carboidrato', width: 100, valueGetter: (params) => handleNumberMysql(params.row.carboidrato, "g"), headerName: 'Carboidrato(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'lipideos', width: 100, valueGetter: (params) => handleNumberMysql(params.row.lipideos, "g"), headerName: 'Lipídios(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'fibraAlimentar', width: 100, valueGetter: (params) => handleNumberMysql(params.row.fibraAlimentar, "g"), headerName: 'Fibra Alimentar(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'calcio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.calcio, "mg"), headerName: 'Cálcio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'sodio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.sodio, "mg"), headerName: 'Sódio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'created_at', width: 110, headerName: 'Dt. Criação', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      {
        field: 'delete', headerName: "Deletar", renderCell: (params) => (

          <div className={classes.root}>
            <IconButton >
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
                onClick={handlePurge(params.row.idAlimento)} ></DeleteIcon>
            </IconButton>
          </div>
        ),
      },
      {
        field: 'change', width: 100, headerName: "Alterar", renderCell: () => (
          //<ChangeTabelaNutricional nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} origemDadoNutricionalSelectRow={origemDadoNutricionalSelectRow} origemDadoNutricionalData={origemDadoNutricionalData}  />          
          <IconButton >
            <ChangeTabelaNutricional {...props} />
            <ChangeCircleIcon sx={[
              { fontSize: 40, },
              (theme) => ({
                [theme.breakpoints.down('sm')]: {

                  fontSize: 20,
                }
              }
              ),
            ]} color="warning" onClick={handleClickOpen} />
          </IconButton>
        ),
      },
    ]
  }



  useEffect(() => {

    loadGetTabelaNutricional()
    loadGetOrigemDadoNutricional()
    loadGetGrupoAlimento()

  }, [data, loadGetGrupoAlimento, loadGetOrigemDadoNutricional, loadGetTabelaNutricional])


  useEffect(() => {
    // setRowsData(TabelaNutricionalData.getAllTabelaNutricional);

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {
          const isDuplicate = uniqueIds.includes(element.idAlimento);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });

        //ordenar o array antes de atualizar a tela
        unique.sort(function (a: any, b: any) {
          return a.idAlimento < b.idAlimento ? -1 : a.idAlimento > b.idAlimento ? 1 : 0;

        });
        setRowsDataTemp(unique.reverse());

      }
    }
  }, [rowsData]);

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


  const CustomToolbar = () => {
    return (

      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

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
  const [open3, setOpen3] = React.useState(false);

  const handleClick = (idAlimento: number, field: string) => {

    rowsDataTemp.filter((e) => {
      if (e.idAlimento === idAlimento && e.pesoEmbalagem !== undefined) {
        
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
      setOpen3(true);

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
                          Tabela Nutricional
                        </Typography>
                      </Toolbar>
                    </AppBar>
                  </div>
                </a>
              </Link>
            </div>
            <Toolbar variant="dense">
              <Stack className={classes.root} direction="row" spacing={2}>
                <Button onClick={handlePurge(undefined)} size="large" variant="outlined"
                  startIcon={<DeleteIcon />}>
                  Deletar
                </Button>
                <AddTabelaNutricional nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} origemDadoNutricionalData={origemDadoNutricionalData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} setCheckboxSelection={setCheckboxSelection} checkboxSelection={checkboxSelection} />
              </Stack>
            </Toolbar>
            <div className={classes.root} >
              <DataGrid
                components={{
                  Toolbar: CustomToolbar,
                  LoadingOverlay: LinearProgress,
                }}
                rows={rowsDataTemp}
                getRowId={(row) => row.idAlimento}
                columns={columns}
                //rowsPerPageOptions={5}               
                autoHeight={true}
                showColumnRightBorder={true}
                //headerHeight={75}
                rowHeight={65}
                cellWidth={80}
                pageSize={5}
                rowsPerPageOptions={[]}
                //hideFooterSelectedRowCount={false}
                checkboxSelection
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
                  // console.log(newSelectionModel)
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
                onCellClick={(params) => {
                  //console.log(params)
                  handleClick(params.row.idAlimento, params.field);
                }}
                onRowClick={(params, event) => {
                  //handleClick(params.row.idAlimento);
                  props["grupoAlimentoData"] = grupoAlimentoData;
                  props["origemDadoNutricionalData"] = origemDadoNutricionalData;
                  props["idSelectRow"] = params.row.idAlimento;
                  props["descricaoAlimentoSelectRow"] = params.row.descricaoAlimento;
                  props["nomeGrupoAlimentoSelectRow"] = params.row.nomeGrupoAlimento;
                  props["sodioSelectRow"] = params.row.sodio;
                  props["calcioSelectRow"] = params.row.calcio;
                  props["fibraAlimentarSelectRow"] = params.row.fibraAlimentar;
                  props["carboidratoSelectRow"] = params.row.carboidrato;
                  props["lipideosSelectRow"] = params.row.lipideos;
                  props["proteinaSelectRow"] = params.row.proteina;
                  props["energiaKcalSelectRow"] = params.row.energiaKcal;
                  props["qtdeConsumoSugeridaSelectRow"] = params.row.qtdeConsumoSugerida;
                  props["nomeOrigemDadoNutricionalSelectRow"] = params.row.nomeOrigemDadoNutricional;
                  props["numeroAlimentoSelectRow"] = params.row.numeroAlimento;
                  props["idOrigemDadoNutricionalSelectRow"] = params.row.idOrigemDadoNutricional;
                  props["idGrupoAlimentoSelectRow"] = params.row.idGrupoAlimento;
                  props["rowsDataTemp"] = rowsDataTemp;
                  props["setRowsDataTemp"] = setRowsDataTemp;
               
                  console.log( setRowsDataTemp);
                }}
                {...data
                }
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
            <NutritionLabel opcaoPage={"Tabela_Nutricional"} open2={open3} setOpen2={setOpen3} qtdeConsumidaExecPage={qtdeConsumidaExecPage} descricaoAlimentoPage={descricaoAlimentoPage} precoPage={precoPage} pesoEmbalagem={pesoEmbalagemPage} servingsPerContainer={'100g'} calories={energiaKcalPage} totalFat={lipideosPage} sodium={sodioPage} totalCarbohydrate={carboidratoPage} dietaryFiber={fibraAlimentarlPage} calcio={calcioPage} protein={proteinaPage} vitamins={[]} />

          </main>

        </div>

      )
      }
    </>

  );

}

export default (TabelaNutricional);


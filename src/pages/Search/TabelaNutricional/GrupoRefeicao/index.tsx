import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../components/ScreenGenericComponent/PageHeader';
//import style from "./styles.module.scss";
import { useMutation, useLazyQuery } from "@apollo/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LinearProgress from '@mui/material/LinearProgress';
import { UPDATE_ONLY_PESO_CONSUMIDO_GR } from "../../../../queries/TabelaNutricional/GrupoRefeicao/";
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
import AddGrupoRefeicao from "../../../../components/ActionComponent/TabelaNutricional/GrupoRefeicao/AddGrupoRefeicao";
import ChangeGrupoRefeicao from "../../../../components/ActionComponent/TabelaNutricional/GrupoRefeicao/ChangeGrupoRefeicao";
import Snackbar from "@mui/material/Snackbar";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import { GET_GRUPO_REFEICAO, DELETE_GRUPO_REFEICAO, DELETE_ITEM_REFEICAO } from '../../../../queries/TabelaNutricional/GrupoRefeicao';
import Link from "next/link";
import LinearProgressWithLabel from '../../../../components/ScreenGenericComponent/LinearProgressWithLabel';
import DetailItemMeal from '../../../../components/GetDataComponent/DetailItemMeal';
import { SlideTransition } from "../../../../utils/CustomLib";
import { useStyles } from '../../../../../styles/useStyles';
import { GET_TABELA_NUTRICIONAL } from '../../../../queries/TabelaNutricional/TabelaNutricional';
interface SnackbarMessage {
  message: string;
  key: number;
}

interface RowsData {

  __typename: string;
  idGrupoRefeicao: number;
  descricaoAlimento: string;

}

//style override




let idSelectRow: number = 0;
let nomeGrupoRefeicaoAlimentoSelectRow: string = "";
let observacaoSelectRow: string = "";
let pesoTotalGrupoRefeicaoSelectRow: number = 0;
let descricaoAlimentoSelectRow: string = "";

function GrupoRefeicao() {

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const classes = useStyles();
  const [tabelaNutricionalData, setTabelaNutricionalData] = useState([]);
  const [grupoRefeicao, setGrupoRefeicao] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletedRows, setDeletedRows] = React.useState<GridSelectionModel>([]);
  const [deleteGrupoRefeicaoPage] = useMutation(DELETE_GRUPO_REFEICAO);
  const [deleteItemRefeicaoPage] = useMutation(DELETE_ITEM_REFEICAO);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const [checkboxSelection, setCheckboxSelection] = useState(true);
  const rowsData = grupoRefeicao;
  const [open2, setOpen2] = React.useState(false);
  const [updateOnlyPesoConsumidoGR] = useMutation(UPDATE_ONLY_PESO_CONSUMIDO_GR);
  const [idGrupoRefeicaoPage, setIdGrupoRefeicaoPage] = useState<number | undefined>(0);
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

  // load the datagrid information  
  const [loadGetGrupoRefeicao, { called, loading, data }] = useLazyQuery(GET_GRUPO_REFEICAO, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setGrupoRefeicao(data.getAllGrupoRefeicao);
      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  // load the GET_TABELA_NUTRICIONAL  
  const [loadGetTabelaNutricional] = useLazyQuery(GET_TABELA_NUTRICIONAL, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setTabelaNutricionalData(data.getAllTabelaNutricional);
      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  const handlePurge = (
    idGrupoRefeicao: number | undefined
  ) =>
    () => {


      if (idGrupoRefeicao != undefined) {

        while (deletedRows.length > 0) {
          deletedRows.pop();
        }
        deletedRows.push(idGrupoRefeicao);

      }

      if (deletedRows.length > 0) {

        deleteItemRefeicaoPage({ variables: { idGrupoRefeicao: deletedRows } }).then(

          async function (response) {

            if (response.data.deleteItemRefeicao === true) {

              console.log("itens deletado")

            }
          }
        ).catch((e) => {

          console.log("erro ao tentar deletar item " + e)

        });

        deleteGrupoRefeicaoPage({ variables: { idGrupoRefeicao: deletedRows } }).then(


          async function (response) {

            if (response.data.deleteGrupoRefeicao === true) {

              //alert("Registro deletado com sucesso!");
              //console.log("aqui" + Object.values(deletedRows));

              // remove os elementos do array deletedRows2 do array rows a atribui a uma nova variável newRows
              const newRows = rowsDataTemp.filter(function (x) {

                return deletedRows.indexOf(x.idGrupoRefeicao) < 0;
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
              // console.log(arrayGrupoRefeicao);
              //console.log("newRows: => " + newRows.map(function (x) { console.log(x.idGrupoRefeicao) }));
              //console.log("AtualRows: " + rowsDataTemp.map(function (x) { console.log(x.idGrupoRefeicao) }));
            }

          }
        ).catch((e) => {

          showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

        });
      } else {
       
        showMessage("Selecione um registro para deletar!", SlideTransition);
        setMessageInfo(undefined);
      }
    }

  useEffect(() => {
  
      loadGetGrupoRefeicao()
    loadGetTabelaNutricional()

  }, [data,loadGetGrupoRefeicao,loadGetTabelaNutricional])



  useEffect(() => {  

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {
          const isDuplicate = uniqueIds.includes(element.idGrupoRefeicao);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
 
          //ordenar o array antes de atualizar a tela
          unique.sort(function (a: any, b: any) {
            return a.idGrupoRefeicao < b.idGrupoRefeicao ? -1 : a.idGrupoRefeicao > b.idGrupoRefeicao ? 1 : 0;

          });
          setRowsDataTemp(unique.reverse());        

      }
    }
  }, [rowsData]);


  function CustomToolbar() {
    return (

      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />

      </GridToolbarContainer>

    );
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



  useEffect(() => {

    updateOnlyPesoConsumidoGR({
      variables: {
        idGrupoRefeicao: idGrupoRefeicaoPage,
        pesoTotalConsumidoGrupoRefeicao: 0
      },
      fetchPolicy: "network-only",
    }).then(function (response) {

      console.log("pesoTotalConsumidoGrupoRefeicao atualizada")
      console.log(response)
      loadGetGrupoRefeicao()

    }).catch((e) => {

      console.log("Falha ao tentar registrar! Mensagem do servidor: " + e);

    });
  }, [idGrupoRefeicaoPage,loadGetGrupoRefeicao,updateOnlyPesoConsumidoGR]);


  const handleReset = (idGrupoRefeicao: number | undefined) =>
    () => {
      setIdGrupoRefeicaoPage(idGrupoRefeicao)
    }


  let columns: GridColDef[] = [
    { field: 'nomeGrupoRefeicao', width: 200, headerName: 'Nome Grupo Refeição', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'pesoTotalGrupoRefeicao', width: 120, valueGetter: (params) => handleNumberMysql(params.row.pesoTotalGrupoRefeicao, "g"), headerName: 'Peso Total', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'pesoTotalConsumidoGrupoRefeicao', width: 120, valueGetter: (params) => handleNumberMysql(params.row.pesoTotalConsumidoGrupoRefeicao, "g"), headerName: 'Peso Consumido', headerAlign: 'left', headerClassName: 'super-app-theme--header' },  
    {
      field: 'reset', width: 100, headerName: "Reset", renderCell: (params) => (
        <div className={classes.root}>
          <IconButton >
            <ChangeCircleIcon color="success"
              sx={[
                { fontSize: 40, },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: {
                    fontSize: 20,
                  }
                }
                ),
              ]}
              onClick={handleReset(params.row.idGrupoRefeicao)} />
          </IconButton>
        </div>
      ),
    },
    {
      field: 'detail', width: 110, headerName: "Detalhar Itens", renderCell: () => (

        <DetailItemMeal showMessage={showMessage} open2={open2} setOpen2={setOpen2} idGrupoRefeicao={idSelectRow} />
      ),
    },
/*
    {
      field: 'change', width: 110, headerName: "Alterar", renderCell: () => (

        <ChangeGrupoRefeicao tabelaNutricionalData={tabelaNutricionalData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} pesoTotalGrupoRefeicaoSelectRow={pesoTotalGrupoRefeicaoSelectRow} observacaoSelectRow={observacaoSelectRow} nomeGrupoRefeicaoAlimentoSelectRow={nomeGrupoRefeicaoAlimentoSelectRow} descricaoAlimentoSelectRow={''} qtdePesoConsumidaExecSelectRow={''} dtConsumoExecSelectRow={''} idAlimentoSelectRow={0} />

      ),
      
    },*/
    {
      field: 'delete', width: 110, headerName: "Deletar", renderCell: (params) => (
        <div className={classes.root}>
          <IconButton >
            <DeleteIcon color="primary"
              sx={[
                { fontSize: 40, },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: {

                    fontSize: 20,
                  }
                }
                ),
              ]}
              onClick={handlePurge(params.row.idGrupoRefeicao)} ></DeleteIcon>
          </IconButton>
        </div>
      ),

    },

  ];

  const matches = useMediaQuery("(max-width:450px)");

  if (matches) {

    columns = [

      { field: 'nomeGrupoRefeicao', width: 150, headerName: 'Nome Grupo Refeição', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'pesoTotalGrupoRefeicao', width: 80, valueGetter: (params) => handleNumberMysql(params.row.pesoTotalGrupoRefeicao, "g"), headerName: 'Peso Total', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'pesoTotalConsumidoGrupoRefeicao', width: 80, valueGetter: (params) => handleNumberMysql(params.row.pesoTotalConsumidoGrupoRefeicao, "g"), headerName: 'Peso Consumido', headerAlign: 'left', headerClassName: 'super-app-theme--header' },    
      {
        field: 'reset', width: 80, headerName: "Reset", renderCell: (params) => (
          <div className={classes.root}>
            <IconButton >
              <ChangeCircleIcon color="success"
                sx={[
                  { fontSize: 40, },
                  (theme) => ({
                    [theme.breakpoints.down('sm')]: {
                      fontSize: 20,
                    }
                  }
                  ),
                ]}
                onClick={handleReset(params.row.idGrupoRefeicao)} />
            </IconButton>
          </div>
        ),
      },
      {
        field: 'detail', width: 80, headerName: "Detalhar Itens", renderCell: () => (

          <DetailItemMeal showMessage={showMessage} open2={open2} setOpen2={setOpen2} idGrupoRefeicao={idSelectRow} />
        ),
      },
/*
      {
        field: 'change', width: 80, headerName: "Alterar", renderCell: () => (

          <ChangeGrupoRefeicao showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} pesoTotalGrupoRefeicaoSelectRow={pesoTotalGrupoRefeicaoSelectRow} observacaoSelectRow={observacaoSelectRow} nomeGrupoRefeicaoAlimentoSelectRow={nomeGrupoRefeicaoAlimentoSelectRow} tabelaNutricionalData={undefined} descricaoAlimentoSelectRow={''} qtdePesoConsumidaExecSelectRow={''} dtConsumoExecSelectRow={''} idAlimentoSelectRow={0} />

        ),

      }, 
      */{
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

                onClick={handlePurge(params.row.idGrupoRefeicao)} ></DeleteIcon>
            </IconButton>
          </div>
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
                            Grupo Refeicao
                          </Typography>
                        </Toolbar>
                      </AppBar>
                    </div>
                  </a>
                </Link>
              </div>
              <div className={classes.root} >
                <Stack className={classes.root} padding={"12px 10px 0px 20px"} direction="row" spacing={2}>
                  <Stack className={classes.root} direction="row" spacing={2}>
                    <Button onClick={handlePurge(undefined)} size="large" variant="outlined"
                      startIcon={<DeleteIcon />}>
                      Deletar
                    </Button>

                  </Stack>
                  <AddGrupoRefeicao descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} tabelaNutricionalData={tabelaNutricionalData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} setCheckboxSelection={setCheckboxSelection} checkboxSelection={checkboxSelection} />
                </Stack>
              </div>
              <div className={classes.root} >
                <DataGrid
                  rows={rowsDataTemp}
                  getRowId={(row) => row.idGrupoRefeicao}
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
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,

                  }}
                  onRowClick={(params, event) => {
                    //console.log(rowsDataTemp)
                    idSelectRow = params.row.idGrupoRefeicao;
                    nomeGrupoRefeicaoAlimentoSelectRow = params.row.nomeGrupoRefeicao;
                    pesoTotalGrupoRefeicaoSelectRow = params.row.pesoTotalGrupoRefeicao;
                    observacaoSelectRow = params.row.observacao;
                    descricaoAlimentoSelectRow = params.row.descricaoAlimento;

                    // console.log("push -> /roles/" + params.row.descricaoAlimento);
                    //console.log(idSelectRow)              
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
            </form>
          </main>

        </div>

      )
      }
    </>

  );

}

export default (GrupoRefeicao);


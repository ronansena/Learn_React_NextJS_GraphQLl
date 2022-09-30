import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../components/ScreenGenericComponent/PageHeader';
//import style from "./styles.module.scss";
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
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Button } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import AddGrupoAlimento from "../../../../components/ActionComponent/TabelaNutricional/GrupoAlimento/AddGrupoAlimento";
import ChangeGrupoAlimento from "../../../../components/ActionComponent/TabelaNutricional/GrupoAlimento/ChangeGrupoAlimento";
import Snackbar from "@mui/material/Snackbar";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import { GET_GRUPO_ALIMENTO, DELETE_GRUPO_ALIMENTO } from '../../../../queries/TabelaNutricional/GrupoAlimento';
import Link from "next/link";
import { SlideTransition } from "../../../../utils/CustomLib";
import LinearProgressWithLabel from '../../../../components/ScreenGenericComponent/LinearProgressWithLabel';
import { useStyles } from '../../../../../styles/useStyles';
interface SnackbarMessage {
  message: string;
  key: number;
}

interface RowsData {

  __typename: string;
  idGrupoAlimento: number;
  nomeGrupoAlimento: string;

}

//style override




let idSelectRow: number = 0;
let nomeGrupoAlimentoSelectRow: string = "";


function GrupoAlimento() {

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const classes = useStyles();
  const [grupoAlimentoData, setGrupoAlimentoData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletedRows, setDeletedRows] = React.useState<GridSelectionModel>([]);
  const [deleteGrupoAlimentoPage] = useMutation(DELETE_GRUPO_ALIMENTO);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const [checkboxSelection, setCheckboxSelection] = useState(true);
  const rowsData = grupoAlimentoData;

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
  const [loadGreeting, { called, loading, data }] = useLazyQuery(GET_GRUPO_ALIMENTO, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setGrupoAlimentoData(data.getAllGrupoAlimento);
      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })


  // handle for delete rows from datagrid
  const handlePurge = (
    idGrupoAlimento: number | undefined
  ) =>
    () => {


      if (idGrupoAlimento != undefined) {

        while (deletedRows.length > 0) {
          deletedRows.pop();
        }
        deletedRows.push(idGrupoAlimento);

      }

      //console.log(deletedRows);
      if (deletedRows.length > 0) {

        deleteGrupoAlimentoPage({ variables: { idGrupoAlimento: deletedRows } }).then(

          async function (response) {

            if (response.data.deleteGrupoAlimento === true) {

              //alert("Registro deletado com sucesso!");
              //console.log("aqui" + Object.values(deletedRows));

              // remove os elementos do array deletedRows2 do array rows a atribui a uma nova variável newRows
              const newRows = rowsDataTemp.filter(function (x) {

                return deletedRows.indexOf(x.idGrupoAlimento) < 0;
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
              // console.log(arrayGrupoAlimento);
              //console.log("newRows: => " + newRows.map(function (x) { console.log(x.idGrupoAlimento) }));
              //console.log("AtualRows: " + rowsDataTemp.map(function (x) { console.log(x.idGrupoAlimento) }));
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

      loadGreeting()

  }, [data,loadGreeting])


  useEffect(() => {
   
    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {
          const isDuplicate = uniqueIds.includes(element.idGrupoAlimento);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
       
          unique.sort(function (a: any, b: any) {
            return a.nomeGrupoAlimento < b.nomeGrupoAlimento ? -1 : a.nomeGrupoAlimento > b.nomeGrupoAlimento ? 1 : 0;

          });
          setRowsDataTemp(unique);
        

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

  let columns: GridColDef[] = [
    {
      field: 'nomeGrupoAlimento', width: 200, headerName: 'Grupo de Alimento', headerClassName: 'super-app-theme--header',
      headerAlign: 'left'
    },

    {
      field: 'delete', width: 110, headerName: "Deletar", renderCell: (params) => (
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

              onClick={handlePurge(params.row.idGrupoAlimento)} ></DeleteIcon>
          </IconButton>
        </div>
      ),

    },
    {
      field: 'change', width: 110, headerName: "Alterar", renderCell: () => (

        <ChangeGrupoAlimento showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} />

      ),

    },

  ];

  const matches = useMediaQuery("(max-width:450px)");

  if (matches) {

    columns = [

      { field: 'nomeGrupoAlimento', width: 110, headerName: 'Grupo de Alimento', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
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

                onClick={handlePurge(params.row.idGrupoAlimento)} ></DeleteIcon>
            </IconButton>
          </div>
        ),

      },
      {
        field: 'change', width: 100, headerName: "Alterar", renderCell: () => (

          <ChangeGrupoAlimento showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} />

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
                            Origem do Dado Nutricional
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
                  <AddGrupoAlimento showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} setCheckboxSelection={setCheckboxSelection} checkboxSelection={checkboxSelection} />
                </Stack>
              </div>
              <div className={classes.root} >

                <DataGrid
                  rows={rowsDataTemp}
                  getRowId={(row) => row.idGrupoAlimento}
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

                    idSelectRow = params.row.idGrupoAlimento;
                    nomeGrupoAlimentoSelectRow = params.row.nomeGrupoAlimento;
                    // console.log("push -> /roles/" + params.row.nomeGrupoAlimento);
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

export default (GrupoAlimento);


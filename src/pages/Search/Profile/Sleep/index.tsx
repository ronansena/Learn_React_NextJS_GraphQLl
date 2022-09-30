import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../components/ScreenGenericComponent/PageHeader';
//import style from "./styles.module.scss";
import { useMutation, useLazyQuery } from "@apollo/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { handleTotalSleep, convertDateTime, SlideTransition } from "../../../../utils/CustomLib";
import AddIcon from '@mui/icons-material/Add';
import LinearProgress from '@mui/material/LinearProgress';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ConfirmationDialogRaw from '../../../../components/ScreenGenericComponent/ConfirmationDialogRaw';
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
import Snackbar from "@mui/material/Snackbar";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import { GET_SLEEP, DELETE_SLEEP, UPDATE_SLEEP, GET_LAST_SLEEP } from '../../../../queries/Profile/Sleep';
import Link from "next/link";
import LinearProgressWithLabel from '../../../../components/ScreenGenericComponent/LinearProgressWithLabel';
import {
  ADD_SLEEP,
} from "../../../../queries/Profile/Sleep";
import SleepTotalDialog from '../../../../components/ScreenGenericComponent/SleepTotalDialog';
import { useStyles } from '../../../../../styles/useStyles';

interface SnackbarMessage {
  message: string;
  key: number;
}

interface RowsData {

  __typename: string;
  idSleep: number;
  idProfileUser: number;
  dtFallAsleep: string;
  dtWakeUp: string;

}


function Sleep() {

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const classes = useStyles();
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
  const [openSleepTotalDialog, setOpenSleepTotalDialog] = React.useState(false);
  const [param, setParam] = useState();
  const [sleepData, setSleepData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletedRows, setDeletedRows] = React.useState<GridSelectionModel>([]);
  const [deleteSleepDataPage] = useMutation(DELETE_SLEEP);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const [checkboxSelection, setCheckboxSelection] = useState(true);
  const rowsData = sleepData;
  let conuntTemp3: number = 0;
  const [idSelectRow, setIdSelectRowPage] = useState<number>(0);
  const [createSleepPage] = useMutation(ADD_SLEEP);
  const [updateSleepPage] = useMutation(UPDATE_SLEEP);
  const matches = useMediaQuery("(max-width:450px)");
  /*
    const [atualizaPage] = useLazyQuery(GET_LAST_SLEEP,{
      fetchPolicy: "network-only",
      onCompleted: (data) => {
  
        let lastItemSleep = data.getLastSleep[0];    
  
        let hash: RowsData = Object.create(null);
        hash["__typename"] = "Sleep";
        hash["idSleep"] = parseInt(
          lastItemSleep.idSleep
        );
        hash["idProfileUser"] = parseInt(
          lastItemSleep.idProfileUser
        );
        
        hash["dtWakeUp"] = lastItemSleep.dtWakeUp;
        hash["dtFallAsleep"] = lastItemSleep.dtFallAsleep;
  
        //setDescricaoAlimentoPage("");
        //setQtdeConsumoSugeridaPage("");;
   
  
        const arr3 = Array.isArray(rowsDataTemp) ? rowsDataTemp.concat(hash) : [];
      
  
        const uniqueIds: any = [];
  
        if (arr3 != undefined) {
  
          const unique = arr3.filter(element => {
            const isDuplicate = uniqueIds.includes(element.idSleep);
  
            if (!isDuplicate) {
  
              uniqueIds.push(element);
              //console.log("isDuplicate" + true);
              return true;
            }
          });
  
          unique.sort(function (a: RowsData, b: RowsData) {
            return a.idSleep < b.idSleep ? -1 : a.idSleep > b.idSleep ? 1 : 0;
          });      
  
            setRowsDataTemp(unique.reverse());
  
        }
  
      },
      onError: (error) => {
        showMessage(error.message, SlideTransition);
      },
    });
  */
  //console.log(rowsData)
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

  const handleClose = () => {

    setOpenConfirmDelete(false);
    setOpenSleepTotalDialog(false);
  };

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
    setMessageInfo(undefined);
  };

  // handle for reset the message after it close
  const handleExited = () => {
    setMessageInfo(undefined);
  };

  // load the datagrid information  
  const [loadGetsleepData, { called, loading, data }] = useLazyQuery(GET_SLEEP, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setSleepData(data.getAllSleep);
      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  // handle for delete rows from datagrid
  const handlePurge = (
    idSleep: number | undefined
  ) =>
    () => {

      console.log(idSleep)

      if (idSleep != undefined) {

        while (deletedRows.length > 0) {
          deletedRows.pop();
        }
        deletedRows.push(idSleep);

      }

      console.log(deletedRows);
      if (deletedRows.length > 0) {

        deleteSleepDataPage({ variables: { idSleep: deletedRows } }).then(

          async function (response) {
            console.log(response)
            if (response.data.deleteSleep === true) {

              const newRows = rowsDataTemp.filter(function (x) {

                return deletedRows.indexOf(x.idSleep) < 0;
              })
              setDeletedRows([]);
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

              loadGetsleepData();
              showMessage("Registro deletado com sucesso!", SlideTransition);

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

  const handleClickListItem = () => {
    setOpenConfirmDelete(true);

  };

  const handleClickSleepTotalDialog = () => {

    setOpenSleepTotalDialog(true);

  };

  useEffect(() => {

    loadGetsleepData()

  }, [data, loadGetsleepData])



  useEffect(() => {

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {
          const isDuplicate = uniqueIds.includes(element.idSleep);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
        setRowsDataTemp(unique);
      }
    }
  }, [rowsData]);


  function CustomToolbar() {

    if (matches) {
      return (

        <GridToolbarContainer>
          <GridToolbarFilterButton />
          <GridToolbarExport />
          <Stack className={classes.root} direction="row" spacing={1}>
            <Button size="large" variant="outlined" onClick={handlePurge(undefined)}
              startIcon={<DeleteIcon />}>
              Deletar
            </Button>
            <Button type="button" size="large" variant="outlined" onClick={handleSleep}
              endIcon={<AddIcon />}>
              Sleep
            </Button>
          </Stack>
        </GridToolbarContainer>

      );
    } else {
      return (

        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
          <Stack className={classes.root} direction="row" spacing={1}>
            <Button size="large" variant="outlined" onClick={handlePurge(undefined)}
              startIcon={<DeleteIcon />}>
              Deletar
            </Button>
            <Button type="button" size="large" variant="outlined" onClick={handleSleep}
              endIcon={<AddIcon />}>
              Sleep
            </Button>
          </Stack>
        </GridToolbarContainer>

      );
    }
  }

  const handleWakeUp = (
    idSleep: number | undefined
  ) =>
    () => {

      updateSleepPage({
        variables: {
          idSleep: idSleep,
          dtWakeUp: convertDateTime(new Date),
        },

      }).then(function (response) {

        if (response.data.updateSleep === true) {

          showMessage("Registro atulizado com sucesso!", SlideTransition);
          loadGetsleepData();

        }
      }).catch((e) => {


        showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

      });

    }

  let columns: GridColDef[] = [
    {
      field: 'dtFallAsleep', width: 200, type: 'string', valueGetter: (params) => new Date(params.row.dtFallAsleep).toLocaleString('pt-BR'),
      headerName: 'Sleep', headerClassName: 'super-app-theme--header', headerAlign: 'left',
    },
    {
      field: 'dtWakeUp', width: 200, type: 'string', valueGetter: (params) => params.row.dtWakeUp === null ? "" : new Date(params.row.dtWakeUp).toLocaleString('pt-BR'),
      headerName: 'Wake Up', headerClassName: 'super-app-theme--header', headerAlign: 'left',
    },
    {
      field: 'totalSleep', width: 70, type: 'string', valueGetter: (params) => handleTotalSleep(params.row.dtFallAsleep, params.row.dtWakeUp),
      headerName: 'Total', headerClassName: 'super-app-theme--header', headerAlign: 'left',
    },
    {
      field: 'wakeup', width: 100, headerName: "Acordar", renderCell: (params) => (
        <div className={classes.root}>
          <IconButton >
            <ChangeCircleIcon color="warning"
              sx={[
                { fontSize: 40, },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: {
                    fontSize: 20,
                  }
                }
                ),
              ]}
              onClick={handleWakeUp(params.row.idSleep)} ></ChangeCircleIcon>
          </IconButton>
        </div>
      ),

    },

    {
      field: 'sleepTotalDialog', width: 100, headerName: "Total Sleep", renderCell: () => (
        <div className={classes.root}>
          <IconButton >
            <ChangeCircleIcon color="primary" onClick={handleClickSleepTotalDialog}
              sx={[
                { fontSize: 40, },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: {

                    fontSize: 20,
                  }
                }
                ),
              ]}
            >
            </ChangeCircleIcon>
            <SleepTotalDialog
              // id={params.row.idConsumoNutricionalDiario}
              id="ringtone-menu"
              keepMounted
              open={openSleepTotalDialog}
              onClose={handleClose}
              param={param}
            //value={params.row.idConsumoNutricionalDiario}
            />
          </IconButton>
        </div>
      ),
    },
    {
      field: 'delete', width: 100, headerName: "Deletar", renderCell: (params) => (        
        <div className={classes.root}>
          <IconButton >
            <DeleteIcon color="secondary" onClick={handleClickListItem}
              sx={[
                { fontSize: 40, },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: {
                    fontSize: 20,
                  }
                }
                ),
              ]}             
            >
             
            </DeleteIcon>
            <ConfirmationDialogRaw
              //id={params.row.idConsumoNutricionalDiario}
              id="ringtone-menu"
              keepMounted
              open={openConfirmDelete}
              onClose={handleClose}
              handlePurge={handlePurge(idSelectRow)}
              idNumber={idSelectRow}
              //value={params.row.idConsumoNutricionalDiario}
            />
          </IconButton>
        </div>
      ),
    },
  ];


  if (matches) {

    columns = [

      {
        field: 'dtFallAsleep', width: 130, type: 'string', valueGetter: (params) => new Date(params.row.dtFallAsleep).toLocaleString('pt-BR'),
        headerName: 'Sleep', headerClassName: 'super-app-theme--header', headerAlign: 'left',
      },

      {
        field: 'dtWakeUp', width: 130, type: 'string', valueGetter: (params) => params.row.dtWakeUp === null ? "" : new Date(params.row.dtWakeUp).toLocaleString('pt-BR'),
        headerName: 'Wake Up', headerClassName: 'super-app-theme--header', headerAlign: 'left',
      },
      {
        field: 'totalSleep', width: 60, type: 'string', valueGetter: (params) => handleTotalSleep(params.row.dtFallAsleep, params.row.dtWakeUp),
        headerName: 'Total', headerClassName: 'super-app-theme--header', headerAlign: 'left',
      },
      {
        field: 'wakeup', width: 20, headerName: "Acordar", renderCell: (params) => (
          <div className={classes.root}>
            <IconButton >
              <ChangeCircleIcon color="warning"
                sx={[
                  { fontSize: 40, },
                  (theme) => ({
                    [theme.breakpoints.down('sm')]: {

                      fontSize: 20,
                    }
                  }
                  ),
                ]}

                onClick={handleWakeUp(params.row.idSleep)} ></ChangeCircleIcon>
            </IconButton>
          </div>
        ),

      },
      {
        field: 'sleepTotalDialog', width: 70, headerName: "Total Sleep", renderCell: () => (
          <div className={classes.root}>
            <IconButton >
              <ChangeCircleIcon color="primary" onClick={handleClickSleepTotalDialog}
                sx={[
                  { fontSize: 40, },
                  (theme) => ({
                    [theme.breakpoints.down('sm')]: {
                      fontSize: 20,
                    }
                  }
                  ),
                ]}
              >

              </ChangeCircleIcon>
              <SleepTotalDialog
                // id={params.row.idConsumoNutricionalDiario}
                id="ringtone-menu"
                keepMounted
                open={openSleepTotalDialog}
                onClose={handleClose}
                param={param}
              //value={params.row.idConsumoNutricionalDiario}
              />
            </IconButton>
          </div>
        ),
      },

      {
        field: 'delete', width: 20, headerName: "Deletar", renderCell: (params) => (
          <div className={classes.root}>
            <IconButton >
              <DeleteIcon color="secondary" onClick={handleClickListItem}
                sx={[
                  { fontSize: 40, },
                  (theme) => ({
                    [theme.breakpoints.down('sm')]: {

                      fontSize: 20,
                    }
                  }
                  ),
                ]}

              //onClick={handlePurge(params.row.idSleep)} 
              ></DeleteIcon>
              <ConfirmationDialogRaw
                // id={params.row.idConsumoNutricionalDiario}
                id="ringtone-menu"
                keepMounted
                open={openConfirmDelete}
                onClose={handleClose}
                handlePurge={handlePurge(idSelectRow)}
                idNumber={idSelectRow}
              //value={params.row.idConsumoNutricionalDiario}
              />
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

  function handleSleep() {

    createSleepPage({
      variables: {

        idProfileUser: 1,
        dtFallAsleep: convertDateTime(new Date),
        dtWakeUp: null,
      },

    }).then(function (response) {

      if (response.data.createSleep === true) {

        loadGetsleepData();
        showMessage("Registro cadastrado com sucesso!", SlideTransition);


      }
    }).catch((e) => {


      showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

    });
  }



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
                            Sleep
                          </Typography>
                        </Toolbar>
                      </AppBar>
                    </div>
                  </a>
                </Link>
              </div>
              <div className={classes.root} >


                <DataGrid

                  rows={rowsDataTemp}
                  getRowId={(row) => row.idSleep}
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

                    setIdSelectRowPage(params.row.idSleep);
                    setParam(params.row);

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

export default (Sleep);


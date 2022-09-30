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
import AddMetaDiariaData from "../../../../components/ActionComponent/Profile/MetaDiaria/AddMetaDiaria";
import ChangeMetaDiariaData from "../../../../components/ActionComponent/Profile/MetaDiaria/ChangeMetaDiaria";
import Snackbar from "@mui/material/Snackbar";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import { GET_META_DIARIA, DELETE_META_DIARIA } from '../../../../queries/Profile/MetaDiaria';
import { GET_LAST_MASSA_CORPORAL } from '../../../../queries/Profile/MassaCorporal';
import Link from "next/link";
import LinearProgressWithLabel from '../../../../components/ScreenGenericComponent/LinearProgressWithLabel';
import { SlideTransition } from "../../../../utils/CustomLib";
import { useStyles } from '../../../../../styles/useStyles';

interface SnackbarMessage {
  message: string;
  key: number;
}

interface RowsData {

  __typename: string;
  idMetaDiaria: number;
  idProfileUser: number;
  idStatusCadastro: number;
  custoMensalPrevisto: number;
  proteina: number;
  lipideos: number;
  carboidrato: number;
  fibraAlimentar: number;
  calcio: number;
  sodio: number;
  ferro: number;
  energiaKcal: number;
  dtCadastro: string;
  qtdeConsumoSugerida: number;


}

//style override




let idSelectRow: number = 0;
let descricaoAlimentoSelectRow: string = "";
let linkFonteSelectRow: string = "";
let nomeGrupoAlimentoSelectRow: string = "";

function MetaDiaria() {

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const classes = useStyles();
  const [metaDiariaData, setMetaDiariaData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletedRows, setDeletedRows] = React.useState<GridSelectionModel>([]);
  const [deleteMetaDiariaDataPage] = useMutation(DELETE_META_DIARIA);
  const [rowsDataTemp, setRowsDataTemp] = useState<Array<RowsData>>([]);
  const [checkboxSelection, setCheckboxSelection] = useState(true);
  const rowsData = metaDiariaData;
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
  const [loadGetMetaDiariaData, { called, loading, data }] = useLazyQuery(GET_META_DIARIA, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      loadGetLastMassaCorporal()
      setMetaDiariaData(data.getAllMetaDiaria);
      //setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })




  const [loadGetLastMassaCorporal, { data: cachedData, loading: loadingR, error }] = useLazyQuery(GET_LAST_MASSA_CORPORAL, {
    fetchPolicy: 'network-only',

    onCompleted: (data) => {

      setLoadingData(true);

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    }
  })

  // handle for delete rows from datagrid
  const handlePurge = (
    idMetaDiaria: number | undefined
  ) =>
    () => {


      if (idMetaDiaria != undefined) {

        while (deletedRows.length > 0) {
          deletedRows.pop();
        }
        deletedRows.push(idMetaDiaria);

      }

      //console.log(deletedRows);
      if (deletedRows.length > 0) {

        deleteMetaDiariaDataPage({ variables: { idMetaDiaria: deletedRows } }).then(

          async function (response) {

            if (response.data.deleteMetaDiaria === true) {

              //alert("Registro deletado com sucesso!");
              //console.log("aqui" + Object.values(deletedRows));

              // remove os elementos do array deletedRows2 do array rows a atribui a uma nova variável newRows
              const newRows = rowsDataTemp.filter(function (x) {

                return deletedRows.indexOf(x.idMetaDiaria) < 0;
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
              // console.log(arrayMetaDiariaData);
              //console.log("newRows: => " + newRows.map(function (x) { console.log(x.idMetaDiaria) }));
              //console.log("AtualRows: " + rowsDataTemp.map(function (x) { console.log(x.idMetaDiaria) }));
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

    loadGetMetaDiariaData()
    loadGetLastMassaCorporal()
    
  }, [data,loadGetMetaDiariaData,loadGetLastMassaCorporal])
  
  useEffect(() => {    

    const uniqueIds: any = [];

    if (rowsData != undefined) {

      if (Array.isArray(rowsData)) {

        const unique = rowsData.filter((element: RowsData) => {
          const isDuplicate = uniqueIds.includes(element.idMetaDiaria);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
     
          //ordenar o array antes de atualizar a tela
          unique.sort(function (a: any, b: any) {
            return a.idMetaDiaria < b.idMetaDiaria ? -1 : a.idMetaDiaria > b.idMetaDiaria ? 1 : 0;

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


  let columns: GridColDef[] = [
    { field: 'custoMensalPrevisto', width: 130, headerName: 'Custo Previsto', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'energiaKcal', width: 100, valueGetter: (params) => handleNumberMysql(params.row.energiaKcal, "g"), headerName: 'Energia Kcal', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'proteina', width: 100, valueGetter: (params) => handleNumberMysql(params.row.proteina, "g"), headerName: 'Proteína(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'carboidrato', width: 100, valueGetter: (params) => handleNumberMysql(params.row.carboidrato, "g"), headerName: 'Carboidrato(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'lipideos', width: 100, valueGetter: (params) => handleNumberMysql(params.row.lipideos, "g"), headerName: 'Lipídios(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'fibraAlimentar', width: 100, valueGetter: (params) => handleNumberMysql(params.row.fibraAlimentar, "g"), headerName: 'Fibra Alimentar(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'calcio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.calcio, "mg"), headerName: 'Cálcio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'sodio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.sodio, "mg"), headerName: 'Sódio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    { field: 'ferro', width: 100, valueGetter: (params) => handleNumberMysql(params.row.ferro, "mg"), headerName: 'Ferro(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
    {
      field: 'dtCadastro', width: 200, type: 'string', valueGetter: (params) => new Date(params.row.dtCadastro).toLocaleString('pt-BR'),
      headerName: 'Data', headerClassName: 'super-app-theme--header', headerAlign: 'left',
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

              onClick={handlePurge(params.row.idMetaDiaria)} ></DeleteIcon>
          </IconButton>
        </div>
      ),

    },
    {
      field: 'change', width: 110, headerName: "Alterar", renderCell: () => (

        <ChangeMetaDiariaData nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} linkFonteSelectRow={linkFonteSelectRow} />

      ),

    },

  ];

  const matches = useMediaQuery("(max-width:450px)");

  if (matches) {

    columns = [

      { field: 'custoMensalPrevisto', width: 130, headerName: 'Custo Previsto', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'energiaKcal', width: 100, valueGetter: (params) => handleNumberMysql(params.row.energiaKcal, "g"), headerName: 'Energia Kcal', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'proteina', width: 100, valueGetter: (params) => handleNumberMysql(params.row.proteina, "g"), headerName: 'Proteína(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'carboidrato', width: 100, valueGetter: (params) => handleNumberMysql(params.row.carboidrato, "g"), headerName: 'Carboidrato(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'lipideos', width: 100, valueGetter: (params) => handleNumberMysql(params.row.lipideos, "g"), headerName: 'Lipídios(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'fibraAlimentar', width: 100, valueGetter: (params) => handleNumberMysql(params.row.fibraAlimentar, "g"), headerName: 'Fibra Alimentar(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'calcio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.calcio, "mg"), headerName: 'Cálcio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'sodio', width: 100, valueGetter: (params) => handleNumberMysql(params.row.sodio, "mg"), headerName: 'Sódio(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      { field: 'ferro', width: 100, valueGetter: (params) => handleNumberMysql(params.row.ferro, "mg"), headerName: 'Ferro(g)', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
      {
        field: 'dtCadastro', width: 200, type: 'string', valueGetter: (params) => new Date(params.row.dtCadastro).toLocaleString('pt-BR'),
        headerName: 'Data', headerClassName: 'super-app-theme--header', headerAlign: 'left',
      },
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

                onClick={handlePurge(params.row.idMetaDiaria)} ></DeleteIcon>
            </IconButton>
          </div>
        ),

      },
      {
        field: 'change', width: 100, headerName: "Alterar", renderCell: () => (

          <ChangeMetaDiariaData nomeGrupoAlimentoSelectRow={nomeGrupoAlimentoSelectRow} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} idSelectRow={idSelectRow} descricaoAlimentoSelectRow={descricaoAlimentoSelectRow} linkFonteSelectRow={linkFonteSelectRow} />

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
                            Meta Diária
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
                  <AddMetaDiariaData cachedData={cachedData} showMessage={showMessage} setRowsDataTemp={setRowsDataTemp} rowsDataTemp={rowsDataTemp} setCheckboxSelection={setCheckboxSelection} checkboxSelection={checkboxSelection} />
                </Stack>
              </div>
              <div className={classes.root} >


                <DataGrid
                  rows={rowsDataTemp}
                  getRowId={(row) => row.idMetaDiaria}
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

                    idSelectRow = params.row.idMetaDiaria;

                    //descricaoAlimentoSelectRow = params.row.descricaoAlimento;
                    //linkFonteSelectRow = params.row.linkFonte;
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

export default (MetaDiaria);


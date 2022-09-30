import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { pink } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import { makeStyles, createStyles } from "@material-ui/core";
import { GET_ITEM_REFEICAO_BY_ID } from "../../../queries/TabelaNutricional/GrupoRefeicao";
import {  useLazyQuery } from "@apollo/client";

import Button from "@material-ui/core/Button";
import CancelIcon from '@mui/icons-material/Cancel';
import DetailsIcon from '@mui/icons-material/Details';
import {
    DataGrid, 
    GridColDef, 

} from '@mui/x-data-grid';

const useStyles = makeStyles((theme) =>
    createStyles({

        root: {
            "& .MuiDataGrid-root": {

                height: 492,
                color: `black`,
                fontSize: 12,

                zIndex: theme.zIndex.drawer + 1,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                [theme.breakpoints.down('sm')]: {

                    fontSize: 12,

                },
            },

            "& .input": {
                width: '100px', padding: '15px 15px 0px 0px',
                margin: '10px 10px 10px 0px',


            },
            "& .MuiTypography-root": {
                color: `black`,
                fontSize: 16,
                background: "#6842C2",
                fontWeight: "bold"
            },
            "& .MuiTypography-root.MuiDialogContentText-root": {
                fontSize: '1.5rem',
                background: "white",
                padding: "1px 0px 15px 0px"

            },
            "& .MuiDialogActions-root": {

            },
            "& .MuiButton-containedSizeLarge": {
                padding: "12px 23px",
            },
            "& .MuiAutocomplete-inputRoot": {

            },
            "& .MuiButtonBase-root": {

            },
            "& .MuiSnackbarContent-message": {
                fontSize: '1.5rem',
            },

            '& .MuiInputBase-input': {

                display: 'flex',
                fontSize: 16,
                width: '300px',
                padding: '20px 12px 10px 0px',
            },
            '& .MuiInputLabel-root': {

                fontSize: 16,

            },
        },
    })
);

interface DetailItemMeal {

    idGrupoRefeicao: number;
    open2: boolean;
    setOpen2: any;
    showMessage: any;
    itemGrupoRefeicao?: any;

}

const DetailItemMeal = (props: DetailItemMeal) => {

    let result = props.hasOwnProperty("itemGrupoRefeicao");
    const variables = {
        idGrupoRefeicao: props.idGrupoRefeicao,
    }
    const [rowsDataDetailItemMeal, setRowsDataDetailItemMeal] = useState<Array<any>>([]);
    //const { data: cachedData } = useQuery(GET_ITEM_REFEICAO_BY_ID, { fetchPolicy: 'network-only', variables });
    const [executeMyQuery, { data, loading, error }] = useLazyQuery(GET_ITEM_REFEICAO_BY_ID, {
        variables,
        fetchPolicy: 'network-only',
        onCompleted: (data) => {

            setRowsDataDetailItemMeal(data.getItemRefeicaoByID);

        }
    });


    useEffect(() => {

        if (result) {

            setRowsDataDetailItemMeal(props.itemGrupoRefeicao);

        } else {

            executeMyQuery()

        }
    }, [props.open2,executeMyQuery,props.itemGrupoRefeicao,result])


    const classes = useStyles();

    const handleClose = () => {

        props.setOpen2(false);
        setRowsDataDetailItemMeal([])

    };

    const handleClickOpen = () => {

        props.setOpen2(true);


    };


    let columns: GridColDef[] = [
        { field: 'descricaoAlimento', width: 140, headerName: 'Descrição Alimento', headerAlign: 'left', headerClassName: 'super-app-theme--header' },
        {
            field: 'qtdePesoPreparoRefeicao', width: 120, headerName: 'Peso preparado item', headerClassName: 'super-app-theme--header',
            headerAlign: 'left'
        },
        {
            field: 'observacao', width: 120, headerName: 'Observação', headerClassName: 'super-app-theme--header',
            headerAlign: 'left'
        },
    ];
    return (
        <>
            <div className={classes.root}>
                <Dialog                  
                    fullWidth
                    //maxWidth="sm"
                    onBackdropClick={handleClose}
                    open={props.open2}
                    //sx={{ width: '100%' }}
                >
                    <div className={classes.root}>
                        <DialogTitle >
                            Detalhamento de Itens
                        </DialogTitle>
                    </div>
                    {
                        <>{(rowsDataDetailItemMeal != undefined) ?

                            <div className={classes.root}>
                                <DataGrid
                                    rows={rowsDataDetailItemMeal}
                                    getRowId={(row) => row.idRefeicoes === undefined ? row.idAlimento : row.idRefeicoes}
                                    columns={columns}
                                    //rowsPerPageOptions={5}               
                                    autoHeight={true}
                                    showColumnRightBorder={true}
                                    //headerHeight={75}
                                    rowHeight={80}
                                    //cellWidth={50}
                                    pageSize={5}
                                    rowsPerPageOptions={[]}
                                    //hideFooterSelectedRowCount={false}
                                    //checkboxSelection
                                    {...data
                                    }
                                />
                            </div>
                            : ""}
                            <Button size="medium" variant="contained"
                                onClick={handleClose} endIcon={<CancelIcon />}>
                                Fechar
                            </Button>
                        </>
                    }
                </Dialog>
            </div>
            {result === false ?
                <>
                    <div className={classes.root}>
                        <IconButton >
                            <DetailsIcon sx={[
                                { fontSize: 40, color: pink[500] },
                                (theme) => ({
                                    [theme.breakpoints.down('sm')]: {

                                        fontSize: 20,
                                    }
                                }
                                ),
                            ]} onClick={handleClickOpen} />
                        </IconButton>

                    </div>
                </> : ""}
        </>
    );
}

export default (DetailItemMeal);
import { makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => createStyles({
 
    root: {    
        "& .MuiButton-label": {
            width: "40px",
    
        },
        "& .input": {
            display: 'inline-block',            
            marginTop: "18px",
         
      
        },
        "& .MuiTypography-root": {
            background: "#6842C2",
            fontSize: 18,
            color: `black`,
            fontWeight: "bold"

        },
        "& .MuiTypography-root.MuiDialogContentText-root": {            
            background: "#FFFFFF",
            padding: "1px 0px 15px 0px"

        },
        "& .MuiFormControlLabel-label": {
            background: "#FFFFFF",            
            fontSize: '1.3rem',
        },
        "& .MuiDialogActions-root": {
            padding: "15px 0px 0px 0px"
        },
     

        "& .MuiSnackbarContent-message": {
            fontSize: '1.5rem',
        },
        '& div div div div >.MuiDataGrid-cell': {
            borderBottom: 'none',
          },
        '& .MuiInputBase-input': {
            borderBottom: "0.1rem solid",
            fontSize: 16,
            width:"auto",
            padding: '10px 0px 5px 0px',            
        },

        "& .MuiFormLabel-root": {
            fontSize: 15,
            color: "black",
            margin: "0px 0px 10px 10px"
        },
        "& .MuiInputBase-root": {            
            fontSize: 12,            
        },
     
        "& .MuiDataGrid-root": {
            border: 'none',
            height: 492,         
            fontSize: 14,
            //background:"#222222",        
        
            [theme.breakpoints.down('sm')]: {

                fontSize: 10,

            },
        },
       
     
         "& .MuiButtonBase-root.MuiButton-root": {
            height: "30px",
            //height: "auto",
            //width: "auto",
            color: "black",
            [theme.breakpoints.down('sm')]: {

                fontSize: 10,

            },

        }, "& .MuiDataGrid-toolbarContainer": {
            //borderRadius: "1.1rem",
            borderBottom: "6px solid ",
            marginLeft: "10px",

        },       
        "& .MuiDataGrid-columnHeaderTitle": {

            fontWeight: 1000,

        },
        '& .MuiSvgIcon-root':
        {
            fontSize: 20,

            [theme.breakpoints.down('sm')]: {

                fontSize: 16

            }
        },

        "& .MuiTablePagination-displayedRows": {
            fontSize: 17,
        },


    },
    appBar: {
        "& .MuiToolbar-root ": {

            backgroundColor: '#6842C2',
            zIndex: theme.zIndex.drawer + 1,                                                
        },
        "& .MuiTypography-root": {
            fontSize: 18
        },
        "& .MuiSvgIcon-root": {
            fontSize: "2em"
        }
    },
}))

export { useStyles };

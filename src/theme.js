import { createTheme } from '@material-ui/core/styles';
import {blue,red} from '@material-ui/core/colors';
const themeLight = createTheme({
  palette: {
    background: {
      default: "#e0e0e0",
    },
    
  },  
  typography: {
    // In Japanese the characters are usually larger.
    fontSize: 12,
    color:"black"
  },
  
  
});

const themeDark = createTheme({
  palette: {
    background: {
      default: "#222222",
    },
    text: {
      primary: "#07060c",
      
      fontWeight: 1000,
    },
  } ,
  
 
});

export {themeLight,themeDark};
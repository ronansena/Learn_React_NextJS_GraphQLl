import React, { useEffect, useState } from 'react';
import { useLazyQuery } from "@apollo/client";

import TextField from '@mui/material/TextField';
import { GET_ORIGEM_DADO_NUTRICIONAL } from '../../../queries/TabelaNutricional/OrigemDadoNutricional';
import Autocomplete from '@mui/material/Autocomplete';
import { SlideTransition } from "../../../utils/CustomLib"
interface NomeOrigemDadoNutricional {

    showMessage: any;
    setIdOrigemDadoNutricionalPage: (idOrigemDadoNutricional: number) => void;
    setNomeOrigemDadoNutricionalPage: (nomeOrigemDadoNutricional: string) => void;
    nomeOrigemDadoNutricionalPage: string;
}

const NomeOrigemDadoNutricional = (props: NomeOrigemDadoNutricional) => {
    //console.log(props.descricaoAlimentoPage)
    
    const [idOrigemDadoNutricionalPageTemp, setIdOrigemDadoNutricionalPageTemp] = useState(0);
    const [nomeOrigemDadoNutricionalTemp, setNomeOrigemDadoNutricionalTemp] = useState(props.nomeOrigemDadoNutricionalPage);
    const [origemDadoNutricionalData, setOrigemDadoNutricionalData] = useState([]);

    const variables = {
        idOrigemDadoNutricional: idOrigemDadoNutricionalPageTemp,
    }

    //console.log("descricaoAlimentoTemp")
 //console.log(descricaoAlimentoTemp)
   

    const [loadGetOrigemDadoNutricional, { called, loading, data }] = useLazyQuery(GET_ORIGEM_DADO_NUTRICIONAL, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            
            setOrigemDadoNutricionalData(data.getAllOrigemDadoNutricional);
         
            

        },
        onError: (error) => {
            props.showMessage(error.message, SlideTransition);
        }
    }) 

  
    

    function onSelectHandle(value: { nomeOrigemDadoNutricional:string,idOrigemDadoNutricional: any }) {
       
      setNomeOrigemDadoNutricionalTemp(value.nomeOrigemDadoNutricional)
      setIdOrigemDadoNutricionalPageTemp(value.idOrigemDadoNutricional)
     props.setIdOrigemDadoNutricionalPage(value.idOrigemDadoNutricional)
     
  }
  
    
    const [value, setValue] = React.useState<any>(nomeOrigemDadoNutricionalTemp);
    const [inputValue, setInputValue] = React.useState('');
  
    useEffect(() => {
     
      
      setNomeOrigemDadoNutricionalTemp(props.nomeOrigemDadoNutricionalPage);
      setNomeOrigemDadoNutricionalTemp((state:any) => {
          console.log(state); // "React is awesome!"
          setInputValue(state)
          return state;
      });   

      loadGetOrigemDadoNutricional()
     
  }, [ loadGetOrigemDadoNutricional,props.nomeOrigemDadoNutricionalPage])
  
  

    return (
        <>

<Autocomplete
                    value={value}
                    inputValue={nomeOrigemDadoNutricionalTemp}
                    //inputValue={descricaoAlimentoTemp }
                    onInputChange={(event, newInputValue) => {
                      let tempCount = 0
                      tempCount++;
                      if (newInputValue !== "" || tempCount > 2 || nomeOrigemDadoNutricionalTemp !== undefined && nomeOrigemDadoNutricionalTemp.length === 1) {
                        
                        setNomeOrigemDadoNutricionalTemp(newInputValue);
                        
                      }
                    }}


                    onChange={(event: any, newValue: any) => {
                      setValue(newValue);

                      onSelectHandle(newValue)
                    }}

                    id="auto-complete"
                    disableClearable
                    options={origemDadoNutricionalData}
                    getOptionLabel={(origemDadoNutricionalData: any) => origemDadoNutricionalData.nomeOrigemDadoNutricional ? origemDadoNutricionalData.nomeOrigemDadoNutricional : ""}
                    renderInput={(params) => <TextField
                      {...params}
                      
                      variant="standard"
                      id="standard-basic"
                      sx={{ width: '100px', padding: '30px 0px 0px 0px', display: 'block' }}
                      label="Origem dado nutricional"
                      onChange={(event) => {
                        if (event.target.value !== '' || event.target.value !== null) {
                          console.log("onChangeHandle = onChange")
                          console.log(event.target.value)
                          // onChangeHandle(event.target.value)
                          //setidAlimentoPage((event.target.value))
                        }
                      }}
                    />}
                  />

        </>
    )

}

export default (NomeOrigemDadoNutricional)
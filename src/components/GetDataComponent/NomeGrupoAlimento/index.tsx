import React, { useEffect, useState } from 'react';
import { useLazyQuery } from "@apollo/client";
import TextField from '@mui/material/TextField';
import { GET_GRUPO_ALIMENTO } from '../../../queries/TabelaNutricional/GrupoAlimento';
import Autocomplete from '@mui/material/Autocomplete';
import { SlideTransition } from "../../../utils/CustomLib";
interface NomeGrupoAlimento {

    showMessage: any;
    setIdGrupoAlimentoPage: (idGrupoAlimentoPage: number) => void;
    nomeGrupoAlimentoPage: string;
    setNomeGrupoAlimentoPage: (idGrupoAlimentoPage: string) => void;

}

const NomeGrupoAlimento = (props: NomeGrupoAlimento) => {

    //console.log(props.descricaoAlimentoPage)

    const [idGrupoAlimentoTemp, setIdGrupoAlimentoTemp] = useState(0);
    const [grupoAlimentoData, setGrupoAlimentoData] = useState([]);
    const [nomeGrupoAlimentoTemp, setNomeGrupoAlimentoTemp] = useState(props.nomeGrupoAlimentoPage);
    // segmento responsável por retornar o nome do Grupo de Alimento para ser usado em parent and child components

    //const [loadingDataGetGrupoAlimento, setLoadingDataGetGrupoAlimento] = useState(false);

    const [loadGetGrupoAlimento, { called, loading, data }] = useLazyQuery(GET_GRUPO_ALIMENTO, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {

            setGrupoAlimentoData(data.getAllGrupoAlimento);
            //setLoadingDataGetGrupoAlimento(true);

        },
        onError: (error) => {
            props.showMessage(error.message, SlideTransition);
        }
    })


    function onSelectHandle(value: { nomeGrupoAlimento: string, idGrupoAlimento: any }) {

        props.setNomeGrupoAlimentoPage(value.nomeGrupoAlimento)
        setIdGrupoAlimentoTemp(value.idGrupoAlimento)
        props.setIdGrupoAlimentoPage(value.idGrupoAlimento)

    }

    const [value, setValue] = React.useState<any>(nomeGrupoAlimentoTemp);
    const [inputValue, setInputValue] = React.useState('');

    useEffect(() => {


        loadGetGrupoAlimento()
        setNomeGrupoAlimentoTemp(props.nomeGrupoAlimentoPage);
        setNomeGrupoAlimentoTemp((state:any) => {
            //console.log(state); // "React is awesome!"
            setInputValue(state)
            return state;
        });

    }, [loadGetGrupoAlimento])


    return (
        <>
            <Autocomplete
                value={value}                
                inputValue={nomeGrupoAlimentoTemp} 
                onInputChange={(event, newInputValue) => {
                
                    if (newInputValue !== "" || nomeGrupoAlimentoTemp.length === 1) {

                        //setInputValue(newInputValue);                   
                        setNomeGrupoAlimentoTemp(newInputValue);
                        //props.setnomeGrupoAlimentoPage(newInputValue);
                    }
                }}

                onChange={(event: any, newValue: any) => {
                    
                    setValue(newValue);
                    onSelectHandle(newValue)

                }}
                id="auto-complete"
                disableClearable
                options={grupoAlimentoData}                                
                getOptionLabel={(grupoAlimentoData: any) => grupoAlimentoData.nomeGrupoAlimento ? grupoAlimentoData.nomeGrupoAlimento : ""}                                
                renderInput={(params) => <TextField
                    {...params}
                    variant="standard"
                    id="standard-basic"
                    label="Grupo Alimento"
                    sx={{ width: '230px', padding: '30px 0px 0px 0px', display: 'block' }}
                />}           
            />
        </>
    )
}

export default (NomeGrupoAlimento)
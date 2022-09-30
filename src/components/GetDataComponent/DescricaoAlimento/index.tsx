import React, { useEffect, useState } from 'react';
import { useLazyQuery } from "@apollo/client";
import TextField from '@mui/material/TextField';
import { GET_TABELA_NUTRICIONAL_DESCRICAO_ALIMENTO, GET_TABELA_NUTRICIONAL_BY_ID } from '../../../queries/TabelaNutricional/TabelaNutricional';
import Autocomplete from '@mui/material/Autocomplete';
import { TimeZoneCustom, convertCommaToDot, convertFixNumber, SlideTransition } from "../../../utils/CustomLib"
interface DescricaoAlimento {

    showMessage: any;
    setIdAlimentoPage: (idAlimentoPage: number) => void;
    setDescricaoAlimentoPage: (descricaoAlimento: string) => void;
    descricaoAlimentoPage: string;
}

const DescricaoAlimento = (props: DescricaoAlimento) => {
    
    const [tabelaNutricionalData, setTabelaNutricionalData] = useState([]);
    const [idAlimentoPageTemp, setIdAlimentoPageTemp] = useState(0);
    const [descricaoAlimentoTemp, setDescricaoAlimentoTemp] = useState(props.descricaoAlimentoPage);

    const variables = {
        idAlimento: idAlimentoPageTemp,
    }

    const [loadGetTabelaNutricional, { called, loading, data }] = useLazyQuery(GET_TABELA_NUTRICIONAL_DESCRICAO_ALIMENTO, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {

            setTabelaNutricionalData(data.getAllTabelaNutricionalDescricaoAlimento);

        },
        onError: (error) => {
            props.showMessage(error.message, SlideTransition);
        }
    })


    function onSelectHandle(value: { descricaoAlimento: string, idAlimento: any }) {

        props.setDescricaoAlimentoPage(value.descricaoAlimento)
        setIdAlimentoPageTemp(value.idAlimento)
        props.setIdAlimentoPage(value.idAlimento)

    }

    const [value, setValue] = React.useState<any>(descricaoAlimentoTemp);
    const [inputValue, setInputValue] = React.useState('');

    useEffect(() => {

        setDescricaoAlimentoTemp(props.descricaoAlimentoPage);
        setDescricaoAlimentoTemp((state) => {
            //console.log(state); // "React is awesome!"
            setInputValue(state)
            return state;
        });

        loadGetTabelaNutricional()

    }, [loadGetTabelaNutricional,props.descricaoAlimentoPage])

    return (
        <>
            <Autocomplete
                value={value}
                inputValue={descricaoAlimentoTemp}                
                onInputChange={(event, newInputValue) => {
                    let tempCount = 0
                    tempCount++;
                    if (newInputValue !== "" || tempCount > 2 || descricaoAlimentoTemp.length === 1) {                                     
                        setDescricaoAlimentoTemp(newInputValue);                        
                    }
                }}
                onChange={(event: any, newValue: any) => {
                    setValue(newValue);
                    onSelectHandle(newValue)
                }}
                autoSelect
                id="auto-complete"
                disableClearable
                options={tabelaNutricionalData}
                getOptionLabel={(tabelaNutricionalData: any) => tabelaNutricionalData.descricaoAlimento ? tabelaNutricionalData.descricaoAlimento : ""}
                sx={{ width: 200 }}
                renderInput={(params) => <TextField
                    required
                    {...params}
                    variant="standard"
                    autoFocus
                    id="standard-basic"
                    
                    label="Descrição alimento"
                />}
            />
        </>
    )
}

export default (DescricaoAlimento)
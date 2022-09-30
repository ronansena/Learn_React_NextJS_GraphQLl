import React, { useEffect, useState } from 'react';
import { useLazyQuery } from "@apollo/client";
import TextField from '@mui/material/TextField';
import { GET_GRUPO_REFEICAO, GET_ITEM_REFEICAO_BY_ID } from '../../../queries/TabelaNutricional/GrupoRefeicao';
import Autocomplete from '@mui/material/Autocomplete';
import {convertCommaToDot, SlideTransition,onBlurField } from "../../../utils/CustomLib";

interface NomeGrupoRefeicao {

    showMessage: any;
    setIdGrupoRefeicaoPage: (idGrupoRefeicaoPage: number) => void;
    setItemGrupoRefeicao: any;
    idGrupoRefeicaoPage: number;
    qtdePesoConsumidaExecPage:string;
    setQtdePesoConsumidaExecPage: (qtdePesoConsumidaExecPage: string) => void;   
    consideraPesoProporcionalGrupoRefeicao:boolean; 
    classes:any;
    buttonRef:any;
    
}


interface ItemGrupoAlimentoObj {
    __typename: string;
    qtdePesoPreparoRefeicao: number;    
    idAlimento: number;
    idGrupoRefeicao: number;
}

interface ItemGrupoAlimentoObjData {
    [key: string]: ItemGrupoAlimentoObj;
}

interface GetDetailItemMealByID {

    idGrupoRefeicao: number;
    setItemGrupoRefeicao: ItemGrupoAlimentoObjData;
   

}


const NomeGrupoRefeicao = (props: NomeGrupoRefeicao) => {
   //console.log("props.idGrupoRefeicaoPage")
  // console.log(props.idGrupoRefeicaoPage)
  
    const [grupoRefeicaoData, setGrupoRefeicaoData] = useState([]);
 
    // segmento responsável por retornar o nome do Grupo de Refeicao para ser usado em parent and child components

    const variables = {
        idGrupoRefeicao: props.idGrupoRefeicaoPage,
    }

    //const [loadingDataGetGrupoRefeicao, setLoadingDataGetGrupoRefeicao] = useState(false);
    const [loadGetItemGrupoRefeicao, { data: dataR, error: errorR, loading: landingR }] = useLazyQuery(GET_ITEM_REFEICAO_BY_ID, {
        variables,
        fetchPolicy: 'network-only',   

        onCompleted: (data) => {

            console.log("data loadGetItemGrupoRefeicao")
            console.log(data)   
            props.setItemGrupoRefeicao([])

            if ((data.getItemRefeicaoByID).length > 0) {
                console.log("data loadGetItemGrupoRefeicao")
                console.log(data)                

                data.getItemRefeicaoByID.map((item: ItemGrupoAlimentoObj) => {

                    props.setItemGrupoRefeicao(((existingItems: ItemGrupoAlimentoObj[]) => {

                        return existingItems.concat([item])
                    }
                    ))

                })
            }

        }
    });
    const [loadGetGrupoRefeicao, { called, loading, data }] = useLazyQuery(GET_GRUPO_REFEICAO, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {

            console.log("data loadGetGrupoRefeicao")
            console.log(data)   

            setGrupoRefeicaoData(data.getAllGrupoRefeicao);
            //console.log(data.getAllGrupoRefeicao.consideraPesoProporcionalGrupoRefeicao);
            

        },
        onError: (error) => {
            props.showMessage(error.message, SlideTransition);
        }
    })

  
    useEffect(() => {
   
            loadGetGrupoRefeicao()
         
    }, [data,loadGetGrupoRefeicao])


    useEffect(() => {      
        
        loadGetItemGrupoRefeicao()
        
    },[props.idGrupoRefeicaoPage,loadGetItemGrupoRefeicao])    


    function onSelectHandle(value: any) {
       
        props.setIdGrupoRefeicaoPage(value.idGrupoRefeicao)
        
    }

    return (
        <>
        <div className={props.classes.root} >
          
            <Autocomplete
                onChange={(event, newValue) => {
                    onSelectHandle(newValue)
                }}
                id="auto-complete"
                fullWidth={true}
                disableClearable             
                defaultValue={{ nomeGrupoRefeicao: ""}}             
                options={grupoRefeicaoData}              
                getOptionLabel={(grupoRefeicaoData: any) => grupoRefeicaoData.nomeGrupoRefeicao}
                renderInput={(params) => <TextField
                    required
                    {...params}
                    variant="standard"                    
                    id="standard-basic"
                    label="Grupo Refeicao"                    
                />}
            />
           
            </div>

            {props.consideraPesoProporcionalGrupoRefeicao === true ? (

                <>
                   <div className={props.classes.root} >
                    <TextField
                        required
                        variant="standard"
                        id="standard-basic"
                        sx={{ width: '230px', padding: '15px 0px 0px 0px', display: 'flex' }}                        
                        inputRef={(input) => {
                            if(input !== null && props.idGrupoRefeicaoPage !== 0 && input.value === "") {
                              console.log(props.idGrupoRefeicaoPage)
                               input.focus();
                            }
                          }}
                        onBlur={() => onBlurField(props.buttonRef)}
                        //className="input"
                        //type="text"
                        //placeholder="fator conversão"
                        // name="qtdePesoConsumidaExecPage"
                        label="Quantidade Consumida Prato Executado"
                        //label="Informe o fator de conversão:"                        
                        value={props.qtdePesoConsumidaExecPage}                        
                        onChange={(e) => {
                        
                                props.setQtdePesoConsumidaExecPage(convertCommaToDot(e.target.value));
                          
                        }}
                    />
                    </div>
                </>
                //{errors?.qtdePesoConsumidaExec && <p>{errors.qtdePesoConsumidaExec.message}</p>}

            ) : ("")
            }
        </>
    )
}

export default (NomeGrupoRefeicao)
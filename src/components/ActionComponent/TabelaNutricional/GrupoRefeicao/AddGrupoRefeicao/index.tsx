import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useMutation, useLazyQuery } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import ListIcon from '@mui/icons-material/List';

import {
  ADD_GRUPO_REFEICAO,
  GET_LAST_GRUPO_REFEICAO,
  ADD_ITEM_REFEICAO
} from "../../../../../queries/TabelaNutricional/GrupoRefeicao";

import Stack from '@mui/material/Stack';
import { Typography, Box } from '@mui/material';
import DescricaoAlimento from "../../../../GetDataComponent/DescricaoAlimento";
import {convertCommaToDot, convertFixNumber,SlideTransition } from "../../../../../utils/CustomLib";
import DetailItemMeal from "../../../../GetDataComponent/DetailItemMeal";
import { useStyles } from '../../../../../../styles/useStyles'

interface ItemGrupoAlimentoObj {
  
  __typename: string;
  qtdePesoPreparoRefeicao: number;  
  idAlimento: number;
  idGrupoRefeicao: number;
  descricaoAlimento:string;
  observacao:string;
  
} 


interface ItemGrupoAlimentoObjData {
  [key: string]: ItemGrupoAlimentoObj;
}

type FormValues = {
  idGrupoRefeicao: number;
  idAlimento: number;
  nomeGrupoRefeicao: String;
  descricaoAlimento: String;
  observacao: String;
  qtdePesoConsumidaExec: number;
  qtdePesoPreparoRefeicao: number;
  pesoTotalGrupoRefeicao: number;
  qtdePesoPreparoRefeicaoPage: string;
  idAlimentoPage: number;
};
interface RowsData {
  __typename: string;
  idGrupoRefeicao: number;
  idAlimento: number;
  nomeGrupoRefeicao: String;
  descricaoAlimento: String;
  observacao: String;
  qtdePesoConsumidaExec: number;
  qtdePesoPreparoRefeicao: number;
  pesoTotalGrupoRefeicao: number;
  qtdePesoPreparoRefeicaoPage: string;
  idAlimentoPage: number;
}

const AddGrupoRefeicao = ({
  tabelaNutricionalData,
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  setCheckboxSelection,
  descricaoAlimentoSelectRow,
  checkboxSelection
}: {  descricaoAlimentoSelectRow:any, tabelaNutricionalData: any, showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, setCheckboxSelection: any, checkboxSelection: any }
) => {

  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [idAlimentoPage, setIdAlimentoPage] = useState(0);
  const [idGrupoRefeicaoPage, setIdGrupoRefeicaoPage] = useState(0);
  const [nomeGrupoRefeicaoPage, setNomeGrupoRefeicaoPage] = useState("");
  const [qtdePesoPreparoRefeicaoPage, setQtdePesoPreparoRefeicaoPage] = useState("");    
  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState("");  
  const [observacaoPage, setObservacaoPage] = useState("");
  const [pesoTotalPage, setPesoTotalPage] = useState(0);
  const [itemGrupoRefeicao, setItemGrupoRefeicao] = useState<ItemGrupoAlimentoObjData[] | []>([]);
  const [createGrupoRefeicaoPage] = useMutation(ADD_GRUPO_REFEICAO);
  const [createItemRefeicaoPage] = useMutation(ADD_ITEM_REFEICAO);

  const [atualizaPage] = useLazyQuery(GET_LAST_GRUPO_REFEICAO, 
     { fetchPolicy: "network-only",
    onCompleted: (data) => {
      let conuntTemp3: number = 0;
      //console.log(data.getLastUnidadeMedida[0].idUnidadeMedida)
      //console.log(dtConsumoExecPage + "------" + qtdePesoConsumidaExecPage)
      let hash: RowsData = Object.create(null);
      hash["__typename"] = "GrupoRefeicao";
      hash["idGrupoRefeicao"] = parseInt(
        data.getLastGrupoRefeicao[0].idGrupoRefeicao
      );
      hash["nomeGrupoRefeicao"] = nomeGrupoRefeicaoPage;
      hash["pesoTotalGrupoRefeicao"] = data.getLastGrupoRefeicao[0].pesoTotalGrupoRefeicao;
      hash["observacao"] = data.getLastGrupoRefeicao[0].observacao;

      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      setNomeGrupoRefeicaoPage("");
      setIdAlimentoPage(0)
      setObservacaoPage("")      
      setQtdePesoPreparoRefeicaoPage("")
      //   console.log("rowsDataTemp");
      //  console.log(rowsDataTemp)
      //  console.log("hash");
      //  console.log(hash)
      const arr3 = Array.isArray(rowsDataTemp) ? rowsDataTemp.concat(hash) : [];
      //   console.log("arr3");
      //     console.log(arr3)
      const uniqueIds: any = [];
      if (arr3 != undefined) {
        const unique = arr3.filter(element => {
          const isDuplicate = uniqueIds.includes(element.idConsumoNutricionalDiario);
          if (!isDuplicate) {
            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });
        //ordenar o array pelo campo escolhido(nomeUnidademedida) antes de atualizar a tela
        unique.sort(function (a, b) {
          return a.idGrupoRefeicao < b.idGrupoRefeicao ? -1 : a.idGrupoRefeicao > b.idGrupoRefeicao ? 1 : 0;
        });

        conuntTemp3++
        if (conuntTemp3 === 1) {
          setRowsDataTemp(unique.reverse());
          //     console.log("unique");
          //     console.log(unique);
        }
      }
      itemGrupoRefeicao.map((item) => {
        console.log("createItemRefeicaoPage")
        console.log(item)
        createItemRefeicaoPage({
          variables: {
            idAlimento: item.idAlimento,
            idGrupoRefeicao: data.getLastGrupoRefeicao[0].idGrupoRefeicao,
            qtdePesoPreparoRefeicao: item.qtdePesoPreparoRefeicao,            
          },
        }).then(function (response) {
          if (response.data.createItemRefeicao === true) {
            console.log("item incluído")
            console.log(response.data.createItemRefeicao)
            // atualizaPage();
            //showMessage("Registro cadastrado com sucesso!", SlideTransition);
       

          }
        }).catch((e) => {
          handleClose()
          showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);
        });
      });// map
      setItemGrupoRefeicao([]);
      setQtdePesoPreparoRefeicaoPage("")  
      
      setPesoTotalPage(0)
      setObservacaoPage("")
      setNomeGrupoRefeicaoPage("")
      setOpen2(false);
      
    }
  });//fim useLazyQuery

  const handleClickOpen = () => {

    setOpen2(true);
    //  console.log("estoy handleClickOpen => " + open)

  };
  const handleClose = () => {
    setOpen2(false);
    setQtdePesoPreparoRefeicaoPage("")      
    setItemGrupoRefeicao([])
    setPesoTotalPage(0)
    setObservacaoPage("")
    setNomeGrupoRefeicaoPage("")

  };
  /*
    const resolver: Resolver<FormValues> = async (values) => {
      return {
        values: !values.qtdePesoConsumidaExec || !values.idConsumoNutricionalDiario ? {} : values,
        errors: !values.qtdePesoConsumidaExec || !values.idConsumoNutricionalDiario
          ? {
            qtdePesoConsumidaExec: {
              type: "required",
              message: "This is required."
            },
            idConsumoNutricionalDiario: {
              type: "required",
              message: "This is required."
            }
          }
          : {}
      };
    };
  */
  const {
    register,
    control,
    formState: { isDirty, isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });
  //} = useForm<FormValues>({ resolver: resolver, mode: 'onChange' });

  const onSubmit = () => {
    //e.preventDefault();

    if (nomeGrupoRefeicaoPage != "" && itemGrupoRefeicao.length>0) {
      createGrupoRefeicaoPage({
        variables: {
          nomeGrupoRefeicao: nomeGrupoRefeicaoPage,
          pesoTotalGrupoRefeicao: pesoTotalPage,
          observacao: observacaoPage          
        },
      }).then(function (response) {
        if (response.data.createGrupoRefeicao === true) {
          console.log(response.data.createGrupoRefeicao)
          atualizaPage();
          showMessage("Registro cadastrado com sucesso!", SlideTransition);

        }
      }).catch((e) => {
        handleClose()
        showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);
      });
    }else{

      showMessage("Alerta: É necessário registrar ao menos um item para cadastrar o grupo refeição! Por favor verificar!", SlideTransition);

    }
    
  };  

  const handleAddItem = () => {

    if(qtdePesoPreparoRefeicaoPage !== ""){
    let pesoTotalPageTemp = pesoTotalPage + convertFixNumber(qtdePesoPreparoRefeicaoPage); 

    setPesoTotalPage(pesoTotalPageTemp)

    let hash: ItemGrupoAlimentoObj = Object.create(null);
    hash["__typename"] = "ItemRefeicao";
    hash["idAlimento"] = idAlimentoPage;
    hash["idGrupoRefeicao"] = idGrupoRefeicaoPage; 
    hash["descricaoAlimento"] = descricaoAlimentoPage; 
    hash["observacao"] = observacaoPage; 
    hash["qtdePesoPreparoRefeicao"] = convertFixNumber(qtdePesoPreparoRefeicaoPage);    
 
    setItemGrupoRefeicao(((existingItems: any) => {
      return existingItems.concat([hash]);
    }));
 
    setIdAlimentoPage(0)
    setQtdePesoPreparoRefeicaoPage("")

    }else{

      showMessage("Alerta: É necessário informar o campo Qtde. preparada item! Por favor verificar!", SlideTransition);
      
    }
  }

  function handleListItem(){
    
    setOpenList(true)

  }

  return (
    <div className={classes.root}>
      <Dialog
        //disableEscapeKeyDown={false}
        //fullScreen={false}
        //onBackdropClick={handleClose}
        open={open2}
      >
        <div className={classes.root}>
          <DialogTitle >
            Cadastro
          </DialogTitle>
        </div>
        <DialogContent >
          <div className={classes.root}>
            <DialogContentText>Informe os campos:</DialogContentText>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)} id="formlogin">

            <Box
              sx={{               
                border: 1,
                padding: "15px"
              }}
            >
              <Stack spacing={2} >
                <Box
                  sx={{                  
                    border: 1,
                    padding: "15px",                   
                  }}
                >
                  <div className={classes.root}>
                    <div>

                      <TextField      
                        required                  
                        variant="standard"
                        id="standard-basic"
                        autoComplete='off'
                        label="Nome grupo refeição"
                        sx={{ width: '180px', padding: '15px 0px 0px 0px', display: 'flex' }}
                        value={nomeGrupoRefeicaoPage}
                        {...register("nomeGrupoRefeicao", {
                          required: true,
                        })}
                        onChange={(e) => {
                          setNomeGrupoRefeicaoPage(e.target.value);
                        }}
                      />

                    </div>
                    <div>
                      <TextField                        
                        variant="standard"
                        id="standard-basic"
                        autoComplete='off'
                        sx={{ width: '180px', padding: '15px 0px 0px 0px', display: 'flex' }}
                        label="Observação"                     
                        value={observacaoPage}                    
                        onChange={(e) => {
                          setObservacaoPage(e.target.value);
                        }}
                      />

                    </div>
                  
                  </div>
                </Box>
                <div className={classes.root}>

                  <DescricaoAlimento  descricaoAlimentoPage={descricaoAlimentoSelectRow}  setDescricaoAlimentoPage={setDescricaoAlimentoPage} setIdAlimentoPage={setIdAlimentoPage} showMessage={showMessage} />
                  
                  <TextField
                    
                    variant="standard"
                    id="standard-basic"
                    autoComplete='off'                 
                    sx={{ width: '180px', padding: '15px 0px 0px 0px', display: 'flex' }}
                    label="Qtde. preparada item"
                    value={qtdePesoPreparoRefeicaoPage}                 
                    onChange={(e) => {
                  
                      setQtdePesoPreparoRefeicaoPage( convertCommaToDot(e.target.value))
                    }}
                  />
                  {errors?.qtdePesoPreparoRefeicao && <p>{errors.qtdePesoPreparoRefeicao.message}</p>}
                </div>
                <Typography variant="h5" sx={{
                  background: "white",
                }}  >
                  Peso Total:
                </Typography>
                <Typography variant="h4" sx={{
                  background: "white",
                  padding:"10px"
                }}>
                  {pesoTotalPage}
                </Typography>
              </Stack>              
              <DialogActions >      
              <Button size="medium" variant="contained" onClick={handleAddItem}
                endIcon={<AddIcon />}                
              >  
                Add Item
              </Button>
              <Button size="medium" variant="contained"  onClick={handleListItem}
                endIcon={<ListIcon />}                
              >                
                Listar Itens
              </Button>
              </DialogActions>
             
            </Box>
            <div className={classes.root}>
              <DialogActions >
                <Button size="medium" variant="contained"
                  onClick={handleClose} endIcon={<CancelIcon />}>
                  Cancel
                </Button>
                <Button type="submit" size="medium" variant="contained"
                  endIcon={<AddIcon />}>
                  Add Grupo
                </Button>
              </DialogActions>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Stack className={classes.root} direction="row" spacing={2}>
        <Button size="large" variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen}>
          Add Items
        </Button>
      </Stack>  
      <DetailItemMeal itemGrupoRefeicao={itemGrupoRefeicao} showMessage={showMessage} open2={openList} setOpen2={setOpenList} idGrupoRefeicao={idGrupoRefeicaoPage} />      
    </div>
    
  );
};
export default AddGrupoRefeicao;

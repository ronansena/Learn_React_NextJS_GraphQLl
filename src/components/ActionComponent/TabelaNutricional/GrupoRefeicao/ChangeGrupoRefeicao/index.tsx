import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { useMutation, } from "@apollo/client";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { IconButton } from '@mui/material';
import { UPDATE_CONSUMO_DIARIO } from "../../../../../queries/Profile/ConsumoDiario";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DescricaoAlimento from "../../../../GetDataComponent/DescricaoAlimento";
import {TimeZoneCustom,SlideTransition } from "../../../../../utils/CustomLib";
import { useStyles } from '../../../../../../styles/useStyles'

type FormValues = {
  __typename: string;
  idConsumoNutricionalDiario: number;
  descricaoAlimento: string;
  
  qtdePesoConsumidaExec: number;
  dtConsumoExec: string;
};

interface RowsData {

  __typename: string;
  idConsumoNutricionalDiario: number;
  idAlimento: number;
  descricaoAlimento: string;
  
  qtdePesoConsumidaExec: number;
  dtConsumoExec: string;

}

const ChangeGrupoRefeicao = ({
  tabelaNutricionalData,
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  idSelectRow,  
  qtdePesoConsumidaExecSelectRow,
  dtConsumoExecSelectRow,
  idAlimentoSelectRow,
  descricaoAlimentoSelectRow,
  pesoTotalGrupoRefeicaoSelectRow,
  observacaoSelectRow,
  nomeGrupoRefeicaoAlimentoSelectRow,
}: { tabelaNutricionalData: any, showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, idSelectRow: number, descricaoAlimentoSelectRow: string, qtdePesoConsumidaExecSelectRow: string, dtConsumoExecSelectRow: string, idAlimentoSelectRow: number ,pesoTotalGrupoRefeicaoSelectRow:number, observacaoSelectRow:string, nomeGrupoRefeicaoAlimentoSelectRow:string,  }
) => {

  //console.log(idSelectRow);
  // console.log(descricaoAlimentoSelectRow);
    //console.log(idAlimentoSelectRow);


  //const [open3, setOpen3] = React.useState(false)
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [idConsumoNutricionalDiarioPage, setIdConsumoNutricionalDiarioPage] = useState(0);
  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState("");
  const [qtdePesoConsumidaExecPage, setQtdePesoConsumidaExecPage] = useState("");
  const [updateConsumoDiarioPage] = useMutation(UPDATE_CONSUMO_DIARIO);
  const [idAlimentoPage, setIdAlimentoPage] = useState(idAlimentoSelectRow);  
  const [dtConsumoExecPage, setDtConsumoExecPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());

  const atualizaPage = () => {

    //console.log(descricaoAlimentoPage + "------" + fatorConversaoPage  + "------" + parseInt(idConsumoNutricionalDiarioPage) ),
    // console.log(descricaoAlimentoPage + "------" + fatorConversaoPage  + "------" + parseInt(idConsumoNutricionalDiarioPage) )

    if (descricaoAlimentoPage != "" && qtdePesoConsumidaExecPage !== "" && idConsumoNutricionalDiarioPage !== 0) {
      
      //ATENÇÃO: falta incluir idmetadiaria e idprofile
      let hash: RowsData = Object.create(null);
      hash["__typename"] = "ConsumoDiario";
      hash["idConsumoNutricionalDiario"] = idConsumoNutricionalDiarioPage;
      hash["descricaoAlimento"] = descricaoAlimentoPage;
      hash["idAlimento"] = idAlimentoPage;
      
      hash["qtdePesoConsumidaExec"] = parseFloat(qtdePesoConsumidaExecPage);
      hash["dtConsumoExec"] = dtConsumoExecPage;
      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      

      //setDescricaoAlimentoPage("")
      // setQtdePesoConsumidaExecPage("")
      //console.log("rowsDataTemp");
      //console.log(rowsDataTemp)

      //eliminar o registro antigo que foi atualizado antes de inserir os novos valores  

      if (Array.isArray(rowsDataTemp)) {

        var filteredRowsDataTemp = rowsDataTemp.filter(unidadeMedida => unidadeMedida.idConsumoNutricionalDiario !== idConsumoNutricionalDiarioPage);

        //retira quaisquer registro com idConsumoNutricionalDiario = 0
        filteredRowsDataTemp = filteredRowsDataTemp.filter(function (el: RowsData) { return el.idConsumoNutricionalDiario !== 0 });

        //console.log("filteredRowsDataTemp");
        //console.log(filteredRowsDataTemp)


        //console.log("hash");
        //console.log(hash)

        const arr3 = Array.isArray(filteredRowsDataTemp) ? filteredRowsDataTemp.concat(hash) : [];
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
            return a.dtConsumoExec < b.dtConsumoExec ? -1 : a.dtConsumoExec > b.dtConsumoExec ? 1 : 0;
          });

          setRowsDataTemp(unique);
          //  console.log("unique");
          // console.log(unique);

        }
      }
    }
    handleClose()
  }

  useEffect(() => {

    setIdConsumoNutricionalDiarioPage(idSelectRow);
    setDescricaoAlimentoPage(descricaoAlimentoSelectRow);
    setDtConsumoExecPage(dtConsumoExecSelectRow);
    setQtdePesoConsumidaExecPage(qtdePesoConsumidaExecSelectRow);
    setIdAlimentoPage(idAlimentoSelectRow);
    
    
  }, [open2,descricaoAlimentoSelectRow, dtConsumoExecSelectRow, idAlimentoSelectRow, idSelectRow,qtdePesoConsumidaExecSelectRow]);

  // console.log("state variables");
  //  console.log(idConsumoNutricionalDiarioPage);
  // console.log(descricaoAlimentoPage);
  // console.log(qtdePesoConsumidaExecPage);
  //console.log(idAlimentoPage);



  /*
  const resolver: Resolver<FormValues> = async (values) => {
    return {
      values: !values.descricaoAlimento ? {} : values,
      errors: !values.descricaoAlimento
        ? {
          descricaoAlimento: {
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
    //} = useForm<FormValues>({ resolver: resolver, mode: 'onChange' });
  } = useForm<FormValues>({ mode: 'onChange' });

  const onSubmit = () => { 

    if (descricaoAlimentoPage != "" && idConsumoNutricionalDiarioPage !== 0) {

      updateConsumoDiarioPage({
        variables: {
          idConsumoNutricionalDiario: idConsumoNutricionalDiarioPage,
          idAlimento: idAlimentoPage,
          idMetaDiaria: 1,
          idProfileUser: 1,          
          qtdePesoConsumidaExec: parseFloat(qtdePesoConsumidaExecPage),
          dtConsumoExec: TimeZoneCustom(dtConsumoExecPage)
        },
      }).then(function (response) {
        if (response.data.updateConsumoDiario === true) {

          showMessage("Registro alterado com sucesso!", SlideTransition);
          atualizaPage();

        }
      }).catch((e) => {

        handleClose()
        showMessage("Falha ao tentar alterar! Mensagem do servidor: " + e, SlideTransition);

      });
    }

  };

  const handleClickOpen = () => {

    setOpen2(true);

  };

  const handleClose = () => {

    setOpen2(false);

  };

  function onSelectHandle(value: any) {
    //console.log("onSelectHandle")
    //console.log(value.idAlimento)

    setIdAlimentoPage(value.idAlimento)
    setDescricaoAlimentoPage(value.descricaoAlimento)

  }

  function onChangeHandle(value: any) {

    //console.log("onChangeHandle")
    //console.log(value)

  }


  function convertDateTime(date: any) {

    //console.log("convertDateTime")
    //console.log(date)
    let newDate = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];

    return newDate;
  }


  function convertUTCDateToLocalDate(date: any) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset());
    return newDate;
  }



  const handleChange = (newValue: any | null) => {

    setDtConsumoExecPage(convertDateTime(newValue));
    //setDtConsumoExecPage(convertUTCDateToLocalDate(newValue));

  };

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
            Alteração
          </DialogTitle>
        </div>
        <DialogContent >
          <div className={classes.root}>
            <DialogContentText>Informe os campos:</DialogContentText>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)} id="formlogin">

            <div className={classes.root}>
              
            <DescricaoAlimento descricaoAlimentoPage={descricaoAlimentoSelectRow} setIdAlimentoPage={setIdAlimentoPage} showMessage={showMessage} setDescricaoAlimentoPage={setDescricaoAlimentoPage}/>

              <TextField
                required
                variant="standard"
                id="standard-basic"
                //className="input"
                //type="text"
                //placeholder="fator conversão"
                // name="qtdePesoConsumidaExecPage"
                label="Quantidade Consumida"
                //label="Informe o fator de conversão:"
                value={qtdePesoConsumidaExecPage}
                {...register("qtdePesoConsumidaExec", {
                  required: true,
                })}

                onChange={(e) => {
                  //const re = /^[0-9\b]+$/;                
                  const re = new RegExp('^[+]?([0-9]{0,})*[.]?([0-9]{0,4})?$', 'g');
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setQtdePesoConsumidaExecPage(e.target.value);
                  }
                }}
              />
              {errors?.qtdePesoConsumidaExec && <p>{errors.qtdePesoConsumidaExec.message}</p>}
           
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker 
                      showTodayButton
                      placeholder='dd/MM/yyyy HH:mm'
                      format='dd/MM/yyyy HH:mm'
                      label="Data e Hora"
                      value={dtConsumoExecPage}
                      onChange={handleChange}
                      ampm={false}
                    />
                  </MuiPickersUtilsProvider>
            </div>
            <div className={classes.root}>
              <DialogActions >
                <Button size="medium" variant="contained"
                  onClick={handleClose} endIcon={<CancelIcon />}>
                  Cancel
                </Button>
                <Button type="submit" size="medium" variant="contained"
                  endIcon={<AddIcon />}>
                  Alterar
                </Button>
              </DialogActions>
            </div>
          </form>
        </DialogContent>

      </Dialog>

      <IconButton >
        <ChangeCircleIcon sx={[
          { fontSize: 40, },
          (theme) => ({
            [theme.breakpoints.down('sm')]: {

              fontSize: 20,
            }
          }
          ),
        ]} color="warning" onClick={handleClickOpen} />
      </IconButton>
    </div>


  );
};

export default ChangeGrupoRefeicao;

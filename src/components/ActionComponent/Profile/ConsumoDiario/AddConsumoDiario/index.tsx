import React, { useEffect, useRef, useState } from "react";
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
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import LuxonUtils from '@date-io/luxon';
import {
  ADD_CONSUMO_DIARIO,
  GET_LAST_CONSUMO_DIARIO,
} from "../../../../../queries/Profile/ConsumoDiario";
//import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DescricaoAlimento from '../../../../GetDataComponent/DescricaoAlimento';
import NomeGrupoRefeicao from "../../../../GetDataComponent/NomeGrupoRefeicao";
import { TimeZoneCustom, convertCommaToDot, convertFixNumber,convertUTCDateToLocalDate,convertDateTime, SlideTransition, onBlurField } from "../../../../../utils/CustomLib";
import { GET_ITENS_REFEICAO_CONSUMO_DIARIO } from "../../../../../queries/Profile/ConsumoDiario";
import { UPDATE_ONLY_PESO_CONSUMIDO_GR, GET_ITEM_REFEICAO_BY_ID } from "../../../../../queries/TabelaNutricional/GrupoRefeicao/";
import { useStyles } from '../../../../../../styles/useStyles';


type FormValues = {
  idConsumoNutricionalDiario: number;
  qtdePesoConsumidaExec: number;
  descricaoAlimento: string;
  idAlimento: number;
};
interface RowsData {

  __typename: string;
  idConsumoNutricionalDiario: number;
  idAlimento: number;
  qtdePesoConsumidaExec: number;
  descricaoAlimento: string;
  dtConsumoExec: string;

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

const AddConsumoDiario = ({
  tabelaNutricionalData,
  descricaoAlimentoSelectRow,
  showMessage,
  setRowsDataTemp,
  rowsDataTemp,
  setCheckboxSelection,
  checkboxSelection
}: { descricaoAlimentoSelectRow: any, tabelaNutricionalData: any, showMessage: any, setRowsDataTemp: any, rowsDataTemp: any, setCheckboxSelection: any, checkboxSelection: any }
) => {



  const [descricaoAlimentoPage, setDescricaoAlimentoPage] = useState("");
  const classes = useStyles();
  const [open2, setOpen2] = React.useState(false);
  const [openPratoExecutado, setOpenPratoExecutado] = React.useState(false);
  const [idAlimentoPage, setIdAlimentoPage] = useState(0);
  const [idGrupoRefeicaoPage, setIdGrupoRefeicaoPage] = useState(0);
  const [pesoTotalConsumidoGrupoRefeicaoTemp, setPesoTotalConsumidoGrupoRefeicaoTemp] = useState(0);
  const [limit, setLimit] = useState(0);
  const [itemGrupoRefeicao, setItemGrupoRefeicao] = useState<ItemGrupoAlimentoObjData[] | []>([]);
  const [qtdePesoConsumidaExecPage, setQtdePesoConsumidaExecPage] = useState("");
  const [dtConsumoExecPage, setDtConsumoExecPage] = useState(convertUTCDateToLocalDate(new Date).toISOString());
  //const [dtConsumoExecPage, setDtConsumoExecPage] = useState(new Date);
  const [createConsumoDiarioPage] = useMutation(ADD_CONSUMO_DIARIO);
  const [updateOnlyPesoConsumidoGRPage] = useMutation(UPDATE_ONLY_PESO_CONSUMIDO_GR);
  const [checkedConsideraPesoProporcional, setCheckedConsideraPesoProporcional] = React.useState(true);
  const [consideraPesoProporcionalGrupoRefeicao, setConsideraPesoProporcionalGrupoRefeicao] = React.useState(false);
  const buttonRef = useRef<any>();
  let conuntTemp3: number = 0;
  let limitTemp = 0;

  const [atualizaPage] = useLazyQuery(GET_LAST_CONSUMO_DIARIO, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {

      //console.log(data.getLastUnidadeMedida[0].idUnidadeMedida)
      //console.log(dtConsumoExecPage + "------" + qtdePesoConsumidaExecPage)
      let hash: RowsData = Object.create(null);
      hash["__typename"] = "ConsumoDiario";
      hash["idConsumoNutricionalDiario"] = parseInt(
        data.getLastConsumoDiario[0].idConsumoNutricionalDiario
      );
      hash["idAlimento"] = idAlimentoPage;
      hash["descricaoAlimento"] = data.getLastConsumoDiario[0].descricaoAlimento;
      hash["qtdePesoConsumidaExec"] = data.getLastConsumoDiario[0].qtdePesoConsumidaExec;
      hash["dtConsumoExec"] = dtConsumoExecPage;

      //console.log(hash)
      //console.log(rowsDataTemp.concat(hash));      
      setCheckboxSelection(checkboxSelection);
      //setIdAlimentoPage(0)
      setQtdePesoConsumidaExecPage("")
      //setDtConsumoExecPage(convertUTCDateToLocalDate(new Date).toISOString())
      setDescricaoAlimentoPage("")
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
          return a.dtConsumoExec < b.dtConsumoExec ? -1 : a.dtConsumoExec > b.dtConsumoExec ? 1 : 0;
        }).reverse();
        //console.log("unique aqui reverse vai");
        // console.log(unique);


        conuntTemp3++
        if (conuntTemp3 === 1) {

          setRowsDataTemp(unique);
          //     console.log("unique");
          //     console.log(unique);
        }

      }

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    },
  });
  //////////////////
  const variables = {

    limit: limit,
  }

  let arr3: any = [];



  const [atualizaPageItensRefeicao] = useLazyQuery(GET_ITENS_REFEICAO_CONSUMO_DIARIO, {
    variables,
    fetchPolicy: "network-only",
    onCompleted: (data) => {

      console.log("Entrou AtualizaPageItensRefeicao no onCompleted  limit")
      console.log(limit)
      console.log("data ==> atualizaPageItensRefeicao")
      console.log(data)
      data.getItemRefeicaoConsumoDiarioByID.map((dataItemRefeicao: any) => {


        console.log("map atualizaPageItensRefeicao acionado" + dataItemRefeicao)

        //console.log(dtConsumoExecPage + "------" + qtdePesoConsumidaExecPage)
        let hash: RowsData = Object.create(null);
        hash["__typename"] = "ConsumoDiario";
        hash["idConsumoNutricionalDiario"] = parseInt(
          dataItemRefeicao.idConsumoNutricionalDiario
        );
        hash["idAlimento"] = dataItemRefeicao.idAlimento;
        hash["descricaoAlimento"] = dataItemRefeicao.descricaoAlimento;
        hash["qtdePesoConsumidaExec"] = dataItemRefeicao.qtdePesoConsumidaExec;
        hash["dtConsumoExec"] = dataItemRefeicao.dtConsumoExec;

        //console.log(hash)
        //console.log(rowsDataTemp.concat(hash));      
        console.log("rowsDataTemp");
        console.log(rowsDataTemp)
        //  console.log("hash");
        //  console.log(hash)

        arr3 = arr3.concat(hash);
        console.log("arr3dentro");
        console.log(arr3)
      })

      arr3 = Array.isArray(rowsDataTemp) && rowsDataTemp != [] ? rowsDataTemp.concat(arr3) : [];

      console.log("arr3fora");
      console.log(arr3);
      const uniqueIds: any = [];

      if (arr3 != undefined) {

        const unique = arr3.filter((element: { idConsumoNutricionalDiario: number; }) => {
          const isDuplicate = uniqueIds.includes(element.idConsumoNutricionalDiario);

          if (!isDuplicate) {

            uniqueIds.push(element);
            //console.log("isDuplicate" + true);
            return true;
          }
        });

        //ordenar o array pelo campo escolhido(nomeUnidademedida) antes de atualizar a tela
        unique.sort(function (a: RowsData, b: RowsData) {
          return a.dtConsumoExec < b.dtConsumoExec ? -1 : a.dtConsumoExec > b.dtConsumoExec ? 1 : 0;
        });


        conuntTemp3++
        if (conuntTemp3 === 1) {

          setRowsDataTemp(unique.reverse());
          console.log("unique conuntTemp3");
          console.log(unique);
        }

      }
      // limpar variáveis 

      setQtdePesoConsumidaExecPage("")
      setLimit(0)
    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    },

  });

  const handleClickOpen = () => {

    setDtConsumoExecPage(convertUTCDateToLocalDate(new Date).toISOString())
    setOpen2(true);
    //  console.log("estoy handleClickOpen => " + open)


  };

  const handleClose = () => {


    setOpen2(false);
    setChecked(false);
    setOpenPratoExecutado(false);
    setItemGrupoRefeicao([])
    setCheckboxSelection(checkboxSelection);
    setIdAlimentoPage(0)
    setQtdePesoConsumidaExecPage("")
    setDtConsumoExecPage(convertUTCDateToLocalDate(new Date).toISOString())
    setDescricaoAlimentoPage("")
    //setLimit(0)

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


  const [getItemRefeicaoByID, { data, loading, error }] = useLazyQuery(GET_ITEM_REFEICAO_BY_ID, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      console.log("AQUIAQUIAQUIdata.getItemRefeicaoByID[0].pesoTotalConsumidoGrupoRefeicao")
      console.log(data)

    },
    onError: (error) => {
      showMessage(error.message, SlideTransition);
    },

  });



  useEffect(() => {
    const shouldSearch = idGrupoRefeicaoPage !== 0;

    if (shouldSearch) {
      getItemRefeicaoByID({
        variables: {
          idGrupoRefeicao: idGrupoRefeicaoPage,
        }
      });
    }
  }, [idGrupoRefeicaoPage,getItemRefeicaoByID]);


  const onSubmit = async () => {
    //e.preventDefault();
    console.log("idGrupoRefeicaoPage vai chamar getItemRefeicaoByID inicio submit")
    console.log(idGrupoRefeicaoPage)
    console.log(data)

    let pesoTotalConsumidoGrupoRefeicaoSoma = 0
    if (openPratoExecutado === false) {

      if (idAlimentoPage != 0 && qtdePesoConsumidaExecPage !== "") {
        createConsumoDiarioPage({
          variables: {
            idAlimento: idAlimentoPage,
            idMetaDiaria: 1,
            idProfileUser: 1,            
            qtdePesoConsumidaExec: convertFixNumber(qtdePesoConsumidaExecPage),
            dtConsumoExec: TimeZoneCustom(dtConsumoExecPage)
          }, fetchPolicy: "network-only",
        }).then(function (response) {

          if (response.data.createConsumoDiario === true) {

            atualizaPage();

            showMessage("Registro cadastrado com sucesso!", SlideTransition);

          }
        }).catch((e) => {

          handleClose()
          showMessage("Falha ao tentar registrar! Mensagem do servidor: " + e, SlideTransition);

        });
      }
    } else {
      // implementar submit PratoExecutado True aqui
      // retorn dialog box to defaul state which are:
      //setOpen2(false);
      setChecked(false);
      setOpenPratoExecutado(false);

      //console.log("dtConsumoExec:" + TimeZoneCustom(dtConsumoExecPage));
      console.log("Entrou opção prato executado igual a Sim (true) idGrupoRefeicaoPage no submit addconsumo:");
      console.log(itemGrupoRefeicao)

      let qtdeConsumidaPratoExecutado = qtdePesoConsumidaExecPage === "" ? 0 : Number(qtdePesoConsumidaExecPage);
      let pesoTotalConsumidoGrupoRefeicaoTemp = Number(itemGrupoRefeicao[0].pesoTotalConsumidoGrupoRefeicao);
      let pesoTotalGrupoRefeicaoTemp = Number(itemGrupoRefeicao[0].pesoTotalGrupoRefeicao)
      let pesoParcialConsumidoPratoExecutado = Number(qtdeConsumidaPratoExecutado) + pesoTotalConsumidoGrupoRefeicaoTemp
      if (pesoParcialConsumidoPratoExecutado > pesoTotalGrupoRefeicaoTemp) {

        if (confirm('Peso consumido maior que o peso total cadastrado para o prazo executado! Deseja zerar o peso consumido, e iniciar um novo ciclo?\nPeso Padrão Total Grupo Refeição: '+pesoTotalGrupoRefeicaoTemp+'\nPeso parcial já consumido até o momento: '+pesoTotalConsumidoGrupoRefeicaoTemp+'\nPeso informado nesse lançamento: '+Number(qtdeConsumidaPratoExecutado)+'\nFalta lançar apenas: '+(pesoTotalGrupoRefeicaoTemp-pesoTotalConsumidoGrupoRefeicaoTemp)+'\nATENÇÃO: Caso falte lançar quantidade para esse prato, não inicie um novo ciclo. Cancele e refaça a operação informando apenas a quantidade faltante de '+(pesoTotalGrupoRefeicaoTemp-pesoTotalConsumidoGrupoRefeicaoTemp))){
          //console.log("entrou na try")
          if (qtdeConsumidaPratoExecutado > pesoTotalGrupoRefeicaoTemp) {

            qtdeConsumidaPratoExecutado = pesoTotalGrupoRefeicaoTemp;
            console.log("qtdeConsumidaPratoExecutado")
            console.log(qtdeConsumidaPratoExecutado)

          }

          try {

            await Promise.all(itemGrupoRefeicao.map((itemRefeicao) => {
              console.log("Entrou na promisse itemGrupoRefeicao")

              //FALTA IMPLEMENTAR APENAS PARA VALIDAS SE O VALOR DO CAMPO
              //pesoTotalConsumidoGrupoRefeicao FOR MAIOR QUE pesoTotalGrupoRefeicao 
              // NÃO SERÁ FEITO MAIS LANÇAMENTO DE CONSUMO DIÁRIO PARA O PRATO EXECUTADO
              // EM QUESTÃO ATÉ QUE O USUÁRIO DESEJE ZERAR NOVAMENTE O pesoTotalConsumidoGrupoRefeicao
              // OU SEJA, FALTA TRATAR AS VALIDAÇÕES, E A MENSAGEM PEGUNTANDO SE DESEJA ZERAR E VOLTAR A LANÇAR

              let pesoItemPratoExecutado = itemRefeicao.qtdePesoPreparoRefeicao

              let pesoTotalPratoExecutado = itemRefeicao.pesoTotalGrupoRefeicao

              let percentualItemSobrePesoTotal = ((Number(pesoItemPratoExecutado) / Number(pesoTotalPratoExecutado)) * 100);

              let qtFinalApuradaItemConsumidoPratoExecutado = (Number(qtdeConsumidaPratoExecutado) / 100) * percentualItemSobrePesoTotal

              let variables = {}
              console.log("consideraPesoProporcionalGrupoRefeicao")
              console.log(consideraPesoProporcionalGrupoRefeicao)

              if (consideraPesoProporcionalGrupoRefeicao === true) {

                variables =
                {

                  idAlimento: itemRefeicao.idAlimento,
                  idMetaDiaria: 1,
                  idProfileUser: 1,                  
                  qtdePesoConsumidaExec: qtFinalApuradaItemConsumidoPratoExecutado,
                  dtConsumoExec: TimeZoneCustom(dtConsumoExecPage)

                }
                pesoTotalConsumidoGrupoRefeicaoSoma = pesoTotalConsumidoGrupoRefeicaoSoma + qtFinalApuradaItemConsumidoPratoExecutado;

              } else {

                variables =
                {
                  idAlimento: itemRefeicao.idAlimento,
                  idMetaDiaria: 1,
                  idProfileUser: 1,                  
                  qtdePesoConsumidaExec: itemRefeicao.qtdePesoPreparoRefeicao,
                  dtConsumoExec: TimeZoneCustom(dtConsumoExecPage)

                }

                pesoTotalConsumidoGrupoRefeicaoSoma = pesoTotalConsumidoGrupoRefeicaoSoma + Number(itemRefeicao.qtdePesoPreparoRefeicao);

              }

              return createConsumoDiarioPage({
                variables: variables,
                fetchPolicy: "network-only",
              }).then(function (response) {

                if (response.data.createConsumoDiario === true) {

                  console.log("Registro cadastrado com sucesso! --> idAlimento" + itemRefeicao.idAlimento);
                  console.log(" Dentro do callback  createConsumoDiarioPage prestes a chamar atualizapagetem")
                  console.log(response)

                }
              }).catch((e) => {

                console.log("Falha ao tentar registrar! Mensagem do servidor: " + e);

              });

            }))



            console.log("AQUI data ==> pesoTotalConsumidoGrupoRefeicaoSoma E pesoTotalConsumidoGrupoRefeicaoSoma")
            console.log(data.getItemRefeicaoByID[0])
            console.log(data.getItemRefeicaoByID[0].pesoTotalConsumidoGrupoRefeicao)
            console.log(pesoTotalConsumidoGrupoRefeicaoSoma)

            //pesoTotalConsumidoGrupoRefeicaoSoma = Number(data.getItemRefeicaoByID[0].pesoTotalConsumidoGrupoRefeicao) + pesoTotalConsumidoGrupoRefeicaoSoma            

            setPesoTotalConsumidoGrupoRefeicaoTemp(pesoTotalConsumidoGrupoRefeicaoSoma);
            console.log("pesoTotalConsumidoGrupoRefeicaoSoma Fim Promisse")
            console.log(pesoTotalConsumidoGrupoRefeicaoSoma)

            if (itemGrupoRefeicao.length > 0) {

              console.log("setLimit itemGrupoRefeicao")
              limitTemp = itemGrupoRefeicao.length;
              console.log(" antes da promisse")
              console.log(limit)
              setLimit(limitTemp)

            }


          } catch (error) {

            showMessage("Falha ao tentar registrar! Mensagem do servidor: " + error, SlideTransition);
            console.log("Falha ao tentar registrar! Mensagem do servidor: ");
            console.log(error);

          }

        } else {
          // Do nothing!
          console.log('não.');
        }
      } else { // valor lançado consumido menor que o peso total do prato executado 

        try {

          await Promise.all(itemGrupoRefeicao.map((itemRefeicao) => {
            console.log("Entrou na promisse itemGrupoRefeicao")

            //FALTA IMPLEMENTAR APENAS PARA VALIDAS SE O VALOR DO CAMPO
            //pesoTotalConsumidoGrupoRefeicao FOR MAIOR QUE pesoTotalGrupoRefeicao 
            // NÃO SERÁ FEITO MAIS LANÇAMENTO DE CONSUMO DIÁRIO PARA O PRATO EXECUTADO
            // EM QUESTÃO ATÉ QUE O USUÁRIO DESEJE ZERAR NOVAMENTE O pesoTotalConsumidoGrupoRefeicao
            // OU SEJA, FALTA TRATAR AS VALIDAÇÕES, E A MENSAGEM PEGUNTANDO SE DESEJA ZERAR E VOLTAR A LANÇAR


            let pesoItemPratoExecutado = itemRefeicao.qtdePesoPreparoRefeicao

            let pesoTotalPratoExecutado = itemRefeicao.pesoTotalGrupoRefeicao

            let percentualItemSobrePesoTotal = ((Number(pesoItemPratoExecutado) / Number(pesoTotalPratoExecutado)) * 100);

            let qtFinalApuradaItemConsumidoPratoExecutado = (Number(qtdeConsumidaPratoExecutado) / 100) * percentualItemSobrePesoTotal

            let variables = {}
            console.log("consideraPesoProporcionalGrupoRefeicao")
            console.log(consideraPesoProporcionalGrupoRefeicao)

            if (consideraPesoProporcionalGrupoRefeicao === true) {

              variables =
              {

                idAlimento: itemRefeicao.idAlimento,
                idMetaDiaria: 1,
                idProfileUser: 1,                
                qtdePesoConsumidaExec: qtFinalApuradaItemConsumidoPratoExecutado,
                dtConsumoExec: TimeZoneCustom(dtConsumoExecPage)

              }
              pesoTotalConsumidoGrupoRefeicaoSoma = pesoTotalConsumidoGrupoRefeicaoSoma + qtFinalApuradaItemConsumidoPratoExecutado;

            } else {

              variables =
              {
                idAlimento: itemRefeicao.idAlimento,
                idMetaDiaria: 1,
                idProfileUser: 1,                
                qtdePesoConsumidaExec: itemRefeicao.qtdePesoPreparoRefeicao,
                dtConsumoExec: TimeZoneCustom(dtConsumoExecPage)

              }

              pesoTotalConsumidoGrupoRefeicaoSoma = pesoTotalConsumidoGrupoRefeicaoSoma + Number(itemRefeicao.qtdePesoPreparoRefeicao);

            }

            return createConsumoDiarioPage({
              variables: variables,
              fetchPolicy: "network-only",
            }).then(function (response) {

              if (response.data.createConsumoDiario === true) {

                console.log("Registro cadastrado com sucesso! --> idAlimento" + itemRefeicao.idAlimento);
                console.log(" Dentro do callback  createConsumoDiarioPage prestes a chamar atualizapagetem")
                console.log(response)

              }
            }).catch((e) => {

              console.log("Falha ao tentar registrar! Mensagem do servidor: " + e);

            });




          }))



          console.log("AQUI data ==> pesoTotalConsumidoGrupoRefeicaoSoma E pesoTotalConsumidoGrupoRefeicaoSoma")
          console.log(data.getItemRefeicaoByID[0])
          console.log(data.getItemRefeicaoByID[0].pesoTotalConsumidoGrupoRefeicao)
          console.log(pesoTotalConsumidoGrupoRefeicaoSoma)
          pesoTotalConsumidoGrupoRefeicaoSoma = Number(data.getItemRefeicaoByID[0].pesoTotalConsumidoGrupoRefeicao) + pesoTotalConsumidoGrupoRefeicaoSoma

          setPesoTotalConsumidoGrupoRefeicaoTemp(pesoTotalConsumidoGrupoRefeicaoSoma);
          console.log("pesoTotalConsumidoGrupoRefeicaoSoma Fim Promisse")
          console.log(pesoTotalConsumidoGrupoRefeicaoSoma)

          if (itemGrupoRefeicao.length > 0) {

            console.log("setLimit itemGrupoRefeicao")
            limitTemp = itemGrupoRefeicao.length;
            console.log(" antes da promisse")
            console.log(limit)
            setLimit(limitTemp)

          }


        } catch (error) {

          showMessage("Falha ao tentar registrar! Mensagem do servidor: " + error, SlideTransition);
          console.log("Falha ao tentar registrar! Mensagem do servidor: ");
          console.log(error);

        }

      }


    };



    // setLimit(0)
  }

  useEffect(() => {
    console.log("limit depois da promisse dentro do useEffect")
    console.log(limit)
    if (limit > 0) {

      console.log("pesoTotalConsumidoGrupoRefeicaoTemp depois da promisse dentro do useEffect")
      console.log(pesoTotalConsumidoGrupoRefeicaoTemp)
      setItemGrupoRefeicao([])
      atualizaPageItensRefeicao()
      
      if (consideraPesoProporcionalGrupoRefeicao === true) {
        updateOnlyPesoConsumidoGRPage({
          variables: {
            idGrupoRefeicao: idGrupoRefeicaoPage,
            pesoTotalConsumidoGrupoRefeicao: pesoTotalConsumidoGrupoRefeicaoTemp
          },
          fetchPolicy: "network-only",
        }).then(function (response) {

          console.log("pesoTotalConsumidoGrupoRefeicao atualizada")
          console.log(response)

        }).catch((e) => {

          console.log("Falha ao tentar registrar! Mensagem do servidor: " + e);

        });
      }
    }
  }, [limit,atualizaPageItensRefeicao,pesoTotalConsumidoGrupoRefeicaoTemp,updateOnlyPesoConsumidoGRPage,consideraPesoProporcionalGrupoRefeicao,idGrupoRefeicaoPage]);

  const handleChange = (newValue: any | null) => {
    // console.log("newValue")
    //  console.log(newValue)

    setDtConsumoExecPage(convertDateTime(newValue));
    //setDtConsumoExecPage(convertUTCDateToLocalDate(newValue));

  };

  const [checked, setChecked] = React.useState(true);


  const handlePratoExecutado = async (event: React.ChangeEvent<HTMLInputElement>) => {

    //React setState does not immediately update the state
    setChecked(event.target.checked);
    setConsideraPesoProporcionalGrupoRefeicao(false);
    setQtdePesoConsumidaExecPage("");
    //then we do this to solve this situation:
    setChecked((state) => {

      console.log(state); // "React is awesome!"

      if (state === true) {

        setOpenPratoExecutado(true);

      } else {

        setOpenPratoExecutado(false);

      }

      return state;
    });

  };



  const handleRecorrente = async (event: React.ChangeEvent<HTMLInputElement>) => {

    //React setState does not immediately update the state
    setCheckedConsideraPesoProporcional(event.target.checked);

    //then we do this to solve this situation:
    setCheckedConsideraPesoProporcional((state) => {

      console.log(state); // "React is awesome!"

      if (state === true) {

        setConsideraPesoProporcionalGrupoRefeicao(true);

      } else {

        setConsideraPesoProporcionalGrupoRefeicao(false);

      }

      return state;
    });

  };


  return (

    <div className={classes.root}>
      <Dialog
        //disableEscapeKeyDown={false}
        //fullScreen={false}
        onBackdropClick={handleClose}
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
                width: "auto",
                height: "auto",
                border: 1,
                padding: "15px",

              }}
            >
              <div className={classes.root}>
                <Stack spacing={2} >
                  <FormControlLabel
                    sx={{
                      m: 2,
                      margin: "10px 0px 0px 0px"
                    }}
                    label="Informar prato executado"
                    control={
                      <Checkbox
                        sx={{

                          '& .MuiSvgIcon-root': { fontSize: 20 }
                        }}
                        onChange={handlePratoExecutado}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                  />
                  <>
                    {openPratoExecutado === false ? (
                      <>

                        <DescricaoAlimento setIdAlimentoPage={setIdAlimentoPage} showMessage={showMessage} descricaoAlimentoPage={descricaoAlimentoPage} setDescricaoAlimentoPage={setDescricaoAlimentoPage} />

                        <TextField
                          required
                          variant="standard"
                          id="standard-basic"
                          autoComplete='off'
                          inputRef={(input) => {
                            if (input !== null && idAlimentoPage !== 0 && input.value === "") {
                              console.log(input)
                              input.focus();
                            }
                          }}
                          //className="input"
                          //type="text"
                          //placeholder="fator conversão"
                          // name="qtdePesoConsumidaExecPage"
                          label="Quantidade Consumida"
                          //label="Informe o fator de conversão:"                        
                          value={qtdePesoConsumidaExecPage}
                          onBlur={() => onBlurField(buttonRef)}
                          onChange={(e) => {

                            setQtdePesoConsumidaExecPage(convertCommaToDot(e.target.value));

                          }}
                        />


                      </>


                    ) : (
                      <>

                        <NomeGrupoRefeicao buttonRef={buttonRef} classes={classes} consideraPesoProporcionalGrupoRefeicao={consideraPesoProporcionalGrupoRefeicao} setItemGrupoRefeicao={setItemGrupoRefeicao} idGrupoRefeicaoPage={idGrupoRefeicaoPage} setIdGrupoRefeicaoPage={setIdGrupoRefeicaoPage} showMessage={showMessage} qtdePesoConsumidaExecPage={qtdePesoConsumidaExecPage} setQtdePesoConsumidaExecPage={setQtdePesoConsumidaExecPage} />
                        <div>
                          <FormControlLabel
                            sx={{
                              m: 2,
                              margin: "10px 0px 0px 0px"
                            }}
                            label="Considerar peso proporcional"
                            control={
                              <Checkbox
                                sx={{

                                  '& .MuiSvgIcon-root': { fontSize: 20 }
                                }}
                                onChange={handleRecorrente}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                            }
                          />

                        </div>
                      </>
                    )
                    }
                  </>


                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker 
                      showTodayButton
                      //format='fullDateTime'
                      placeholder='dd/MM/yyyy HH:mm'
                      format='dd/MM/yyyy HH:mm'
                      label="Data e Hora"
                      value={dtConsumoExecPage}
                      onChange={handleChange}
                      ampm={false}
                      autoOk={true}
                      variant="dialog"                      
                      fullWidth
                      
                    />
                  </MuiPickersUtilsProvider>



                  <div className={classes.root}>
                    <DialogActions >
                      <Button size="medium" variant="contained"
                        onClick={handleClose} endIcon={<CancelIcon />}>
                        Cancel
                      </Button>
                      <Button
                        ref={buttonRef}
                        type="submit" size="medium" variant="contained"
                        endIcon={<AddIcon />}
                      >

                        Add
                      </Button>
                    </DialogActions>
                  </div>
                </Stack>
              </div>
            </Box>
          </form>

        </DialogContent>

      </Dialog>
      <Stack className={classes.root} direction="row" spacing={2}>
        <Button variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen}>
          Add Items
        </Button>
      </Stack>
    </div>

  );
};

export default AddConsumoDiario;


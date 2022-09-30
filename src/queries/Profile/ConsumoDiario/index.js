import { gql } from "graphql-tag";

export const ADD_CONSUMO_DIARIO = gql`
  mutation createConsumoDiario(
    $idAlimento: Int
    $idMetaDiaria: Int
    $idProfileUser: Int
    $qtdePesoConsumidaExec: Float
    $dtConsumoExec: Date
  ) {
    createConsumoDiario(
      idAlimento: $idAlimento
      idMetaDiaria: $idMetaDiaria
      idProfileUser: $idProfileUser
      qtdePesoConsumidaExec: $qtdePesoConsumidaExec

      dtConsumoExec: $dtConsumoExec
    )
  }
`;

export const DELETE_CONSUMO_DIARIO = gql`
  mutation deleteConsumoDiario($idConsumoNutricionalDiario: [Int]) {
    deleteConsumoDiario(idConsumoNutricionalDiario: $idConsumoNutricionalDiario)
  }
`;

export const UPDATE_CONSUMO_DIARIO = gql`
  mutation updateConsumoDiario(
    $idConsumoNutricionalDiario: Int
    $idAlimento: Int
    $idMetaDiaria: Int
    $idProfileUser: Int
    $qtdePesoConsumidaExec: Float
    $dtConsumoExec: Date
  ) {
    updateConsumoDiario(
      idConsumoNutricionalDiario: $idConsumoNutricionalDiario
      idAlimento: $idAlimento
      idMetaDiaria: $idMetaDiaria
      idProfileUser: $idProfileUser
      qtdePesoConsumidaExec: $qtdePesoConsumidaExec
      dtConsumoExec: $dtConsumoExec
    )
  }
`;

export const GET_CONSUMO_DIARIO = gql`
  query getAllConsumoDiario {
    getAllConsumoDiario {
      idConsumoNutricionalDiario
      idAlimento
      descricaoAlimento
      idMetaDiaria
      idProfileUser
      qtdePesoConsumidaExec
      dtConsumoExec
      energiaKcal
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      calcio
      ferro
      sodio
      idProdutoControlMoney
      pesoEmbalagem
      preco
      dataUltimaCotacaoPreco
    }
  }
`;

export const GET_LAST_CONSUMO_DIARIO = gql`
  query getLastConsumoDiario {
    getLastConsumoDiario {
      idConsumoNutricionalDiario
      idAlimento
      descricaoAlimento
      idMetaDiaria
      idProfileUser
      qtdePesoConsumidaExec
      dtConsumoExec
    }
  }
`;

export const GET_CONSUMO_DIARIO_BY_DATE_INICIAL_FINAL = gql`
  query getConsumoByDateInicialFinal($dtConsumoExecInicial:Date,$dtConsumoExecFinal:Date) {
    getConsumoByDateInicialFinal(dtConsumoExecInicial:$dtConsumoExecInicial,dtConsumoExecFinal:$dtConsumoExecFinal) {
      idConsumoNutricionalDiario
      idAlimento
      descricaoAlimento
      idMetaDiaria
      idProfileUser
      qtdePesoConsumidaExec
      dtConsumoExec
      energiaKcal
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      calcio
      ferro
      sodio
      idProdutoControlMoney
      pesoEmbalagem
      preco
      dataUltimaCotacaoPreco
    }
  }
`;


export const GET_CONSUMO_DIARIO_BY_DATE = gql`
  query getConsumoByDate($dtConsumoExec:Date) {
    getConsumoByDate(dtConsumoExec: $dtConsumoExec) {
      idConsumoNutricionalDiario
      idAlimento
      descricaoAlimento
      idMetaDiaria
      idProfileUser
      qtdePesoConsumidaExec
      dtConsumoExec
      energiaKcal
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      calcio
      ferro
      sodio
      idProdutoControlMoney
      pesoEmbalagem
      preco
      dataUltimaCotacaoPreco
    }
  }
`;

export const GET_ITENS_REFEICAO_CONSUMO_DIARIO = gql`
  query getItemRefeicaoConsumoDiarioByID($limit: Int) {
    getItemRefeicaoConsumoDiarioByID(limit: $limit) {
      idConsumoNutricionalDiario
      idAlimento
      descricaoAlimento
      idMetaDiaria
      idProfileUser
      qtdePesoConsumidaExec
      dtConsumoExec
    }
  }
`;

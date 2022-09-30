import { gql } from "graphql-tag";

export const GET_CONSUMO_BY_DATE_INICIAL_FINAL = gql`
  query getConsumoReportQuant($dtConsumoExecInicial:Date,$dtConsumoExecFinal:Date) {
    getConsumoReportQuant(dtConsumoExecInicial:$dtConsumoExecInicial,dtConsumoExecFinal:$dtConsumoExecFinal) {
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
      quantidadeTotalConsumida
      custoItem
    }
  }
`;


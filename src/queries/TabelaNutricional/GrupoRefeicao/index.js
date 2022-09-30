import { gql } from "graphql-tag";

export const ADD_GRUPO_REFEICAO = gql`
  mutation createGrupoRefeicao(
    $idGrupoRefeicao: Int
    $nomeGrupoRefeicao: String
    $pesoTotalGrupoRefeicao: Float
    $observacao: String    
  ) {
    createGrupoRefeicao(
      idGrupoRefeicao: $idGrupoRefeicao
      nomeGrupoRefeicao: $nomeGrupoRefeicao
      pesoTotalGrupoRefeicao: $pesoTotalGrupoRefeicao
      observacao: $observacao      
    )
  }
`;

export const ADD_ITEM_REFEICAO = gql`
  mutation createItemRefeicao(
    $idAlimento: Int
    $idGrupoRefeicao: Int
    $qtdePesoPreparoRefeicao: Float
    
  ) {
    createItemRefeicao(
      idAlimento: $idAlimento
      idGrupoRefeicao: $idGrupoRefeicao
      qtdePesoPreparoRefeicao: $qtdePesoPreparoRefeicao
      
    )
  }
`;

export const DELETE_GRUPO_REFEICAO = gql`
  mutation deleteGrupoRefeicao($idGrupoRefeicao: [Int]) {
    deleteGrupoRefeicao(idGrupoRefeicao: $idGrupoRefeicao)
  }
`;

export const DELETE_ITEM_REFEICAO = gql`
  mutation deleteItemRefeicao($idGrupoRefeicao: [Int]) {
    deleteItemRefeicao(idGrupoRefeicao: $idGrupoRefeicao)
  }
`;

export const UPDATE_GRUPO_REFEICAO = gql`
  mutation updateGrupoRefeicao(
    $idGrupoRefeicao: Int
    $nomeGrupoRefeicao: String
    $pesoTotalGrupoRefeicao: Float
    $pesoTotalConsumidoGrupoRefeicao: Float
    $observacao: String
    
  ) {
    updateGrupoRefeicao(
      idGrupoRefeicao: $idGrupoRefeicao
      nomeGrupoRefeicao: $nomeGrupoRefeicao
      pesoTotalGrupoRefeicao: $pesoTotalGrupoRefeicao
      pesoTotalConsumidoGrupoRefeicao: $pesoTotalConsumidoGrupoRefeicao
      observacao: $observacao      
    )
  }
`;

export const UPDATE_ONLY_PESO_CONSUMIDO_GR = gql`
  mutation updateOnlyPesoConsumidoGR(
    $idGrupoRefeicao: Int   
    $pesoTotalConsumidoGrupoRefeicao: Float   
  ) {
    updateOnlyPesoConsumidoGR(
      idGrupoRefeicao: $idGrupoRefeicao     
      pesoTotalConsumidoGrupoRefeicao: $pesoTotalConsumidoGrupoRefeicao      
    )
  }
`;

export const GET_GRUPO_REFEICAO = gql`
  query getAllGrupoRefeicao {
    getAllGrupoRefeicao {
      idGrupoRefeicao
      nomeGrupoRefeicao
      pesoTotalGrupoRefeicao
      pesoTotalConsumidoGrupoRefeicao
      observacao      
    }
  }
`;

export const GET_ITEM_REFEICAO_BY_ID = gql`
  query getItemRefeicaoByID($idGrupoRefeicao:Int) {
    getItemRefeicaoByID(idGrupoRefeicao:$idGrupoRefeicao)  {   
      idRefeicoes	
	    idAlimento	
      descricaoAlimento
	    idGrupoRefeicao	
    	qtdePesoPreparoRefeicao 
      pesoTotalGrupoRefeicao  
      pesoTotalConsumidoGrupoRefeicao    
      observacao
    }
  }
`;

export const GET_LAST_GRUPO_REFEICAO = gql`
  query getLastGrupoRefeicao {
    getLastGrupoRefeicao {
      idGrupoRefeicao
      nomeGrupoRefeicao
      pesoTotalGrupoRefeicao
      observacao      
    }
  }
`;

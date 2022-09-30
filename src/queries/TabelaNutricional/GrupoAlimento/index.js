import { gql } from "graphql-tag";

export const ADD_GRUPO_ALIMENTO = gql`
  mutation createGrupoAlimento($nomeGrupoAlimento: String) {
    createGrupoAlimento(nomeGrupoAlimento: $nomeGrupoAlimento)
  }
`;



export const DELETE_GRUPO_ALIMENTO = gql`
  mutation deleteGrupoAlimento($idGrupoAlimento: [Int]) {
    deleteGrupoAlimento(idGrupoAlimento:$idGrupoAlimento)
  }
`;


export const UPDATE_GRUPO_ALIMENTO = gql`
  mutation updateGrupoAlimento(
    $idGrupoAlimento: Int
    $nomeGrupoAlimento: String
    
  ) {
    updateGrupoAlimento(
      idGrupoAlimento: $idGrupoAlimento
      nomeGrupoAlimento: $nomeGrupoAlimento
      
    )
  }
`;

export const GET_GRUPO_ALIMENTO = gql`
  query getAllGrupoAlimento {
    getAllGrupoAlimento {
      idGrupoAlimento
      nomeGrupoAlimento
      
    }
  }
`;


export const GET_LAST_GRUPO_ALIMENTO = gql`
  query getLastGrupoAlimento {
    getLastGrupoAlimento {
      idGrupoAlimento
      nomeGrupoAlimento
      
    }
  }
`;



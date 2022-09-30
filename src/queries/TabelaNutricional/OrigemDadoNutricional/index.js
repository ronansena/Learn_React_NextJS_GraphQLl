import { gql } from "graphql-tag";

export const ADD_ORIGEM_DADO_NUTRICIONAL = gql`
  mutation createOrigemDadoNutricional(
    $nomeOrigemDadoNutricional: String
    $linkFonte: String
  ) {
    createOrigemDadoNutricional(
      nomeOrigemDadoNutricional: $nomeOrigemDadoNutricional
      linkFonte: $linkFonte
    )
  }
`;

export const DELETE_ORIGEM_DADO_NUTRICIONAL = gql`
  mutation deleteOrigemDadoNutricional($idOrigemDadoNutricional: [Int]) {
    deleteOrigemDadoNutricional(
      idOrigemDadoNutricional: $idOrigemDadoNutricional
    )
  }
`;

export const UPDATE_ORIGEM_DADO_NUTRICIONAL = gql`
  mutation updateOrigemDadoNutricional(
    $idOrigemDadoNutricional: Int
    $nomeOrigemDadoNutricional: String
    $linkFonte: String
  ) {
    updateOrigemDadoNutricional(
      idOrigemDadoNutricional: $idOrigemDadoNutricional
      nomeOrigemDadoNutricional: $nomeOrigemDadoNutricional
      linkFonte: $linkFonte
    )
  }
`;

export const GET_ORIGEM_DADO_NUTRICIONAL = gql`
  query getAllOrigemDadoNutricional {
    getAllOrigemDadoNutricional {
      idOrigemDadoNutricional
      nomeOrigemDadoNutricional
      linkFonte
    }
  }
`;

export const GET_LAST_ORIGEM_DADO_NUTRICIONAL = gql`
  query getLastOrigemDadoNutricional {
    getLastOrigemDadoNutricional {
      idOrigemDadoNutricional
      nomeOrigemDadoNutricional
      linkFonte
    }
  }
`;

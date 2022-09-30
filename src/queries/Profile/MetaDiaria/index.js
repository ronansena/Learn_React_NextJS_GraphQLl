import { gql } from "graphql-tag";

export const ADD_META_DIARIA = gql`
  mutation createMetaDiaria(
    $idMetaDiaria: Int
    $idProfileUser: Int
    $idStatusCadastro: Int
    $custoMensalPrevisto: Float
    $dtCadastro: Date
    $energiaKcal: Float
    $proteina: Float
    $lipideos: Float
    $colesterol: Float
    $carboidrato: Float
    $fibraAlimentar: Float
    $calcio: Float
    $ferro: Float
    $sodio: Float
  ) {
    createMetaDiaria(
      idMetaDiaria: $idMetaDiaria
      idProfileUser: $idProfileUser
      idStatusCadastro: $idStatusCadastro
      custoMensalPrevisto: $custoMensalPrevisto
      dtCadastro: $dtCadastro
      energiaKcal: $energiaKcal
      proteina: $proteina
      lipideos: $lipideos
      colesterol: $colesterol
      carboidrato: $carboidrato
      fibraAlimentar: $fibraAlimentar
      calcio: $calcio
      ferro: $ferro
      sodio: $sodio
    )
  }
`;

export const DELETE_META_DIARIA = gql`
  mutation deleteMetaDiaria($idMetaDiaria: [Int]) {
    deleteMetaDiaria(idMetaDiaria: $idMetaDiaria)
  }
`;

export const UPDATE_META_DIARIA = gql`
  mutation updateMetaDiaria(
    $idMetaDiaria: Int
    $idProfileUser: Int
    $idStatusCadastro: Int
    $custoMensalPrevisto: Float
    $dtCadastro: Date
    $energiaKcal: Float
    $proteina: Float
    $lipideos: Float
    $colesterol: Float
    $carboidrato: Float
    $fibraAlimentar: Float
    $calcio: Float
    $ferro: Float
    $sodio: Float
  ) {
    updateMetaDiaria(
      idMetaDiaria: $idMetaDiaria
      idProfileUser: $idProfileUser
      idStatusCadastro: $idStatusCadastro
      custoMensalPrevisto: $custoMensalPrevisto
      dtCadastro: $dtCadastro
      energiaKcal: $energiaKcal
      proteina: $proteina
      lipideos: $lipideos
      colesterol: $colesterol
      carboidrato: $carboidrato
      fibraAlimentar: $fibraAlimentar
      calcio: $calcio
      ferro: $ferro
      sodio: $sodio
    )
  }
`;

export const GET_META_DIARIA = gql`
  query getAllMetaDiaria {
    getAllMetaDiaria {
      idMetaDiaria
      idProfileUser
      idStatusCadastro
      custoMensalPrevisto
      dtCadastro
      energiaKcal
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      calcio
      ferro
      sodio
    }
  }
`;

export const GET_META_DIARIA_BY_ID = gql`
  query getMetaDiariaById($idMetaDiaria: Int) {
    getMetaDiariaById(idMetaDiaria: $idMetaDiaria) {
      idMetaDiaria
      idProfileUser
      idStatusCadastro
      custoMensalPrevisto
      dtCadastro
      energiaKcal
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      calcio
      ferro
      sodio
    }
  }
`;

export const GET_LAST_META_DIARIA = gql`
  query getLastMetaDiaria {
    getLastMetaDiaria {
      idMetaDiaria
      idProfileUser
      idStatusCadastro
      custoMensalPrevisto
      dtCadastro
      energiaKcal
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      calcio
      ferro
      sodio
    }
  }
`;

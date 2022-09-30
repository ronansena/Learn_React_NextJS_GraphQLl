import { gql } from "graphql-tag";

export const ADD_MASSA_CORPORAL = gql`
  mutation createMassaCorporal(
    $idMassaCorporal: Int
    $idProfileUser: Int
    $massaCorporalCadastrada: Float
    $idWorkout: Int
    $dataMassaCorporal: Date
  ) {
    createMassaCorporal(
      idMassaCorporal:$idMassaCorporal
      idProfileUser:$idProfileUser
      massaCorporalCadastrada:$massaCorporalCadastrada
      idWorkout:$idWorkout
      dataMassaCorporal:$dataMassaCorporal
    )
  }
`;

export const GET_MASSA_CORPORAL_BY_DATE = gql`
  query getMassaCorporalByDate($dataMassaCorporalInicial: Date,$dataMassaCorporalFinal: Date) {
    getMassaCorporalByDate(dataMassaCorporalInicial: $dataMassaCorporalInicial,dataMassaCorporalFinal: $dataMassaCorporalFinal) {
      idMassaCorporal
      idProfileUser
      massaCorporalCadastrada
      idWorkout
      dataMassaCorporal
    }
  }
`;

export const DELETE_MASSA_CORPORAL = gql`
  mutation deleteMassaCorporal($idMassaCorporal: [Int]) {
    deleteMassaCorporal(idMassaCorporal: $idMassaCorporal)
  }
`;

export const UPDATE_MASSA_CORPORAL = gql`
  mutation updateMassaCorporal(
    $idMassaCorporal: Int
    $idProfileUser: Int
    $massaCorporalCadastrada: Float
    $idWorkout: Int
    $dataMassaCorporal: Date
  ) {
    updateMassaCorporal(
      idMassaCorporal:$idMassaCorporal
      idProfileUser:$idProfileUser
      massaCorporalCadastrada:$massaCorporalCadastrada
      idWorkout:$idWorkout
      dataMassaCorporal:$dataMassaCorporal
    )
  }
`;

export const GET_MASSA_CORPORAL = gql`
  query getAllMassaCorporal {
    getAllMassaCorporal {
      idMassaCorporal
      idProfileUser
      massaCorporalCadastrada
      idWorkout
      dataMassaCorporal
    }
  }
`;

export const GET_MASSA_CORPORAL_BY_ID = gql`
  query getMassaCorporalById($idMassaCorporal: Int) {
    getMassaCorporalById(idMassaCorporal: $idMassaCorporal) {
      idMassaCorporal
      idProfileUser
      massaCorporalCadastrada
      idWorkout
      dataMassaCorporal
    }
  }
`;

export const GET_LAST_MASSA_CORPORAL = gql`
  query getLastMassaCorporal {
    getLastMassaCorporal {
      idMassaCorporal
      idProfileUser
      massaCorporalCadastrada
      idWorkout
      dataMassaCorporal
    }
  }
`;

import { gql } from "graphql-tag";

export const ADD_SLEEP = gql`
  mutation createSleep(
    $idSleep: Int
    $idProfileUser: Int
    $dtWakeUp: Date
    $dtFallAsleep: Date
  ) {
    createSleep(
      idSleep: $idSleep
      idProfileUser: $idProfileUser
      dtWakeUp: $dtWakeUp
      dtFallAsleep: $dtFallAsleep
    )
  }
`;

export const DELETE_SLEEP = gql`
  mutation deleteSleep($idSleep: [Int]) {
    deleteSleep(idSleep: $idSleep)
  }
`;

export const UPDATE_SLEEP = gql`
  mutation updateSleep(
    $idSleep: Int
    $idProfileUser: Int
    $dtWakeUp: Date
    $dtFallAsleep: Date
  ) {
    updateSleep(
      idSleep: $idSleep
      idProfileUser: $idProfileUser
      dtWakeUp: $dtWakeUp
      dtFallAsleep: $dtFallAsleep
    )
  }
`;

export const GET_SLEEP = gql`
  query getAllSleep {
    getAllSleep {
      idSleep
      idProfileUser
      dtWakeUp
      dtFallAsleep
    }
  }
`;


export const GET_SLEEP_BY_ID = gql`
  query getSleepById($idSleep: Int) {
    getSleepById(idSleep: $idSleep) {
      idSleep
      idProfileUser
      dtWakeUp
      dtFallAsleep
    }
  }
`;

export const GET_LAST_SLEEP = gql`
  query getLastSleep {
    getLastSleep {
      idSleep
      idProfileUser
      dtWakeUp
      dtFallAsleep
    }
  }
`;

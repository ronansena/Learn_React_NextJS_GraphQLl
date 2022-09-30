import { gql } from "graphql-tag";

export const ADD_TABELA_NUTRICIONAL = gql`
  mutation createTabelaNutricional(
    $idAlimento: Int
    $idGrupoAlimento: Int
    $idOrigemDadoNutricional: Int    
    $numeroAlimento: Int
    $descricaoAlimento: String    
    $qtdeConsumoSugerida: Float    
    $umidade: Float
    $energiaKcal: Float
    $energiaKj: Float
    $proteina: Float
    $lipideos: Float
    $colesterol: Float
    $carboidrato: Float
    $fibraAlimentar: Float
    $cinzas: Float
    $calcio: Float
    $magnesio: Float
    $manganes: Float
    $fosforo: Float
    $ferro: Float
    $sodio: Float
    $potassio: Float
    $cobre: Float
    $zinco: Float
    $retinol: Float
    $re: Float
    $rae: Float
    $tiamina: Float
    $riboflavina: Float
    $piridoxina: Float
    $niacina: Float
    $vitaminaC: Float
    $created_at: Date
    $updated_at: Date
  ) {
    createTabelaNutricional(
      idAlimento: $idAlimento
      idGrupoAlimento: $idGrupoAlimento
      idOrigemDadoNutricional: $idOrigemDadoNutricional      
      numeroAlimento: $numeroAlimento
      descricaoAlimento: $descricaoAlimento      
      qtdeConsumoSugerida: $qtdeConsumoSugerida      
      umidade: $umidade
      energiaKcal: $energiaKcal
      energiaKj: $energiaKj
      proteina: $proteina
      lipideos: $lipideos
      colesterol: $colesterol
      carboidrato: $carboidrato
      fibraAlimentar: $fibraAlimentar
      cinzas: $cinzas
      calcio: $calcio
      magnesio: $magnesio
      manganes: $manganes
      fosforo: $fosforo
      ferro: $ferro
      sodio: $sodio
      potassio: $potassio
      cobre: $cobre
      zinco: $zinco
      retinol: $retinol
      re: $re
      rae: $rae
      tiamina: $tiamina
      riboflavina: $riboflavina
      piridoxina: $piridoxina
      niacina: $niacina
      vitaminaC: $vitaminaC
      created_at: $created_at
      updated_at: $updated_at
    )
  }
`;

export const DELETE_TABELA_NUTRICIONAL = gql`
  mutation deleteTabelaNutricional($idAlimento: [Int]) {
    deleteTabelaNutricional(idAlimento: $idAlimento)
  }
`;

export const UPDATE_TABELA_NUTRICIONAL = gql`
  mutation updateTabelaNutricional(                            
    $idAlimento: Int
    $idGrupoAlimento: Int
    $idOrigemDadoNutricional: Int
    $descricaoAlimento: String
    $qtdeConsumoSugerida: Float
    $energiaKcal: Float
    $proteina: Float
    $lipideos: Float
    $carboidrato: Float
    $fibraAlimentar: Float
    $calcio: Float
    $sodio: Float
    $updated_at: Date
  ) {
    updateTabelaNutricional(
      idAlimento: $idAlimento
      idGrupoAlimento: $idGrupoAlimento
      idOrigemDadoNutricional: $idOrigemDadoNutricional
      descricaoAlimento: $descricaoAlimento
      qtdeConsumoSugerida: $qtdeConsumoSugerida      
      energiaKcal: $energiaKcal
      proteina: $proteina
      lipideos: $lipideos     
      carboidrato: $carboidrato
      fibraAlimentar: $fibraAlimentar    
      calcio: $calcio
      sodio: $sodio
      updated_at: $updated_at
    )
  }
`;

export const GET_TABELA_NUTRICIONAL = gql`
  query getAllTabelaNutricional {
    getAllTabelaNutricional {
      idAlimento
      idGrupoAlimento
      nomeGrupoAlimento
      idOrigemDadoNutricional
      nomeOrigemDadoNutricional      
      numeroAlimento
      descricaoAlimento      
      qtdeConsumoSugerida      
      umidade
      energiaKcal
      energiaKj
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      cinzas
      calcio
      magnesio
      manganes
      fosforo
      ferro
      sodio
      potassio
      cobre
      zinco
      retinol
      re
      rae
      tiamina
      riboflavina
      piridoxina
      niacina
      vitaminaC
      created_at
      updated_at
      idProdutoControlMoney
      pesoEmbalagem
      preco
      dataUltimaCotacaoPreco
    }
  }
`;

export const GET_TABELA_NUTRICIONAL_DESCRICAO_ALIMENTO = gql`
  query getAllTabelaNutricionalDescricaoAlimento {
    getAllTabelaNutricionalDescricaoAlimento {
      idAlimento  
      descricaoAlimento     
    }
  }
`;

export const GET_TABELA_NUTRICIONAL_BY_ID = gql`
  query getTabelaNutricionalById($idAlimento: Int) {
    getTabelaNutricionalById(idAlimento: $idAlimento) {
      idAlimento
      idGrupoAlimento
      nomeOrigemDadoNutricional
      nomeGrupoAlimento
      idOrigemDadoNutricional      
      numeroAlimento
      descricaoAlimento      
      qtdeConsumoSugerida      
      umidade
      energiaKcal
      energiaKj
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      cinzas
      calcio
      magnesio
      manganes
      fosforo
      ferro
      sodio
      potassio
      cobre
      zinco
      retinol
      re
      rae
      tiamina
      riboflavina
      piridoxina
      niacina
      vitaminaC
      created_at
      updated_at
    }
  }
`;

export const GET_LAST_TABELA_NUTRICIONAL = gql`
  query getLastTabelaNutricional {
    getLastTabelaNutricional {
      idAlimento
      idGrupoAlimento
      idOrigemDadoNutricional      
      nomeGrupoAlimento
      nomeOrigemDadoNutricional
      numeroAlimento
      descricaoAlimento      
      qtdeConsumoSugerida      
      umidade
      energiaKcal
      energiaKj
      proteina
      lipideos
      colesterol
      carboidrato
      fibraAlimentar
      cinzas
      calcio
      magnesio
      manganes
      fosforo
      ferro
      sodio
      potassio
      cobre
      zinco
      retinol
      re
      rae
      tiamina
      riboflavina
      piridoxina
      niacina
      vitaminaC
      created_at
      updated_at
    }
  }
`;

import queryDB from "../../../queryDB";

const resolvers = {

getAllTabelaNutricional: (args, req) => queryDB(req,"select t.*,g.*,o.*,r.idProdutoControlMoney,r.pesoEmbalagem,r.dataUltimaCotacaoPreco,r.preco  from tabelanutricional t left join grupoalimento g on (t.idGrupoAlimento=g.idGrupoAlimento)left join origemdadonutricional o on (t.idOrigemDadoNutricional=o.idOrigemDadoNutricional) left join reltabelanutricionalcotacao r on (t.idAlimento=r.idAlimento) order by t.idAlimento desc").then(data => data),
getAllTabelaNutricionalDescricaoAlimento: (args, req) => queryDB(req,"select t.descricaoAlimento,t.idAlimento from tabelanutricional t order by t.descricaoAlimento").then(data => data),
getLastTabelaNutricional: (args, req) => queryDB(req,"select * from tabelanutricional t left join grupoalimento g on (t.idGrupoAlimento=g.idGrupoAlimento) order by idAlimento desc limit 1").then(data => data),
createTabelaNutricional: (args, req) => queryDB(req, "insert into tabelanutricional SET ?", args),
deleteTabelaNutricional:(args, req) =>  queryDB(req, "delete from reltabelanutricionalcotacao where idAlimento IN ("+args.idAlimento+")", args),
deleteTabelaNutricional:(args, req) =>  queryDB(req, "delete from tabelanutricional where idAlimento IN ("+args.idAlimento+")", args),
updateTabelaNutricional:(args, req) =>  queryDB(req, 'update tabelanutricional set  idOrigemDadoNutricional='+args.idOrigemDadoNutricional+',descricaoAlimento='+'"'+args.descricaoAlimento+'"'+',qtdeConsumoSugerida='+'"'+args.qtdeConsumoSugerida+'"'+',energiaKcal='+'"'+args.energiaKcal+'"'+',proteina='+'"'+args.proteina+'"'+',lipideos='+'"'+args.lipideos+'"'+',carboidrato='+'"'+args.carboidrato+'"'+',fibraAlimentar='+'"'+args.fibraAlimentar+'"'+',calcio='+'"'+args.calcio+'"'+',sodio='+'"'+args.sodio+'"'+',updated_at='+'"'+args.updated_at+'"'+' where idAlimento='+args.idAlimento, args),
getTabelaNutricionalById: (args, req) => queryDB(req,"select * from tabelanutricional where idAlimento="+args.idAlimento).then(data => data),

};


export default { resolvers };


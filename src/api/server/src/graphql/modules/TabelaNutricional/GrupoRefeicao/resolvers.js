import queryDB from "../../../queryDB";

const resolvers = {

getAllGrupoRefeicao: (args, req) => queryDB(req,"select idGrupoRefeicao,nomeGrupoRefeicao,pesoTotalGrupoRefeicao,pesoTotalConsumidoGrupoRefeicao,observacao from gruporefeicao order by nomeGrupoRefeicao").then(data => data),
getLastGrupoRefeicao: (args, req) => queryDB(req,"select * from gruporefeicao order by idGrupoRefeicao desc limit 1").then(data => data),
createGrupoRefeicao: (args, req) => queryDB(req, "insert into gruporefeicao SET ?", args),
deleteItemRefeicao:(args, req) =>  queryDB(req, "delete from itemrefeicao where idGrupoRefeicao IN ("+args.idGrupoRefeicao+")", args),
deleteGrupoRefeicao:(args, req) =>  queryDB(req, "delete from gruporefeicao where idGrupoRefeicao IN ("+args.idGrupoRefeicao+");", args),
updateOnlyPesoConsumidoGR:(args, req) =>  queryDB(req, 'update gruporefeicao set pesoTotalConsumidoGrupoRefeicao='+args.pesoTotalConsumidoGrupoRefeicao+' where idGrupoRefeicao='+args.idGrupoRefeicao, args),
updateGrupoRefeicao:(args, req) =>  queryDB(req, 'update gruporefeicao set  nomeGrupoRefeicao='+'"'+args.nomeGrupoRefeicao+'"'+',pesoTotalGrupoRefeicao='+'"'+args.pesoTotalGrupoRefeicao+'"'+',pesoTotalConsumidoGrupoRefeicao='+args.pesoTotalConsumidoGrupoRefeicao+' where idGrupoRefeicao='+args.idGrupoRefeicao, args),
createItemRefeicao:(args, req) => queryDB(req, "insert into itemrefeicao SET ?", args),
getItemRefeicaoByID: (args, req) => queryDB(req,"select t.descricaoAlimento,g.observacao,g.pesoTotalConsumidoGrupoRefeicao,g.pesoTotalGrupoRefeicao,i.* from itemrefeicao i left join tabelanutricional t on (i.idAlimento=t.idAlimento) left join gruporefeicao g on (i.idGrupoRefeicao=g.idGrupoRefeicao) where i.idGrupoRefeicao="+args.idGrupoRefeicao).then(data => data),
};


export default { resolvers };


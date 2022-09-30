import queryDB from "../../../queryDB";

const resolvers = {

getAllGrupoAlimento: (args, req) => queryDB(req,"select * from grupoalimento").then(data => data),
getLastGrupoAlimento: (args, req) => queryDB(req,"select * from grupoalimento order by idGrupoAlimento desc limit 1").then(data => data),
createGrupoAlimento: (args, req) => queryDB(req, "insert into grupoalimento SET ?", args),
deleteGrupoAlimento:(args, req) =>  queryDB(req, "delete from grupoalimento where idGrupoAlimento IN ("+args.idGrupoAlimento+")", args),
updateGrupoAlimento:(args, req) =>  queryDB(req, 'update grupoalimento set  nomeGrupoAlimento='+'"'+args.nomeGrupoAlimento+'"'+' where idGrupoAlimento='+args.idGrupoAlimento, args),

};


export default { resolvers };


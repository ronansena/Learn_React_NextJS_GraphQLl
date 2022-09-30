import queryDB from "../../../queryDB";

const resolvers = {

getAllMetaDiaria: (args, req) => queryDB(req,"select * from metadiaria").then(data => data),
getLastMetaDiaria: (args, req) => queryDB(req,"select * from metadiaria order by idMetaDiaria desc limit 1").then(data => data),
createMetaDiaria: (args, req) => queryDB(req, "insert into metadiaria SET ?", args),
deleteMetaDiaria:(args, req) =>  queryDB(req, "delete from metadiaria where idMetaDiaria IN ("+args.idMetaDiaria+")", args),
updateMetaDiaria:(args, req) =>  queryDB(req, 'update metadiaria set  idProfileUser='+args.idProfileUser+',idStatusCadastro='+args.idStatusCadastro+',custoMensalPrevisto='+'"'+args.custoMensalPrevisto+',dtCadastro='+'"'+args.dtCadastro+'"'+',energiaKcal='+'"'+args.energiaKcal+'"'+',proteina='+'"'+args.proteina+'"'+',lipideos='+'"'+args.lipideos+'"'+',colesterol='+'"'+args.colesterol+'"'+',carboidrato='+'"'+args.carboidrato+'"'+',fibraAlimentar='+'"'+args.fibraAlimentar+'"'+',calcio='+'"'+args.calcio+'"'+',ferro='+'"'+args.ferro+'"'+',sodio='+'"'+args.sodio+'"'+' where idMetaDiaria='+args.idMetaDiaria, args),
getMetaDiariaById: (args, req) => queryDB(req,"select * from metadiaria where idMetaDiaria="+args.idMetaDiaria).then(data => data),

};


export default { resolvers };


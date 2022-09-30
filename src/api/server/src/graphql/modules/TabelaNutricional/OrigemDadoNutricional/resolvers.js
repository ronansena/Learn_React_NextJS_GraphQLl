import queryDB from "../../../queryDB";

const resolvers = {

getAllOrigemDadoNutricional: (args, req) => queryDB(req,"select * from origemdadonutricional").then(data => data),
getLastOrigemDadoNutricional: (args, req) => queryDB(req,"select * from origemdadonutricional order by idOrigemDadoNutricional desc limit 1").then(data => data),
createOrigemDadoNutricional: (args, req) => queryDB(req, "insert into origemdadonutricional SET ?", args),
deleteOrigemDadoNutricional:(args, req) =>  queryDB(req, "delete from origemdadonutricional where idOrigemDadoNutricional IN ("+args.idOrigemDadoNutricional+")", args),
updateOrigemDadoNutricional:(args, req) =>  queryDB(req, 'update origemdadonutricional set  nomeOrigemDadoNutricional='+'"'+args.nomeOrigemDadoNutricional+'"'+',linkFonte='+'"'+args.linkFonte+'"'+' where idOrigemDadoNutricional='+args.idOrigemDadoNutricional, args),

};


export default { resolvers };


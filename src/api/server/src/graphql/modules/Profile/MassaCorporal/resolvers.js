import queryDB from "../../../queryDB";

const resolvers = {

getAllMassaCorporal: (args, req) => queryDB(req,"select * from massacorporal order by dataMassaCorporal desc").then(data => data),
getLastMassaCorporal: (args, req) => queryDB(req,"select * from massacorporal order by idMassaCorporal desc limit 1").then(data => data),
createMassaCorporal: (args, req) => queryDB(req, "insert into massacorporal SET ?", args),
deleteMassaCorporal:(args, req) =>  queryDB(req, "delete from massacorporal where idMassaCorporal IN ("+args.idMassaCorporal+")", args),
updateMassaCorporal:(args, req) =>  queryDB(req, 'update massacorporal set  idProfileUser='+args.idProfileUser+',massaCorporalCadastrada='+args.massaCorporalCadastrada+',dataMassaCorporal='+'"'+args.dataMassaCorporal+'"'+',idWorkout='+args.idWorkout+' where idMassaCorporal='+args.idMassaCorporal, args),
getMassaCorporalById: (args, req) => queryDB(req,"select * from massacorporal where idMassaCorporal="+args.idMassaCorporal).then(data => data),
getMassaCorporalByDate: (args, req) => queryDB(req,"select * from massacorporal where dataMassaCorporal>='"+args.dataMassaCorporalInicial+"' and dataMassaCorporal<='"+args.dataMassaCorporalFinal+"' order by dataMassaCorporal").then(data => data),

};

export default { resolvers };


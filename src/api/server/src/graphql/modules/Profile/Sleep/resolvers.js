import queryDB from "../../../queryDB";

const resolvers = {

getAllSleep: (args, req) => queryDB(req,"select * from sleep order by dtFallAsleep desc").then(data => data),
getLastSleep: (args, req) => queryDB(req,"select * from sleep order by dtFallAsleep desc limit 1").then(data => data),
createSleep: (args, req) => queryDB(req, "insert into sleep SET ?", args),
deleteSleep:(args, req) =>  queryDB(req, "delete from sleep where idSleep in ("+args.idSleep+")", args),
updateSleep:(args, req) =>  queryDB(req, 'update sleep set  dtWakeUp='+'"'+args.dtWakeUp+'"'+'where idSleep='+args.idSleep, args),
getSleepById: (args, req) => queryDB(req,"select * from sleep where idSleep="+args.idSleep).then(data => data),

};

export default { resolvers };


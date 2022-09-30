import queryDB from "../../../queryDB";

const resolvers = {

getAllConsumoDiario: (args, req) => queryDB(req,"select * from consumonutricionaldiario c left join tabelanutricional t on (c.idAlimento=t.idAlimento) left join reltabelanutricionalcotacao r on (c.idAlimento=r.idAlimento) order by c.dtConsumoExec desc").then(data => data),
getLastConsumoDiario: (args, req) => queryDB(req,"select * from consumonutricionaldiario c left join tabelanutricional t on (c.idAlimento=t.idAlimento) order by idConsumoNutricionalDiario desc limit 1").then(data => data),
getConsumoByDate: (args, req) => queryDB(req,'select * from consumonutricionaldiario c left join tabelanutricional t on (c.idAlimento=t.idAlimento) left join reltabelanutricionalcotacao r on (c.idAlimento=r.idAlimento) where dtConsumoExec>='+'"'+args.dtConsumoExec.substring(0,10)+ ' 00:00:00"'+' and dtConsumoExec<='+'"'+args.dtConsumoExec.substring(0,10)+ ' 23:59:59"'+' order by c.dtConsumoExec desc').then(data => data),
createConsumoDiario: (args, req) => queryDB(req, "insert into consumonutricionaldiario SET ?", args),
deleteConsumoDiario:(args, req) =>  queryDB(req, "delete from consumonutricionaldiario where idConsumoNutricionalDiario IN ("+args.idConsumoNutricionalDiario+")", args),
//updateConsumoDiario:(args, req) =>  queryDB(req, 'update consumonutricionaldiario set  qtdePesoConsumidaExec='+'"'+args.qtdePesoConsumidaExec+'"'+' ,idAlimento='+'"'+args.idAlimento+ '"'+' ,dtConsumoExec='+'DATE_FORMAT(STR_TO_DATE("'+args.dtConsumoExec+ '", "%d/%m/%Y %H:%i:%s"), "%Y-%m-%d %H:%i:%s")'+' where idConsumoNutricionalDiario='+args.idConsumoNutricionalDiario, args),
updateConsumoDiario:(args, req) =>  queryDB(req, 'update consumonutricionaldiario set  qtdePesoConsumidaExec='+'"'+args.qtdePesoConsumidaExec+'"'+' ,idAlimento='+'"'+args.idAlimento+ '"'+' ,dtConsumoExec='+'"'+args.dtConsumoExec+ '"'+' where idConsumoNutricionalDiario='+args.idConsumoNutricionalDiario, args),
getItemRefeicaoConsumoDiarioByID: (args, req) => queryDB(req,"select * from consumonutricionaldiario c left join tabelanutricional t on (c.idAlimento=t.idAlimento)  order by c.dtConsumoExec desc limit "+args.limit).then(data => data),
getConsumoByDateInicialFinal: (args, req) => queryDB(req,'select * from consumonutricionaldiario c left join tabelanutricional t on (c.idAlimento=t.idAlimento) left join reltabelanutricionalcotacao r on (c.idAlimento=r.idAlimento) where dtConsumoExec>='+'"'+args.dtConsumoExecInicial.substring(0,10)+ ' 00:00:00"'+' and dtConsumoExec<='+'"'+args.dtConsumoExecFinal.substring(0,10)+ ' 23:59:59"'+' order by c.dtConsumoExec').then(data => data),

};



export default { resolvers };


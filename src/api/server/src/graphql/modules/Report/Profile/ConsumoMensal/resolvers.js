import queryDB from "../../../../queryDB";

const resolvers = {

getConsumoReportQuant:(args, req) => queryDB(req,'SELECT sum(qtdePesoConsumidaExec) as quantidadeTotalConsumida,((r.preco/r.pesoEmbalagem)*sum(qtdePesoConsumidaExec)) as custoItem, c.*,t.*,r.* FROM controlhealthtest.consumonutricionaldiario c left join tabelanutricional t on (c.idAlimento=t.idAlimento) left join reltabelanutricionalcotacao r on (c.idAlimento=r.idAlimento) where c.dtConsumoExec>='+'"'+args.dtConsumoExecInicial.substring(0,10)+ ' 00:00:00"'+' and c.dtConsumoExec<='+'"'+args.dtConsumoExecFinal.substring(0,10)+ ' 23:59:59"'+' group by c.idAlimento order by t.descricaoAlimento').then(data => data),

};



export default { resolvers };


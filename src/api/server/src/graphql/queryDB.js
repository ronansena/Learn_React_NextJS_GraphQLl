const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    
    console.log("sql")
    console.log(sql)
    //console.log("req")
    //console.log(req)

    req.mysqlDb.query(sql, args, (err, rows) => {
       
        if (err)
            return reject(err);
           
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
      
    });
    //fecha a conexão com o banco;
    req.mysqlDb.end();
});



export default queryDB;
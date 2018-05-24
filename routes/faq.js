var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var connectionDetails;
var connectionStatus = {"status": "failed"};
let queryDetails;
var dbConfig = require('../config/dbconfig.json');
function faq() {
    return new Promise(function (resolve, reject) {
        var connectionStatus;
        oracledb.getConnection(
            {
                user: dbConfig.user,
                password: dbConfig.password,
                connectString: dbConfig.connectString
            },
            function (err, conn) {
                if (err) {
                    connectionStatus = {"status": "failed"};
                    console.log("err");
                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                    return;
                }
                try{
                    conn.execute(
                        `SELECT DISEASE_NAME AS "DISEASE NAME", TREATMENT_PROCEDURE AS "TREATMENT PROCEDURE" FROM HRP_FAQ`,    
                    function (err, result) {
                        if (!err) {
                            queryDetails = {"status": "ok", "result": result};
                            if (conn) {
                                try {
                                    conn.close();
                                } catch (err) {
                                    console.log("1");//DEBUG FLAG
                                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                                }
                            }
                            resolve(result);
                            
                        } else {
                            queryDetails = {"status": "failed"};
                            console.log(err);
                            reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                        }
                    });
                }catch (err){
                    console.log(err);
                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                }
            });
        })
}

router.get('/', function (req, res, next) {
    
    faq().then((result)=>{       
        res.render('nonupdate', {resulty:result})
    }).catch((err)=> {
        res.json(err);
    })
});

module.exports = router;
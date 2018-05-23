var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var connectionDetails;
var connectionStatus = {"status": "failed"};
let queryDetails;
var dbConfig = require('../config/dbconfig.json');

function insert(values) {
    return new Promise(function (resolve, reject) {
        var date = new Date(values.when);
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
                    "INSERT INTO hrp_appointments VALUES (:id, :pid, :did, :when, :fee)",
                    {id: {val: values.id}, pid: {val: values.pid}, did: {val: values.did}, when: {val: date}, fee: {val: 50} }, {autoCommit: true}, // 'bind by name' syntax
                    function (err, result) {
                        if (!err) {
                            queryDetails = {"status": "ok", "rows_affected": result.rowsAffected};
                            if (conn) {
                                try {
                                    conn.close();
                                    resolve(result);
                                } catch (err) {
                                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                                }
                            }
                        } else {
                            queryDetails = {"status": "failed"};
                            reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                        }
                    });
                }catch (err){
                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                }
            });
        })
}
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
                        `SELECT hrp_department.name as "Department Name", hrp_doctor.name as "Doctor Name", hrp_appointments.when as "When" FROM HRP_appointments, hrp_doctor, hrp_patient, hrp_department
                        WHERE hrp_patient.id = hrp_appointments.pid and hrp_doctor.id = hrp_appointments.did and hrp_doctor.dept_no = hrp_department.id`,    
                    function (err, result) {
                        if (!err) {
                            queryDetails = {"status": "ok", "result": result};
                            if (conn) {
                                try {
                                    conn.close();
                                } catch (err) {
                                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                                }
                            }
                            resolve(result);
                            
                        } else {
                            queryDetails = {"status": "failed"};
                            console.log(err)
                            reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                        }
                    });
                }catch (err){
                    console.log(err)
                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                }
            });
        })
}

function view(id) {
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
                        `SELECT * FROM hrp_appointments, hrp_doctor, hrp_patient, hrp_department
                        WHERE hrp_appointments.id = :id and hrp_patient.id = hrp_appointments.pid and hrp_doctor.id = hrp_appointments.did and hrp_doctor.dept_no = hrp_department.id`,
                       [id],
                    function (err, result) {
                        if (!err) {
                            queryDetails = {"status": "ok", "result": result};
                            if (conn) {
                                try {
                                    conn.close();
                                } catch (err) {
                                    console.log("1")
                                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                                }
                            }
                            resolve(result);
                            
                        } else {
                            queryDetails = {"status": "failed"};
                            console.log(err)
                            reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                        }
                    });
                }catch (err){
                    console.log(err)
                    reject({"connectionDetails": conn, "connectionStatus": connectionStatus, "err": err});
                }
            });
        })
}

router.get('/', function (req, res, next) {
    faq().then((result)=>{       
        res.render('appointments', {resulty:result})
    }).catch((err)=> {
        res.json(err);
    })
});
router.get('/view/:id', function (req, res, next) {
    var id = req.params.id

    view(id).then((result)=>{
        res.render('appointment', {fee:result.rows[0][4], deptname: result.rows[0][18], dname:result.rows[0][6], date:result.rows[0][3], name: result.rows[0][12]})
    }).catch((err)=> {
        res.json(err);
    })
});
router.get('/create', function (req, res, next) {

    insert({id : req.param('id'), did : req.param('did'), pid : req.param('pid'), when : req.param('when')})
        .then(function (succ) {
            //console.log(req.params)
            res.json(succ);
        })
        .catch(function (err) {
            res.json(err);
    });
});
module.exports = router;

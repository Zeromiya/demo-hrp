document.getElementById("connect").addEventListener("click", connectFunct);
document.getElementById("insert").addEventListener("click", insertFunct);
document.getElementById("create").addEventListener("click", createFunct);
document.getElementsByName("refresh")[0].addEventListener("click", refreshReq);
document.getElementsByName("refresh_cre")[0].addEventListener("click", refreshCre);
document.getElementsByName("refresh_ins")[0].addEventListener("click", refreshIns);
function connectFunct(){
    var x = document.getElementById("connect");
    var y = document.getElementById("connect-body");
    x.setAttribute("disabled", "true");
    request("connect", y);
}
function insertFunct(){
    var x = document.getElementById("insert");
    var y = document.getElementById("insert-body");
    x.setAttribute("disabled", "true");
    request("insert", y);
}
function createFunct(){
    var x = document.getElementById("create");
    var y = document.getElementById("create-body");
    x.setAttribute("disabled", "true");
    request("create", y);
}

function refreshReq(){
    location.reload();
}

function refreshCre(){
    var x = document.getElementById("create");
    x.removeAttribute("disabled");
    x.innerText = "Create Table";
    x.className = "btn btn-lg btn-block btn-primary";
    x.addEventListener("click", createFunct);
}
function refreshIns(){
    var x = document.getElementById("insert");
    x.removeAttribute("disabled");
    x.innerText = "Insert";
    x.className = "btn btn-lg btn-block btn-primary";
    x.addEventListener("click", insertFunct);
}
function request(req,y){
    var query;
    y.innerHTML += "<i style =\"margin-top:15px\" id=\"spin-k\" class=\"fas fa-spinner fa-spin\"></i>";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/'+req);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function() {
        var x = document.getElementById(req);
        if (xhr.status === 200 || xhr.status === 304) {
            query = JSON.parse(xhr.responseText);
            if(query.connectionStatus.status === "ok") {
                if(query.hasOwnProperty('queryDetails')) {
                    if(query.queryDetails.status === "ok"){
                        x.innerText = x.innerText.split(/\s/)[0] + (req !== "create" ? "ed" : "d");
                        x.className = "btn btn-lg btn-block btn-success";
                    }else{
                        x.innerText = x.innerText + " Failed";
                        x.className = "btn btn-lg btn-block btn-danger";
                    }
                }else{
                    x.innerText = x.innerText.split(/\s/)[0] + (req !== "create" ? "ed" : "d");
                    x.className = "btn btn-lg btn-block btn-success";
                }
            }else{
                x.innerText = x.innerText + " Failed";
                x.className = "btn btn-lg btn-block btn-danger";
            }
            var temp = document.getElementById('spin-k');
            temp.parentNode.removeChild(temp);
        }else{
            console.log(xhr.status);
        }
    };
}
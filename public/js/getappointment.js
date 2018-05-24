var buts = document.getElementsByName("butts");
for(var i= 0; i<buts.length; i++){
    console.log(buts[i].id);
    buts[i].addEventListener('click', request, buts[i]);
}
function request(req) {
    var query;
    console.log(req.id);
    var y = document.getElementById("time" + this.id);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/appointment/create?did=' + this.id + '&when=' + y.value);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 304) {
            query = JSON.parse(xhr.responseText);

        }
    }
}
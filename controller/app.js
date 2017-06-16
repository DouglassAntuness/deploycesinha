var app = angular.module('myApp', ['ngRoute']);

// const URL = "http://dysweb.dys.com.br";
const URL = "";

var g$ = {
    isNewItemMenuTela: false,
    TABLE_ESC: false,
    elmSelected: "",
    popAtivos: [],
    memo1: "",
    memo2: "",
    memo3: "",
    memo4: "",
    memo5: ""
};

g$.newElement = function () {
    var el = document.createElement(arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
        el.classList.add(arguments[i]);
    }
    return el;
};

function _initDate() {
    var elm = $("[data-id='" + event.target.dataset.id + "']");
    elm.focus();
}

g$.setValuesCombo = function (view, obj) {
    var combo, tr, keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        $("#" + view + " [data-id='" + keys[i] + "'] #selectbox")[0].value = obj[keys[i]];
    }
}

g$.getValuesCombo = function (view, obj) {
    var combo = {}, elm,
        keys = Object.keys(obj),
        combos = $("#" + view + " select-box");
    for (var i = 0; i < combos.length; i++) {
        combo[combos[i].dataset.nameCombo] = combos[i].querySelector("#selectbox").value;
    }
    return angular.extend(combo, obj);
}

g$.formato = [
    {
        "DD_MM_YYYY": " | date : 'dd/MM/yyyy'",
        "DD-MM-YYYY": " | date : 'dd-MM-yyyy'",
        "YYYY_MM_DD": " | date : 'yyyy/MM/dd'"
    }
]

g$.popHelp = function () {
    alert("Help em manutenção");
}


g$.urlObj = function (url) {
    var url = url.slice(1).split("&"), obj = {};
    for (var i = 0; i < url.length; i++) {
        obj[url[i].split("=")[0].trim()] = (url[i].split("=")[0].trim() == "foto" && url[0].split("=")[1] == "FACE") ? url[i].slice(5) + "&" + url[4] : url[i].split("=")[1].replace("%20", " ");
    }
    return obj;
}

addEventListener("keydown", function (e) {
    // Sargento = alt + 1
    if (event.altKey && event.keyCode == "49") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "»";
        }
    }

    // Parametro = alt + 1
    if (event.altKey && event.keyCode == "50") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "¦";
        }
    }

    // Barra = alt + 3
    if (event.altKey && event.keyCode == "51") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "½";
        }
    }

    // Porcentagem = alt + 4
    if (event.altKey && event.keyCode == "52") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "‰";
        }
    }

    if (event.ctrlKey && event.altKey && event.keyCode == "76") {
        $('#modal-log').modal('open');
    }

});

// Nova data
g$.formataData = function (data) {
    data = new Date(data);
    return dataFormatada = data.getFullYear() + "-" + ("0" + (data.getMonth() + 1)).substr(-2) + "-" + ("0" + data.getDate()).substr(-2);
}

g$.formataDateTime = function (data) {
    var data = new Date(data);
    return data.toLocaleDateString() + " " + data.toLocaleTimeString();
}

// Formata a data no formato do mySql
g$.formataDataBanco = function (data) {
    var data = data.split(" ")
    return data[0].split("/").reverse().join("-") + ((data[1]) ? " " + data[1] : "");
}

g$.formataDataBarra = function (data) {
    return data.split("-").reverse().join("/");
}

// Formata data para tabela 
g$.formataDataCell = function (data) {
    return new Date(data).toLocaleDateString();
}

// Mostra os dados na tela
g$.controllerToview = function (obj, user) {
    var keys = Object.keys(obj), elm, query, tabela, campo, tr;
    for (var i = 0; i < keys.length; i++) {
        if (obj[keys[i]] != undefined) {
            elm = $("#view [data-id='" + keys[i].slice(2, keys[i].length) + "']")[0];
            if (elm.dataset.tipo == "date-time" && obj[keys[i]] != 'null' && obj[keys[i]])
                elm.value = g$.formataDateTime(obj[keys[i]]);
            else if (elm.dataset.tipo == "date" && obj[keys[i]] != 'null' && obj[keys[i]]) {
                elm.value = g$.formataData(obj[keys[i]]);
            }
            else if (elm.type == "checkbox") elm.checked = obj[keys[i]];
            else if (elm.id == "selectbox") {
                elm.querySelector("#selectbox").dataset.value = obj[keys[i]].split("¿")[0];
                elm.querySelector("#selectbox").value = obj[keys[i]].split("¿")[1];
            }
            else if ((elm.id == "label") && obj[keys[i]] != 'null' && obj[keys[i]]) elm.innerHTML = obj[keys[i]];
            else if (elm.id == "link" && elm.dataset.texto != "") {
                elm.innerHTML = obj[keys[i]];
                hrefLink(obj, elm);
            }
            else if (elm.dataset.tipo == "file") elm.parentElement.querySelectorAll("input")[1].value = obj[keys[i]];
            else if (elm.id == "imagem") {
                elm.src = "http://dysweb.dys.com.br/" + user.banco + "/" + obj[keys[i]];
            }
            else elm.value = obj[keys[i]];
        }
    }
}

g$.openIframe = function (src) {
    document.body.innerHTML += "<iframe id='iframe01' class='iframe' src='" + src + "'></iframe>";
    $("#closeIframe").removeClass("play-none");
}

g$.openModalCust = function (id) {
    var id = (!id) ? event.target.id : id;
    $('#' + id).modal('open');
}

g$.closeModalCust = function (id) {
    var id = (!id) ? event.target.id : id;
    $('#' + id).modal('close');
}

g$.closeIframe = function (src) {
    document.body.removeChild($("#iframe01")[0]);
    $("#closeIframe").addClass("play-none");
}


g$.omitirPropriedade = function (obj) {
    var keys = Object.keys(obj), elm;
    for (var i = 0; i < keys.length; i++) {
        if (obj[keys[i]] === '') obj[keys[i]] = null;
        else if (obj[keys[i]] === 'null') delete obj[keys[i]];
    }
    return obj;
}

g$.openLink = function (link) {
    window.open(link, "_system");
}

// Modal icone
g$.selecionarIcone = function (e) {
    var elm = event.target, classe;
    classe = elm.classList.contains("btn") ? elm.children[0].classList[1] : elm.classList[1];
    $("#propriedades .play-block #icone")[0].value = classe;
    $('#modal-icone').modal('close');
}

// Funcoes do Popup
g$.requeryAcoesTela = function () {
    var elm = event.target.parentElement.parentElement;
    elm = elm.classList.contains("card-header") ? elm.parentElement : elm;
    
    $("#filtros-head .form-control")[0].value = elm.dataset.tela;
    $("#telaacoes-head .form-control")[0].value = elm.dataset.tela;
}
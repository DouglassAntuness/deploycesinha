app.controller("inicial", function ($scope, $http, $rootScope) {

    g$.exceptionRequisicao = function (tipo, data) {
        if (data.err) {
            // Materialize.toast(data.error, 4000, 'red darken-1');
            event.preventDefault();
            event.stopPropagation();
            return true;
        }
        else {
            return false;
        }
    }

    // Inicial
    $('.modal').modal();

    // if (user.isNew == "true") $http.get("/criagatilhos/" + user.banco);

    $rootScope.user = JSON.parse(localStorage.user);

    var query = "SELECT * FROM usuario WHERE email = '" + $rootScope.user.email + "'", imgAnonimo;
    $http.get(URL + "/get/" + query).success(function (response) {
        // Trata Excecao
        g$.exceptionRequisicao("User", response);

        $scope.user = response.data[0];
        $rootScope.user = $scope.user;
        $scope.user.foto = "img/anonimo.png";
        $(".user-image")[0].src = $(".logo-user")[0].src = $scope.user.foto;
    });

    g$.carregaDados = function (callback) {
        // Array da Tabela
        var queryNodeTabela = "SELECT id, tabela, alias FROM node.tabela;";
        $http.get(URL + "/get/" + queryNodeTabela).success(function (data) {
            // Trata Excecao
            g$.exceptionRequisicao("ARRAY TABELA", data);

            $rootScope.nodeTabela = data.data;

            // Array da Consulta
            var queryNodeConsulta = "SELECT id, consulta FROM node.consulta;";
            $http.get(URL + "/get/" + queryNodeConsulta).success(function (data) {
                // Trata Excecao
                g$.exceptionRequisicao("ARRAY CONSULTA", data);

                $rootScope.nodeConsulta = data.data;

                // Array da Consulta
                var queryNodeCampo = "SELECT id, campo FROM node.campo;";
                $http.get(URL + "/get/" + queryNodeCampo).success(function (data) {
                    // Trata Excecao
                    g$.exceptionRequisicao("ARRAY CAMPO", data);

                    $rootScope.nodeCampo = data.data;

                    if (callback) g$[callback]();
                });
            });
        });
    }

    // Passa como o nome da tabela e recebe o nome ou o alias
    g$.filterTabela = function (id, isName) {
        var result, ini, array = JSON.stringify($rootScope.nodeTabela);

        ini = array.indexOf('"id":' + id + '');
        result = array.substring(ini, ini + 600);
        result = array.substring(ini, result.indexOf("}") + ini);

        // Nome ou alias
        result = (isName) ? result.split(",")[1].split(":")[1] : result.split(",")[2].split(":")[1];

        result = result.slice(1, result.length - 1);

        return result;
    }

    // Passa como o id da consulta e recebe o nome
    g$.filterCampo = function (id) {
        var result, ini, array = JSON.stringify($rootScope.nodeCampo);

        ini = array.indexOf('"id":' + id + ',');
        result = array.substring(ini, ini + 600);
        result = array.substring(ini, result.indexOf("}") + ini);

        // Nome ou alias
        result = result.split(":")[2];

        result = result.slice(1, result.length - 1)

        return result;
    }

    // Passa como o id da consulta e recebe o nome
    g$.filterConsulta = function (id) {
        var result, ini, array = JSON.stringify($rootScope.nodeConsulta);

        ini = array.indexOf('"id":' + id + ',');
        result = array.substring(ini, ini + 600);
        result = array.substring(ini, result.indexOf("}") + ini);

        // Nome ou alias
        result = result.split(",")[1].split(":")[1];

        result = result.slice(1, result.length - 1)

        return result;
    }

    // getValueOptionString
    g$.getValueOption = function (elm, valor) {
        return elm.dataset.value;
    }

    // Pega da lista pelo valor no campo
    g$.vfyDescOption = function (elm, valor) {
        var value = (valor) ? valor : elm.value;
        if (!elm.parentElement.querySelector(".container_combo [data-inner='" + value + "'] ")) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        return elm.parentElement.querySelector(".container_combo [data-inner='" + value + "'] ").dataset.inner;
    }

    g$.alerta = function (titulo, texto) {
        $("#myCustomDialog .dialogWrapper")[0].innerHTML = texto;
        alertjs.show({
            title: titulo,
            text: '#myCustomDialog', //must be an id
            from: 'top'
        });
    }

});
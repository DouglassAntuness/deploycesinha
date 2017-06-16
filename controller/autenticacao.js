app.controller("autenticacao", function ($scope, $http, $rootScope) {

    $("#email")[0].addEventListener("keydown", inputKeyDown, false);
    $("#senha")[0].addEventListener("keydown", inputKeyDown, false);

    function inputKeyDown(e) {
        if (event.keyCode == 13) $scope.autenticacaoDYS();
    }

    $scope.autenticacaoDYS = function () {
        var email = $("#email")[0],
            senha = $("#senha")[0];
        if ($("input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 4000, 'red darken-1');
        else if (!email.value.trim().length) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf("@") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf(".") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        var query = "SELECT * FROM usuario WHERE email = '" + email.value + "' AND senha = '" + senha.value + "'";
        $http.get(URL + "/get/" + query).success(function (data) {
            if (data.data.length) {
                Materialize.toast("Autenticacao realizada com sucesso!", 4000, 'green darken-1');
                window.location = "inicial.html?";
                localStorage.user = JSON.stringify({"email": data.data[0].email, auth: "DYS", nome: data.data[0].nome, banco: data.data[0].banco});
            }
            else return Materialize.toast("Usuário ou Senha incorreto(s)!", 4000, 'red darken-1');
        });
    }

    $scope.autenticacaoFace = function () {
        var email = $("#email")[0];
        if ($("input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 4000, 'red darken-1');
        else if (!email.value.trim().length) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf("@") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf(".") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');

        var query = "SELECT * FROM usuario WHERE email = '" + email.value + "'";
        $http.get(URL + "/get/" + query).success(function (data) {
            if (data.data.length) {
                Materialize.toast("Autenticacao realizada com sucesso!", 4000, 'green darken-1');
                window.location = "/auth/facebook";
            }
            else Materialize.toast("Não existe esse usuário em nosso banco de dados!", 4000, 'red darken-1');
        });
    }

    $scope.cadastrar = function () {
        var email = $("#email")[0];
        if ($("input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 4000, 'red darken-1');
        if ($("input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 4000, 'red darken-1');
        else if (!email.value.trim().length) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf("@") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf(".") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');

        var camposUsuario = $("input[data-tabela='usuario']"),
            camposCliente_Fornecedor = $("input[data-tabela!='usuario']"),
            objUsuario = {}, objCliente = {};
        for (var i = 0; i < camposUsuario.length; i++) {
            objUsuario[camposUsuario[i].dataset.coluna] = (camposUsuario[i].value.trim() == "") ? null : camposUsuario[i].value;
        }
        for (var i = 0; i < camposCliente_Fornecedor.length; i++) {
            objCliente[camposCliente_Fornecedor[i].dataset.coluna] = (camposCliente_Fornecedor[i].value.trim() == "") ? null : camposCliente_Fornecedor[i].value;
        }
        objUsuario.banco = camposUsuario[0].dataset.banco;
        objUsuario.projeto_id = camposUsuario[0].dataset.projeto;
        objCliente.razao = objUsuario.nome;
        objCliente.email = objUsuario.email;
        objCliente.adm = "1";
        $http.post(URL + '/post/node.usuario/', objUsuario).success(function (data) {
            data = data.data;
            objCliente.node_usuario_id = data.insertId;
            $http.post(URL + '/post/' + camposCliente_Fornecedor[0].dataset.banco + '.' + camposCliente_Fornecedor[0].dataset.tabela + '/', objCliente).success(function (data) {
                data = data.data;
                if (!data.err) {
                    Materialize.toast("Cadastrado com Sucesso.", 5000, 'green darken-1');
                    var query = "SELECT * FROM usuario WHERE email = '" + email.value + "' AND senha = '" + senha.value + "'";
                    $http.get(URL + "/get/" + query).success(function (data) {
                        if (data.data.length) {
                            window.location = "../inicial.html?auth=DYS&nome=" + data.data[0].nome + "&banco=" + data.data[0].banco + "&foto=" + data.data[0].foto + "&email=" + data.data[0].email;
                        }
                    });
                }
            });
        });
    }

    $scope.cadastrarCliente = function () {
        var email = $("#email")[0];
        if ($("input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 4000, 'red darken-1');
        else if (email.value.indexOf("@") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');
        else if (email.value.indexOf(".") == -1) return Materialize.toast("Campo email inválido!", 4000, 'red darken-1');

        var query = "SELECT * FROM usuario WHERE email = '" + email.value + "'";
        $http.get(URL + "/get/" + query).success(function (data) {
            if (data.data.length) return Materialize.toast("Já existe esse usuário em nosso banco de dados!", 4000, 'red darken-1');
            else {
                var proc = "node.cria_schema('" + $scope.cadastro.banco + "')";
                $http.get(URL + "/proc/" + proc).success(function (data) {
                    if (g$.exceptionRequisicao("Tela", data)) return;;

                    if (data.data[0][0].SUCESSO) {
                        Materialize.toast("Banco criado com sucesso!", 4000, 'green darken-1');
                        $http.post(URL + "/post/usuario", JSON.stringify($scope.cadastro)).success(function (response) {
                            response = response.data;
                            Materialize.toast('Usuário criado com sucesso!!', 4000, 'green darken-1');
                            var query = "SELECT * FROM usuario WHERE id = " + response.insertId;
                            $http.get(URL + "/get/" + query).success(function (data) {
                                // Criar Pasta
                                window.location = "../inicial.html?auth=DYS&nome=" + data[0].nome + "&banco=" + data[0].banco + "&foto=" + data[0].foto + "&email=" + data[0].email + "&isNew=" + true;
                            });
                        });
                    }
                    else {
                        return Materialize.toast(data[0][0].RESULTADO, 4000, 'red darken-1');
                    }
                });
            }
        });
    }

});
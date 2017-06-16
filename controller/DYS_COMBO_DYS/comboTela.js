app.directive("teste", function() {
    return {
        restrict: 'E',
        templateUrl: "../controller/DYS_COMBO_DYS/template.html",
        scope: {},

        controller: function($scope, $element, $http, $compile, $rootScope) {
            var elm = $element[0], query, tabela, campo;

            if (parseInt(elm.dataset.combo_tabela)) {
                tabela = g$.filterTabela(elm.dataset.combo_tabela, true);
            }
            else tabela = elm.dataset.comboTabela;

            if (parseInt(elm.dataset.combo_campo)) {
                campo = g$.filterCampo(elm.dataset.combo_campo);
            }
            else campo = elm.dataset.comboCampo;

            if(elm.dataset.bloqueado == "1") elm.querySelector("input").disabled = true;

            $scope.idCombo = "";
            $scope.coluna = campo;
            $scope.value = elm.dataset.comboGravaCampo || "id";

            $scope.openCombo = function() {
                var query, template,
                    filtro = (!elm.dataset.comboFiltro || elm.dataset.comboFiltro == "null") ? "" : elm.dataset.comboFiltro;

                if (elm.dataset.comboQuery) {
                    $scope.coluna = elm.dataset.combo_campo;
                    query = elm.dataset.comboQuery;
                }
                else query = "SELECT " + ((elm.dataset.comboGravaCampo == "" || elm.dataset.comboGravaCampo == "undefined") ? 'id' : elm.dataset.comboGravaCampo) +
                    "," + campo + " FROM " + $rootScope.user.banco + "." + tabela + ((filtro.length) ? " WHERE " : " ") + filtro;

                query = g$.alterSargentos(query)[0];

                $http.get(URL + "/get/" + query).success(function(data) {

                    if (g$.exceptionRequisicao("Combobox", data)) return;
                    id = elm.dataset.id;
                    data = (data.data[0] && data.data[0][0]) ? data.data[0] : data.data;
                    // id do elemento, json, nome do popup, descricao, valor, isTela
                    _initCombo(id, data, elm.dataset.nome, $scope.coluna, $scope.value, true);

                });
            }

            g$.selecionarComboTela = function(linha, id) {
                $("[data-id='" + id + "'] #selectbox")[0].value = linha[Object.keys(linha)[1]];
                $("[data-id='" + id + "'] #selectbox")[0].dataset.value = linha[Object.keys(linha)[0]];
                onComboChange(id);
            };

            function onComboChange(id) {
                // Chama todas as funcoes change
                var queryElementoChange = "SELECT funcao FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and ef.elemento_id = " +
                    id + " and evento = 'change' ORDER BY ef.ordem;"
                $http.get(URL + "/get/" + queryElementoChange).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Tela", data)) return;;

                    data.data.forEach(function(v) {
                        var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                            params = v.funcao;
                        g$[funcao.trim()](params);
                    });
                });
            }

            // Monta a query para buscar a descricao no banco de acordo com o valor que ta vindo e atualiza no Combobox 
            g$.getValorComboBanco = function(elemento, valor) {

                elemento.querySelector("#selectbox").dataset.value = valor;

                var campo, tabela, query, chave;

                tabela = g$.filterTabela(elemento.dataset.combo_tabela, true);
                campo = g$.filterCampo(elemento.dataset.combo_campo);
                chave = elemento.dataset.comboGravaCampo || "id";

                query = "SELECT " + campo + " FROM " + $rootScope.user.banco + "." + tabela + " WHERE " + chave + " = '" + valor + "'";

                $http.get(URL + "/get/" + query).success(function(data) {

                    if (g$.exceptionRequisicao("Combobox", data)) return;
                    data = data.data;

                    elemento.querySelector("#selectbox").value = data[0][campo];
                    // onComboChange(elemento.dataset.id);
                });

            }

        }
    };
});
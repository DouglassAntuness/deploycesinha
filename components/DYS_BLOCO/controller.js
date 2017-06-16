app.controller("bloco", function ($scope, $http, $rootScope, $compile) {

    // FUNCAO INICIA Bloco
    _initBloco = function (elm, filtro_bloco, filtro_proc, nome_procedure, idFuncao, isTela) {
        var nome = elm.children[0].dataset.nome + elm.children[0].dataset.id, template = "", datable;
        if (filtro_bloco && filtro_bloco.trim() != "") {
            var filtro = filtro_bloco.split("¦"),
                elemento_filtro = $("[data-id='" + filtro[0].trim() + "']")[0],
                id_filtro_bloco = filtro[1].trim(),
                pai_elemento = elemento_filtro.parentElement;
            pai_elemento.removeChild(elemento_filtro);
            elemento_filtro.setAttribute("ng-model", "e_" + id_filtro_bloco);
            elemento_filtro = $compile(elemento_filtro)($scope)[0];
            pai_elemento.appendChild(elemento_filtro);
            $("[data-id='" + filtro[0].trim() + "']")[0].addEventListener("keydown", g$.filtroBloco.bind(null, idFuncao), false);
            elm.setAttribute("ng-repeat", nome + " in " + nome + "s | filter:{e_" + id_filtro_bloco + ": e_" + id_filtro_bloco + "}" + " | limitTo: " + elm.dataset.limite);
        }
        else elm.setAttribute("ng-repeat", nome + " in " + nome + "s | limitTo: " + elm.dataset.limite);
        elm.dataset.obj = "{{" + nome + "}}";

        if (!elm.parentElement.dataset.template) template = atualizarBloco(elm, nome);
        template = elm.parentElement.dataset.template;
        get(elm, template, nome, filtro_proc, nome_procedure, idFuncao, isTela);
    }

    g$.filtroBloco = function (idFuncao) {
        g$.vfyFuncaoDepois(idFuncao, false);
    }

    // FUNCAO MONTA E ATUALIZA Bloco PARA O FUNCIONAMENTO DA TABELA
    atualizarBloco = function (elm, nome) {
        var filhos = elm.querySelectorAll("[data-le_da_tabela]");

        for (var i = 0; i < filhos.length; i++) {
            if (filhos[i].dataset.le_da_tabela && filhos[i].dataset.le_da_tabela != "" && filhos[i].dataset.le_da_tabela != "null") {
                if (filhos[i].tagName == "LABEL") {
                    if (filhos[i].dataset.nome && filhos[i].dataset.nome != "") {
                        filhos[i].dataset[filhos[i].dataset.nome] = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                    }
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                }
                else if (filhos[i].id == "input") {
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].setAttribute("value", "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}");
                }
                else if (filhos[i].id == "imagem") {
                    filhos[i].src = "http://dysweb.dys.com.br/{{user.banco}}/{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                }
                else if (filhos[i].id == "link") {
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                }
            }
        }

        elm.parentElement.dataset.template = elm.outerHTML;
        return elm;
    }

    // FUNÇÂO READ  
    get = function (elm, template, nome, filtro, nome_procedure, idFuncao, isTela) {
        var keys, td, query, idBloco, queryEventsBlocos, elemento_bloco = elm.parentElement, elementos,
            nomeProc = 'node.le(' + elm.children[0].dataset.consulta_id + ',"' + $rootScope.user.banco + '", "' + filtro + '")';

        if (nome_procedure && nome_procedure != "") {
            if (nome_procedure.split("¦")[1]) {
                nomeProc = nome_procedure.split("¦")[0].trim() + '(' + nome_procedure.split("¦")[1] + ',"' + elm.children[0].dataset.consulta_id + '")';
            }
            else {
                nome_procedure = nome_procedure.split("¦")[0].trim()
                // Chama a proc passada por parametro
                nomeProc = nome_procedure + '(' + elm.children[0].dataset.consulta_id + ',"' + $rootScope.user.banco + '", "' + filtro + '")';
            }

            $http.get(URL + "/proc/" + nomeProc).success(function (response) {
                // Trata Excecao
                if (g$.exceptionRequisicao("ProcLe - Bloco", response)) return;;

                // Compila o template
                template = angular.element(template)[0];
                template.dataset.template = elm.dataset.template;
                template = $compile(template)($scope)[0];
                $scope[nome + "s"] = response.data[0];

                if (response.data.length) {
                    if (template) {
                        // template.classList.remove("play-none");
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);
                    }

                    // Adiciona os HREF nos links 
                    hrefLinkBloco(elm);
                    setAttributesCellsBloco(elm);
                    $scope.addEventosElmsBloco(elm, elemento_bloco);
                    g$.vfyFuncaoDepois(idFuncao, isTela);
                }
                else {
                    elm.classList.add("play-none");
                    $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(elm);
                    g$.vfyFuncaoDepois(idFuncao, isTela);
                }

            });
        }
        else {
            $http.get(URL + "/proc/" + nomeProc).success(function (response) {
                if (g$.exceptionRequisicao("ProcLe - Bloco", response)) return;;

                var consulta = { query: response.data[0][0].consulta };
                $http.post(URL + "/jsonQuery/", consulta).success(function (response) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Query Bloco - Bloco", response)) return;;

                    // Compila o template
                    template = $compile(angular.element(template)[0])($scope)[0];

                    if (response.data.length) {
                        $scope[nome + "s"] = response.data;

                        if (template) {
                            // template.classList.remove("play-none");
                            $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                            $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);
                        }

                        // Adiciona os HREF nos links 
                        hrefLinkBloco(elm);
                        setAttributesCellsBloco(elm);
                        $scope.addEventosElmsBloco(elm, elemento_bloco);
                        g$.vfyFuncaoDepois(idFuncao, isTela);
                    }
                    else {
                        elm.classList.add("play-none");
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(elm);
                        g$.vfyFuncaoDepois(idFuncao, isTela);
                    }
                });
            });
        }
    }

    // Adiciona os eventos nos elementos da tela
    $scope.addEventosElmsBloco = function (elm, elemento_bloco) {
        var queryEventsBlocos = "SELECT ef.*, e.menu_id FROM node.elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and e.menu_id = " +
            elm.dataset.menu_id + " AND nome='evento_bloco' and isnull(ef.depois) ORDER BY ef.ordem";

        $http.get(URL + "/get/" + queryEventsBlocos).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Eventos Bloco - Bloco", data)) return;;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao,
                    elementos = elemento_bloco.querySelectorAll("[data-id='" + v.elemento_id + "']");

                for (var i = 0; i < elementos.length; i++) {
                    elementos[i].addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                }
            });
        });
    }

    setAttributesCellsBloco = function (elm) {
        var blocos, labels, campo;
        $http.get(URL + "/").success(function () {
            blocos = $("#view [data-id='" + elm.dataset.id + "']")[0].parentElement.children;
            for (var i = 0; i < blocos.length; i++) {
                labels = blocos[i].querySelectorAll("label");
                for (var j = 0; j < labels.length; j++) {
                    if (labels[j].innerHTML && labels[j].innerHTML.indexOf("«cor=") > -1) {
                        labels[j].parentElement.parentElement.setAttribute("data-bloco_cor", labels[j].innerHTML.split("«")[1].split("=")[1]);
                        labels[j].innerHTML = labels[j].innerHTML.split("«")[2];
                    }
                }
            }
        });
    }

    hrefLinkBloco = function (elm) {
        var tabela, campo, query, blocos, elms;

        $http.get(URL + "/").success(function () {
            blocos = [].slice.call($("[data-id='" + elm.dataset.id + "']"));

            blocos.forEach(function (v) {
                elms = [].slice.call(v.querySelectorAll("#link, img, label"));
                elms.forEach(function (elm) {

                    if (elm.tagName == "LABEL") {
                        var valor = elm.innerHTML.replace(/&lt;/g, "<");
                        valor = valor.replace(/&gt;/g, ">");
                        valor = valor.replace(/<br>/g, "\n").replace(/<space>/g, " ");
                        elm.innerText = valor;
                    }
                    else {
                        elm.innerHTML = elm.innerHTML.replace(/\&lt;br \/&gt;/g, "<br>")

                        if (elm.dataset.link_tabela != "" && elm.dataset.link_campo != "") {
                            tabela = g$.filterTabela(elm.dataset.link_tabela, true);
                            campo = g$.filterCampo(elm.dataset.link_campo);

                            query = "SELECT " + campo + " FROM " + $rootScope.user.banco + "." + tabela + " WHERE id = " + v.querySelector("[data-nome='bloco_id']").innerHTML;
                            $http.get(URL + "/get/" + query).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Query Links - Bloco", data)) return;

                                data = data.data;

                                if (elm.id == "imagem") {
                                    elm.setAttribute("onclick", "g$.openLink('" + data[0][campo] + "')");
                                }
                                // Se for para abrir no Sistema
                                else if (elm.dataset.abrir_no_sistema == "1") {
                                    elm.setAttribute("onclick", "g$.openIframe('" + data[0][campo] + "')");
                                }
                                else elm.setAttribute("onclick", "g$.openLink('" + data[0][campo] + "')");
                            });
                        }
                    }
                });
            });
        });
    }

});
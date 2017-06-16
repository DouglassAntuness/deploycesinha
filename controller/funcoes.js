app.controller("funcoes", function ($scope, $http, $rootScope) {

    // Troca todos os sargentos que estão na string 
    g$.alterSargentos = function (params) {
        var texto = params.split("»"), campo, encode, inArray = "";
        for (var i = 0; i < texto.length; i++) {
            if (texto[i].indexOf("|") == -1 && texto[i].indexOf("¦") == -1 && !!parseInt(texto[i])) {
                campo = $("[data-id='" + texto[i] + "']")[0]
                if (texto[i].indexOf("_combo_desc") > -1) {
                    campo = $("[data-id='" + texto[i].split("_")[0].trim() + "']")[0]
                    texto[i] = (campo.querySelector("#selectbox").value == "") ? null : campo.querySelector("#selectbox").value;
                }
                else if (campo.id == "label") texto[i] = campo.innerHTML.trim();
                else if (campo.id == "selectbox") texto[i] = g$.getValueOption(campo.querySelector("#selectbox"));
                else if (campo.type == "checkbox") texto[i] = (campo.checked) ? 1 : 0;
                else if (campo.dataset.tipo == "file" && campo.children[1].files.length) {
                    texto[i] = "http:½½dysweb.dys.com.br½" + $rootScope.user.banco + "½" + campo.children[1].files[0].name;
                }
                else {
                    if (campo.dataset.tipo == "date" || campo.dataset.tipo == "date-time")
                        texto[i] = g$.formataDataBanco(campo.value);
                    else texto[i] = campo.value;
                }
            }
            else if (texto[i].indexOf("_array") > -1) {
                if (g$[texto[i].split("_")[0] + "_array"]) {
                    for (var j = 0; j < g$[texto[i].split("_")[0] + "_array"].length; j++) {
                        encode = (g$[texto[i].split("_")[0] + "_array"][j + 1]) ? "," : "";
                        inArray += g$[texto[i].split("_")[0] + "_array"][j]["e_" + texto[i].split("_")[2]] + encode;
                    }
                }
                texto[i] = inArray;
                inArray = "";
            }
            else if (texto[i].indexOf("_elemento") > -1) {
                campo = g$[texto[i].split("_")[0] + "_elemento"].querySelector("[data-id='" + texto[i].split("_")[2] + "']");
                if (campo.children[0]) {
                    // Se for check coloca 1 ou 0
                    if (campo.dataset.coluna_check == "1") inArray = (campo.children[0].checked) ? 1 : 0;
                    else inArray = campo.querySelector("#span").innerHTML;
                }
                // Se for Data
                else if (campo.dataset.cell_tipo == "date") {
                    inArray = campo.innerHTML.split("/").reverse().join("-");
                }
                else inArray = campo.innerHTML;
                texto[i] = inArray;
            }
            else if (texto[i] == "now") {
                var data = new Date();
                texto[i] = data.toLocaleDateString().split("/").reverse().join("-") + " " + data.toLocaleTimeString();
            }
            else if (texto[i] != "memo" && texto[i].indexOf("|") < 0 && texto[i].slice(0, 4) == "memo") texto[i] = g$[texto[i].trim()];
            else if (texto[i].indexOf("user.") > -1) texto[i] = $rootScope.user[texto[i].split(".")[1]];
            else if (texto[i].indexOf("g$.") > -1) texto[i] = (g$[texto[i].split(".")[1]] == "") ? "" : g$[texto[i].split(".")[1]];
        }
        return texto.join("").split("|");
    }

    // Função Alert
    g$.mensagem = function (params, isTela) {
        var params = g$.alterSargentos(params),
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        g$.alerta("Alerta", params[1]);

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    // Função guarda e limpa memo,
    // A funcao memo se fosse bloco nao podia ter depois, por causa do event.target(onde o usuario clicou), porque quando faz a requisicao depois, 
    // o evento passa a ser os metodos da requisacao
    // Entao tratamos na funcao que faz o depois, ele guarda o elemento que clicou e se tiver que executar o depois, passa o elm por parametro
    g$.memo = function (params, isTela, elm) {
        var params = g$.alterSargentos(params), obj,
            memo = params[1].trim(),
            valor = (params[2] && params[2] != "") ? params[2].trim() : "",
            cond = params[3],
            idFuncao = params[0].split("¦")[1],
            elm = (elm && elm.tagName) ? elm : event.target,
            elmBloco;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // Verifica 3 vezes o pai para achar o bloco pai e pegar o valor do objeto, se o valor for ID_BLOCO
        if (valor.indexOf("ID_BLOCO") > -1) {
            if (elm.parentElement.dataset.nome == "BLOCO") {
                elmBloco = elm.parentElement;
                obj = JSON.parse(elmBloco.dataset.obj);
            }
            else if (elm.parentElement.parentElement.dataset.nome == "BLOCO") {
                elmBloco = elm.parentElement.parentElement;
                obj = JSON.parse(elmBloco.dataset.obj);
            }
            else if (elm.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
                elmBloco = elm.parentElement.parentElement.parentElement;
                obj = JSON.parse(elmBloco.dataset.obj);
            }
            else if (elm.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
                elmBloco = elm.parentElement.parentElement.parentElement.parentElement;
                obj = JSON.parse(elmBloco.dataset.obj);
            }
            else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
                elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement;
                obj = JSON.parse(elmBloco.dataset.obj);
            }
            else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
                elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                obj = JSON.parse(elmBloco.dataset.obj);
            }

            // Depois que achou o elemento e o objeto
            if (valor.split("¦")[1] && valor.split("¦")[1].trim() != "") {
                valor = obj["e_" + valor.split("¦")[1].trim()];
            }
            else valor = obj["e_" + elmBloco.querySelector("[data-nome='bloco_id']").dataset.id];
        }

        g$[memo] = valor;

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.atualizarTabela = function (params, isTela) {
        var params = g$.alterSargentos(params), filtro = "",
            elm = $("table[data-id=" + params[1].trim() + "]")[0],
            nome_procedure = (params[2] && params[2].trim() != "") ? params[2].trim() : "",
            consultaID = elm.dataset.tabela_consulta_id,
            idFuncao = params[0].split("¦")[1],
            cond = params[4],
            queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        filtro = (params[3]) ? params[3].trim() : "";

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        delete g$[elm.dataset.nome + "ID"];
        delete g$[elm.dataset.nome + "_elemento"];
        delete g$[elm.dataset.nome + "_array"];

        $http.get(URL + "/get/" + queryConsultaFiltro).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - Tabela", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            g$._initTabela(elm, filtro, nome_procedure, idFuncao, isTela);
        });
    }

    g$.atualizarBloco = function (params, isTela) {
        var params = g$.alterSargentos(params), filtro_bloco = "", filtro = "",
            elm = $("#view [data-id=" + params[1].trim() + "]")[0],
            nome_procedure = (params[2] && params[2].trim() != "") ? params[2].trim() : "",
            consultaID = elm.children[0].dataset.consulta_id,
            idFuncao = params[0].split("¦")[1],
            cond = params[4], filtro,
            queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        delete g$[elm.dataset.nome + "ID"];

        filtro_bloco = (params[3]) ? params[3].trim() : "";

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        $http.get(URL + "/get/" + queryConsultaFiltro).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - Bloco", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            _initBloco(elm, filtro_bloco, filtro, nome_procedure, idFuncao, isTela);
        });
    }

    g$.loadzinTabela = function (params) {
        var tempInterval, queryLoadzin, elemento, tbl, tds, td,
            params = g$.alterSargentos(params),
            query = params[1],
            array = params[2].split(","),
            elementos = params[3].split("¦"),
            tempo = parseInt(params[4].trim()),
            cond = params[5],
            contInterval = tempo;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // Coloca Loadzin no elemento
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < elementos.length; j++) {
                elemento = $("#view [data-id='" + elementos[j].trim() + "']")[0];
                tbl = elemento.parentElement.parentElement.parentElement;
                td = $("#view [data-id='" + tbl.dataset.id + "'] tr[data-row-id='" + array[i].trim() + "'] td[data-id='" + elemento.dataset.id + "']")[0];

                td.classList.add("center-align");
                if (td.children[0]) {
                    if (td.children[0].getAttribute("data-cor")) td.setAttribute("data-cor", td.children[0].getAttribute("data-cor"));
                }
                td.innerHTML = "";

                td.append(angular.element($.template[0]["loadzin"])[0]);
            }

            // for (var j = 0; j < tds.length; j++) {
            //     tds[j].classList.add("center-align");
            //     if (tds[j].children[0]) {
            //         if (tds[j].children[0].getAttribute("data-cor")) tds[j].setAttribute("data-cor", tds[j].children[0].getAttribute("data-cor"));
            //     }
            //     tds[j].innerHTML = "";
            // }

            // // Adiciona em todas as TDS com as linhas selecionadas
            // tds.append(angular.element($.template[0]["loadzin"])[0]);
        }

        tempInterval = setInterval(function () {
            array.forEach(function (v, i) {
                if (v != "encontrado") {
                    queryLoadzin = query.trim() + array[i].trim();
                    $http.get(URL + "/get/" + queryLoadzin).success(function (data) {
                        data = data.data;

                        // Trata Excecao
                        if (g$.exceptionRequisicao("LoadzinTabela - Tela", data)) return;;

                        if (data.length) {
                            // Coloca Loadzin no elemento
                            for (var i = 0; i < elementos.length; i++) {
                                elemento = $("#view [data-id='" + elementos[i].trim() + "']")[0];
                                td = tbl.querySelector("tr[data-row-id='" + data[0].id + "'] td[data-id='" + elemento.dataset.id + "']");

                                // Verifica se tem o attribute cor 
                                if (data[0][Object.keys(data[0])[i + 1]].indexOf("cor") > -1) g$.setAttributeCell(td, data[0][Object.keys(data[0])[i + 1]]);
                                else td.innerHTML = data[0][Object.keys(data[0])[i + 1]];
                            }
                            array.splice(i, 1);
                            clearInterval(tempInterval);
                        }
                    });
                }
            });
            contInterval += tempo;
            if (contInterval >= 120000) {
                tbl = elemento.parentElement.parentElement.parentElement;
                tds = $("#view [data-id='" + tbl.dataset.id + "'] tr.active td[data-id='" + elemento.dataset.id + "'] .preloader-wrapper");
                tds.parent().text("");
                clearInterval(tempInterval);
            }
        }, tempo);

    }

    g$.loadzinTela = function (params, isTela) {
        var tempInterval, queryLoadzin, elemento, loadzin,
            params = g$.alterSargentos(params),
            query = params[1],
            idFuncao = params[0].split("¦")[1],
            elementos = params[2].split("¦"),
            tempo = parseInt(params[3].trim()),
            contInterval = tempo;

        // Coloca Loadzin no elemento
        for (var i = 0; i < elementos.length; i++) {
            elemento = $("#view [data-id='" + elementos[i].trim() + "']")[0];

            if (elemento.getAttribute("loadzin-tela") == "true") return;

            elemento.setAttribute("loadzin-tela", true);

            if (elemento.id == "selectbox") {
                elemento = elemento.querySelector("#selectbox");
            }

            elemento.value = "";
            elemento.disabled = true;
            elemento.style.width = "80%";

            // Se tiver label e nao estiver com display block, ele coloca
            if (elemento.parentElement.querySelector("label")) {
                if (elemento.parentElement.querySelector("label").style.display != "block") {
                    elemento.parentElement.querySelector("label").style.display = "block";
                    elemento.parentElement.setAttribute("setLabelBlock", true);
                }
            }

            loadzin = angular.element($.template[0]["loadzin"])[0];
            loadzin.classList.add("loadzin-input");
            elemento.parentElement.append(loadzin);

        }

        tempInterval = setInterval(function () {
            $http.get(URL + "/get/" + query.trim()).success(function (data) {

                data = data.data;

                // Trata Excecao
                if (g$.exceptionRequisicao("LoadzinTela - Tela", data)) return;

                if (data.length) {
                    // Coloca Loadzin no elemento
                    for (var j = 0; j < elementos.length; j++) {
                        elemento = $("#view [data-id='" + elementos[j].trim() + "']")[0];
                        if (elemento.parentElement.getAttribute("setLabelBlock") == "true") {
                            elemento.parentElement.querySelector("label").style = "";
                        }

                        elemento.removeAttribute("loadzin-tela");
                        elemento.parentElement.removeChild(elemento.parentElement.querySelector(".preloader-wrapper"));

                        if (elemento.dataset.bloqueado != "true") {
                            if (elemento.id == "selectbox") {
                                g$.getValorComboBanco(elemento, data[0][Object.keys(data[0])[j]]);
                                elemento.children[1].disabled = false;
                            }
                            else {
                                elemento.value = data[0][Object.keys(data[0])[j]];
                                elemento.disabled = false;
                            }
                        }
                        else {
                            elemento.value = data[0][Object.keys(data[0])[j]];
                        }
                        elemento.style.width = "100%";
                    }
                    clearInterval(tempInterval);
                    g$.vfyFuncaoDepois(idFuncao);
                }
            });

            contInterval += tempo;
            if (contInterval >= 120000) {
                for (var j = 0; j < elementos.length; j++) {
                    elemento = $("#view [data-id='" + elementos[j].trim() + "']")[0];
                    if (elemento.parentElement.getAttribute("setLabelBlock") == "true") {
                        elemento.parentElement.querySelector("label").style = "";
                    }
                    elemento.removeAttribute("loadzin-tela");
                    elemento.parentElement.removeChild(elemento.parentElement.querySelector(".preloader-wrapper"));

                    if (elemento.dataset.bloqueado != "true") {
                        elemento = (elemento.id == "selectbox") ? elemento.querySelector("#selectbox") : elemento;
                        elemento.disabled = false;
                    }
                    elemento.style.width = "100%";
                }
                clearInterval(tempInterval);
            }
        }, tempo);

    }

    g$.leTela = function (params, isTela) {
        var proc, params, filtro,
            params = g$.alterSargentos(params),
            view = params[1].trim(),
            consultaID = params[2].trim(),
            idFuncao = params[0].split("¦")[1],
            cond = params[4],
            queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        g$.limparDadosView("limparDadosView | " + view);

        filtro = (params[3]) ? params[3].trim() : "";

        $http.get(URL + "/get/" + queryConsultaFiltro).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - LeTela", data)) return;

            data.data.forEach(function (v) {
                if (v.id == consultaID) {
                    if (!v.filtro) return
                    var params = g$.alterSargentos(v.filtro);
                    if (filtro == "") filtro += params;
                    else filtro += " AND " + params;
                }
            });

            proc = 'node.le3("' + consultaID + '","' + $rootScope.user.banco + '", "' + filtro + '")';
            $http.get(URL + "/proc/" + proc).success(function (data) {

                if (g$.exceptionRequisicao("Proc le3 - LeTela", data)) return;

                var consulta = data.data[0][0].consulta;
                $http.get(URL + "/get/" + consulta).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Consulta - LeTela", data)) return;

                    data = data.data;

                    // Se nao trazer nada ele sai
                    if (!data || !data[0]) return g$.vfyFuncaoDepois(idFuncao, isTela);
                    else {
                        g$.controllerToview(data[0], $rootScope.user);
                        g$.vfyFuncaoDepois(idFuncao, isTela);
                    }
                });
            });
        });
    }

    g$.gravanaTabela = function (params) { }

    g$.salvarTela = function (params, isTela) {
        var params = g$.alterSargentos(params),
            view = params[1].trim(),
            limpar = (params[2] && params[2].trim() == "false") ? true : false,
            idTabela, obj = {}, elms, tabela,
            cond = params[3],
            idFuncao = params[0].split("¦")[1];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // Se ele passar view, vai pegar o Popup
        if (view == "view") view = $("#view")[0].children[0];
        else {
            if ($("#view [data-id = " + view + "]")[0].id == "tab") view = $("#view [data-id = " + view + "]")[1];
            else view = $("#view [data-id = " + view + "]")[0];
        }

        elms = view.querySelectorAll("input, select, textarea");

        if (elms[0].id == "selectbox") idTabela = elms[0].parentElement.dataset.grava_na_tabela;
        else idTabela = elms[0].dataset.grava_na_tabela;

        // elms = view.querySelectorAll("input[data-grava_na_tabela='" + idTabela + "'], select-box[data-selectbox_grava_na_tabela='" + idTabela + "']");

        tabela = g$.filterTabela(idTabela, true);

        for (var k = 0; k < elms.length; k++) {
            if (elms[k].id == "selectbox") {
                if (!elms[k].parentElement.dataset.grava_na_tabela || (elms[k].parentElement.dataset.grava_na_tabela == "null" || elms[k].parentElement.dataset.grava_na_tabela == "") ||
                    (elms[k].parentElement.dataset.grava_no_campo == "null" || elms[k].parentElement.dataset.grava_no_campo == "")) {
                    g$.exibeQuery("Elemento Tela", "O elemento " + elms[k].parentElement.dataset.id + " está sem o grava na tabela ou grava no campo!");
                    continue
                };
            }
            else {
                if (!elms[k].dataset.grava_na_tabela || (elms[k].dataset.grava_na_tabela == "null" || elms[k].dataset.grava_na_tabela == "") ||
                    (elms[k].dataset.grava_no_campo == "null" || elms[k].dataset.grava_no_campo == "")) {
                    g$.exibeQuery("Elemento Tela", "O elemento " + elms[k].dataset.id + " está sem o grava na tabela ou grava no campo!");
                    continue
                };
            }

            // Selectbox
            if (elms[k].id == "selectbox") {
                campo = g$.filterCampo(elms[k].parentElement.dataset.grava_no_campo);
                obj[campo] = (elms[k].value.trim() == "" || elms[k].value.trim() == "null") ? null : g$.getValueOption(elms[k], elms[k].value);
            }
            // Input
            else {
                campo = g$.filterCampo(elms[k].dataset.grava_no_campo);
                if (elms[k].dataset.tipo == "date") {
                    obj[campo] = (elms[k].value.trim() == "" || elms[k].value.trim() == "null") ? null : g$.formataDataBanco(elms[k].value);
                }
                else obj[campo] = (elms[k].type == "checkbox") ? elms[k].checked : (elms[k].value.trim() == "" || elms[k].value == "null") ? null : elms[k].value;
            }
        }

        if (!view.querySelector("[data-nome='txt_id']") || view.querySelector("[data-nome='txt_id']").value == "") {
            obj = g$.omitirPropriedade(obj);
            g$.insertUpdateTela(obj, tabela, true, view, limpar, idFuncao);
        }
        else {
            obj = g$.omitirPropriedade(obj);
            g$.insertUpdateTela(obj, tabela, false, view, limpar, idFuncao);
        }
    }

    g$.insertUpdateTela = function (obj, tabela, insert, view, limpar, idFuncao) {
        // Pega todos os objetos e faz uma requisicao com cada objeto a sua tabela 
        var banco;

        // var queryConsulta = "SELECT * FROM consulta WHERE tela_id = " + view.children[0].dataset.menu_id;

        // $http.get(URL + "/get/" + queryConsulta).success(function(data) {

        //     data = data.data;

        //     // Trata Excecao
        //     if (g$.exceptionRequisicao("Insert - SalvarTela", data)) return;;

        // Abre a Conexao com o banco do Usuario
        // banco = (!data[0].banco) ? $rootScope.user.banco : data[0].banco;

        banco = $rootScope.user.banco;

        if (insert) {
            // Insert 
            $http.post(URL + "/post/" + banco + "." + tabela + "/", obj)
                .then(function (data, status) {

                    data = data.data;

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Insert - SalvarTela", data)) return;

                    view.querySelector("[data-nome='txt_id']").value = data.data.insertId;
                    // Verifica se é pra limpar, se nao for para limpar, ele nao limpa
                    if (!limpar) g$.limparDadosView(false, view);
                    g$.alerta("Alerta", "Salvo com Sucesso");

                    // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
                    g$.vfyFuncaoDepois(idFuncao);
                });

        }
        else {
            // update 
            $http.put(URL + "/put/" + banco + "." + tabela + "/", obj)
                .then(function (data) {

                    data = data.data;

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Update - SalvarTela", data)) return;

                    g$.alerta("Alerta", "Salvo com Sucesso");

                    // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
                    g$.vfyFuncaoDepois(idFuncao);

                });
        }
        // });
    }

    g$.limparDadosView = function (params, view) {
        var view, elms;

        if (params) {
            var params = g$.alterSargentos(params),
                view = params[1].trim(),
                cond = params[2],
                idFuncao = params[0].split("¦")[1],
                valida = (!cond) ? true : g$.validaCondicao(cond);

            if (valida == false) {
                console.log("Não executou porque" + cond + " é falso");
                return g$.vfyFuncaoDepois(idFuncao);
            };

            // Se ele passar view, vai pegar o Popup
            if (view == "view") view = $("#view .card-content")[0];
            else {
                if ($("#view [data-id = " + view + "]")[0].id == "tab") view = $("#view [data-id = " + view + "]")[1];
                else view = $("#view [data-id = " + view + "]")[0];
            }
        }
        else view = view;

        if (!view) return;
        elms = view.querySelectorAll("input, select, textarea");

        for (var i = 0; i < elms.length; i++) {
            elm = elms[i];
            if (elm.type == "checkbox") elm.checked = false;
            else elm.value = "";
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao);

        return event.preventDefault();
    }

    g$.showHide = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elms = params[1].split("¦"), elm,
            idFuncao = params[0].split("¦")[1],
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        for (var i = 1; i < elms.length; i++) {
            elm = $("#view [data-id='" + elms[i].trim() + "']")[0];

            if (elm.id == "botao") {
                elm.classList.remove("play-block");
                elm.classList.add("play-none");
            }
            else {
                elm.classList.remove("dys-show");
                elm.classList.add("dys-hide");
            }
        }

        elm = $("#view [data-id='" + elms[0].trim() + "']")[0];
        elm.classList.toggle("dys-show");
        elm.classList.toggle("dys-hide");

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.alteraPropriedadeBloco = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elemento, elmBloco, lenBlocos, elmsBloco, params,
            id_elemento = params[1].trim(),
            propriedade = params[2].trim(),
            valor = (params[3] && params[3].trim() != "") ? params[3].trim() : params[3],
            filtro = (params[4] && params[4].trim() != "") ? "[data-" + params[4].trim() + "]" : "",
            cond = params[5],
            idFuncao = params[0].split("¦")[1];

        elemento = $("[data-id='" + id_elemento + "']")[0];

        elmBloco = g$.procuraBloco(elemento);
        elmsBloco = $("[data-id='" + elmBloco.dataset.id + "'] " + filtro);
        lenBlocos = elmsBloco.length;

        for (var i = 0; i < lenBlocos; i++) {
            elmBloco = g$.procuraBloco(elmsBloco[i]);
            elemento = elmBloco.querySelector("[data-id='" + id_elemento + "']");
            params = " || " + propriedade + " | " + valor + " | ";
            g$.alteraPropriedade(params, false, elemento);
        }

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    // Procura o bloco e retorna o elemento que quer alterar
    g$.procuraBloco = function (elm) {
        var elmBloco;
        if (elm.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement;
        }
        else if (elm.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        }
        return elmBloco;
    }

    g$.alteraPropriedade = function (params, isTela, elm) {
        var params = g$.alterSargentos(params),
            elemento = (elm && elm.tagName) ? elm : $("#view [data-id='" + params[1].trim() + "']")[0],
            propriedade = params[2].trim(),
            valor = (params[3] && params[3].trim() != "") ? params[3].trim() : params[3],
            cond = params[4],
            idFuncao = params[0].split("¦")[1];

        // if(elemento.indexOf("_bloco") > 1) g$.procuraElementoBloco(elemento);
        // else elemento = $("#view [data-id='" + elemento + "']")[0];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (propriedade == "fundo") elemento.style.background = valor;
        else if (propriedade == "valor") {
            if (elemento.id == "selectbox") g$.getValorComboBanco(elemento, valor);
            else if (elemento.tagName == "INPUT") elemento.value = valor;
            else if (elemento.tagName == "TEXTAREA") elemento.value = valor.replace(/\\n/g, "\n");
            else if (elemento.tagName == "LABEL") elemento.innerHTML = valor;
            else if (elemento.id == "botao") elemento.innerHTML = valor;
            else if (elemento.tagName == "IMG") elemento.src = "http://dysweb.dys.com.br/" + $rootScope.user.banco + "/" + valor;
        }
        else if (propriedade == "largura") {
            if (valor && valor != "") elemento.setAttribute("style", elemento.getAttribute("style") + " width: " + valor + "px !important;");
        }
        else if (propriedade == "tamanho") {
            if (valor && valor != "") elemento.setAttribute("style", elemento.getAttribute("style") + " height: " + valor + "px !important;");
        }
        else if (propriedade == "foco") {
            if (elemento.id == "selectbox") elemento.querySelector("#selectbox").focus();
            else if (elemento.tagName == "INPUT") elemento.focus();
            else elemento.focus();
        }
        else if (propriedade == "display") {
            if (valor.trim() == "") valor = "block";
            if (elemento.id == "selectbox") elemento.querySelector("#selectbox").style.display = valor;
            else if (elemento.tagName == "INPUT") elemento.style.display = valor;
            else if (elemento.tagName == "TD") {
                var tds = $("[data-id='" + params[1].trim() + "']"),
                    tabela = tds[0].parentElement.parentElement.parentElement,
                    th = tabela.querySelectorAll("th")[tds[0].cellIndex];
                if (valor == "none") {
                    tds.addClass("play-none");
                    th.classList.add("play-none");
                }
                else {
                    tds.removeClass("play-none");
                    th.classList.remove("play-none");
                }
            }
            else elemento.style.display = valor;
        }
        else if (propriedade == "disabled") {
            if (elemento.id == "selectbox") {
                if (valor == "true") elemento.querySelector("#selectbox").setAttribute("disabled", valor);
                else elemento.querySelector("#selectbox").removeAttribute("disabled");
            }
            else if (elemento.tagName == "INPUT") {
                if (valor == "true") elemento.setAttribute("disabled", valor);
                else elemento.removeAttribute("disabled");
            }
            else {
                if (valor == "true") elemento.setAttribute("disabled", valor);
                else elemento.removeAttribute("disabled");
            }
        }
        else if (propriedade == "removeClasse") {
            if (valor != "") {
                elemento.classList.remove(valor);
            }
        }
        else if (propriedade == "addClasse") {
            if (valor != "") {
                elemento.classList.add(valor);
            }
        }
        else if (propriedade == "toggleClasse") {
            if (valor != "") {
                elemento.classList.toggle(valor);
            }
        }

        // Verifica se tem função depois
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }


    g$.carregaQuery = function (params, isTela) {
        var banco = $rootScope.user.banco, campo,
            params = g$.alterSargentos(params),
            query = params[1],
            elms = params[2],
            cond = params[3],
            msg = params[4],
            idFuncao = params[0].split("¦")[1];
        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        var obj = { query: query.trim() };
        $http.post(URL + "/jsonQuery/", obj).success(function (data) {

            // Trata Excecao
            g$.exceptionRequisicao("CarregaQuery - Tela", data);

            data = data.data;

            if (!data) return;

            if (data[0]) data[0] = (data[0][0]) ? data[0][0] : data[0];

            // Tratamento de mensagem
            // Verifica se deu erro        
            g$.mensagemCarregaQuery(data, msg);

            // Só vai entrar se for insert
            if (data && data.insertId) {
                // Se o elemento tiver memo e o insertID, guarda no memo que esta passando
                if (elms && elms.indexOf("insertID") > -1) {
                    if (elms.indexOf("memo") > -1) g$[elms.split("_")[0].trim()] = data.insertId;
                    else {
                        campo = $("#view [data-id=" + elms.split("_")[0].trim() + "]")[0];
                        if (campo.id == "selectbox") {
                            g$.getValorComboBanco(campo, data.insertId);
                        }
                        else if (campo.id == "label") campo.innerHTML = data.insertId;
                        else campo.value = data.insertId;
                    }
                }
            }

            // Só vai entrar se trazer alguma coisa na consulta
            if (data[0]) {
                // Se passar os elementos é porque tem um retorno
                if (elms && elms.trim() != "") {
                    elms = elms.split("¦");
                    for (var i = 0; i < elms.length; i++) {
                        // Se o elemento for memo, é para guardar
                        if (elms && elms[i].trim().indexOf("memo") > -1) {
                            g$[elms[i].trim()] = data[0][Object.keys(data[0])[i]];
                        }
                        // Senao mostra o valor no elemento
                        else {
                            campo = $("#view [data-id=" + elms[i].trim() + "]")[0];
                            if (campo.id == "selectbox") {
                                g$.getValorComboBanco(campo, data[0][Object.keys(data[0])[i]]);
                            }
                            else if (campo.id == "label") {
                                var valor = data[0][Object.keys(data[0])[i]];
                                campo.innerHTML = valor;
                            }
                            else {
                                if (campo.dataset.tipo == "date-time" && data[0][Object.keys(data[0])[i]] && (data[0][Object.keys(data[0])[i]] != ""))
                                    campo.value = g$.formataDateTime(data[0][Object.keys(data[0])[i]]);
                                else if (campo.dataset.tipo == "date" && data[0][Object.keys(data[0])[i]] && (data[0][Object.keys(data[0])[i]] != ""))
                                    campo.value = g$.formataData(data[0][Object.keys(data[0])[i]]);
                                else campo.value = data[0][Object.keys(data[0])[i]];
                            }
                        }
                    }
                }
            }

            // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
            g$.vfyFuncaoDepois(idFuncao, isTela);
        });

    }

    // Tratamento de mensagem
    // Verifica se deu erro
    g$.mensagemCarregaQuery = function (data, msg) {
        if (msg && msg.split("¦")[0].trim() == "alert") {
            // se tiver um subparametro na mensagem
            if (msg.split("¦")[1]) g$.alerta("Alerta", msg.split("¦")[1].trim());
            else if (msg.split("¦")[2]) g$.alerta("Erro!", msg.split("¦")[1].trim());
            // se nao executa a mensagem da procedure 
            else g$.alerta("Alerta", data[0][Object.keys(data[0])[0]]);
        }
        else if (msg && msg.split("¦")[0].trim() == "toast") {
            // se tiver um subparametro na mensagem
            if (msg.split("¦")[1]) Materialize.toast(msg.split("¦")[1].trim(), 4000, 'grey darken-3');
            else if (msg.split("¦")[2]) Materialize.toast(msg.split("¦")[1].trim(), 4000, 'grey darken-3');
            // se nao executa a mensagem da procedure 
            else Materialize.toast(data[0][Object.keys(data[0])[0]], 4000, 'grey darken-3');
        }
    }

    g$.buscaCEP = function (params) {
        var params = g$.alterSargentos(params),
            valor = params[1].trim(),
            elms = params[2].split("¦");

        $http.get("https://viacep.com.br/ws/" + valor + "/json/unicode/").success(function (data) {
            if (data.status == 0) return g$.alerta("Erro!", "CEP não encontrado!");
            if (elms) {
                for (var i = 0; i < elms.length; i++) {
                    if (elms && elms[i].trim().indexOf("memo") > -1) {
                        g$[elms[i].trim()] = data[0][Object.keys(data[0])[i]];
                    }
                    else {
                        campo = $("#view [data-id=" + elms[i].trim() + "]")[0];
                        if (campo) {
                            if (campo.id == "selectbox") g$.getValorComboBanco(campo, data[Object.keys(data)[i]]);
                            else campo.value = data[Object.keys(data)[i]];
                        }
                    }
                }
            }
        });
    }

    g$.openFile = function (params) {
        var params = g$.alterSargentos(params);
        window.open(params[1], "_blank");
    }

    g$.geraBarcode = function (params) {
        var params = g$.alterSargentos(params),
            queryProduto = "SELECT * FROM produto where id = " + params[1],
            etiquetaID = params[2];

        $http.get(URL + "/get/" + queryProduto).success(function (data) {

            data = data.data;

            // Trata Excecao
            if (g$.exceptionRequisicao("Gerar BarCode - QueryProduto", data)) return;

            var vlr = "R$:" + data[0].valor,
                newid = "barcode" + 1

            if ($(newid)[0]) $("#view")[0].children[1].querySelector("[data-id='" + params[3].trim() + "']").innerHTML = "";
            if (!$("#mainBar")[0]) {
                tmp = '<div id="mainBar" style="width:750px;"><div class="divBar" style="display:inline-block;border:solid;text-align:center;">' +
                    '<b class= "txt" style="font: 20px monospace;color:black;"><p>' + data[0].produto + '</p><p>' + vlr + '</p><p>' + data[0].sku + '</p></b><svg class="barcode" id="' + newid + '">' +
                    '</svg></div></div>'
                $("#view")[0].children[1].querySelector("[data-id='" + params[3].trim() + "']").innerHTML = tmp;
            }
            else {
                tmp = '<div class="divBar" style="display:inline-block;border:solid;text-align:center;"><b class="txt" style="font: 20px monospace;color:black;"><p>' + data[0].produto + '</p><p>' + vlr + '</p></b><svg class="barcode" id="' + newid + '"></svg></div>'
                $("#mainBar")[0].innerHTML = tmp + $("#mainBar")[0].innerHTML;
            }
            g$.estiloBarCode(data[0], "#" + newid);
        });
    }

    g$.estiloBarCode = function (obj, id, etiquetaID) {
        var query = "SELECT * FROM etiqueta_config WHERE id = " + etiquetaID;
        obj.cod_alt = (!obj.cod_alt || obj.cod_alt > 0) ? obj.cod_alt : 50;
        obj.cod_larg = (!obj.cod_larg || obj.cod_larg > 0) ? obj.cod_larg : 2;
        JsBarcode(id, obj.ean, {
            width: obj.cod_larg,
            height: obj.cod_alt
        });
        $http.get(URL + "/get/" + $rootScope.user.banco + "/" + query).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("estiloBarCode - Tela", data)) return;;

            obj = data.data[0];
            $('.divBar').css('margin', (obj) ? obj.mg : "10" + "px");
            $('.divBar').css('margin-top', obj.mgtp + "px");
            $('.divBar').css('margin-bottom', obj.mgbt + "px");
            $('.divBar').css('margin-left', obj.mglf + "px");
            $('.divBar').css('margin-right', obj.mgrt + "px");
            $('.divBar').css('padding', obj.pd + "px");
            $('.divBar').css('padding-top', obj.pdtp + "px");
            $('.divBar').css('padding-bottom', obj.pdbt + "px");
            $('.divBar').css('padding-left', obj.pdlf + "px");
            $('.divBar').css('padding-right', obj.pdrt + "px");
            $('.divBar').css('border-width', obj.largura_borda + "px");
            $('.divBar').css('border-radius', obj.borda_radius + "px");
            $('.divBar').css('height', obj.altura_etiqueta + "px");
            $('.divBar').css('width', obj.largura_etiqueta + "px");
            $('.txt').css('font-size', obj.font + "px");
        });
    }

    g$.imprime = function (params) {
        var elemento = params.split("|")[1].trim(),
            conteudo = $("#view [data-id='" + elemento + "']")[0].innerHTML;
        tela_impressao = window.open('about:blank');
        tela_impressao.document.write(conteudo);
        tela_impressao.window.print();
    }

    g$.onClick = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elm = $("#view [data-id=" + params[1].trim() + "]")[0],
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (elm.id == "tab") {
            elm.click();
            elm.children[0].click();
            $('ul.tabs').tabs('select_tab', elm.children[0].href.split("#")[1]);
        }
        else {
            elementoClick(elm.dataset.id);
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.leColunas = function (params) {
        var params = params.split("|"),
            j = [].slice.call($('[data-id="' + params[1].trim() + '"]')),
            n = 0,
            destino = $("[data-id=" + params[2].trim() + "]")[0];

        j.forEach(function (v, i) {
            if (v.textContent > 0) n += parseInt(v.textContent);
        })
        destino.value = (params[3].trim() == "soma") ? n : (params[3].trim() == "count") ? j.length - 1 : (n / (j.length - 1)).toFixed(2);
    }

    g$.contas = function (params) {
        var params = g$.alterSargentos(params),
            elm = $("[data-id=" + params[1].trim() + "]")[0],
            l = params[2].split("¦"),
            result = 0,
            cond = params[4],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = (params[0].split("¦")[1]) ? params[0].split("¦")[1].trim() : undefined;

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        l.forEach(function (v, i) {
            if (v.trim() && v.trim() != "-") {
                result = (params[3].trim() == "soma") ? result + parseInt(v) : (params[3].trim() == "subtracao") ? v - result : (params[3].trim() == "divisao") ? (result / v).toFixed(2) : (result * v).toFixed(2);
            }
        })
        elm.value = result;
    }

    // Função Adicionar tecla de Atalho na tela
    g$.teclaDeAtalho = function (params) {
        var params = g$.alterSargentos(params),
            elemento_id = params[1].trim(),
            atalho = params[2].trim();

        g$.addAtalhoTela(elemento_id, atalho);
    }

    g$.addAtalhoTela = function (elemento_id, atalho) {
        if ((atalho == "ctrl + l") && (event.ctrlKey && event.keyCode == 76)) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
        else if ((atalho == "ctrl + s") && (event.ctrlKey && event.keyCode == 83)) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
        else if ((atalho == "ENTER") && (event.keyCode == 13)) {
            elementoClick(elemento_id);
        }
    }

    function elementoClick(elemento_id) {
        var query = "SELECT e.nome, ef.*, e.menu_id FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and ef.elemento_id =  "
            + elemento_id + " and isnull(ef.depois) ORDER BY ef.ordem;"
        $http.get(URL + "/get/" + query).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Elementos Click", data)) return;;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao;
                g$[funcao.trim()](params);
            });
        })
    }

    g$.validaCondicao = function (condicao) {
        var condicao = condicao.split("¦");
        for (var i = 0; i < condicao.length; i++) {
            if (condicao[i].indexOf("=") > -1) { var resultado = condicao[i].split("="); if (resultado[0].trim() != resultado[1].trim()) { return condicao = false } }
            else if (condicao[i].indexOf("<>") > -1) { var resultado = condicao[i].split("<>"); if (resultado[0].trim() == resultado[1].trim()) { return condicao = false } }
            else if (condicao[i].indexOf("><") > -1) { var resultado = condicao[i].split("><"); if (resultado[0].trim().indexOf(resultado[1].trim()) == -1) { return condicao = false } }
            else if (condicao[i].indexOf(">") > -1) { var resultado = condicao[i].split(">"); if (resultado[0].trim() <= resultado[1].trim()) { return condicao = false } }
            else if (condicao[i].indexOf("<") > -1) { var resultado = condicao[i].split("<"); if (resultado[0].trim() >= resultado[1].trim()) { return condicao = false } }
            else if (condicao[i].indexOf(">=") > -1) { var resultado = condicao[i].split(">="); if (resultado[0].trim() < resultado[1].trim()) { return condicao = false } }
            else if (condicao[i].indexOf("<=") > -1) { var resultado = condicao[i].split("<="); if (resultado[0].trim() > resultado[1].trim()) { return condicao = false } }
        }
        return condicao = true;
    }

    g$.limparElementos = function (params, isTela) {
        var elms = params.split("|")[1].split("¦"), elm,
            idFuncao = params.split("|")[0].split("¦")[1];
        for (var i = 0; i < elms.length; i++) {
            elm = $("[data-id=" + elms[i].trim() + "]")[0];
            if (elm.id == "selectbox") elm.querySelector("#selectbox").value = "";
            else if (elm.dataset.tipo == "checkbox") elm.checked = false;
            else if (elm.id == "input") elm.value = "";
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.openModal = function (params) {
        var params = g$.alterSargentos(params),
            nome = params[1].trim(),
            id = params[2].trim(),
            tela = params[3].trim(),
            cond = (params[4] && params[4].trim() != "") ? params[4].trim() : "",
            msg = (params[5] && params[5].trim() != "") ? params[5].trim() : undefined;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            if (msg) g$.alerta("Erro", msg);
            return
        }

        $("#" + id).modal("open");
        if (g$[tela + "_load"]) g$[tela + "_load"]();
    }

    g$.graficoDoughnut = function (params, isTela) {
        var params = params, legend, elm, legend,
            idFuncao = params.split("|")[0].split("¦")[1];

        params = g$.alterSargentos(params)
        elm = $("#view [data-id='" + params[1].trim() + "']")[0];
        legend = (params[5] && params[5].trim() == "true") ? true : false;

        if (elm.dataset.grafico_ativo == "true") {
            $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = elm.dataset.template;
            legend = angular.element("<div id='legend-" + elm.dataset.id + "' class='chart-legend'></div>")[0];
            if (legend) {
                $("#view [data-id='" + elm.dataset.pai + "']")[0].append(legend);
                elm = $("#view [data-id='" + elm.dataset.pai + "']")[0].children[0];
            }
            elm.dataset.template = elm.outerHTML;
        }

        elm.id += elm.dataset.id;

        elm.dataset.grafico_ativo = true;

        var porcentagem = [], cor = [], labels = [], count, data = [];

        count = params[2].split("¦").length;

        for (var i = 0; i < count; i++) {
            data[i] = {
                value: parseInt(params[2].split("¦")[i]), color: $.graficoColors[params[3].split("¦")[i].trim()],
                label: params[4].split("¦")[i].trim() + ": " + parseInt(params[2].split("¦")[i])
            };
        }

        var options = {
            segmentShowStroke: false,
            animateRotate: true,
            animateScale: false,
            percentageInnerCutout: 50,
            tooltipTemplate: "<%= value %>%"
        }

        var ctx = $("#view #" + elm.id)[0].getContext("2d");
        var myChart = new Chart(ctx).Doughnut(data, options);
        if (legend) {
            $('#legend-' + elm.dataset.id)[0].innerHTML = myChart.generateLegend();
        }

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.graficoTorre = function (params, isTela) {
        var params = params, legend, elm,
            idFuncao = params.split("|")[0].split("¦")[1];

        params = g$.alterSargentos(params)
        elm = $("#view [data-id='" + params[1].trim() + "']")[0];

        elm.id += elm.dataset.id;

        elm.dataset.grafico_ativo = true;

        var porcentagem = [], cor = [], labels = [], count, data = [];

        count = params[2].split("¦").length;

        for (var i = 0; i < count; i++) {
            data[i] = {
                value: parseInt(params[2].split("¦")[i]), color: $.graficoColors[params[3].split("¦")[i].trim()],
                label: params[4].split("¦")[i].trim() + ": " + parseInt(params[2].split("¦")[i])
            };
        }

        var areaChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Digital Goods",
                    fillColor: "rgba(60,141,188,0.9)",
                    strokeColor: "rgba(60,141,188,0.8)",
                    pointColor: "#3b8bba",
                    pointStrokeColor: "rgba(60,141,188,1)",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(60,141,188,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var barChartCanvas = $("#barChart").get(0).getContext("2d");
        var barChart = new Chart(barChartCanvas);
        var barChartData = areaChartData;
        barChartData.datasets[1].fillColor = "#00a65a";
        barChartData.datasets[1].strokeColor = "#00a65a";
        barChartData.datasets[1].pointColor = "#00a65a";
        var barChartOptions = {};

        barChartOptions.datasetFill = false;
        barChart.Bar(barChartData, barChartOptions);

        elm.style.width = (elm.dataset.largura && elm.dataset.largura != "") ? elm.dataset.largura + "px" : "200px";
        elm.style.height = (elm.dataset.tamanho && elm.dataset.tamanho != "") ? elm.dataset.tamanho + "px" : "200px";

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.uploadFile = function () {
        var formData = new FormData();
        var arquivo = event.target.files[0];
        formData.append("file", arquivo);
        var xhr = new XMLHttpRequest();

        var params = JSON.stringify({ banco: $rootScope.user.banco });

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { }
        }
        xhr.open("POST", "http://138.197.32.22/lexus/apiDys?banco=" + $rootScope.user.banco);
        xhr.send(formData);
    }

    g$.geraRastreio = function (params) {
        var params = g$.alterSargentos(params),
            id = params[1],
            campo = params[2],
            emb = params[3],
            cod = params[4],
            peso = params[5].trim();

        if ($("#view [data-id=" + campo + "]")[0].value) {
            return g$.alerta("Alerta", "Rastreio já Gerado!");
        }
        var query = "select * from " + $rootScope.user.banco + ".pedido where id= " + id.trim()
        $http.get(URL + "/get/" + query).success(function (response) {
            var query = "select * from " + $rootScope.user.banco + ".embalagens emb left join " + $rootScope.user.banco + ".pacote pct on pct.id = emb.id where emb.id=" + emb
            $http.get("/get/" + query).then(function (data) {
                data = data.data;
                var query = "SELECT p.id,p.integracao_pedido,p.rastreamento,p.dest_xNome,p.dest_xLgr,p.dest_nro, " +
                    "p.dest_xCpl,p.dest_xBairro,p.dest_CEP,p.dest_xMun,p.dest_UF,e.imagemLogo, " +
                    "e.razao,e.endereco,e.numero,e.complemento,e.bairro,e.cep,e.uf,e.cidade,e.apelidoCorreios, " +
                    "p.transp_servico_de_postagem,p.transp_Nome,em.altura,em.comprimento,em.largura, " +
                    "em.descricao as emb_descricao,pac.pacote,pac.pacote_numero " +
                    "FROM " + $rootScope.user.banco + ".pedido p " +
                    "LEFT JOIN " + $rootScope.user.banco + ".empresa e ON p.empresa_id = e.id " +
                    "LEFT JOIN " + $rootScope.user.banco + ".embalagens em ON p.embalagem_id = em.id " +
                    "LEFT JOIN " + $rootScope.user.banco + ".pacote pac ON em.pacote_id = pac.id " +
                    "WHERE p.id = " + id;
                $http.get("/get/" + query).then(function (data) {
                    var data = data.data
                    if (!data.data[0].dest_xNome) return g$.alerta("Erro!", "Nome do Destinatário não informado!");
                    if (!data.data[0].dest_xLgr) return g$.alerta("Erro!", "Endereço de Destino não informado!");
                    if (!data.data[0].dest_nro) return g$.alerta("Erro!", "Número de destino não informado!");
                    if (!data.data[0].dest_xBairro) return g$.alerta("Erro!", "Bairro de Destino não informado!");
                    if (!data.data[0].dest_CEP) return g$.alerta("Erro!", "CEP de Destino não informado!");
                    if (!data.data[0].dest_xMun) return g$.alerta("Erro!", "Município de Destino não informado!");
                    if (!data.data[0].dest_UF) return g$.alerta("Erro!", "UF de Destino não informado!");
                    if (!data.data[0].imagemLogo) return g$.alerta("Erro!", "Logo de Etiqueta não informado!");
                    if (!data.data[0].razao) return g$.alerta("Erro!", "Razão não informado!");
                    if (!data.data[0].endereco) return g$.alerta("Erro!", "Endereço do Remetente não informado!");
                    if (!data.data[0].numero) return g$.alerta("Erro!", "Número do Remetente não informado!");
                    if (!data.data[0].complemento) return g$.alerta("Erro!", "Complemento do Remetente não informado!");
                    if (!data.data[0].bairro) return g$.alerta("Erro!", "Bairro do Remetente não informado!");
                    if (!data.data[0].cep) return g$.alerta("Erro!", "CEP do Remetente não informado!");
                    if (!data.data[0].uf) return g$.alerta("Erro!", "UF do Remetente não informado!");
                    if (!data.data[0].cidade) return g$.alerta("Erro!", "Cidade do Remetente não informado!");
                    if (!data.data[0].apelidoCorreios) return g$.alerta("Erro!", "Apelido da Etiqueta não informado!");
                    if (!data.data[0].transp_servico_de_postagem) return g$.alerta("Erro!", "Serviço de Postagem não informado!");
                    if (!data.data[0].transp_Nome) return g$.alerta("Erro!", "Nome do Serviçode Postagem não informado!");
                    if (!data.data[0].altura) return g$.alerta("Erro!", "Altura não informada!");
                    if (!data.data[0].comprimento) return g$.alerta("Erro!", "Comprimento não informado!");
                    if (!data.data[0].largura) return g$.alerta("Erro!", "Largura não informado!");
                    if (!data.data[0].emb_descricao) return g$.alerta("Erro!", "Descrição da Embalagem não informada!");
                    if (!data.data[0].pacote) return g$.alerta("Erro!", "Pacote não informado!");
                    if (!data.data[0].pacote_numero) return g$.alerta("Erro!", "Número do Pacote não informado!");
                    var urls = "http://138.197.32.22/correios/gera_etiqueta.php?idPedido=" + id.trim() + "&banco=" + $rootScope.user.banco + "&peso=" + peso;
                    $http.get(urls).success(function (response) {
                        if (response) {
                            $("[data-id=" + campo + "]")[0].value = response.replace(/"/g, "");
                            tela_impressao = window.open('about:blank');
                            tela_impressao.window.location.href = "http://dysweb.dys.com.br/" + $rootScope.user.banco + "/" + response.replace(/"/g, "") + ".pdf"
                        }
                    })
                })
            })
        })
    }

    g$.sendEmail = function (params, isTela) {
        var anexo = params.split("|")[5], campo, vlanexo,
            params = g$.alterSargentos(params),
            idFuncao = params[0].split("¦")[1],
            emailDe = params[1].split("¦")[0],
            nomeDe = (params[1].split("¦")[1] && params[1].split("¦")[1].trim() != "") ? params[1].split("¦")[1] : null,
            emailPara = params[2].split("¦")[0],
            nomePara = (params[2].split("¦")[1] && params[2].split("¦")[1].trim() != "") ? params[2].split("¦")[1] : null,
            quantEmails = params[2].split(",").length,
            titulo = params[3],
            corpo = params[4],
            cond = params[6],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) { console.log("Não executou porque " + cond + " é falso"); return; };

        for (var i = 0; i < quantEmails; i++) {
            var anexos = "", obj;
            for (var j = 0; j < anexo.split("¦").length; j++) {
                campo = $("[data-id='" + anexo.split("¦")[j].split("»")[1] + "']")[0];
                if (campo.children[1].files.length) {
                    anexos += $rootScope.user.banco + "/" + campo.children[1].files[0].name + ((j + 1) ? "," : "");
                }
            }
            if (anexos) anexos = anexos.slice(0, anexos.length - 1);
            obj = {
                "emailDe": emailDe.trim(),
                "nomeDe": nomeDe,
                "emailPara": emailPara.split(",")[i].trim(),
                "nomePara": nomePara,
                "titulo": titulo,
                "corpo": corpo,
                "anexo": anexos
            }

            $http.post(URL + "/sendEmail/", obj).success(function (data) {
                if (data == "OK") g$.alerta("Alerta", "Enviado com Sucesso");
            });
        }
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.sendMailPesquisa = function (params) {
        var params = g$.alterSargentos(params),
            elementos = params[1].split(","),
            pesquisa = params[2];
        elementos.forEach(function (v, i) {
            var query = "select * from " + $rootScope.user.banco + ".auto_usuarios where aus_codigo=" + v;
            $http.get("/get/" + query).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("SendEmailPesquisa", data)) return;

                data = data.data;

                $http.get("/sendMailPesquisa/" + data[0].aus_email + "/" + pesquisa.trim() + "/" + data[0].aus_codigo).then(function (data) {
                    g$.alerta("Alerta", 'Pesquisa Enviada!', 4000, 'green darken-1');
                });
            });
        });
    }

    g$.vfyFuncaoDepois = function (idFuncao, isTela, name) {
        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        var name = (!name) ? "ef.depois" : name,
            elm = event.target;
        if (idFuncao) {
            if (isTela)
                queryFuncoesDepois = "SELECT * FROM tela_funcao ef WHERE " + name + " = '" + idFuncao.trim() + "' ORDER BY ef.ordem;";
            else
                queryFuncoesDepois = "SELECT * FROM elemento_funcao ef WHERE " + name + " = '" + idFuncao.trim() + "' ORDER BY ef.ordem;";
            $http.get(URL + "/get/" + queryFuncoesDepois).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("VfyDepois", data)) return;

                var funcao = data.data[0].funcao.split("|")[0].split("¦")[0].trim(),
                    params = data.data[0].funcao,
                    isTela = (data.data[0].evento == "load" || (data.data[0].evento == "close")) ? true : false;
                if (funcao == "memo") g$[funcao.trim()](params, isTela, elm);
                else g$[funcao.trim()](params, isTela);
            });
        }
    }

    g$.download = function (params) {
        // Se ele for um array, TABELA
        if (params.split("|")[1] && params.split("|")[1].indexOf("array") > -1) {
            var params = g$.alterSargentos(params);
            for (var i = 0; i < params[1].split(",").length; i++) {
                var link = document.createElement("a");
                link.download = params[1].split(",")[i];
                link.href = params[1].split(",")[i];
                link.click();
            }
        }
        // se for um so, TELA
        else {
            var params = g$.alterSargentos(params);
            var link = document.createElement("a");
            link.download = params[1];
            link.href = params[1];
            link.click();
        }
    }

    g$.sizePasta = function (params) {
        $http.get("/trazDisco/" + $rootScope.user.banco).success(function (response) {
            var pst = parseFloat(response.pasta / 1024);
            $("[data-id=" + params.split("|")[1] + "]")[0].textContent = response.bc + " MB";
            $("[data-id=" + params.split("|")[2] + "]")[0].textContent = pst.toFixed(2) + " MB";
        });
    }

    g$.geraPLP = function (params) {
        var params = g$.alterSargentos(params);
        empresa = params[1];
        var urls = "http://138.197.32.22/correios/gerar_plp_lote.php?banco=" + $rootScope.user.banco;
        $http.get(urls).success(function (response) {
            if (response) {
                var query = "update " + $rootScope.user.banco + ".plp set empresa_id = " + empresa + " where id =" + response.message.id;
                $http.get("/get/" + query).then(function (data) {
                    tela_impressao = window.open('about:blank');
                    tela_impressao.window.location.href = "http://dysweb.dys.com.br/temp/plp/plp.html#plp=" + response.message.id + "&banco=" + $rootScope.user.banco + "&empresa=" + empresa.trim();
                })
            }
        })
    }

    g$.statusCorreio = function (params) {
        var params = g$.alterSargentos(params),
            urls = "http://138.197.32.22/correios/status_cliente.php?numeroContratoCorreios=" + params[1] +
                "&cartaoPostagem=" + params[2] + "&usuarioCorreios=" + params[3] + "&senhaCorreios=" + params[4] +
                "&banco=" + $rootScope.user.banco + "&idEmpresa=" + params[5];
        $http.get(urls).success(function (response) {
            if (response.status = "error") {
                g$.alerta("Erro!", response.message, 4000, 'red darken-1');
            } else {
                g$.alerta("Erro!", response.message, 4000, 'green darken-1');
            }
        })
    }

    g$.initGoogleMaps = function (params) {
        var params = g$.alterSargentos(params),
            elemento = $("[data-id='" + params[1].trim() + "']")[0],
            address = params[2],
            texto = params[3],
            options;

        directionsService = new google.maps.DirectionsService();
        info = new google.maps.InfoWindow({ maxWidth: 200 });

        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();

                marker = new google.maps.Marker({
                    title: 'DYS',
                    icon: '../img/marker.png',
                    position: new google.maps.LatLng(lat, lng)
                });

                options = {
                    zoom: 15,
                    center: marker.position,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(elemento, options);

                marker.setMap(map);

                info.setContent(texto);
                info.open(map, marker);

                google.maps.event.addListener(marker, 'click', function () {
                    info.setContent(texto);
                    info.open(map, marker);
                });
            } else {
                g$.alerta("Erro!", "Não foi possivel obter localização: " + status);
            }
        });
    }

    g$.initRotaMaps = function (params) {
        var params = g$.alterSargentos(params),
            endereco = params[1];

        info.close();
        marker.setMap(null);

        var directionsDisplay = new google.maps.DirectionsRenderer();

        var request = {
            origin: endereco,
            destination: marker.position,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            }
        });

        return false;
    }

    g$.confirm = function (params) {
        var params = g$.alterSargentos(params),
            msg = params[1],
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = (params[0].split("¦")[1]) ? params[0].split("¦")[1].trim() : undefined,
            primeiroParametro = (params[0].split("¦")[2]) ? params[0].split("¦")[2].trim() : undefined,
            segundoParametro = (params[0].split("¦")[3]) ? params[0].split("¦")[3].trim() : undefined;

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, null);
        };

        alertjs.show({
            type: 'confirm',
            title: 'Confirm',
            text: msg,
            from: 'left', //slide from left		
            complete: function (val) {
                if (val) {
                    g$.vfyFuncaoDepois(primeiroParametro, null, "id");
                } else {
                    g$.vfyFuncaoDepois(segundoParametro, null, "id");
                }
            }
        });
    }

    g$.popCloseLogo = function () {

        var tabelas = $("#view #tabela"),
            prop;
        for (var i = 0; i < tabelas.length; i++) {
            prop = tabelas[i].dataset.nome + "ID";
            delete g$[prop];
        }

        if ($("#view .popup")) {
            for (var i = 0; i < $("#view .popup").length; i++) {
                $("#view")[0].removeChild($("#view .popup")[i]);
            }
        }

        if ($("#view .tela-modal")) {
            for (var i = 0; i < $("#view .tela-modal").length; i++) {
                $("#view")[0].removeChild($("#view .tela-modal")[i]);
            }
        }

        $("#container-menu")[0].style.display = "block";

        if (!$("#menutelas")[0].classList.contains("menu-ativo")) {
            document.body.classList.remove("sidebar-collapse");
            controlWidthView(this, $('#menutelas')[0]);
        }

    }

    g$.popClose = function () {

        var tabelas = $("#view #tabela"),
            prop;
        for (var i = 0; i < tabelas.length; i++) {
            prop = tabelas[i].dataset.nome + "ID";
            delete g$[prop];
        }

        if ($("#view .popup")[0]) window.location.href = "http://localhost:8000/inicial.html?#/";
        $("#container-menu")[0].style.display = "block";

        if (!$("#menutelas")[0].classList.contains("menu-ativo")) {
            document.body.classList.remove("sidebar-collapse");
            controlWidthView(this, $('#menutelas')[0]);
        }

    }

    g$.closeModal = function (params) {
        var id;
        if (params) {
            if (params.indexOf("|") > 0) id = params.split("|")[1].trim();
            else return $('#' + params).modal("close");
            $("#view")[0].removeChild($('#' + id)[0]);
        }
        else {
            $("#" + event.target.id).modal("close")
        }
    }

    g$.closeModalView = function (id) {
        var query = "SELECT * FROM tela_funcao ef WHERE evento='close' and tela_id='" + $("#view #" + id + " .popup")[0].id + "' and isnull(ef.depois) ORDER BY ordem";

        $http.get(URL + "/get/" + query).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Close Modal", data)) return;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao;
                g$[funcao.trim()](params, true);
            });
        });

        $("#" + id).modal("close");
    }

});
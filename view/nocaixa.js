app.controller("nocaixa", function ($scope, $http, $rootScope) {

    $scope.tab = 1;

    g$.carregaDados("callbackNoCaixa");

    g$.callbackNoCaixa = function () {
        // Script Tela
        // Load
        g$.memo("memo ¦ 583 | memo9 |", true);

        $("#view [data-id=4698]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 4793 | display | none | '»4699»' = ''", false), false);
        $("#view [data-id=4698]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 4793 | display | inline-block | '»4699»' <> ''", false), false);
        $("#view [data-id=4717]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery | call »user.banco».mandar_para_cozinha('»4699»') | | | alert", false), false);
        $("#view [data-id=4840]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 856 | call »user.banco».insere_servico_e_desconto('0', '0', '»4838»','»4839»','»4699»')", false), false);
        $("#view [data-id=4859]")[0].addEventListener("blur", g$.carregaQuery.bind(null, "carregaQuery ¦ 860 | UPDATE »user.banco».pedido SET pessoas = »4859» WHERE id = »4699»", false), false);
        $("#view [data-id=4797]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 863 | CALL »user.banco».finaliza_pedido('»4699»') | 14946 | | alert", false), false);
        $("#view [data-id=4865]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | pedido_id | pagamento | »4699»", false), false);
        $("#view [data-id=4865]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | origem_pagamento_id | pagamento | 2", false), false);
        $("#view [data-id=4865]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | cliente_fornecedor_id | pagamento | »user.id»", false), false);
        $("#view [data-id=15295]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 3203 | memo11 | 1", false), false);
        $("#view [data-id=15294]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 3205 | memo11 | 2", false), false);
        $("#view [data-id=15293]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 3206 | memo11 | 4", false), false);
        $("#view [data-id=15292]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 3207 | memo11 | 3", false), false);
        $("#view [data-id=15296]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 3208 | memo11 | 5", false), false);
        $("#view [data-id=4691]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Clientes |Cliente2| 346 | |", false), false);
        $("#view [data-id=4715]")[0].addEventListener("click", g$.salvarTela.bind(null, "salvarTela ¦ 1697 | 4683 | false | '»14940»' = 'alterou'", false), false);
        $("#view [data-id=4716]")[0].addEventListener("click", g$.salvarTela.bind(null, "salvarTela ¦ 1699 | 4683 | false | '»14940»' = 'alterou'", false), false);
        $("#view [data-id=15315]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Caixa  |CAIXA|173", false), false);
        $("#view [data-id=15315]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 15285 | display | block |", false), false);
        $("#view [data-id=15315]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 15284 | display | none |", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery | SELECT total_faltando_a FROM »user.banco».pedido WHERE id = »memo1» | memo8", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 15285 | display | none | '»memo9»' = ''", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 15284 | display | none | '»memo9»' <> ''", false), false);
        $("#view [data-id=15285]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 15285 | display | none | '»memo9»' = ''", false), false);
        $("#view [data-id=15285]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 15284 | display | block | '»memo9»' = ''", false), false);
        $("#view [data-id=15285]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Abra o caixa para prosseguir | '»memo9»' = ''", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.memo.bind(null, "	memo | memo12 | 15321", false), false);
        $("#view [data-id=4796]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 2999| memo2 | SELECT IF(c.cumpom_conferencia_imprimir_cpf_cnpj, e.cnpj_a, '' ), CONCAT('IMPRESSO EM ', DATE_FORMAT(NOW(), '%d/%m/%Y %h:%i')), c.cabecalho, c.rodape, CONCAT('NO CAIXA - PEDIDO No.: ', p.id ), p.subtotal_a, p.servico_a, p.desconto_a, p.totalGeral_a, p.tempo_a, p.pessoas, p.por_pessoa, '»user.nome»' , a.razao_a, IF (np.imprimir_como_senha, CONCAT('*** SENHA: ', numero_senha, ' ***'), '' ), 'TOTAL PAGO:', (SELECT SUM(COALESCE(entrada,0)) FROM »user.banco».pagamento WHERE pedido_id = p.id), 'TROCO: ',(SELECT SUM(COALESCE(saida,0)) FROM »user.banco».pagamento WHERE pedido_id = p.id) FROM »user.banco».configuracao c, »user.banco».pedido p, »user.banco».cliente_fornecedor a, »user.banco».empresa e, »user.banco».numeracao_personalizada np WHERE np.id = 1 AND e.id = 1 AND c.id=1 AND p.id =»memo1» AND a.node_usuario_id = COALESCE(p.atendente_id_a,0)", false), false);
        $("#view [data-id=15321]")[0].addEventListener("click", g$.leTela.bind(null, "leTela | 4793 | 294 | PEDI.id=»4699» ", false), false);
        $("#view [data-id=15321]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 4865", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | »4699»", false), false);
        $("#view [data-id=4830]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 4832 ¦ 4803", false), false);
        $("#view [data-id=4812]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 4803 ¦ 4832", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 4865", false), false);
        $("#view [data-id=4793]")[0].addEventListener("click", g$.leTela.bind(null, "leTela | 4793 | 294 | PEDI.id=»4699»", false), false);
        $("#view [data-id=14941]")[0].addEventListener("click", g$.salvarTela.bind(null, "salvarTela ¦ 3012 | 4683 | false | '»14940»' = 'alterou'", false), false);
        $("#view [data-id=4792]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo2 | nao_exibir_no_cardapio = 0 AND categoria_id<>3  |", false), false);
        $("#view [data-id=4792]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo3 | 4782", false), false);
        $("#view [data-id=15374]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 14941", false), false);
        $("#view [data-id=15374]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo7 | quilo", false), false);
        $("#view [data-id=4842]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 14940 | valor | alterou", false), false);
        $("#view [data-id=4717]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 4782", false), false);
        $("#view [data-id=4865]")[0].addEventListener("aogravar", g$.leTela.bind(null, "leTela | 4793 | 294 | PEDI.id=»4699»", false), false);
        $("#view [data-id=4865]")[0].addEventListener("depoisDeExcluir", g$.onClick.bind(null, "onClick | 15321", false), false);
    };

});
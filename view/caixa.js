app.controller("caixa", function($scope, $http, $rootScope) {

    g$.carregaDados("callbackCaixa");

    g$.callbackCaixa = function() {
        // Script Tela
        // Load
        g$.carregaQuery("carregaQuery | SELECT ROUND(SUM(COALESCE(entrada,0)),2), ROUND(SUM(COALESCE(saida,0)),2), ROUND(SUM(COALESCE(entrada,0))-SUM(COALESCE(saida,0)),2) FROM »user.banco».pagamento where caixa_id in (select id from »user.banco».caixa c where c.aberto=1 and c.cliente_fornecedor_id=»user.id») |  4133 ¦ 4134 ¦ 4138", false)
        g$.carregaQuery("carregaQuery | SELECT remover_pedido_sem_consumo FROM »user.banco».configuracao WHERE id = 1 | memo2", false)
        g$.atualizarTabela("atualizarTabela | 4121", false)
        g$.carregaQuery("carregaQuery ¦ 166 | SELECT saldo_inicial, observacoes FROM »user.banco».caixa where cliente_fornecedor_id = »user.id» and aberto = 1 | 4081 ¦ 4083", true)

        $("#view [data-id=4084]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 527 | INSERT INTO »user.banco».pagamento (forma_de_pagamento_id, observacao, origem_pagamento_id, valor, cliente_fornecedor_id) VALUES ('1', '»4083»', '0', '»4081»', '»user.id»') | memo9_insertID | '»4081»' <> '' | alert ¦ Caixa Aberto com Sucesso para Usuário »user.nome» ¦ Falha ao tentar abrir Caixa", false), false);
        $("#view [data-id=4086]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 530 | UPDATE »user.banco».caixa SET aberto='0', data_fechamento=NOW() WHERE cliente_fornecedor_id=»user.id» and aberto='1' | | | alert ¦ Caixa fechado com sucesso! ¦ Falha ao tentar fechar caixa!", false), false);
        $("#view [data-id=4117]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery | INSERT INTO »user.banco».pagamento (forma_de_pagamento_id, observacao, origem_pagamento_id, valor, cliente_fornecedor_id) VALUES ('»4108»', '»4114»', '»4110»', '»4112»', '»user.id»')", false), false);
        $("#view [data-id=4080]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 1869 | memo1 | 33", false), false);
        $("#view [data-id=4096]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 2936 | SELECT id FROM »user.banco».caixa WHERE aberto = 1 AND cliente_fornecedor_id = »user.id» LIMIT 1| memo1", false), false);
        $("#view [data-id=4084]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | O Campo SALDO INICIAL não foi preenchido | '»4081»' = ''", false), false);
        $("#view [data-id=4091]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 4102", false), false);
        $("#view [data-id=4117]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 4121", false), false);
        $("#view [data-id=4117]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery | SELECT ROUND(SUM(COALESCE(entrada,0)),2), ROUND(SUM(COALESCE(saida,0)),2), ROUND(SUM(COALESCE(entrada,0))-SUM(COALESCE(saida,0)),2) FROM »user.banco».pagamento where caixa_id in (select id from »user.banco».caixa c where c.aberto=1 and c.cliente_fornecedor_id=»user.id») | 4133 ¦ 4134 ¦ 4138 | '»4081»' <> ''`", false), false); 
    };

});
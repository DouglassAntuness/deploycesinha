app.controller("delivery", function($scope, $http, $rootScope) {

    $scope.tab = 1;

    g$.carregaDados("callbackHistoricoCaixa");

    g$.callbackHistoricoCaixa = function() {
        // Script Tela
        // Load
        g$.atualizarTabela("atualizarTabela | 4150", true);

        $("#view [data-id=4144]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 4161", false), false); 
    };

});
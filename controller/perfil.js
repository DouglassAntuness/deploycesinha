app.controller("perfil", function($scope, $http, $rootScope) {

    // var user = g$.urlObj(location.search);

    // if (user.auth == "DYS") {
    //     var query = "SELECT * FROM usuario WHERE email = '" + user.email + "'";
    //     g$.exibeQuery("Menu Topo", query);
    //     $http.get(URL + "/get/" + query).success(function (response) {
    //         $scope.user = response.data[0];
    //         $scope.user.foto = (!$scope.user.foto) ? "img/anonimo.png" : "img/" + $scope.user.foto;
    //         $(".user-image")[0].src = $(".logo-user")[0].src = $scope.user.foto;
    //         $.createMenuTelas($scope.user.projeto_id);
    //     });
    // }
    // else {
    //     var query = "SELECT * FROM usuario WHERE email = '" + user.email + "'";
    //     g$.exibeQuery("Menu Topo", query);
    //     $http.get(URL + "/get/" + query).success(function (response) {
    //         $scope.user = response.data[0];
    //         $scope.user.foto = user.foto;
    //         $(".user-image")[0].src = $(".logo-user")[0].src = $scope.user.foto;
    //         $.createMenuTelas($scope.user.projeto_id);
    //     });
    // }

});
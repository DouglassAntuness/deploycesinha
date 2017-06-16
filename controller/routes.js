app.config(function($routeProvider) {
    $routeProvider
    .when("/caixa", {
        templateUrl : "view/caixa.html",
        controller: "caixa"
    })
    .when("/historicocaixa", {
        templateUrl : "view/historicocaixa.html",
        controller: "historicocaixa"
    })
    .when("/nocaixa", {
        templateUrl : "view/nocaixa.html",
        controller: "nocaixa"
    })
    .when("/delivey", {
        templateUrl : "view/delivery.html",
        controller: "delivery"
    });
});
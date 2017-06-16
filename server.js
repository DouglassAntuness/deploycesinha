'use strict';

var mysql = require("mysql"),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    conexao = require('./config/conexao'),
    Sequelize = require('sequelize'),
    app = express(),
    multiparty = require('connect-multiparty'),
    router = express.Router(),
    request = require('request'),
    fs = require('fs'),
    conexaoNot, intervalConexaoNot;

const nodemailer = require('nodemailer');

var port = process.env.port || 8000;

var connection = mysql.createPool({
    host: conexao.auth.host,
    user: conexao.auth.user,
    password: conexao.auth.password,
    database: conexao.auth.database
});

connection.on('error', function (err) {
    console.log(err);
    res.send({ success: false, message: 'database error', error: err });
    return;
});

var sequelize = new Sequelize('node', 'dsysdb', '3@H9SXuEyDcbdK', {
    host: 'dys-clbanco.cloudbr.net',
    dialect: 'mysql'
});

var sequelizeTeste = new Sequelize('mag', 'root', '4haqmecp2pcg', {
    host: '200.98.146.129',
    dialect: 'mysql',
    dialectOptions: {
        insecureAuth: true
    }
});

var gatilhos = require('./config/gatilhos')(app, sequelize);

// create application/json parser
var jsonParser = bodyParser.json()

app.use(express.static('./'));

// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// });

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    return next();
});

require('./config/passport')(passport);

// Facebook
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use('/', router);
require('./app/routes.js')(app, passport);

// CRUD NODE
// Chamar uma Procedure
app.get("/proc/:nome", function (req, res) {
    var nome = req.params.nome,
        query = 'call ' + nome;

    query = query.replace(/\^/g, "%");
    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows, fields) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// get
app.get("/getold/:id", function (req, res) {

    var id = req.params.id,
        query = "SELECT DATE_FORMAT(VNDA.data, '%d/%m/%Y') as data, CLTE.razão,CONCAT(COALESCE(entrEndereço,''),' ',COALESCE(entrNúmero,''),' ',COALESCE(entrComplemento,'')) as entrEndereco, entrbairro, entrcidade, entruf, SOLI.razão, SOLI.email, SOLI.telefone , PDTO.produto,VDPD.quantidade, UNID.unidade, VDPD.valor, VDPD.quantidade*VDPD.valor total, PROP.proposta, USUA.usuário, USUA.departamento, USUA.email solicEmail, USUA.celular solicCel, VNDA.fretePorConta AS fretePorConta, VNDA.prazoEntrega AS prazoEntrega,VNDA.validade AS validade,CLEN.cep AS CLIcep,CONCAT(IF(COALESCE(CLTE.cpf,'')<>'',CONCAT('CPF : ',CLTE.cpf),''), IF(COALESCE(CLTE.cnpj,'')<>'',CONCAT('CNPJ : ',CLTE.cnpj),'') ,IF(COALESCE(CLTE.inscriçãoEstadual,'')<>'' AND COALESCE(CLTE.inscriçãoEstadual,'')<>'ISENTO',CONCAT(' IE : ',CLTE.inscriçãoEstadual),'')) AS insc, PDTO.foto AS foto,COALESCE(TRSP.apelido,TRSP.razão) transporte, VNDA.mensagemCliente As mensagemCliente,VNDA.taxaEntrega taxaEntrega,FMPG.formaDePagamento formaDePagamento, VNDA.totalGeral ,VNDA.anotaçõesEquipe,VNDA.entrCpf FROM venda VNDA LEFT JOIN forma_de_pagamento FMPG ON FMPG.código = VNDA.forma_de_pagamento_pk LEFT JOIN transporte TRSP ON TRSP.código = VNDA.transporte_pk LEFT JOIN usuário USUA ON USUA.código = VNDA.vendedor LEFT JOIN proposta PROP ON PROP.código = VNDA.proposta_pk LEFT JOIN cliente SOLI ON SOLI.código = VNDA.solicitante ,cliente CLTE LEFT JOIN cliente_endereço CLEN ON (CLTE.código = CLEN.cliente_pk AND endereço_tipo_pk=1), produto PDTO LEFT JOIN unidade UNID ON PDTO.unidade_pk = UNID.código,venda_produto VDPD LEFT JOIN projeto PRJT ON VDPD.projeto_pk = PRJT.código WHERE VDPD.venda_pk = VNDA.código AND PDTO.código = VDPD.produto_pk AND CLTE.código = VNDA.cliente_pk AND VNDA.código = '" + id + "' GROUP BY VDPD.código ORDER BY PRJT.código, VDPD.código";

    sequelizeTeste.authenticate()
        .then(function (err) {
            console.log('Connection sequelize successfully.');
        })
        .catch(function (err) {
            console.log('Unable to connect to the database');
        });

    sequelizeTeste.query(query, { type: sequelize.QueryTypes.SELECT })
        .then(function (rows) {
            res.send(rows);
        });
});

// get
app.get("/get/:query", function (req, res) {
    var query = req.params.query;

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// delete
app.delete("/delete/:query", function (req, res) {
    var query = req.params.query;

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// put
app.put("/put/:table", jsonParser, function (req, res) {
    var post = req.body, propriedades = "", query, encode, valor,
        keys = Object.keys(post), name = "id", table = req.params.table;

    if (!post.id) name = Object.keys(post)[0];

    for (var i = 0; i < keys.length; i++) {
        encode = (keys[i + 1]) ? "," : "";
        if (post[keys[i]] == "null" || post[keys[i]] == null) valor = 'default';
        else if (post[keys[i]] === true || post[keys[i]] === false) valor = post[keys[i]];
        else valor = '"' + post[keys[i]] + '"';
        propriedades += keys[i] + " = " + valor + encode + " ";
    }
    query = 'UPDATE ' + table + ' SET ' + propriedades + ' WHERE ' + name + ' = ' + post[name];

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows, results) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// post
app.post("/post/:table", jsonParser, function (req, res) {
    var post = req.body, propriedades = "", valores = "", query, encode, valor,
        keys = Object.keys(post), table = req.params.table;


    for (var i = 0; i < keys.length; i++) {
        encode = (keys[i + 1]) ? "," : "";

        if (post[keys[i]] == "null" || post[keys[i]] == null) valor = 'default';
        else if (post[keys[i]] === true || post[keys[i]] === false) valor = post[keys[i]];
        else valor = '"' + post[keys[i]] + '"';
        propriedades += keys[i] + encode;
        valores += valor + encode;
    }
    query = 'INSERT INTO ' + table + ' (' + propriedades + ') VALUES (' + valores + ')';

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// post
app.post("/jsonQuery/", jsonParser, function (req, res) {
    var post = req.body;

    var query = post.query;

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// Enviar Email 
app.post("/sendEmail/", jsonParser, function (req, res) {
    var obj, helper, mail, emailDe, emailPara, personalization, html, content;
    obj = req.body;
    helper = require('sendgrid').mail;

    // Instanciando as classes
    mail = new helper.Mail();
    emailDe = new helper.Email(obj.emailDe, obj.nomeDe);
    personalization = new helper.Personalization();
    emailPara = new helper.Email(obj.emailPara, obj.nomePara);
    html = '<html><body>' + obj.corpo + '</body></html>';
    content = new helper.Content('text/html', html);

    // Setando os Valores
    mail.setFrom(emailDe);
    mail.setSubject(obj.titulo);
    personalization.addTo(emailPara);
    mail.addPersonalization(personalization);
    mail.addContent(content);

    // Consistencia para anexos
    for (var i = 0; i < obj.anexo.split(",").length; i++) {
        if (obj.anexo.split(",")[i].trim() != "") {
            var attachment = new helper.Attachment(),
                file = fs.readFileSync(obj.anexo.split(",")[i].trim());
            base64File = new Buffer(file).toString('base64');
            attachment.setContent(base64File);
            attachment.setType('application/text');
            attachment.setFilename(obj.anexo.split(",")[i].trim());
            attachment.setDisposition('attachment');
            mail.addAttachment(attachment);
        }
    }

    var sg = require('sendgrid')("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");
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        else {
            res.send("OK");
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
});

app.get("/sendMailPesquisa/:email/:pesquisa/:id", function (req, res) {
    var email = req.params.email,
        pesquisa = req.params.pesquisa,
        id = req.params.id;

    let transporter = nodemailer.createTransport({
        // host: 'a1-cpweb-a12.host.intranet',
        host: 'webmail.dys.com.br',
        port: 587,
        //ignoreTLS: true,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: 'faleconosco@dys.com.br',
            pass: 'isadora04'
        }
    });

    let mailOptions = {
        from: '"Pesquisa Lexus" <faleconosco@dys.com.br>', // sender address
        to: email, // list of receivers
        subject: 'Pesquisa Lexus', // Subject line
        text: 'Pesquisa Lexus!', // plain text body
        html: '<div style="text-align:center;"><img src="http://138.197.32.22/lexus/assets/dist/img/logo_lexus-big.png"></img></div><br><p>Olá, Completar esta breve pesquisa vai nos ajudar a obter os resultados para melhor atendê-lo!</p>' +
        '<p>Para acessar a Pesquisa <a href="http://dysweb.dys.com.br/lexus/pesquisaLexus.html?' + pesquisa + '?' + id + '">Clique Aqui!</a></p>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({ error: error })
        } else {
            res.json({ info: info })
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
});

router.route('/uploadfile')
    .post(multiparty(), require('./app/upload'));

app.get("/integraAlbumFB/:pageID/:token", function (req, res) {
    var pageID = req.params.pageID,
        token = req.params.token,
        options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/albums',
            qs: { access_token: token },
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.post("/newAlbumFB/:pageID/:token/:nome/:desc", function (req, res) {
    var pageID = req.params.pageID,
        token = req.params.token,
        nome = req.params.nome,
        desc = req.params.desc,
        options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/albums',
            qs: {
                access_token: token,
                name: nome,
                message: desc
            },
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.get("/integraFotosFB/:albumID/:token", function (req, res) {
    var albumID = req.params.albumID,
        token = req.params.token,
        options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v2.9/' + albumID + '/photos',
            qs: { access_token: token }
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.post("/uploadFotoFB/:token/:pageID/:alb/:url/:desc", function (req, res) {
    var token = req.params.token,
        alb = req.params.alb,
        urls = req.params.url,
        pageID = req.params.pageID,
        desc = req.params.desc,
        options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + alb + '/photos',
            qs: {
                access_token: token,
                url: urls,
                message: desc,
                place: pageID
            },
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.get("/integraComentarioFB/:fotoID/:token", function (req, res) {
    var fotoID = req.params.fotoID,
        token = req.params.token,
        options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v2.9/' + fotoID + '/comments',
            qs: { access_token: token }
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})

app.get("/postarFotoFB/:albumID/:urls/:desc/:token", function (req, res) {
    var albumID = req.params.albumID,
        urls = req.params.urls.replace(/\½/g, "/"),
        token = req.params.token,
        desc = req.params.desc,
        options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + albumID + '/photos',
            qs: {
                access_token: token,
                url: urls,
                message: desc
            }
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})

app.post("/postarTimeFB/:pageID/:img/:desc/:token", function (req, res) {
    var pageID = req.params.pageID,
        img = req.params.img.replace(/\½/g, "/"),
        desc = req.params.desc,
        token = req.params.token;

    if (img == "N") {
        var options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/feed',
            qs: {
                access_token: token,
                message: desc
            }
        };
    } else {
        var options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/photos',
            qs: {
                access_token: token,
                url: img,
                message: desc
            }
        };
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
});

app.get('/', function (req, res) {
    res.sendfile('./www/');
});

app.listen(port, function () {
    console.log("Servidor rodando na porta 8080");
});
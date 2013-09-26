var fs = require('fs'),
    url = require('url'),
    http = require('http');

var HTML = fs.readFileSync("./display.html", 'utf8'),
    PORT = process.env.PORT || 8000;


var state = {
    data: {},
    vers: 0,
    _send: function (res) {
        res.write([
            "id:"+state.vers,
            "data:"+JSON.stringify(state.data),
            "\n"
        ].join('\n'));
    }
};

var openReqs = Object.create(null);


http.createServer(function (req, res) {
    req.url = url.parse(req.url, true);
    console.log(req.method, req.url.pathname);
    
    if (req.url.pathname === "/") {
        res.end(HTML);      // TODO: not modified `if-modified-since` > startup
    } else if (req.url.pathname === "/data") {
        if (req.method === 'GET') {
            var accepts = req.headers['accept'] || '',
                acceptsEventStream = accepts.split(',').filter(function (d) {
                    return (d.indexOf("text/event-stream") === 0);
                })[0];
            if (!acceptsEventStream) {
                res.writeHead(200, {'Content-Type':"application/json",'Vary':"Accept"});
                return res.end(JSON.stringify(state.data));
            }
            
            res.writeHead(200, {'Content-Type':"text/event-stream",'Vary':"Accept",'X-Accel-Buffering':"no"});
            var clientVers = +req.headers['last-event-id'];
            if (clientVers === state.vers) /* already current */;
            else state._send(res);
            
            // don't end request, but keep for sending more data later!
            var key = Math.random().toFixed(20).slice(2);
            openReqs[key] = res;        // not a typo, we write to response
            req.on('close', function () {
                delete openReqs[key];
            });
            
        } else if (req.method === 'POST' && req.url.query.s === 'pwd') {
            var chunks = [];
            req.on('data', function (chunk) {
                chunks.push(chunk);
            });
            req.on('end', function () {
                var body = Buffer.concat(chunks);
                try {
                    state.data = JSON.parse(body.toString('utf8'));
                } catch (e) {
                    res.writeHead(500);
                    return res.end("That was prolly your fault, actually.\n");
                }
                state.vers += 1;
                var reqKeys = Object.keys(openReqs);
                reqKeys.forEach(function (key) {
                     state._send(openReqs[key]);
                });
                res.writeHead(201);
                res.end(JSON.stringify("Broadcast to "+reqKeys.length+" listeners.\n"));
            });
        } else {
            res.writeHead(400);
            res.end("Bad request. BAD!\n");
        }
    } else {
        res.writeHead(404);
        res.end("Not found\n");
    }
    
    // TODO: GET API implement http://www.w3.org/TR/eventsource/
    // TODO: PUT API (w/config.js secret) sets and events listening requests
    
}).listen(PORT, function () {
    console.log("Listening on port", PORT);
});

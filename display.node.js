var fs = require('fs'),
    http = require('http');

var HTML = fs.readFileSync("./display.html", 'utf8'),
    PORT = process.env.PORT || 8000;

http.createServer(function (req, res) {
    console.log(req);
    // TODO: GET API implement http://www.w3.org/TR/eventsource/
    // TODO: PUT API (w/config.js secret) sets and events listening requests
    res.end(HTML);      // TODO: not modified `if-modified-since` > startup
}).listen(PORT, function () {
    console.log("Listening on port", PORT);
});
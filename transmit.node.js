var f = require('fermata');

var inverter = f.json(process.env.INVERTER_URL),
    livesite = f.json(process.env.LIVESITE_URL);

var CALL = {
    jsonrpc:"2.0",
    method:"GeteNexusData",
    params:[
        {"path":"eNEXUS_0006[s:255,t:17]","datatype":"INT16U"},     // DC voltage * 10
        //{"path":"eNEXUS_0008[s:255,t:17]","datatype":"INT16U"},     // AC current * 1000
        {"path":"eNEXUS_0010[s:255,t:17]","datatype":"INT16U"},     // AC power
        {"path":"eNEXUS_0043[s:255,t:17,n:4]","datatype":"INT32U"}  // total energy * 1000
    ], id:0
};


inverter.rpc.post(CALL, function (e,d) {
    if (e) return console.error(e);
    
    var obj = {'timestamp':new Date().toISOString()};
    d.result.forEach(function (res) {
        var pre = "eNEXUS_".length,
            k = res.path.slice(pre, pre+4);
        switch (k) {
            case '0006':
                obj['DC input'] = (+res.value/10).toFixed(1) + "V"; break;
            case '0008':
                obj['AC output'] = (+res.value/1000).toFixed(1) + "A"; break;
            case '0010':
                obj['AC output'] = (+res.value).toFixed(1) + "W"; break;
            case '0043':
                obj['Total produced'] = (+res.value/1000).toFixed(1) + "kWh"; break;
        }
    });
    livesite.data({s:'pwd'}).post(obj, function (e,d) {
        if (e) console.error(e);
        else console.log(d);
    });
});
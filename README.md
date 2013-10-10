# Solar PV logging

## Logging "instant" values

Logging current production stats from from my Theia HE-t inverter, every 30s.

    INVERTER_URL=http://192.168.0.42 ./inverter.sh | tee -a inverter.log

c.f. <https://github.com/natevw/linepost>

## Archiving production details

(See usage comment in daily.sh.)


## Live display

Transmitting stats to e.g. <http://solar.batsig.nl>.

    npm install fermata
    while sleep 2; do INVERTER_URL=http://192.168.0.42 LIVESITE_URL=http://example.com node transmit.node.js; done


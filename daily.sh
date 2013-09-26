#! /bin/sh

curl -XPOST 192.168.1.49 -d '{"jsonrpc":"2.0","method":"GetPowerLog","params":[17,255,"'`date +%Y-%m-%d`' 00:00:00","Wh","15min",96],"id":0}'


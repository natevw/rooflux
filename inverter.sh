#! /bin/sh

while : ; do
    echo -n `date  --rfc-3339=seconds`" ";
    curl -s -XPOST "$INVERTER_URL"/rpc -d '{"jsonrpc":"2.0","method":"GeteNexusData","params":[{"path":"eNEXUS_0005[s:255,t:17]","datatype":"INT16U"},{"path":"eNEXUS_0006[s:255,t:17]","datatype":"INT16U"},{"path":"eNEXUS_0010[s:255,t:17]","datatype":"INT16U"},{"path":"eNEXUS_0007[s:255,t:17]","datatype":"INT16U"},{"path":"eNEXUS_0008[s:255,t:17]","datatype":"INT16U"},{"path":"eNEXUS_0009[s:255,t:17]","datatype":"INT16U"},{"path":"eNEXUS_0011[s:255,t:17]","datatype":"INT32U"}],"id":0}' | tr -d '\n\t ';
    echo
    sleep 30;
done




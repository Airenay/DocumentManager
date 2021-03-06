#!/bin/bash

# This is for geth

# Fetching revert reason -- https://ethereum.stackexchange.com/questions/48383/how-to-receive-revert-reason-for-past-transactions

if [ -z "$1" ]
then
    echo "Usage: revert-reason <TX_HASH>"
    exit
fi

TX=$1
SCRIPT=" tx = eth.getTransaction( \"$TX\" ); tx.data = tx.input; eth.call(tx, tx.blockNumber)"

docker exec -it geth geth --exec "$SCRIPT" attach http://localhost:8545 | cut -d '"' -f 2 | cut -c139- | xxd -r -p
echo

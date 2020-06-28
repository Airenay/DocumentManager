#!/bin/bash
#
# Extracts ABI files from compiled contract data to be used by the Graph
#

DIR=$(dirname $0)

BUILD_DIR=$DIR/../build/contracts
ABI=abis

echo "Extracting ABIs for graph..."
mkdir -p ${BUILD_DIR}/${ABI}

for f in ${BUILD_DIR}/*.json; do
  cat $f | jq '.abi' >$(dirname $f)/${ABI}/$(basename $f)
done

# Link compiled contracts to app
echo "Linking contracts for app..."

ln -sF ../contracts/build/contracts $DIR/../../app

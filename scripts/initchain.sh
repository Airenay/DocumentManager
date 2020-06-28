#!/bin/bash
#
# Initialize blockchain and graph data with somo dummy data.
# Must be started when blockchain and graph are completely initialized.
#

# MataMask account addresses and amount to send to each in Wei (1 ETH)
MM="0xa7bdB348b9d7af4D23431D5213f0B5D9bd667C8D 0x84274Bb270D593Ad54e5Ff705B0A486A858abF88"
AMOUNT="0xDE0B6B3A7640000"
NET="development"
KIND=regular

set -e

DIR=$(dirname $0)
RUN="yarn -s run"

copy_samples() {
  # Copy samples if not yet copied and edited
  if [ ! -f contracts/secrets.json ]; then
    cp contracts/secrets.json.sample contracts/secrets.json
  fi
}

create_contract() {
  # Compile contract
  $RUN oz:compile --no-interactive

  # Interactive deployment
  #$RUN oz:deploy DocumentManager
  #read -p "Copy and paste the contract instance: " INSTANCE

  # Regular deployment
  if [ "$KIND" = "regular" ]; then
    echo "*** Deploying new $KIND contract instance ***"
    INSTANCE=$($RUN oz:deploy --no-interactive --network $NET --kind $KIND DocumentManager)
    echo "*** Initializing the instance ***"
    $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method initialize
  fi

  # Upgradeable deployment
  if [ "$KIND" = "upgradeable" ]; then
    echo "*** Deploying new $KIND contract instance ***"
    INSTANCE=$($RUN oz:deploy --no-interactive --network $NET --kind $KIND DocumentManager)
    echo "*** Initializing the instance ***"
    $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method initialize
  fi

  echo "*** Contract instance deployed: $INSTANCE ***"
}

init_data() {
  # Create document(s)
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"7d24gc7dciogi7sw", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"000001\",\"number\":\"0000001\",\"issue_number\":\"1\",\"issue_date\":\"2020-04-15T14:42:07.000Z\",\"first_name\":\"Ирина\",\"middle_name\":\"Батьковна\",\"last_name\":\"Скажуева\",\"specialty\":\"15.04.06 Мехатроника и робототехника\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":true,\"protocol_number\":\"15\",\"protocol_date\":\"2020-04-15T14:42:07.000Z\",\"chairman\":\"И.И.Петров\",\"head\":\"В.Н.Сидоров\"}", "0xc25e0401160a000605025ef281db000a09106295ef5c2d3bdb7b90a40100b54fbe3a55b82d5240abb02d547d93ed9dc6e28c77c071c50df7b5a584ca09670100d22431397d1176170bcf8bd1828b1c64d34b2211b7f572cbdf59ff44f79cf707"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"e7bryrmj2hfmpew5", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"000001\",\"number\":\"1234593\",\"issue_number\":\"012\",\"issue_date\":\"2020-05-24T21:00:00.000Z\",\"first_name\":\"Алина\",\"middle_name\":\"Ильназовна\",\"last_name\":\"Загитова\",\"specialty\":\"09.03.02 Информационные системы и технологии\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":true,\"protocol_number\":\"001\",\"protocol_date\":\"2020-05-17T21:00:00.000Z\",\"chairman\":\"Дудаков С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39a6d000a09106295ef5c2d3bdb7b491e00fd12635c68e883a8552817694866d935bf2dfb431425a7114e19a6254f3f0715d900fe26d8b6c9afa2d6ecfc2ed7ddd98f8d9c2d3440ec9d32c0cf2858676e668aea0d"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"7wsb7d6exyjj5fh2", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"000001\",\"number\":\"1234678\",\"issue_number\":\"017\",\"issue_date\":\"2020-05-24T21:00:00.000Z\",\"first_name\":\"Евгения\",\"middle_name\":\"Армановна\",\"last_name\":\"Медведева\",\"specialty\":\"09.03.02 Информационные системы и технологии\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":false,\"protocol_number\":\"002\",\"protocol_date\":\"2020-05-17T21:00:00.000Z\",\"chairman\":\"Дудаков С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39aa7000a09106295ef5c2d3bdb7b0f9d0100eb6d1a3883b84a817ec571f0fe6555b1e36b2cb0414c945abccf8652868a5b8a0100ab7f6af91244f62db23a182066ec8c3e1db2f671953410945ed90e7f71e34903"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"ciiqgdxzgshcgior", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"000001\",\"number\":\"1234595\",\"issue_number\":\"022\",\"issue_date\":\"2020-05-24T21:00:00.000Z\",\"first_name\":\"Даниил\",\"middle_name\":\"Александрович\",\"last_name\":\"Самсонов\",\"specialty\":\"09.03.02 Информационные системы и технологии\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":false,\"protocol_number\":\"003\",\"protocol_date\":\"2020-05-17T21:00:00.000Z\",\"chairman\":\"Дудаков С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39abd000a09106295ef5c2d3bdb7b4a740100ba2b4b5b00eee89ccc15f1182ed6a50cbe7dce23c41b5b34606b15bb1ee70a470100de48f68554f4dbe6936a24005363452a807cabbc07b5649995a9c1323c115603"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"azih4fiqi6cvgqbr", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"1837562\",\"issue_number\":\"18\",\"issue_date\":\"2020-05-26T21:00:00.000Z\",\"first_name\":\"Алексей\",\"middle_name\":\"Валерьевич\",\"last_name\":\"Ерохов\",\"specialty\":\"02.04.00 Психология\",\"qualification\":\"Психолог. Преподаватель психологии\",\"degree\":\"Специалист\",\"honours\":false,\"protocol_number\":\"001\",\"protocol_date\":\"2020-05-19T21:00:00.000Z\",\"chairman\":\"Глейхенгауз Д.М.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39af8000a09106295ef5c2d3bdb7b5eef00fd1f0a521a95226837f33234b108fd8d43db5c9a8ca3262b0c04979b7e35efe4550100d9e47ef1353884c50af8ded971c3240b8e9eb90931cf26584892abbd99e6dc0f"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"3pozlvunamosjazq", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"1837573\",\"issue_number\":\"23\",\"issue_date\":\"2020-05-26T21:00:00.000Z\",\"first_name\":\"Всеволод\",\"middle_name\":\"Антонович\",\"last_name\":\"Князев\",\"specialty\":\"02.04.00 Психология\",\"qualification\":\"Психолог. Преподаватель психологии\",\"degree\":\"Специалист\",\"honours\":true,\"protocol_number\":\"002\",\"protocol_date\":\"2020-05-19T21:00:00.000Z\",\"chairman\":\"Глейхенгауз Д.М.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39b0b000a09106295ef5c2d3bdb7bdccf00ff790ec1877cc9f34ab1f9fc6d22db4e099fe477bb46603a1db14b3c7497c2b7b300ff64945243036a122d5be3d1dc1088a247ec5e8950e84cabb2e6fd8f0b6616210d"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"odfyzzfu5jt3vv3k", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"1837629\",\"issue_number\":\"067\",\"issue_date\":\"2020-05-26T21:00:00.000Z\",\"first_name\":\"Аделия\",\"middle_name\":\"Тиграновна\",\"last_name\":\"Петросян\",\"specialty\":\"02.04.00 Психология\",\"qualification\":\"Психолог. Преподаватель психологии\",\"degree\":\"Специалист\",\"honours\":false,\"protocol_number\":\"003\",\"protocol_date\":\"2020-05-19T21:00:00.000Z\",\"chairman\":\"Глейхенгауз Д.М.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39b24000a09106295ef5c2d3bdb7bd5ec0100959b004be3054262d140440b3f4b9b6bb908752b829fc68ec77a4e47374956e400fe30b499cd08cce3846874365c01f2103eac8bf0d41fd41d5e46faf5f439c45c01"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"ebogrobthfdg2but", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"3759274\",\"issue_number\":\"005\",\"issue_date\":\"2020-05-28T21:00:00.000Z\",\"first_name\":\"Полина\",\"middle_name\":\"Игоревна\",\"last_name\":\"Цурская\",\"specialty\":\"09.04.02 Информационные системы и технологии\",\"qualification\":\"Магистр-инженер\",\"degree\":\"Магистр\",\"honours\":true,\"protocol_number\":\"001\",\"protocol_date\":\"2020-05-21T21:00:00.000Z\",\"chairman\":\"Розанов С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39bff000a09106295ef5c2d3bdb7b429900ff60d6352446388610ef6e213122a2ef9ba75cd0ab78104b3927802a1211b86aac0100b89e7cb967e7a3e97596d5d35700c7dcfe3e6e9591c8ae1b33ba936a00024203"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"nifujdeow67jz2yq", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"3759278\",\"issue_number\":\"067\",\"issue_date\":\"2020-05-28T21:00:00.000Z\",\"first_name\":\"Георгий\",\"middle_name\":\"Дмитриевич\",\"last_name\":\"Куница\",\"specialty\":\"09.04.02 Информационные системы и технологии\",\"qualification\":\"Магистр-инженер\",\"degree\":\"Магистр\",\"honours\":false,\"protocol_number\":\"002\",\"protocol_date\":\"2020-05-21T21:00:00.000Z\",\"chairman\":\"Розанов С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39c1a000a09106295ef5c2d3bdb7b98920100deafeed60484dcb163cceaf17d4e033c272c16214be4276a779aae857f07624d00fe350cd8facdec6f211612b0bc5f4404a54203fc028cf67f9ad33a8e20a05c8106"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"6ak3tlf3l4pvthn2", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"3759289\",\"issue_number\":\"056\",\"issue_date\":\"2020-05-28T21:00:00.000Z\",\"first_name\":\"Анастасия\",\"middle_name\":\"Анатольевна\",\"last_name\":\"Тараканова\",\"specialty\":\"09.04.02 Информационные системы и технологии\",\"qualification\":\"Магистр-инженер\",\"degree\":\"Магистр\",\"honours\":false,\"protocol_number\":\"003\",\"protocol_date\":\"2020-05-28T21:00:00.000Z\",\"chairman\":\"Розанов С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39c39000a09106295ef5c2d3bdb7b1a8f0100f341b4854c665520be8f646b572eb68f185b99d33ccba8e707216fe93cfe10dd00fc0c25f2303e3356798c8fb4d8bb3638916a0aeb0645bfd25092cd7e0387003003"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"qf5i3xsozkyvgzt4", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"083871\",\"number\":\"3273290\",\"issue_number\":\"171\",\"issue_date\":\"2020-05-27T21:00:00.000Z\",\"first_name\":\"Алёна\",\"middle_name\":\"Сергеевна\",\"last_name\":\"Косторная\",\"specialty\":\"27.03.04 Управление в технических системах\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":true,\"protocol_number\":\"001\",\"protocol_date\":\"2020-05-20T21:00:00.000Z\",\"chairman\":\"Воронов С.Е.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39b6f000a09106295ef5c2d3bdb7b631c00ff68421e483756999cc71340a2f645c50ea9be5356ce6ad38aab2de9f2ddb09e9100ff56d78deff0d8ed45fe0c596ecef5f9588e44e763f7a7e3952eb746761549dd00"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"vrbfsgmgbpspt7nr", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"104726\",\"number\":\"3759291\",\"issue_number\":\"165\",\"issue_date\":\"2020-05-27T21:00:00.000Z\",\"first_name\":\"Александра\",\"middle_name\":\"Вячеславовна\",\"last_name\":\"Трусова\",\"specialty\":\"27.03.04 Управление в технических системах\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":true,\"protocol_number\":\"002\",\"protocol_date\":\"2020-05-20T21:00:00.000Z\",\"chairman\":\"Воронов С.Е.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39b91000a09106295ef5c2d3bdb7bb24a00ff731c65cde219836945e95e2aea9dce121b4238e45a7e2f42d8de15c62a8322e8010085258f00e0bf2622ae6dbbca91e6ec04e9e7c6c93ec2b9458c4f593313791a0c"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"u5u2ppm6oifc4y4n", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"083871\",\"number\":\"3273672\",\"issue_number\":\"189\",\"issue_date\":\"2020-05-27T21:00:00.000Z\",\"first_name\":\"Анна\",\"middle_name\":\"Станиславовна\",\"last_name\":\"Щербакова\",\"specialty\":\"27.03.04 Управление в технических системах\",\"qualification\":\"Бакалавр-инженер\",\"degree\":\"Бакалавр\",\"honours\":true,\"protocol_number\":\"003\",\"protocol_date\":\"2020-05-20T21:00:00.000Z\",\"chairman\":\"Воронов С.Е.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef39ba4000a09106295ef5c2d3bdb7b649f0100e78ab5c81652713996fe0a4059c1b02a7c7835ef3ff9083eebc0784b4962186f0100835f5976e251205c90bfd6624d1c92985ba32769de44cf762010976c05872501"'
  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"p5d5z27roeu6qdkb", "{\"institution\":\"Межгалактический государственный университет\",\"series\":\"256395\",\"number\":\"3859385\",\"issue_number\":\"072\",\"issue_date\":\"2020-05-25T21:00:00.000Z\",\"first_name\":\"Дарья\",\"middle_name\":\"Романовна\",\"last_name\":\"Усачева\",\"specialty\":\"09.04.03 Прикладная информатика\",\"qualification\":\"Магистр-инженер\",\"degree\":\"Магистр\",\"honours\":true,\"protocol_number\":\"001\",\"protocol_date\":\"2020-05-18T21:00:00.000Z\",\"chairman\":\"Дудаков С.В.\",\"head\":\"Тутберидзе Э.Г.\"}", "0xc25e0401160a000605025ef28603000a09106295ef5c2d3bdb7bf72000fd19ae166351b478dfed100f2417201a95f8dfbf0b8ece70e607669a91e145811600fe3d7539bf9a8522efc6ff5f73ba07ad1c31fde2f209107f56bd1099ce701adc03"'
}

edit_graph() {
  # Edit subgraph for new contract address
  SUBGRAPH=graph/subgraph.yaml
  sed -e "/^[ \t]*address:/s/address:.*/address: '$INSTANCE'/" -i '' $SUBGRAPH
}

deploy_graph() {
  # Build and install the Graph instance
  $RUN graph:codegen
  set +e
  $RUN graph:create
  set -e
  $RUN graph:deploy
}

rpc_call() {
  curl -s -X POST -H 'Content-Type: application/json' --data $1 "http://127.0.0.1:8545/"
}

check_balance() {
  # Check current balance and fund it only if empty in this chain
  TMPFILE=$(mktemp)
  cat <<REQ >$TMPFILE
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_getBalance",
    "params": [
      "$1",
      "latest"
    ]
  }
REQ
  BALANCE=$(( $(rpc_call @$TMPFILE | jq -r '.result') ))
  BALANCE=$(echo $BALANCE / 1000000000000000000 | bc)

  rm -f $TMPFILE
}

transfer_coins() {
  for account in $MM; do

    # Send some dev coins to MetaMask registered address
    check_balance $account

    if [ "$BALANCE" -ne 0 ]; then
      echo Balance of $account is $BALANCE ETH, do not send more coins
      return
    fi
    echo Balance of $account is $BALANCE ETH, sending some coins...

    # Get dev prefunded account
    FROM=$(rpc_call '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' | jq -r '.result[0]')

    TMPFILE=$(mktemp)
    cat <<REQ >$TMPFILE
    {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendTransaction",
      "params": [
        {
          "from": "$FROM",
          "to": "$account",
          "value": "$AMOUNT"
        }
      ]
    }
REQ
    TX=$(rpc_call @$TMPFILE | jq -r '.result')
    rm -f $TMPFILE

    check_balance $account

    echo "1 ETH sent, tx: $TX"
    echo "Balance of $account: $BALANCE ETH"

  done
}


#
# Entry point
#
pushd $DIR/.. &>/dev/null

copy_samples
create_contract
init_data
edit_graph
deploy_graph
transfer_coins

popd &>/dev/null

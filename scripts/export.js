//
// Script to export test data from blockchain to the initchain.sh script format
//

const { createClient } = require('urql')
const gql = require('graphql-tag')
const fetch = require('isomorphic-unfetch')

const query = gql`
  query {
    documentObjects(orderBy: dateCreated) {
      id
      document {
        data
        signature
      }
    }
  }
`

const client = createClient({
  url: 'http://localhost:8000/subgraphs/name/dm',
})

client
  .query(query)
  .toPromise()
  .then(result => {
    result.data.documentObjects.forEach(d => {
      let id = d.id
      let { data, signature } = d.document

      data = data.replace(/"/g, '\\"')
      // console.log(id, data, signature)

      let line = `  $RUN oz:send-tx --no-interactive --network $NET --to $INSTANCE --method create --args '"${id}", "${data}", "${signature}"'`
      console.log(line)
    })
  })

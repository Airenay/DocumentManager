import { withUrqlClient } from 'next-urql'
import fetch from 'isomorphic-unfetch'
import config from '../conf/config'

export default withUrqlClient(
  ctx => ({
    url: config.api.uri,
    fetch: fetch,
  })
)

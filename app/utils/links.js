import Link from 'next/link'
import config from '../conf/config'

const createLinkToDocument = (id, text) => (
  <Link href={`/admin/documents/[id]`} as={`/admin/documents/${id}`}>
    <a>{text || id}</a>
  </Link>
)

const createLinkToView = (id, text) => (
  <Link href={`/[id]`} as={`/${id}`}>
    <a>{text || id}</a>
  </Link>
)

const createLinkToKey = (id, valid) => (
  <a className={valid ? 'valid' : 'invalid'} href={`${config.pgp.keyserver}/search?q=${id}`}>{id}</a>
)

const linkToDocument = (id, text) => createLinkToDocument(id, text)
const linkToView = (id, text) => createLinkToView(id, text)
const linkToKey = (id, valid = true) => createLinkToKey(id, valid)

export {
  linkToDocument,
  linkToView,
  linkToKey,
}

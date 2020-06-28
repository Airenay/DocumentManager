import {
  getUnixTime,
  fromUnixTime,
  parseJSON,
  format,
} from 'date-fns'

import { ru } from 'date-fns/locale'

// Parse JSON string to Date object
const jsonToDate = json => parseJSON(json)

// Convert Unix time to Date object and vice versa
const unixToDate = unix => fromUnixTime(unix)
const dateToUnix = date => getUnixTime(date)

// Format Date object to strings (return null if undefined)
const formatAsDate = date => date ? format(date, 'dd/MM/yyyy') : null
const formatAsDateTime = date => date ? format(date, 'dd/MM/yyyy HH:mm:ss') : null
const formatAsFullDate = date => date ? format(date, 'dd MMMM yyyy года', {locale: ru}) : null

export {
  jsonToDate,

  unixToDate,
  dateToUnix,

  formatAsDate,
  formatAsDateTime,
  formatAsFullDate,
}

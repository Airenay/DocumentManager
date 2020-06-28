//
// Graph mapping source file written in AssemblyScript.
// It provides conversion from blockchain events and data
// to a Graph database to be exported via GraphQL queries.
//
// (c) 2020 by Irina Semyonova
//
// This work is licensed under a
// Creative Commons Attribution-ShareAlike 4.0 International License
// (CC-BY-SA 4.0)
//
// You should have received a copy of the license along with this
// work. If not, see <http://creativecommons.org/licenses/by-sa/4.0/>.
//

// Graph API
import { BigInt, Bytes, ByteArray, store } from "@graphprotocol/graph-ts"
import { json, JSONValue, JSONValueKind, TypedMap } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts'

// Ethereum API
import {
  DocumentManager,
  Created, Updated, Revoked, Removed,
} from "../generated/DocumentManager/DocumentManager"

// Store API
import {
  Document,
  DocumentObject,
  HistoryRecord,
} from "../generated/schema"


//
// Update DocumentObject instance for the document
//
function updateDocumentObject(document: Document): DocumentObject {
  let id = document.id

  // Remove existing instance
  store.remove('DocumentObject', id)

  // Create new DocumentObject instance
  let obj = new DocumentObject(id)
  obj.document = id

  // Convert JSON string into Bytes to parse as JSON
  let byteArray = ByteArray.fromUTF8(document.data)
  let length = byteArray.length
  let bytes = new Bytes(length)

  for (let i: i32 = 0; i < length; i++) {
    bytes[i] = byteArray[i]
  }

  // Parse JSON object and set props
  let jo = json.fromBytes(bytes).toObject()
  let v: JSONValue | null

  if (((v = jo.get('institution'))     != null) && (v.kind == JSONValueKind.STRING)) obj.institution     = v.toString()
  if (((v = jo.get('degree'))          != null) && (v.kind == JSONValueKind.STRING)) obj.degree          = v.toString()
  if (((v = jo.get('honours'))         != null) && (v.kind == JSONValueKind.BOOL))   obj.honours         = v.toBool()
  if (((v = jo.get('series'))          != null) && (v.kind == JSONValueKind.STRING)) obj.series          = v.toString()
  if (((v = jo.get('number'))          != null) && (v.kind == JSONValueKind.STRING)) obj.number          = v.toString()
  if (((v = jo.get('issue_number'))    != null) && (v.kind == JSONValueKind.STRING)) obj.issue_number    = v.toString()
  if (((v = jo.get('issue_date'))      != null) && (v.kind == JSONValueKind.STRING)) obj.issue_date      = v.toString()
  if (((v = jo.get('first_name'))      != null) && (v.kind == JSONValueKind.STRING)) obj.first_name      = v.toString()
  if (((v = jo.get('middle_name'))     != null) && (v.kind == JSONValueKind.STRING)) obj.middle_name     = v.toString()
  if (((v = jo.get('last_name'))       != null) && (v.kind == JSONValueKind.STRING)) obj.last_name       = v.toString()
  if (((v = jo.get('specialty'))       != null) && (v.kind == JSONValueKind.STRING)) obj.specialty       = v.toString()
  if (((v = jo.get('qualification'))   != null) && (v.kind == JSONValueKind.STRING)) obj.qualification   = v.toString()
  if (((v = jo.get('protocol_number')) != null) && (v.kind == JSONValueKind.STRING)) obj.protocol_number = v.toString()
  if (((v = jo.get('protocol_date'))   != null) && (v.kind == JSONValueKind.STRING)) obj.protocol_date   = v.toString()
  if (((v = jo.get('chairman'))        != null) && (v.kind == JSONValueKind.STRING)) obj.chairman        = v.toString()
  if (((v = jo.get('head'))            != null) && (v.kind == JSONValueKind.STRING)) obj.head            = v.toString()

  return obj
}


//
// Blockchain event handlers use Ethereum call().
// The Ethereum node must keep state (mode: archive).
//

export function handleCreated(event: Created): void {
  // Get contract instance
  let contractAddress = event.address
  let contract = DocumentManager.bind(contractAddress)

  // Get event parameters
  let id = event.params.id

  // Get contract current state from blockchain
  let state = contract.get(id)

  // Create new document using state data
  let document = new Document(id)
  let date = state.date.toI32()
  document.dateCreated = date
  document.data = state.data
  document.signature = state.signature

  // Save document
  document.save()

  // Add a record to the document history
  let recId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let record = new HistoryRecord(recId)
  record.docId = document.id
  record.date = date
  record.type = "Create"
  record.data = document.data
  record.signature = document.signature
  record.save()

  // Update document object
  let obj = updateDocumentObject(document)
  obj.dateCreated = date
  obj.data = state.data
  obj.signature = state.signature
  obj.save()

  // Update document
  document.documentObject = id
  document.save()

  log.warning("Created: id: {}, date: {}, data: {}", [
    record.docId, BigInt.fromI32(record.date).toString(), record.data
  ])
}


export function handleUpdated(event: Updated): void {
  // Get contract instance
  let contractAddress = event.address
  let contract = DocumentManager.bind(contractAddress)

  // Get event parameters
  let id = event.params.id
  let reason = event.params.reason

  // Get contract current state from blockchain
  let state = contract.get(id)

  // Update existing document data (document should exist)
  let document = new Document(id)
  let date = state.date.toI32()
  document.dateUpdated = date
  document.data = state.data
  document.signature = state.signature

  // Save document
  document.save()

  // Add a record to the document's history
  let recId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let record = new HistoryRecord(recId)
  record.docId = document.id
  record.date = date
  record.type = "Update"
  record.data = document.data
  record.signature = document.signature
  record.reason = reason
  record.save()

  // Update document object
  let obj = updateDocumentObject(document)
  obj.dateUpdated = date
  obj.data = state.data
  obj.signature = state.signature
  obj.save()

  log.warning("Updated: id: {}, date: {}, data: {}, reason: {}", [
    record.docId, BigInt.fromI32(record.date).toString(), record.data, record.reason
  ])
}


export function handleRevoked(event: Revoked): void {
  // Get contract instance
  let contractAddress = event.address
  let contract = DocumentManager.bind(contractAddress)

  // Get event parameters
  let id = event.params.id
  let reason = event.params.reason

  // Get contract current state from blockchain
  let state = contract.get(id)

  // Revoke existing document data (document should exist)
  let document = new Document(id)
  let date = state.date.toI32()
  document.dateUpdated = date
  document.isRevoked = true

  // Save document
  document.save()

  // Add a record to the document's history
  let recId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let record = new HistoryRecord(recId)
  record.docId = document.id
  record.date = date
  record.type = "Revoke"
  record.reason = reason
  record.save()

  // Update document object (JSON data are not changed)
  let obj = new DocumentObject(id)
  obj.dateUpdated = date
  obj.isRevoked = true
  obj.save()

  log.warning("Revoked: id: {}, date: {}, reason: {}", [
    record.docId, BigInt.fromI32(record.date).toString(), reason
  ])
}


export function handleRemoved(event: Removed): void {
  // Get contract instance
  let contractAddress = event.address
  let contract = DocumentManager.bind(contractAddress)

  // Get event parameters
  let id = event.params.id
  let reason = event.params.reason

  // Get contract current state from blockchain
  let state = contract.get(id)

  // Remove existing document data (document should exist)
  let document = new Document(id)
  let date = state.date.toI32()
  document.dateUpdated = date
  document.isRemoved = true
  document.data = null
  document.signature = null

  // Save document
  document.save()

  // Add a record to the document's history
  let recId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let record = new HistoryRecord(recId)
  record.docId = document.id
  record.date = date
  record.type = "Remove"
  record.reason = reason
  record.save()

  // Remove related document object
  store.remove('DocumentObject', id)

  // Update document
  document.unset('documentObject')
  document.save()

  log.warning("Removed: id: {}, date: {}, reason: {}", [
    record.docId, BigInt.fromI32(record.date).toString(), reason
  ])
}

// test/DocumentManager.test.js

// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment')
const { expectEvent, expectRevert, ZERO_ADDRESS } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

// Load compiled artifacts
const DocumentManager = contract.fromArtifact('DocumentManager')
const ADMIN   = '0x0000000000000000000000000000000000000000000000000000000000000000'  // DEFAULT_ADMIN_ROLE
const MANAGER = '0xaf290d8680820aad922855f39b306097b20e28774d6c1ad35a20325630c3a02c'  // keccak256('MANAGER')

// DocumentManager contract test accounts:
//  - owner: contract owner (can upgrade contract, cannot assign roles or manage documents)
//  - admin: role admin (can assign roles, also can manage documents as written in contract)
//  - manager: data manager (can manage documents, the role assigned explicitly)
//  - user: plain user account (can only read data by id)
//  - new_admin: another one admin which has its role granted and revoked at runtime
//  - new_manager: another one manager which has its role granted and revoked at runtime
describe('DocumentManager', function () {
  const [ owner, admin, manager, user, new_admin, new_manager ] = accounts

  before(async function () {
    // Deploy a new contract
    this.contract = await DocumentManager.new({ from: owner })
  })

  describe('Named constants', function () {
    it('checks for proper VERSION() value', async function () {
      expect(await this.contract.VERSION()).to.equal('0.0.2')
    })

    it('checks for proper MANAGER() value', async function () {
      expect(await this.contract.MANAGER()).to.equal(MANAGER)
    })
  })

  describe('Contract initialization and access control', function () {
    it('checks that no accounts have ADMIN role by default', async function () {
      expect((await this.contract.getRoleMemberCount(ADMIN)).toString()).to.equal('0')
    })

    it('checks that no accounts have MANAGER role by default', async function () {
      expect((await this.contract.getRoleMemberCount(MANAGER)).toString()).to.equal('0')
    })

    it('initialises contract and gives some roles to predefined accounts', async function () {
      await this.contract.initialize({ from: admin })
    })

    it('checks that the same contract cannot be initialized twice', async function () {
      await expectRevert(
        this.contract.initialize({ from: admin }),
        'Contract instance has already been initialized'
      )
    })

    it('checks that only admin account has ADMIN role', async function () {
      expect((await this.contract.getRoleMemberCount(ADMIN)).toString()).to.equal('1')
      expect((await this.contract.hasRole(ADMIN, owner))).to.equal(false)
      expect((await this.contract.hasRole(ADMIN, admin))).to.equal(true)
      expect((await this.contract.hasRole(ADMIN, manager))).to.equal(false)
      expect((await this.contract.hasRole(ADMIN, user))).to.equal(false)
    })

    it('checks that some predefined accounts have MANAGER role', async function () {
      expect((await this.contract.getRoleMemberCount(MANAGER)).toString()).to.equal('3')
      expect((await this.contract.hasRole(MANAGER, admin))).to.equal(true)
      expect((await this.contract.hasRole(MANAGER, '0xa7bdB348b9d7af4D23431D5213f0B5D9bd667C8D'))).to.equal(true)
      expect((await this.contract.hasRole(MANAGER, '0x84274Bb270D593Ad54e5Ff705B0A486A858abF88'))).to.equal(true)
    })

    it('checks that only admin can grant roles', async function () {
      await expectRevert(
        this.contract.grantRole(MANAGER, manager, { from: owner }),
        'AccessControl: sender must be an admin to grant'
      )
    })

    it('checks that grantRole() emits RoleGranted event', async function () {
      const receipt = await this.contract.grantRole(MANAGER, manager, { from: admin })
      expectEvent(receipt, 'RoleGranted', { role: MANAGER, account: manager, sender: admin })
    })

    it('checks that admin role can be assigned and self-revoked', async function () {
      expect((await this.contract.hasRole(ADMIN, new_admin))).to.equal(false)
      await this.contract.grantRole(ADMIN, new_admin, { from: admin })
      expect((await this.contract.hasRole(ADMIN, new_admin))).to.equal(true)
      await this.contract.revokeRole(ADMIN, new_admin, { from: new_admin })
      expect((await this.contract.hasRole(ADMIN, new_admin))).to.equal(false)
    })

    it('checks that manager role can be assigned and revoked', async function () {
      expect((await this.contract.hasRole(MANAGER, new_manager))).to.equal(false)
      await this.contract.grantRole(MANAGER, new_manager, { from: admin })
      expect((await this.contract.hasRole(MANAGER, new_manager))).to.equal(true)
      await this.contract.revokeRole(MANAGER, new_manager, { from: admin })
      expect((await this.contract.hasRole(MANAGER, new_manager))).to.equal(false)
    })
  })

  describe('Access check', function () {
    it('checks that owner has no access rights', async function () {
      expect(await this.contract.checkAccess({ from: owner })).to.equal(false)
    })

    it('checks that user has no access rights', async function () {
      expect(await this.contract.checkAccess({ from: user })).to.equal(false)
    })

    it('checks that admin has access rights (defined by contract)', async function () {
      expect(await this.contract.checkAccess({ from: admin })).to.equal(true)
    })

    it('checks that manager has access rights (granted at runtime)', async function () {
      expect(await this.contract.checkAccess({ from: manager })).to.equal(true)
    })
  })

  describe('Document creation', function () {
    it('checks that owner cannot create documents (transaction reverts: Unauthorized)', async function () {
      await expectRevert(
        this.contract.create('0123456789abcdef', '{"key":"owner"}', '0x', { from: owner }),
        'Unauthorized'
      )
    })

    it('checks that user cannot create documents (transaction reverts: Unauthorized)', async function () {
      await expectRevert(
        this.contract.create('3456789abcdef0123', '{"key":"user"}', '0x', { from: user }),
        'Unauthorized'
      )
    })

    it('checks that admin can create documents being also a manager (Created event emitted)', async function () {
      const receipt = await this.contract.create('123456789abcdef0', '{"by":"admin"}', '0x', { from: admin })
      expectEvent(receipt, 'Created', { id: '123456789abcdef0' })
    })

    it('checks that manager can create documents (Created event emitted)', async function () {
      const receipt = await this.contract.create('23456789abcdef01', '{"by":"manager"}', '0x', { from: manager })
      expectEvent(receipt, 'Created', { id: '23456789abcdef01' })
    })
  })

  describe('Document access', function () {
    it('checks that manager can get document by id (data verified)', async function () {
      const d = await this.contract.get('123456789abcdef0', { from: manager })
      expect(d.data).to.equal('{"by":"admin"}')
      expect(d.signature).to.equal('0x')
      expect(d.revoked).to.equal(false)
      expect(d.removed).to.equal(false)
    })

    it('checks that any user can get document by id (data verified)', async function () {
      const d1 = await this.contract.get('123456789abcdef0', { from: ZERO_ADDRESS })
      expect(d1.data).to.equal('{"by":"admin"}')
      expect(d1.signature).to.equal('0x')
      expect(d1.revoked).to.equal(false)
      expect(d1.removed).to.equal(false)

      const d2 = await this.contract.get('23456789abcdef01', { from: ZERO_ADDRESS })
      expect(d2.data).to.equal('{"by":"manager"}')
      expect(d2.signature).to.equal('0x')
      expect(d2.revoked).to.equal(false)
      expect(d2.removed).to.equal(false)
    })

    it('checks that an ordinary user cannot modify documents (transaction reverts: Unauthorized)', async function () {
      const id = 'useruseruseruser'
      await this.contract.create(id, 'document created', '0x0123', { from: manager })
      await this.contract.get(id)
      await expectRevert(this.contract.update(id, 'document updated', '0x4567', 'update test', { from: user }), 'Unauthorized')
      await expectRevert(this.contract.revoke(id, 'revoke test', { from: user }), 'Unauthorized')
      await expectRevert(this.contract.remove(id, 'remove test', { from: user }), 'Unauthorized')
      await this.contract.remove(id, 'remove test', { from: manager })
    })

    it('returns an error for non-existent document (transaction reverts: Document not found)', async function () {
      await expectRevert(
        this.contract.get('nosuchdocument', { from: ZERO_ADDRESS }),
        'Document not found'
      )
    })
  })

  describe('Data storage validation', function () {
    it('checks that data can contain UTF-8 JSON string (including cyrillic letters)', async function () {
      await this.contract.create('utf8utf8utf8utf8', '{"by":"manager","utf8":"Строка в UTF-8"}', '0x', { from: manager })
      const d = await this.contract.get('utf8utf8utf8utf8', { from: ZERO_ADDRESS })
      expect(JSON.parse(d.data).utf8).to.equal('Строка в UTF-8')
    })

    const signature = '0xc25e0401160a000605025ef0ec77000a09106295ef5c2d3bdb7b324500ff53940ffa24f0e8ec87605d56111a605c22cebc307db1a6eac3efe4a932bf67f30100855df8d7011f737022bc1b6c0981649545adbf5e7f7687665469433a2a3da703'
    it('checks that a digital signature is properly saved and retrieved', async function () {
      await this.contract.create('longsignature', 'signature check', signature, { from: manager })
      const d = await this.contract.get('longsignature', { from: ZERO_ADDRESS })
      expect(d.signature).to.equal(signature)
    })
  })

  describe('Document life cycle', function () {
    it('creates a document (Created event emitted, data verified)', async function () {
      const receipt = await this.contract.create('0000000000000000', 'document created', '0x1234', { from: manager })
      expectEvent(receipt, 'Created', { id: '0000000000000000' })
      const d = await this.contract.get('0000000000000000')
      expect(d.data).to.equal('document created')
      expect(d.signature).to.equal('0x1234')
      expect(d.revoked).to.equal(false)
      expect(d.removed).to.equal(false)
    })

    it('updates a document (Updated event emitted, data verified)', async function () {
      const receipt = await this.contract.update('0000000000000000', 'document updated', '0x5678', 'update test', { from: manager })
      expectEvent(receipt, 'Updated', { id: '0000000000000000', reason: 'update test' })
      const d = await this.contract.get('0000000000000000')
      expect(d.data).to.equal('document updated')
      expect(d.signature).to.equal('0x5678')
      expect(d.revoked).to.equal(false)
      expect(d.removed).to.equal(false)
    })

    it('revokes a document (Revoked event emitted, data verified)', async function () {
      const receipt = await this.contract.revoke('0000000000000000', 'revoke test', { from: manager })
      expectEvent(receipt, 'Revoked', { id: '0000000000000000', reason: 'revoke test' })
      const d = await this.contract.get('0000000000000000')
      expect(d.data).to.equal('document updated')
      expect(d.signature).to.equal('0x5678')
      expect(d.revoked).to.equal(true)
      expect(d.removed).to.equal(false)
    })

    it('deletes a document (Removed event emitted, data not accessible anymore)', async function () {
      const receipt = await this.contract.remove('0000000000000000', 'remove test', { from: manager })
      expectEvent(receipt, 'Removed', { id: '0000000000000000', reason: 'remove test' })
      const d = await this.contract.get('0000000000000000')
      expect(d.data).to.equal('')
      expect(d.signature).to.equal('0x')
      expect(d.revoked).to.equal(true)
      expect(d.removed).to.equal(true)
    })
  })

  describe('Exceptions', function () {
    const id  = 'exceptions'

    it('checks that the same document cannot be created twice (transaction reverts: Document already exists)', async function () {
      await this.contract.create(id, 'document created', '0x0123', { from: manager })
      await expectRevert(
        this.contract.create(id, 'document created', '0x0123', { from: manager }),
        'Document already exists'
      )
    })

    it('checks that the same document cannot be revoked twice (transaction reverts: Document revoked)', async function () {
      await this.contract.revoke(id, 'revocation test', { from: manager })
      await expectRevert(
        this.contract.revoke(id, 'revocation test', { from: manager }),
        'Document revoked'
      )
    })

    it('checks that the same document cannot be removed twice (transaction reverts: Document was removed)', async function () {
      await this.contract.remove(id, 'removal test', { from: manager })
      await expectRevert(
        this.contract.remove(id, 'removal test', { from: manager }),
        'Document was removed'
      )
    })

    it('checks that a deleted document cannot be recreated (transaction reverts: Document was removed)', async function () {
      await expectRevert(
        this.contract.create(id, 'document created', '0x0123', { from: manager }),
        'Document was removed'
      )
    })

    const id2 = 'not existing'

    it('checks that non-existing document cannot be updated (transaction reverts: Document not found)', async function () {
      await expectRevert(
        this.contract.update(id2, 'data', '0x', 'missing', { from: manager }),
        'Document not found'
      )
    })

    it('checks that non-existing document cannot be revoked (transaction reverts: Document not found)', async function () {
      await expectRevert(
        this.contract.revoke(id2, 'missing', { from: manager }),
        'Document not found'
      )
    })

    it('checks that non-existing document cannot be removed (transaction reverts: Document not found)', async function () {
      await expectRevert(
        this.contract.remove(id2, 'missing', { from: manager }),
        'Document not found'
      )
    })
  })
})

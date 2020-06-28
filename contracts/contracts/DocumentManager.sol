//
// Digital Diploma Management System contract
// (c) 2020 by Irina Semyonova
//
// This work is licensed under a
// Creative Commons Attribution-ShareAlike 4.0 International License
// (CC-BY-SA 4.0)
//
// You should have received a copy of the license along with this
// work. If not, see <http://creativecommons.org/licenses/by-sa/4.0/>.
//

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/AccessControl.sol";


contract DocumentManager is Initializable, AccessControlUpgradeSafe {
    struct Document {
        uint256 date; // registration timestamp in blockchain time format
        bool revoked; // true if the document was revoked
        bool removed; // true if the document was removed (hidden)
        string data; // document data as JSON UTF-8 string
        bytes signature; // OpenPGP detached signature for data string
    }

    // Contract code version
    string public constant VERSION = "0.0.2";

    // Access control roles
    bytes32 public constant MANAGER = keccak256("MANAGER");

    // Document storage
    mapping(string => Document) private documents;

    // Constructor replacement for upgradeable contract
    function initialize() public initializer() {
        // Grant DEFAULT_ADMIN_ROLE to owner
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Grant MANAGER role to ourself and known account(s)
        grantRole(MANAGER, msg.sender);
        grantRole(MANAGER, 0xa7bdB348b9d7af4D23431D5213f0B5D9bd667C8D);
        grantRole(MANAGER, 0x84274Bb270D593Ad54e5Ff705B0A486A858abF88);
    }

    // Events
    event Created(string id);
    event Updated(string id, string reason);
    event Revoked(string id, string reason);
    event Removed(string id, string reason);

    // Modifiers
    modifier onlyManager() {
        require(hasRole(MANAGER, msg.sender), "Unauthorized");
        _;
    }

    modifier created(string memory id) {
        require(documents[id].date != 0, "Document not found");
        _;
    }

    modifier exists(string memory id) {
        require(!documents[id].removed, "Document was removed");
        _;
    }

    modifier valid(string memory id) {
        require(!documents[id].revoked, "Document revoked");
        _;
    }

    // Check access rights of current account
    function checkAccess() public view returns (bool) {
        return hasRole(MANAGER, msg.sender);
    }

    // Create new document record
    function create(
        string memory id,
        string memory data,
        bytes memory signature
    ) public onlyManager() {
        // Ensure it does not exist already (maybe removed)
        require(!documents[id].removed, "Document was removed");
        require(documents[id].date == 0, "Document already exists");

        // Reference to storage item
        Document storage doc = documents[id];
        doc.date = block.timestamp;
        doc.data = data;
        doc.signature = signature;

        emit Created(id);
    }

    // Update existing document
    function update(
        string memory id,
        string memory data,
        bytes memory signature,
        string memory reason
    ) public onlyManager() created(id) exists(id) valid(id) {
        Document storage doc = documents[id];
        doc.date = block.timestamp;
        doc.data = data;
        doc.signature = signature;

        emit Updated(id, reason);
    }

    // Revoke existing document (keep visible, but )
    function revoke(string memory id, string memory reason)
        public
        onlyManager()
        created(id)
        exists(id)
        valid(id)
    {
        Document storage doc = documents[id];
        doc.date = block.timestamp;
        doc.revoked = true;

        emit Revoked(id, reason);
    }

    // Remove existing document
    function remove(string memory id, string memory reason)
        public
        onlyManager()
        created(id)
        exists(id)
    {
        Document storage doc = documents[id];
        doc.date = block.timestamp;
        doc.removed = true;
        delete doc.data;
        delete doc.signature;

        emit Removed(id, reason);
    }

    function get(string memory id) public view created(id) returns (Document memory doc) {
        doc = documents[id];
    }
}

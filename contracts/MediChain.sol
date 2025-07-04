// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MediChain {
    struct MedicalRecord {
        string ipfsHash;
        address uploadedBy;
        uint256 timestamp;
    }

    struct AccessRequest {
        bool approved;
    }

    mapping(address => MedicalRecord[]) private records; // patient => records
    mapping(address => mapping(address => AccessRequest)) public accessRequests; // patient => doctor => request

    event RecordUploaded(address indexed patient, string ipfsHash);
    event AccessRequested(address indexed doctor, address indexed patient);
    event AccessApproved(address indexed patient, address indexed doctor);

    modifier onlyPatient(address patient) {
        require(msg.sender == patient, "Only patient can do this.");
        _;
    }

    function uploadRecord(string calldata ipfsHash) external {
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");

        records[msg.sender].push(MedicalRecord({
            ipfsHash: ipfsHash,
            uploadedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit RecordUploaded(msg.sender, ipfsHash);
    }

    function getMyRecords() external view returns (MedicalRecord[] memory) {
        return records[msg.sender];
    }

    function requestAccess(address patient) external {
        require(msg.sender != patient, "Self-request not allowed");
        require(!accessRequests[patient][msg.sender].approved, "Already approved");

        accessRequests[patient][msg.sender] = AccessRequest(false);
        emit AccessRequested(msg.sender, patient);
    }

    function approveAccess(address doctor) external onlyPatient(msg.sender) {
        AccessRequest storage req = accessRequests[msg.sender][doctor];
        require(!req.approved, "Already approved");

        req.approved = true;
        emit AccessApproved(msg.sender, doctor);
    }

    function getRecordsOfPatient(address patient) external view returns (MedicalRecord[] memory) {
        require(accessRequests[patient][msg.sender].approved, "Access denied");
        return records[patient];
    }

    function checkAccess(address patient, address doctor) external view returns (bool) {
        return accessRequests[patient][doctor].approved;
    }
}

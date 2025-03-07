// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Groth16Verifier.sol";

contract PoopTracker {
    struct PoopEvent {
        address userAddress;
        bytes32 cidHash;
    }

    event PoopEventLogged(
        address indexed user,
        bytes32 indexed cidHash
    );

    mapping(address => PoopEvent[]) public userPoopEvents;

    Groth16Verifier public verifierContract;

    constructor(address _verifierAddress) {
        verifierContract = Groth16Verifier(_verifierAddress);
    }

    function logPoopEvent(
        bytes32 _cidHash,
        uint256[2] memory _pA,
        uint256[2][2] memory _pB,
        uint256[2] memory _pC,
        uint256[1] memory _pubSignals
    ) external {
        // Verify the proof
        require (
            verifierContract.verifyProof(_pA, _pB, _pC, _pubSignals),
            "Invalid proof"
        );

        // Store only userAddress and cidHash
        userPoopEvents[msg.sender].push(PoopEvent(msg.sender, _cidHash));

        emit PoopEventLogged(msg.sender, _cidHash);
    }
}

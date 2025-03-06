// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PoopTracker {
    struct PoopEvent {
        address userAddress;
        int32 latitude;
        int32 longitude;
        uint32 timestamp;
        uint16 sessionDuration;
    }

    event PoopEventLogged(
        address indexed user,
        int32 latitude,
        int32 longitude,
        uint32 timestamp,
        uint16 sessionDuration
    );

    mapping(address => PoopEvent[]) public userPoopEvents;

    function logPoopEvent(
        int32 _latitude,
        int32 _longitude,
        uint32 _timestamp,
        uint16 _sessionDuration
    ) external {
        require(_sessionDuration > 0, "Session duration must be greater than 0");

        userPoopEvents[msg.sender].push(
            PoopEvent(msg.sender, _latitude, _longitude, _timestamp, _sessionDuration)
        );

        emit PoopEventLogged(msg.sender, _latitude, _longitude, _timestamp, _sessionDuration);
    }
}

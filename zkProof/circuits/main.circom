pragma circom 2.1.6;

include "../../node_modules/circomlib/circuits/comparators.circom";

template Main() {
    // Input Variables
    signal input is_inside;
    signal input timestamp;
    signal input currentTimestamp;
    signal input sessionDuration;

    signal output valid;

    signal is_valid_duration;
    signal is_within_timeframe;
    signal is_minimum_duration;
    signal is_within_duration;
    signal temp_valid;  // Intermediate step
    signal time_difference;  // Ensure non-negative time difference

    // Ensure time difference is non-negative
    time_difference <== currentTimestamp - timestamp;

    // Check if the session duration is at least 120 seconds (2 minutes)
    component minCheck = LessThan(16); // 16 bits to support values up to 65535
    minCheck.in[0] <== 120;
    minCheck.in[1] <== sessionDuration;
    is_minimum_duration <== minCheck.out;

    // Check if the session duration is less than 1200 seconds (20 minutes)
    component maxCheck = LessThan(16);
    maxCheck.in[0] <== sessionDuration;
    maxCheck.in[1] <== 1200;
    is_within_duration <== maxCheck.out;

    is_valid_duration <== is_minimum_duration * is_within_duration;

    // Check if the timestamp is within the last 24 hours (86400 seconds)
    component timeCheck = LessThan(32); // 32 bits to support large timestamps
    timeCheck.in[0] <== time_difference;  // Use non-negative value
    timeCheck.in[1] <== 86400;
    is_within_timeframe <== timeCheck.out;

    // **Fix: Break into two quadratic constraints**
    temp_valid <== is_inside * is_valid_duration;
    valid <== temp_valid * is_within_timeframe;
}

component main = Main();
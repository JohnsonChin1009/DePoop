#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const { program } = require("commander");

// Set up the command line interface
program
  .name("zkExecute")
  .description("Generate zero-knowledge proofs from input data")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a ZK proof")
  .requiredOption("-i, --is-inside <number>", "Is inside value", parseInt)
  .requiredOption("-t, --timestamp <number>", "Timestamp value", parseInt)
  .requiredOption("-c, --current-timestamp <number>", "Current timestamp value", parseInt)
  .requiredOption("-d, --session-duration <number>", "Session duration value", parseInt)
  .option("-w, --wasm <path>", "Path to the .wasm file", "public/main.wasm")
  .option("-z, --zkey <path>", "Path to the .zkey file", "public/main_final.zkey")
  .option("-o, --output <path>", "Output file path", "proof.json")
  .action(async (options) => {
    try {
      console.time("Proof generation");
      console.log("Starting proof generation...");
      
      // Build circuit input
      const circuitInput = {
        is_inside: Number(options.isInside, 10),  // ✅ Correct
        timestamp: Number(options.timestamp, 10),  // ✅ Correct
        currentTimestamp: Number(options.currentTimestamp, 10),  // ✅ Correct
        sessionDuration: Number(options.sessionDuration, 10)  // ✅ Correct
      };
      
      console.log("Circuit input:", JSON.stringify({
        is_inside: options.isInside,
        timestamp: options.timestamp,
        currentTimestamp: options.currentTimestamp,
        sessionDuration: options.sessionDuration
      }, null, 2));
      
      // Check if files exist
      const wasmPath = path.resolve(options.wasm);
      const zkeyPath = path.resolve(options.zkey);
      
      if (!fs.existsSync(wasmPath)) {
        console.error(`Error: WASM file not found at ${wasmPath}`);
        process.exit(1);
      }
      
      if (!fs.existsSync(zkeyPath)) {
        console.error(`Error: zkey file not found at ${zkeyPath}`);
        process.exit(1);
      }
      
      // Generate the proof
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        circuitInput,
        wasmPath,
        zkeyPath
      );
      
      // Write the proof to a file
      const proofOutput = {
        proof,
        publicSignals
      };
      
      fs.writeFileSync(options.output, JSON.stringify(proofOutput, null, 2));
      
      console.log(`Proof successfully generated and saved to ${options.output}`);
      console.timeEnd("Proof generation");
    } catch (error) {
      console.error("Error generating proof:", error);
      process.exit(1);
    }
  });

program.parse();
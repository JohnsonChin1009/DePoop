const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoopTracker", function () {
    let PoopTracker, poopTracker, Verifier, verifier, owner, user;

    before(async function () {
        [owner, user] = await ethers.getSigners(); // Get test accounts

        // Deploy the zkProof Verifier contract
        Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();

        // Deploy PoopTracker and link it to the Verifier contract
        PoopTracker = await ethers.getContractFactory("PoopTracker");
        poopTracker = await PoopTracker.deploy(verifier.address);
        await poopTracker.deployed();
    });

    it("Should log a poop event with valid zkProof", async function () {
        const proof = "0x1234"; // Replace with actual proof
        const cidHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ValidCID"));

        await expect(poopTracker.connect(user).logPoopEvent(proof, cidHash))
            .to.emit(poopTracker, "PoopEventLogged")
            .withArgs(user.address, cidHash);
        
        const storedEvent = await poopTracker.userPoopEvents(user.address, 0);
        expect(storedEvent.cidHash).to.equal(cidHash);
    });

    it("Should reject invalid zkProof", async function () {
        const proof = "0x5678"; // Mock invalid proof
        const cidHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("InvalidCID"));

        await expect(
            poopTracker.connect(user).logPoopEvent(proof, cidHash)
        ).to.be.revertedWith("Invalid proof");
    });
});
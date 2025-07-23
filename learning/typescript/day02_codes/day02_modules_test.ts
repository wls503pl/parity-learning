/**
 * TypeScript Module System Testing and Blockchain Simulation
 *
 * Author:  Peile Wu
 * Email:   peile.wu.1990@gmail.com
 * Date:    2025/7/23
 * Purpose: Comprehensive testing of TypeScript modules and practical blockchain simulation,
 *          to gain competence for blockchain development positions.
 *
 * Day 02:  Covers module import testing, block validation scenarios, hash calculation,
 *          namespace functionality, transaction validation, and complete blockchain
 *          simulation with genesis block and chain linking.
 *
 * Additional: This file demonstrates practical blockchain concepts including:
 *             - Comprehensive module import and usage testing
 *             - Valid and invalid block validation scenarios
 *             - Hash calculation and timestamp utilities
 *             - Transaction creation and validation
 *             - Complete blockchain simulation with 4-block chain
 *
 *             To run this file:
 *             1. Ensure day02_modules.ts is in the same directory
 *             2. Execute: npx tsx .\day02_modules_test.ts
 *             (This file tests all functionality from day02_modules.ts)
 */

// day02_modules_test.ts
//Test module import and use

import {
  Block,
  BlockValidator,
  BlockchainHelper,
  BlockStatus,
  NetworkType,
  BlockchainUtils,
} from "./day02_modules.js";

console.log("🚀 Start testing the TypeScript module system.\n");

// Test 1: Basic type usage
console.log("=== Test 1: Type Definition ===");
const blockStatus: BlockStatus = "confirmed";
const network: NetworkType = "polkadot";
console.log(`Block status: ${blockStatus}`);
console.log(`Network Type: ${network}\n`);

// Test 2: Creating and verifying a valid block
console.log("=== Test 2: Valid Block Verification ===");
const validBlock: Block = {
  hash: "abc123def456",
  timestamp: BlockchainHelper.getCurrentTimestamp() - 5000, // 5 seconds before
  data: {
    transactions: ["tx1", "tx2"],
    version: 1,
    message: "This is a valid block.",
  },
};

console.log("Block data:", {
  hash: validBlock.hash,
  timestamp: BlockchainHelper.formatTimestamp(validBlock.timestamp),
  data: validBlock.data,
});
BlockValidator.validate(validBlock);
console.log();

// Test 3: Verify invalid blocks
console.log("=== Test 3: Invalid Block Verification ===");
const invalidBlocks: Block[] = [
  {
    hash: "", // Empty hash
    timestamp: Date.now(),
    data: { message: "Invalid block 1." },
  },
  {
    hash: "valid_hash",
    timestamp: Date.now() + 10000, // Future time (10s later)
    data: { message: "Invalid block 2." },
  },
  {
    hash: "another_hash",
    timestamp: Date.now(),
    data: undefined, // No data
  },
];

invalidBlocks.forEach((block, index) => {
  console.log(`\nTesting for invalid blocks ${index + 1}:`);
  BlockValidator.validate(block);
});
console.log();

// Test 4: Hash calculation function
console.log("=== Test 4: Hash calculation ===");
const testData = [
  "Hello World",
  JSON.stringify(validBlock.data),
  "Blockchain data testing",
];

testData.forEach((data, index) => {
  const hash = BlockchainHelper.calculateHash(data);
  console.log(`Data ${index + 1}: "${data}" => Hash: ${hash}`);
});
console.log();

// Test 5: Namespace usage=
console.log("=== Test 5: Namespace functionality ===");
const transaction: BlockchainUtils.Transaction = {
  from: "Alice",
  to: "Bob",
  amount: 100,
  timestamp: BlockchainHelper.getCurrentTimestamp(),
};

console.log("Transaction data:", transaction);
const isValidTransaction =
  BlockchainUtils.TransactionValidator.validate(transaction);
console.log(
  `Transaction verification results: ${
    isValidTransaction ? "✅ Valid" : "❌ Invalid"
  }`
);

// Test invalid transaction
const invalidTransaction: BlockchainUtils.Transaction = {
  from: "Alice",
  to: "Alice", // Transfer to yourself
  amount: -50, // Negative amount
  timestamp: BlockchainHelper.getCurrentTimestamp(),
};

console.log("Invalid transaction data:", invalidTransaction);
const isInvalidTransaction =
  BlockchainUtils.TransactionValidator.validate(invalidTransaction);
console.log(
  `Invalid transaction verification result: ${
    isInvalidTransaction ? "✅ Valid" : "❌ Invalid"
  }`
);
console.log();

// Test 6: Create a simple blockchain
console.log("=== Test 6: Simple blockchain simulation ===");
const blockchain: Block[] = [];

// Create the genesis block
const genesisBlock: Block = {
  hash: "0000000000000000", // Genesis block special hash
  timestamp: BlockchainHelper.getCurrentTimestamp(),
  data: { message: "Genesis Block", genesis: true },
};

blockchain.push(genesisBlock);
console.log("✅ Genesis block created");

// Add more blocks
for (let i = 1; i <= 3; i++) {
  const blockData = {
    blockNumber: i,
    previousHash: blockchain[blockchain.length - 1].hash,
    transactions: [`transaction_${i}_1`, `transaction_${i}_2`],
  };

  const newBlock: Block = {
    hash: BlockchainHelper.calculateHash(
      JSON.stringify(blockData) + Date.now()
    ),
    timestamp: BlockchainHelper.getCurrentTimestamp(),
    data: blockData,
  };

  if (BlockValidator.validate(newBlock)) {
    blockchain.push(newBlock);
    console.log(`✅ Block ${i} added to chain`);
  }
}

console.log(`\n📊 Blockchain Summary:`);
console.log(`Total number of blocks: ${blockchain.length}`);
console.log(
  `Latest block time: ${BlockchainHelper.formatTimestamp(
    blockchain[blockchain.length - 1].timestamp
  )}`
);

// Display the complete blockchain
console.log("\n📋 Full blockchain:");
blockchain.forEach((block, index) => {
  console.log(`Block ${index}:`);
  console.log(`  Hash: ${block.hash}`);
  console.log(
    `  Timestamp: ${BlockchainHelper.formatTimestamp(block.timestamp)}`
  );
  console.log(`  Data: ${JSON.stringify(block.data)}`);
  console.log("");
});

console.log(
  "🎉 All tests completed! Successfully learned the TypeScript module system!"
);

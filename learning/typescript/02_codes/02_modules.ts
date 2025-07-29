/**
 * TypeScript Module System and Blockchain Utilities
 *
 * Author:  Peile Wu
 * Email:   peile.wu.1990@gmail.com
 * Date:    2025/7/23
 * Purpose: Learning TypeScript module exports, imports, and namespace organization,
 *          to gain competence for blockchain development positions.
 *
 * Day 02:  Covers type definitions, interface exports, class modules, utility classes,
 *          namespace organization, and blockchain-specific data structures with
 *          comprehensive validation logic.
 *
 * Additional: This file serves as a comprehensive module library including:
 *             - Blockchain type definitions (BlockStatus, NetworkType)
 *             - Block interface and validation classes
 *             - Utility functions for hash calculation and timestamps
 *             - Namespace organization for transaction utilities
 *
 *             To use this module:
 *             1. Import specific exports: import { Block, BlockValidator } from "./02_modules.js"
 *             2. Run tests with: npx tsx .\02_modules_test.ts
 *             (This file is designed to be imported by other modules)
 */

// 02_modules.ts
// Learning objectives: TypeScript module system and namespaces

// 1. Type definition - export using export
export type BlockStatus = "pending" | "confirmed" | "rejected";
export type NetworkType = "ethereum" | "polkadot" | "bitcoin";

// 2. Interface definition
export interface Block {
  hash: string;
  timestamp: number;
  data: any;
}

// 3. Block Validator Class
export class BlockValidator {
  static validate(block: Block): boolean {
    // Check if hash exists and is a string
    if (!block.hash || typeof block.hash !== "string") {
      console.log("❌ Verification failed: Invalid hash.");
      return false;
    }

    // Check that the timestamp is reasonable (cannot be in the future)
    if (!block.timestamp || block.timestamp > Date.now()) {
      console.log("❌ Validation failed: Invalid timestamp.");
      return false;
    }

    // Check if the data field exists
    if (block.data === undefined) {
      console.log("❌ Validation failed: Data field missing.");
      return false;
    }

    console.log("✅ Block verification passed.");
    return true;
  }
}

// 4. Blockchain Help Tools
export class BlockchainHelper {
  static calculateHash(data: string): string {
    // Simple hash calculation (SHA256, etc. will be used in actual projects)
    let hash = 0;
    if (data.length === 0) return "0";

    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to a 32-bit integer
    }

    return Math.abs(hash).toString(16);
  }

  static getCurrentTimestamp(): number {
    return Date.now();
  }

  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}

// 5. Namespaced versions (shows another way to organize your code)
export namespace BlockchainUtils {
  export interface Transaction {
    from: string;
    to: string;
    amount: number;
    timestamp: number;
  }

  export class TransactionValidator {
    static validate(tx: Transaction): boolean {
      return tx.amount > 0 && tx.from !== tx.to;
    }
  }
}

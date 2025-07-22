// day02_modules.ts
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
      console.log("❌ Verification failed: invalid hash.");
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

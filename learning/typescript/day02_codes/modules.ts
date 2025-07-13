// Practice: Module system and namespaces
export namespace BlockchainUtils {
  export interface Block {
    hash: string;
    timestamp: number;
    data: any;
  }

  export class BlockValidator {
    static validate(block: Block): boolean {
      // Implementing validation logic
    }
  }
}

export default BlockchainUtils;

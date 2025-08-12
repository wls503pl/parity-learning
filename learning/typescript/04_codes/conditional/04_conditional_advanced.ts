/**
 * TypeScript Conditional Types - Advanced Patterns + infer Keyword
 * Focus: Complex infer usage, recursive conditionals, blockchain data extractors
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 12, 2025
 *
 * Learning Focus:
 * - Advanced infer keyword patterns (multiple, nested)
 * - Recursive conditional types for deep transformations
 * - Complex blockchain data extraction utilities
 * - String template pattern matching
 * - Type-safe API response handling
 *
 * Key Concepts:
 * 1. Multiple infer: Extract multiple types in single conditional
 * 2. Recursive Types: Self-referencing type definitions
 * 3. Pattern Matching: String template literal parsing
 * 4. Deep Transformations: Nested object type manipulation
 */

// =============================================================================
// 0. IMPORTS AND INTERFACES
// =============================================================================

// Observable interface for RxJS compatibility
interface Observable<T> {
  subscribe(observer: (value: T) => void): { unsubscribe(): void };
}

// =============================================================================
// 1. ADVANCED INFER KEYWORD PATTERNS
// =============================================================================

/**
 * Multiple infer in single conditional type
 */
type SwapParameters<T> = T extends (first: infer A, second: infer B) => any
  ? (first: B, second: A) => any
  : never;

type Original = (name: string, age: number) => void;
type Swapped = SwapParameters<Original>; // (first: number, second: string) => any

/**
 * Nested infer extraction
 */
type ExtractNestedPromise<T> = T extends Promise<Promise<infer U>>
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type DoublePromise = Promise<Promise<string>>;
type SinglePromise = Promise<number>;
type NonPromise = boolean;

type Test1 = ExtractNestedPromise<DoublePromise>; // string
type Test2 = ExtractNestedPromise<SinglePromise>; // number
type Test3 = ExtractNestedPromise<NonPromise>; // boolean

/**
 * Complex substrate block data extraction
 */
interface SubstrateBlockHeader {
  number: number;
  hash: string;
  parentHash: string;
  stateRoot: string;
  extrinsicsRoot: string;
}

interface SubstrateExtrinsic {
  method: string;
  section: string;
  args: any[];
  signature?: string;
}

interface SubstrateBlock {
  header: SubstrateBlockHeader;
  extrinsics: SubstrateExtrinsic[];
}

interface SubstrateApiResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

/**
 * Advanced blockchain data extractor
 */
type ExtractBlockData<T> = T extends Promise<infer U>
  ? U extends SubstrateApiResponse<infer R>
    ? R extends { block: infer B }
      ? B
      : R
    : never
  : never;

// Test case
type BlockDataResult = ExtractBlockData<
  Promise<SubstrateApiResponse<{ block: SubstrateBlock }>>
>;
// Result: SubstrateBlock

// =============================================================================
// 2. RECURSIVE CONDITIONAL TYPES
// =============================================================================

/**
 * Deep readonly implementation
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

interface NestedSubstrateData {
  block: {
    header: SubstrateBlockHeader;
    body: {
      extrinsics: SubstrateExtrinsic[];
    };
  };
  events: Array<{
    phase: string;
    event: {
      method: string;
      data: any[];
    };
  }>;
}

type ReadonlySubstrateData = DeepReadonly<NestedSubstrateData>;
// All properties and nested properties become readonly

/**
 * Deep partial implementation
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

type PartialSubstrateData = DeepPartial<NestedSubstrateData>;
// All properties and nested properties become optional

/**
 * Deep required implementation
 */
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepRequired<T[P]>
    : T[P];
};

/**
 * Flatten nested object types
 */
type FlattenObject<T, Prefix extends string = ""> = {
  [K in keyof T as T[K] extends object
    ? T[K] extends Function
      ? `${Prefix}${string & K}`
      : FlattenObject<T[K], `${Prefix}${string & K}_`> extends infer U
      ? U extends Record<string, any>
        ? keyof U
        : never
      : never
    : `${Prefix}${string & K}`]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : FlattenObject<T[K], `${Prefix}${string & K}_`>[keyof FlattenObject<
          T[K],
          `${Prefix}${string & K}_`
        >]
    : T[K];
};

// =============================================================================
// 3. SUBSTRATE CHAIN SPECIFIC RECURSIVE TYPES
// =============================================================================

/**
 * Substrate storage key path extraction
 */
type StorageKeyPath<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? `${string & K}` | `${string & K}.${StorageKeyPath<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : never;

interface SubstrateStorage {
  System: {
    Account: Record<string, any>;
    BlockHash: Record<number, string>;
    Number: number;
  };
  Balances: {
    TotalIssuance: number;
    Locks: Record<string, any[]>;
  };
  Timestamp: {
    Now: number;
  };
}

type StoragePaths = StorageKeyPath<SubstrateStorage>;
// "System" | "System.Account" | "System.BlockHash" | "System.Number" |
// "Balances" | "Balances.TotalIssuance" | "Balances.Locks" |
// "Timestamp" | "Timestamp.Now"

/**
 * Recursive event filter
 */
type FilterEventsByType<T, EventType extends string> = T extends readonly any[]
  ? T extends readonly [infer First, ...infer Rest]
    ? First extends { type: EventType }
      ? [First, ...FilterEventsByType<Rest, EventType>]
      : FilterEventsByType<Rest, EventType>
    : []
  : never;

type SubstrateEvents = readonly [
  { type: "NewBlock"; data: SubstrateBlock },
  { type: "Transfer"; data: { from: string; to: string; amount: number } },
  { type: "NewBlock"; data: SubstrateBlock },
  { type: "Error"; data: { message: string } }
];

type NewBlockEvents = FilterEventsByType<SubstrateEvents, "NewBlock">;
// [{ type: 'NewBlock'; data: SubstrateBlock }, { type: 'NewBlock'; data: SubstrateBlock }]

// =============================================================================
// 4. COMPLEX SUBSTRATE API TYPE EXTRACTORS
// =============================================================================

/**
 * RPC method signature extractor with error handling
 */
interface SubstrateRPCError {
  code: number;
  message: string;
  data?: any;
}

type SafeRPCResult<T> =
  | { success: true; data: T }
  | { success: false; error: SubstrateRPCError };

/**
 * Extract RPC method return type with nested Promise and Result handling
 */
type ExtractRPCReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer U>
    ? U extends SafeRPCResult<infer D>
      ? D
      : U
    : R extends SafeRPCResult<infer D>
    ? D
    : R
  : never;

// Example RPC methods
declare function getBlock(
  hash?: string
): Promise<SafeRPCResult<SubstrateBlock>>;
declare function getStorage(key: string): Promise<SafeRPCResult<string | null>>;
declare function subscribeNewHeads(): Promise<
  SafeRPCResult<Observable<SubstrateBlockHeader>>
>;

type BlockReturnType = ExtractRPCReturnType<typeof getBlock>; // SubstrateBlock
type StorageReturnType = ExtractRPCReturnType<typeof getStorage>; // string | null

/**
 * Substrate pallet method extractor
 */
interface SubstratePallet {
  name: string;
  storage: Record<string, any>;
  calls: Record<string, (...args: any[]) => any>;
  events: Record<string, any>;
  errors: Record<string, any>;
}

type ExtractPalletMethods<T extends SubstratePallet> = {
  [K in keyof T["calls"]]: T["calls"][K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<SafeRPCResult<R>>
    : never;
};

type ExtractPalletEvents<T extends SubstratePallet> = keyof T["events"];

type ExtractPalletStorage<T extends SubstratePallet> = keyof T["storage"];

// =============================================================================
// 5. ADVANCED PATTERN MATCHING WITH INFER
// =============================================================================

/**
 * Substrate extrinsic signature parser
 */
type ParseExtrinsicCall<T extends string> =
  T extends `${infer Pallet}::${infer Method}`
    ? { pallet: Pallet; method: Method }
    : T extends `${infer Pallet}.${infer Method}`
    ? { pallet: Pallet; method: Method }
    : { pallet: never; method: never };

type Transfer = ParseExtrinsicCall<"Balances::transfer">; // { pallet: "Balances"; method: "transfer" }
type Remark = ParseExtrinsicCall<"System.remark">; // { pallet: "System"; method: "remark" }

/**
 * Event topic extraction
 */
type ExtractEventTopics<T> = T extends `${string}(${infer Topics})`
  ? Topics extends `${infer First},${infer Rest}`
    ? [First, ...ExtractEventTopics<`dummy(${Rest})`>]
    : Topics extends ""
    ? []
    : [Topics]
  : never;

type TopicList = ExtractEventTopics<"Transfer(address,address,uint256)">;
// ["address", "address", "uint256"]

/**
 * Substrate runtime version parser
 */
type ParseRuntimeVersion<T extends string> =
  T extends `${infer Name}-${infer Version}`
    ? { name: Name; version: Version }
    : T extends `${infer Name}`
    ? { name: Name; version: undefined }
    : never;

type RuntimeInfo = ParseRuntimeVersion<"polkadot-9420">; // { name: "polkadot"; version: "9420" }

// =============================================================================
// 6. CONDITIONAL TYPE UTILITIES FOR BLOCKCHAIN
// =============================================================================

/**
 * Type-safe blockchain address validator
 */
type IsValidSubstrateAddress<T extends string> =
  T extends `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}`
    ? true
    : false;

/**
 * Fixed Extrinsic weight calculator type
 */
interface ExtrinsicWeight {
  refTime: number;
  proofSize: number;
}

// Simplified array length counter to avoid recursion issues
type Length<T extends readonly any[]> = T["length"];

type CalculateWeight<T extends SubstrateExtrinsic[]> = ExtrinsicWeight & {
  totalExtrinsics: T["length"];
};

/**
 * Substrate event aggregator
 */
type AggregateEvents<T extends readonly any[]> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends { type: infer EventType }
    ? Rest extends readonly any[]
      ? EventType | AggregateEvents<Rest>
      : EventType
    : never
  : never;

// =============================================================================
// 7. PRACTICAL BLOCKCHAIN SCENARIOS
// =============================================================================

/**
 * Multi-signature transaction validator
 */
interface MultiSigTransaction {
  threshold: number;
  signatories: string[];
  signatures: string[];
}

type IsMultiSigValid<T extends MultiSigTransaction> =
  T["signatures"]["length"] extends infer L
    ? T["threshold"] extends infer Th
      ? L extends number
        ? Th extends number
          ? L extends Th
            ? true
            : false
          : false
        : false
      : false
    : false;

/**
 * Substrate balance operation types
 */
type BalanceOperation<T> = T extends "transfer"
  ? { from: string; to: string; amount: bigint }
  : T extends "mint"
  ? { to: string; amount: bigint }
  : T extends "burn"
  ? { from: string; amount: bigint }
  : never;

type TransferOp = BalanceOperation<"transfer">; // { from: string; to: string; amount: bigint }
type MintOp = BalanceOperation<"mint">; // { to: string; amount: bigint }
type BurnOp = BalanceOperation<"burn">; // { from: string; amount: bigint }

/**
 * Fixed Runtime upgrade compatibility checker
 */
// Helper type for numeric comparison
type IsGreater<A extends number, B extends number> = A extends B
  ? false
  : A extends 0
  ? false
  : B extends 0
  ? true
  : // Simple comparison for small numbers, fallback to never for complex cases
  [A, B] extends [1, 0]
  ? true
  : [A, B] extends [2, 0 | 1]
  ? true
  : [A, B] extends [3, 0 | 1 | 2]
  ? true
  : [A, B] extends [4, 0 | 1 | 2 | 3]
  ? true
  : [A, B] extends [5, 0 | 1 | 2 | 3 | 4]
  ? true
  : // For larger numbers, we can't determine at compile time
    never;

type IsRuntimeCompatible<Old, New> = Old extends { specVersion: infer OldSpec }
  ? New extends { specVersion: infer NewSpec }
    ? OldSpec extends number
      ? NewSpec extends number
        ? OldSpec extends NewSpec
          ? "same"
          : IsGreater<NewSpec, OldSpec> extends true
          ? "upgrade"
          : IsGreater<OldSpec, NewSpec> extends true
          ? "downgrade"
          : "unknown"
        : "invalid"
      : "invalid"
    : "invalid"
  : "invalid";

// =============================================================================
// 8. COMPLEX SUBSTRATE DATA TRANSFORMERS
// =============================================================================

/**
 * Block header field extractor with validation
 */
type ExtractHeaderField<
  T,
  Field extends keyof SubstrateBlockHeader
> = T extends { header: infer H }
  ? H extends SubstrateBlockHeader
    ? H[Field]
    : never
  : never;

/**
 * Recursive extrinsic method extractor
 */
type ExtractExtrinsicMethods<T> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends { method: infer M }
    ? M extends string
      ? [M, ...ExtractExtrinsicMethods<Rest>]
      : ExtractExtrinsicMethods<Rest>
    : ExtractExtrinsicMethods<Rest>
  : [];

/**
 * Substrate storage diff calculator
 */
type StorageDiff<Before, After> = {
  added: Exclude<keyof After, keyof Before>;
  removed: Exclude<keyof Before, keyof After>;
  modified: {
    [K in keyof Before & keyof After]: Before[K] extends After[K]
      ? never
      : { before: Before[K]; after: After[K] };
  }[keyof Before & keyof After];
};

// =============================================================================
// 9. TESTING & VALIDATION
// =============================================================================

/**
 * Comprehensive test cases for advanced conditional types
 */
namespace AdvancedConditionalTests {
  // Test multiple infer
  type SwapTest = SwapParameters<(x: string, y: number) => boolean>;
  const swappedFunc: SwapTest = (first: number, second: string) => true;

  // Test nested promise extraction
  const doublePromiseTest: ExtractNestedPromise<Promise<Promise<string>>> =
    "hello";

  // Test deep readonly
  const readonlyData: DeepReadonly<NestedSubstrateData> = {
    block: {
      header: {
        number: 1,
        hash: "0x123",
        parentHash: "0x000",
        stateRoot: "0x456",
        extrinsicsRoot: "0x789",
      },
      body: {
        extrinsics: [],
      },
    },
    events: [],
  };
  // readonlyData.block.header.number = 2; // Error: readonly

  // Test storage path extraction
  const storagePath: StoragePaths = "System.Account";

  // Test extrinsic call parsing
  const parsedCall: ParseExtrinsicCall<"Balances::transfer"> = {
    pallet: "Balances",
    method: "transfer",
  };

  // Test balance operations
  const transferOperation: BalanceOperation<"transfer"> = {
    from: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    to: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    amount: BigInt(1000000000000),
  };

  // Test runtime compatibility
  type CompatTest = IsRuntimeCompatible<{ specVersion: 1 }, { specVersion: 2 }>; // 'upgrade'
}

// =============================================================================
// 10. LEARNING CHECKPOINT VALIDATION
// =============================================================================

/**
 * Day 2 Learning Objectives Validation:
 * ✅ Master complex infer usage patterns (multiple infer, nested extraction)
 * ✅ Implement recursive conditional types (DeepReadonly, DeepPartial)
 * ✅ Build type-safe blockchain data extractors
 * ✅ Create advanced pattern matching with string templates
 * ✅ Develop Substrate-specific type utilities
 * ✅ Handle complex API response type extraction
 */

export type {
  SwapParameters,
  ExtractNestedPromise,
  DeepReadonly,
  DeepPartial,
  DeepRequired,
  StorageKeyPath,
  FilterEventsByType,
  ExtractRPCReturnType,
  ExtractPalletMethods,
  ParseExtrinsicCall,
  ExtractEventTopics,
  ParseRuntimeVersion,
  IsValidSubstrateAddress,
  BalanceOperation,
  IsRuntimeCompatible,
  ExtractHeaderField,
  ExtractExtrinsicMethods,
  StorageDiff,
  SafeRPCResult,
  SubstratePallet,
  CalculateWeight,
  Observable,
};

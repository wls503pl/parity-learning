/**
 * TypeScript Template Literal Types - String Type Programming
 * Focus: Type-safe string manipulation, pattern matching, and Substrate event systems
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 13, 2025
 *
 * Learning Focus:
 * - Template literal type basics and advanced patterns
 * - String case transformations (CamelCase, KebabCase, etc.)
 * - Type-safe event naming and RPC method validation
 * - Path parsing and URL construction
 * - Substrate blockchain string type systems
 *
 * Key Concepts:
 * 1. Template Literals: `${string}` pattern matching at type level
 * 2. String Manipulation: Converting between naming conventions
 * 3. Pattern Parsing: Extracting parts from structured strings
 * 4. Type-safe APIs: Compile-time string validation
 * 5. Event Systems: Automatic event handler generation
 *
 * Prerequisites: Understanding of conditional types and infer keyword
 * from 04_conditional_basic.ts and 04_conditional_advanced.ts
 */

// =============================================================================
// 0. IMPORTS AND FOUNDATIONAL TYPES
// =============================================================================

/**
 * Re-using some types from our previous conditional types learning
 * This shows how TypeScript advanced features build upon each other
 */

// From our previous learning - basic conditional types
type IsString<T> = T extends string ? true : false;

// Substrate data types we'll use for practical examples
interface SubstrateBlockHeader {
  number: number;
  hash: string;
  parentHash: string;
  stateRoot: string;
}

interface SubstrateEvent {
  method: string;
  section: string;
  data: unknown[];
}

// =============================================================================
// 1. TEMPLATE LITERAL TYPE BASICS
// =============================================================================

/**
 * Template literal types allow us to create new string literal types
 * by combining existing string literal types using template literal syntax
 */

/**
 * Basic template literal - combining fixed strings
 */
type Greeting<Name extends string> = `Hello, ${Name}!`;

// Test cases - see how specific strings create specific types
type HelloWorld = Greeting<"World">; // "Hello, World!"
type HelloAlice = Greeting<"Alice">; // "Hello, Alice!"

/**
 * Substrate event naming convention
 * In Substrate, events often follow the pattern: pallet_eventName
 */
type SubstrateEventName<
  Pallet extends string,
  Event extends string
> = `${Pallet}_${Event}`;

// Practical examples for common Substrate pallets
type BalanceTransfer = SubstrateEventName<"Balances", "Transfer">; // "Balances_Transfer"
type SystemNewAccount = SubstrateEventName<"System", "NewAccount">; // "System_NewAccount"
type StakingReward = SubstrateEventName<"Staking", "Reward">; // "Staking_Reward"

/**
 * API endpoint generation for Substrate RPC calls
 * This creates type-safe API paths at compile time
 */
type SubstrateRPCEndpoint<
  Module extends string,
  Method extends string
> = `/api/v1/${Module}/${Method}`;

// Examples of type-safe API endpoints
type ChainGetBlock = SubstrateRPCEndpoint<"chain", "getBlock">; // "/api/v1/chain/getBlock"
type StateGetStorage = SubstrateRPCEndpoint<"state", "getStorage">; // "/api/v1/state/getStorage"
type SystemHealth = SubstrateRPCEndpoint<"system", "health">; // "/api/v1/system/health"

/**
 * Version string formatting for Substrate runtime
 */
type RuntimeVersion<
  Name extends string,
  Version extends number
> = `${Name}-${Version}`;

type PolkadotRuntime = RuntimeVersion<"polkadot", 9420>; // "polkadot-9420"
type KusamaRuntime = RuntimeVersion<"kusama", 9370>; // "kusama-9370"

// =============================================================================
// 2. STRING CASE TRANSFORMATIONS
// =============================================================================

/**
 * These utilities convert between different naming conventions
 * Very useful for API integration where frontend uses camelCase
 * but backend/database uses snake_case or kebab-case
 */

/**
 * Convert string to Uppercase
 * Built-in TypeScript utility, but let's understand how it works
 */
type ToUpperCase<S extends string> = Uppercase<S>;

type HELLO = ToUpperCase<"hello">; // "HELLO"

/**
 * Convert string to Lowercase
 * Another built-in utility
 */
type ToLowerCase<S extends string> = Lowercase<S>;

type hello = ToLowerCase<"HELLO">; // "hello"

/**
 * Capitalize first letter
 * Built-in TypeScript utility
 */
type ToCapitalize<S extends string> = Capitalize<S>;

type Hello = ToCapitalize<"hello">; // "Hello"

/**
 * Uncapitalize first letter
 * Built-in TypeScript utility
 */
type ToUncapitalize<S extends string> = Uncapitalize<S>;

type hello2 = ToUncapitalize<"Hello">; // "hello"

/**
 * Convert camelCase to snake_case
 * This is a complex transformation that requires recursive processing
 */
type CamelToSnakeCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends Lowercase<First>
      ? `${First}${CamelToSnakeCase<Rest>}`
      : `_${Lowercase<First>}${CamelToSnakeCase<Rest>}`
    : S;

// Test cases
type UserName = CamelToSnakeCase<"userName">; // "user_name"
type GetBlockHash = CamelToSnakeCase<"getBlockHash">; // "get_block_hash"
type APIEndpoint = CamelToSnakeCase<"APIEndpoint">; // "_a_p_i_endpoint"

/**
 * Convert snake_case to camelCase
 * This is reverse transformation, also complex
 */
type SnakeToCamelCase<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${First}${Capitalize<SnakeToCamelCase<Rest>>}`
    : S;

// Test cases
type user_name = SnakeToCamelCase<"user_name">; // "userName"
type block_hash = SnakeToCamelCase<"block_hash">; // "blockHash"
type storage_key = SnakeToCamelCase<"storage_key">; // "storageKey"

/**
 * Convert camelCase to kebab-case
 * Similar to snake_case but uses hyphens
 */
type CamelToKebabCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends Lowercase<First>
      ? `${First}${CamelToKebabCase<Rest>}`
      : `-${Lowercase<First>}${CamelToKebabCase<Rest>}`
    : S;

// Test cases
type UserNameKebab = CamelToKebabCase<"userName">; // "user-name"
type GetBlockKebab = CamelToKebabCase<"getBlock">; // "get-block"

/**
 * Convert kebab-case to camelCase
 */
type KebabToCamelCase<S extends string> =
  S extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
    : S;

// Test cases
type userNameFromKebab = KebabToCamelCase<"user-name">; // "userName"
type blockHashFromKebab = KebabToCamelCase<"block-hash">; // "blockHash"

/**
 * Convert to PascalCase (same as camelCase but first letter capitalized)
 */
type ToPascalCase<S extends string> = Capitalize<S>;

type UserClass = ToPascalCase<"user">; // "User"
type BlockHeader = ToPascalCase<"blockHeader">; // "BlockHeader"

// =============================================================================
// 3. SUBSTRATE-SPECIFIC STRING SYSTEMS
// =============================================================================

/**
 * Substrate pallet call format: "PalletName::method_name"
 * Let's create types to work with this format
 */

/**
 * Parse pallet call string into components
 * This uses template literal pattern matching with infer
 */
type ParsePalletCall<T extends string> =
  T extends `${infer Pallet}::${infer Method}`
    ? { pallet: Pallet; method: Method }
    : never;

// Test cases
type BalanceTransferCall = ParsePalletCall<"Balances::transfer">;
// { pallet: "Balances"; method: "transfer" }

type SystemRemarkCall = ParsePalletCall<"System::remark">;
// { pallet: "System"; method: "remark" }

type StakingBondCall = ParsePalletCall<"Staking::bond">;
// { pallet: "Staking"; method: "bond" }

/**
 * Generate pallet call string from components
 * This is the reverse operation
 */
type CreatePalletCall<
  Pallet extends string,
  Method extends string
> = `${Pallet}::${Method}`;

type TransferCall = CreatePalletCall<"Balances", "transfer">; // "Balances::transfer"
type RemarkCall = CreatePalletCall<"System", "remark">; // "System::remark"

/**
 * Substrate storage key format: "PalletName StorageItem"
 * Different from calls, uses space instead of ::
 */
type ParseStorageKey<T extends string> =
  T extends `${infer Pallet} ${infer StorageItem}`
    ? { pallet: Pallet; storageItem: StorageItem }
    : never;

// Test cases
type AccountStorage = ParseStorageKey<"System Account">;
// { pallet: "System"; storageItem: "Account" }

type BalanceStorage = ParseStorageKey<"Balances TotalIssuance">;
// { pallet: "Balances"; storageItem: "TotalIssuance" }

/**
 * Event topic parsing for Substrate events
 * Events can have parameters in format: "EventName(param1,param2,param3)"
 */
type ParseEventSignature<T extends string> =
  T extends `${infer EventName}(${infer Params})`
    ? { eventName: EventName; params: ParseParams<Params> }
    : { eventName: T; params: [] };

/**
 * Helper type to parse parameter list
 * This recursively splits comma-separated parameters
 */
type ParseParams<T extends string> = T extends `${infer First},${infer Rest}`
  ? [First, ...ParseParams<Rest>]
  : T extends ""
  ? []
  : [T];

// Test cases
type TransferEvent =
  ParseEventSignature<"Transfer(AccountId,AccountId,Balance)">;
// { eventName: "Transfer"; params: ["AccountId", "AccountId", "Balance"] }

type NewAccountEvent = ParseEventSignature<"NewAccount(AccountId)">;
// { eventName: "NewAccount"; params: ["AccountId"] }

type SimpleEvent = ParseEventSignature<"SomethingHappened">;
// { eventName: "SomethingHappened"; params: [] }

// =============================================================================
// 4. TYPE-SAFE PATH AND URL CONSTRUCTION
// =============================================================================

/**
 * Building type-safe paths for nested object access
 * This is useful for accessing blockchain data structures safely
 */

/**
 * Generate dot-notation paths for nested objects
 * This creates all possible paths to access object properties
 */
type PathsOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${PathsOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

// Example with Substrate block data
interface SubstrateBlockData {
  header: {
    number: number;
    hash: string;
    parentHash: string;
    stateRoot: string;
  };
  body: {
    extrinsics: string[];
  };
  justification: string | null;
}

type BlockPaths = PathsOf<SubstrateBlockData>;
// "header" | "header.number" | "header.hash" | "header.parentHash" |
// "header.stateRoot" | "body" | "body.extrinsics" | "justification"

/**
 * URL parameter extraction
 * Extract parameter names from URL patterns
 */
type ExtractRouteParams<T extends string> =
  T extends `${string}/:${infer Param}/${infer Rest}`
    ? [Param, ...ExtractRouteParams<`/${Rest}`>]
    : T extends `${string}/:${infer Param}`
    ? [Param]
    : [];

// Test cases
type UserRouteParams = ExtractRouteParams<"/users/:userId/posts/:postId">;
// ["userId", "postId"]

type BlockRouteParams = ExtractRouteParams<"/blocks/:blockHash">;
// ["blockHash"]

type ComplexRouteParams =
  ExtractRouteParams<"/api/:version/pallets/:pallet/calls/:method">;
// ["version", "pallet", "method"]

/**
 * Type-safe URL builder
 * Ensures all required parameters are provided
 */
type BuildURL<
  Pattern extends string,
  Params extends Record<string, string | number>
> = Pattern extends `${infer Before}/:${infer ParamName}/${infer After}`
  ? ParamName extends keyof Params
    ? BuildURL<`${Before}/${Params[ParamName]}/${After}`, Params>
    : never
  : Pattern extends `${infer Before}/:${infer ParamName}`
  ? ParamName extends keyof Params
    ? `${Before}/${Params[ParamName]}`
    : never
  : Pattern;

// This would be used like:
// type UserURL = BuildURL<"/users/:userId", { userId: "123" }>; // "/users/123"

// =============================================================================
// 5. ADVANCED SUBSTRATE EVENT SYSTEM
// =============================================================================

/**
 * Automatic event handler generation for Substrate events
 * This creates type-safe event handlers based on event names
 */

/**
 * Convert event name to handler function name
 * Example: "Transfer" becomes "handleTransfer"
 */
type EventToHandler<T extends string> = `handle${Capitalize<T>}`;

type TransferHandler = EventToHandler<"transfer">; // "handleTransfer"
type NewAccountHandler = EventToHandler<"newAccount">; // "handleNewAccount"

/**
 * Generate event handler object type
 * This creates an object with handler functions for each event
 */
type EventHandlers<T extends Record<string, any>> = {
  [K in keyof T as EventToHandler<string & K>]: (data: T[K]) => void;
};

// Example with Substrate events
interface SubstrateEvents {
  transfer: { from: string; to: string; amount: bigint };
  newAccount: { account: string };
  balanceSet: { who: string; free: bigint };
}

type SubstrateEventHandlers = EventHandlers<SubstrateEvents>;
// {
//   handleTransfer: (data: { from: string; to: string; amount: bigint }) => void;
//   handleNewAccount: (data: { account: string }) => void;
//   handleBalanceSet: (data: { who: string; free: bigint }) => void;
// }

/**
 * Event subscription system
 * Generate subscription method names for events
 */
type EventToSubscription<T extends string> = `subscribe${Capitalize<T>}`;

type SubscribeTransfer = EventToSubscription<"transfer">; // "subscribeTransfer"
type SubscribeNewBlock = EventToSubscription<"newBlock">; // "subscribeNewBlock"

/**
 * Complete event system type
 * Combines handlers and subscriptions
 */
type EventSystem<T extends Record<string, any>> = {
  // Handler methods
  [K in keyof T as EventToHandler<string & K>]: (data: T[K]) => void;
} & {
  // Subscription methods
  [K in keyof T as EventToSubscription<string & K>]: (
    handler: (data: T[K]) => void
  ) => { unsubscribe: () => void };
};

type CompleteSubstrateEventSystem = EventSystem<SubstrateEvents>;
// This creates both handleTransfer, handleNewAccount, etc.
// AND subscribeTransfer, subscribeNewAccount, etc.

// =============================================================================
// 6. RPC METHOD TYPE SAFETY
// =============================================================================

/**
 * Substrate RPC method validation
 * Ensure RPC method names follow correct format
 */

/**
 * Valid RPC method pattern: "module_method"
 */
type IsValidRPCMethod<T extends string> = T extends `${string}_${string}`
  ? true
  : false;

type ValidMethod1 = IsValidRPCMethod<"chain_getBlock">; // true
type ValidMethod2 = IsValidRPCMethod<"state_getStorage">; // true
type InvalidMethod = IsValidRPCMethod<"invalidmethod">; // false

/**
 * Parse RPC method into module and method components
 */
type ParseRPCMethod<T extends string> =
  T extends `${infer Module}_${infer Method}`
    ? { module: Module; method: Method }
    : never;

type ChainGetBlock2 = ParseRPCMethod<"chain_getBlock">;
// { module: "chain"; method: "getBlock" }

type StateGetStorage2 = ParseRPCMethod<"state_getStorage">;
// { module: "state"; method: "getStorage" }

/**
 * Generate RPC method name from components
 */
type CreateRPCMethod<
  Module extends string,
  Method extends string
> = `${Module}_${Method}`;

type GetBlockMethod = CreateRPCMethod<"chain", "getBlock">; // "chain_getBlock"
type GetStorageMethod = CreateRPCMethod<"state", "getStorage">; // "state_getStorage"

/**
 * Type-safe RPC call generator
 * This ensures only valid RPC methods can be called
 */
interface RPCCall<Method extends string, Params extends any[], Return> {
  method: Method;
  params: Params;
  id: number;
  jsonrpc: "2.0";
}

/**
 * Specific RPC call types for common Substrate methods
 */
type ChainGetBlockCall = RPCCall<
  "chain_getBlock",
  [string?],
  SubstrateBlockHeader
>;
type StateGetStorageCall = RPCCall<"state_getStorage", [string], string | null>;

// =============================================================================
// 7. PRACTICAL BLOCKCHAIN APPLICATIONS
// =============================================================================

/**
 * Substrate address validation
 * Check if string matches Substrate address pattern
 */
type IsSubstrateAddress<T extends string> = T extends `5${string}`
  ? T extends `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}`
    ? true
    : false
  : false;

// Example addresses (simplified validation)
type ValidAddress =
  IsSubstrateAddress<"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY">; // true
type InvalidAddress = IsSubstrateAddress<"invalid">; // false

/**
 * Transaction hash validation
 * Substrate transaction hashes start with 0x and are 64 characters
 */
type IsTransactionHash<T extends string> = T extends `0x${infer Hash}`
  ? Hash extends `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}`
    ? true
    : false
  : false;

/**
 * Extrinsic format validation
 * Extrinsics in Substrate follow specific hex format
 */
type IsExtrinsicHex<T extends string> = T extends `0x${string}` ? true : false;

/**
 * Multi-signature account detection
 * Multi-sig accounts in Substrate have specific address patterns
 */
type IsMultiSigAccount<T extends string> = T extends `5${infer Rest}`
  ? Rest extends `${string}${string}${string}` // Simplified check
    ? true
    : false
  : false;

// =============================================================================
// 8. COMPREHENSIVE TESTING & EXAMPLES
// =============================================================================

/**
 * Comprehensive test suite for all template literal types
 * This validates our implementations work correctly
 */
namespace TemplateLiteralTests {
  // Basic template literal tests
  const greeting: Greeting<"TypeScript"> = "Hello, TypeScript!";
  const eventName: SubstrateEventName<"Balances", "Transfer"> =
    "Balances_Transfer";
  const endpoint: SubstrateRPCEndpoint<"chain", "getBlock"> =
    "/api/v1/chain/getBlock";

  // String transformation tests
  const snakeCase: CamelToSnakeCase<"getUserName"> = "get_user_name";
  const camelCase: SnakeToCamelCase<"user_name"> = "userName";
  const kebabCase: CamelToKebabCase<"getUserName"> = "get-user-name";
  const fromKebab: KebabToCamelCase<"user-name"> = "userName";

  // Substrate-specific parsing tests
  const palletCall: ParsePalletCall<"Balances::transfer"> = {
    pallet: "Balances",
    method: "transfer",
  };

  const storageKey: ParseStorageKey<"System Account"> = {
    pallet: "System",
    storageItem: "Account",
  };

  const eventSignature: ParseEventSignature<"Transfer(AccountId,AccountId,Balance)"> =
    {
      eventName: "Transfer",
      params: ["AccountId", "AccountId", "Balance"],
    };

  // Path extraction tests
  const blockPath1: PathsOf<SubstrateBlockData> = "header.number";
  const blockPath2: PathsOf<SubstrateBlockData> = "body.extrinsics";

  // Route parameter tests
  const routeParams: ExtractRouteParams<"/users/:userId/posts/:postId"> = [
    "userId",
    "postId",
  ];

  // Event handler tests
  const eventHandlers: SubstrateEventHandlers = {
    handleTransfer: (data) => {
      console.log(
        `Transfer: ${data.from} -> ${data.to}, amount: ${data.amount}`
      );
    },
    handleNewAccount: (data) => {
      console.log(`New account: ${data.account}`);
    },
    handleBalanceSet: (data) => {
      console.log(`Balance set for ${data.who}: ${data.free}`);
    },
  };

  // RPC method tests
  const rpcMethod: ParseRPCMethod<"chain_getBlock"> = {
    module: "chain",
    method: "getBlock",
  };

  // Address validation tests
  const validAddress: IsSubstrateAddress<"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"> =
    true;
  const invalidAddress: IsSubstrateAddress<"invalid"> = false;

  // Transaction hash validation tests
  const validTxHash: IsTransactionHash<"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"> =
    true;
  const invalidTxHash: IsTransactionHash<"invalid"> = false;
}

// =============================================================================
// 9. PERFORMANCE CONSIDERATIONS & BEST PRACTICES
// =============================================================================

/**
 * Performance Notes for Template Literal Types:
 *
 * 1. Recursive string processing can be expensive
 *    - Limit recursion depth where possible
 *    - Use simpler patterns for frequently used types
 *
 * 2. Template literal union types can become very large
 *    - Be careful with cartesian products of string unions
 *    - Use constraints to limit possible combinations
 *
 * 3. Complex pattern matching can slow compilation
 *    - Cache complex type computations where possible
 *    - Break down complex patterns into simpler steps
 */

/**
 * Best Practices:
 *
 * 1. Use template literals for API safety
 *    - Validate URLs, method names, event names at compile time
 *    - Catch typos and invalid formats early
 *
 * 2. Combine with conditional types
 *    - Use our previous learning to make template literals even more powerful
 *    - Create smart defaults and fallbacks
 *
 * 3. Document complex transformations
 *    - Template literal types can be hard to understand
 *    - Provide clear examples and test cases
 */

// =============================================================================
// 10. LEARNING CHECKPOINT VALIDATION
// =============================================================================

/**
 * Learning Objectives Validation:
 * ✅ Master template literal type syntax (`${string}` patterns)
 * ✅ Implement string case transformations (CamelCase, KebabCase, etc.)
 * ✅ Build type-safe Substrate event systems
 * ✅ Create API path validation and URL construction
 * ✅ Parse complex string patterns with infer keyword
 * ✅ Develop practical blockchain string utilities
 * ✅ Understand performance implications of string type processing
 *
 * Ready for next: Advanced Type Inference + Mapped Types
 * Next we'll learn how to combine template literals with mapped types
 * for even more powerful type transformations!
 */

export type {
  // Basic template literals
  Greeting,
  SubstrateEventName,
  SubstrateRPCEndpoint,
  RuntimeVersion,

  // String transformations
  CamelToSnakeCase,
  SnakeToCamelCase,
  CamelToKebabCase,
  KebabToCamelCase,
  ToPascalCase,

  // Substrate-specific parsers
  ParsePalletCall,
  CreatePalletCall,
  ParseStorageKey,
  ParseEventSignature,
  ParseParams,

  // Path and URL utilities
  PathsOf,
  ExtractRouteParams,
  BuildURL,

  // Event system types
  EventToHandler,
  EventHandlers,
  EventToSubscription,
  EventSystem,

  // RPC method utilities
  IsValidRPCMethod,
  ParseRPCMethod,
  CreateRPCMethod,
  RPCCall,

  // Validation utilities
  IsSubstrateAddress,
  IsTransactionHash,
  IsExtrinsicHex,
  IsMultiSigAccount,
};

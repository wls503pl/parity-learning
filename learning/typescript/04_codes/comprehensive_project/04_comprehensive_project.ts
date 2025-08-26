/**
 * TypeScript Advanced Type System - Comprehensive Integration Project
 * Final Integration Project
 *
 * This project integrates all advanced TypeScript concepts learned:
 * - Conditional Types & Advanced infer usage
 * - Template Literal Types
 * - Mapped Types & Key Remapping
 * - Advanced Type Inference
 * - Performance Optimization
 * - Type-level Programming
 *
 * Goal: Build a complete, type-safe Substrate API system for Parity interview preparation
 */

// =============================================================================
// 1. FOUNDATIONAL TYPE UTILITIES (Conditional Types)
// =============================================================================

/**
 * Advanced conditional type utilities with performance optimization
 */
type IsNever<T> = [T] extends [never] ? true : false;
type IsArray<T> = T extends readonly any[] ? true : false;
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
type IsPromise<T> = T extends Promise<any> ? true : false;

/**
 * Advanced infer patterns for extracting nested types
 */
type ExtractPromiseValue<T> = T extends Promise<infer U> ? U : never;
type ExtractArrayElement<T> = T extends (infer U)[] ? U : never;
type ExtractFunctionReturn<T> = T extends (...args: any[]) => infer R
  ? R
  : never;
type ExtractFunctionParams<T> = T extends (...args: infer P) => any ? P : never;

/**
 * Recursive conditional types with depth limiting for performance
 */
type DeepReadonly<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends object
  ? {
      readonly [K in keyof T]: T[K] extends object
        ? DeepReadonly<T[K], Prev<Depth>>
        : T[K];
    }
  : T;

// Helper type for depth counting
type Prev<T extends number> = T extends 5
  ? 4
  : T extends 4
  ? 3
  : T extends 3
  ? 2
  : T extends 2
  ? 1
  : T extends 1
  ? 0
  : 0;

// =============================================================================
// 2. TEMPLATE LITERAL TYPE SYSTEM
// =============================================================================

/**
 * String manipulation utilities using template literals
 */
type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${P1}${Capitalize<CamelCase<`${P2}${P3}`>>}`
    : S;

type KebabCase<S extends string> = S extends `${infer R1}${Capitalize<
  infer R2
>}`
  ? `${R1}-${Lowercase<R2>}`
  : S;

/**
 * Substrate-specific template literal types
 */
type SubstrateEventName<
  Module extends string,
  Event extends string
> = `${Module}.${Event}`;

type SubstrateRPCMethod<
  Pallet extends string,
  Method extends string
> = `${Pallet}_${Method}`;

type SubstrateStorageKey<
  Pallet extends string,
  Item extends string
> = `${Pallet} ${Capitalize<Item>}`;

/**
 * API path validation and construction
 */
type APIPath = `/api/v1/${string}` | `/rpc/${string}` | `/ws/${string}`;
type ValidateAPIPath<T extends string> = T extends APIPath ? T : never;

// =============================================================================
// 3. ADVANCED MAPPED TYPES & INFERENCE
// =============================================================================

/**
 * Advanced mapped types with key remapping
 */
type EventHandlers<T extends Record<string, any>> = {
  [K in keyof T as `handle${Capitalize<string & K>}`]: (data: T[K]) => void;
};

type AsyncMethods<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<R>
    : never;
};

type OptionalFields<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

/**
 * Configuration transformation utilities
 */
type ConfigWithDefaults<T extends Record<string, any>, D extends Partial<T>> = {
  [K in keyof T]: K extends keyof D ? T[K] | D[K] : T[K];
};

// =============================================================================
// 4. SUBSTRATE API TYPE SYSTEM (Enhanced)
// =============================================================================

/**
 * Core Substrate data types
 */
interface Block {
  hash: string;
  parentHash: string;
  number: number;
  timestamp: number;
  extrinsics: Extrinsic[];
}

interface Extrinsic {
  hash: string;
  method: string;
  signature?: string;
  nonce?: number;
  args: Record<string, any>;
}

interface RuntimeVersion {
  specName: string;
  implName: string;
  specVersion: number;
  transactionVersion: number;
}

interface ChainInfo {
  chain: string;
  chainType: string;
  name: string;
  version: string;
}

/**
 * Substrate RPC method definitions
 */
interface SubstrateRPCMethods {
  // Chain methods
  chain_getBlock: (hash?: string) => Block;
  chain_getBlockHash: (number?: number) => string;
  chain_getFinalizedHead: () => string;
  chain_getHeader: (hash?: string) => Block;

  // State methods
  state_getStorage: (key: string, hash?: string) => string | null;
  state_getStorageHash: (key: string, hash?: string) => string | null;
  state_getStorageSize: (key: string, hash?: string) => number | null;
  state_getRuntimeVersion: (hash?: string) => RuntimeVersion;

  // System methods
  system_chain: () => string;
  system_chainType: () => string;
  system_name: () => string;
  system_version: () => string;
  system_properties: () => Record<string, any>;
}

/**
 * Advanced API call type inference
 */
type RPCMethodNames = keyof SubstrateRPCMethods;
type RPCMethodParams<T extends RPCMethodNames> =
  SubstrateRPCMethods[T] extends (...args: infer P) => any ? P : never;
type RPCMethodReturn<T extends RPCMethodNames> = ExtractFunctionReturn<
  SubstrateRPCMethods[T]
>;

/**
 * Type-safe API call builder
 */
class SubstrateAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async call<T extends RPCMethodNames>(
    method: T,
    ...params: RPCMethodParams<T>
  ): Promise<RPCMethodReturn<T>> {
    const response = await fetch(`${this.baseUrl}/rpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    const jsonResponse = (await response.json()) as {
      result: RPCMethodReturn<T>;
    };
    return jsonResponse.result;
  }
}

// =============================================================================
// 5. EVENT SYSTEM WITH ADVANCED TYPES (Integration)
// =============================================================================

/**
 * Substrate event definitions
 */
interface SubstrateEvents {
  "balances.Transfer": {
    from: string;
    to: string;
    amount: number;
  };
  "system.ExtrinsicSuccess": {
    dispatchInfo: Record<string, any>;
  };
  "system.ExtrinsicFailed": {
    dispatchError: string;
    dispatchInfo: Record<string, any>;
  };
  "staking.Rewarded": {
    stash: string;
    amount: number;
  };
}

/**
 * Event handler type generation
 */
type SubstrateEventHandlers = EventHandlers<SubstrateEvents>;

/**
 * Type-safe event emitter with proper handler storage
 */
class SubstrateEventEmitter {
  private handlers: Map<keyof SubstrateEvents, (data: any) => void> = new Map();

  on<T extends keyof SubstrateEvents>(
    event: T,
    handler: (data: SubstrateEvents[T]) => void
  ): void {
    this.handlers.set(event, handler);
  }

  emit<T extends keyof SubstrateEvents>(
    event: T,
    data: SubstrateEvents[T]
  ): void {
    const handler = this.handlers.get(event);
    if (handler) {
      handler(data);
    }
  }

  off<T extends keyof SubstrateEvents>(event: T): void {
    this.handlers.delete(event);
  }
}

// =============================================================================
// 6. CONFIGURATION SYSTEM WITH TYPE VALIDATION
// =============================================================================

/**
 * API configuration with type safety
 */
interface SubstrateConfig {
  endpoint: string;
  timeout: number;
  retries: number;
  enableLogging: boolean;
  customHeaders?: Record<string, string>;
}

/**
 * Configuration with defaults and validation
 */
type ValidatedConfig<T extends Partial<SubstrateConfig>> = ConfigWithDefaults<
  Required<SubstrateConfig>,
  {
    timeout: 5000;
    retries: 3;
    enableLogging: false;
  }
> &
  T;

/**
 * Configuration builder with method chaining
 */
class SubstrateConfigBuilder {
  private config: Partial<SubstrateConfig> = {};

  endpoint(url: string): this {
    this.config.endpoint = url;
    return this;
  }

  timeout(ms: number): this {
    this.config.timeout = ms;
    return this;
  }

  retries(count: number): this {
    this.config.retries = count;
    return this;
  }

  logging(enabled: boolean): this {
    this.config.enableLogging = enabled;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.config.customHeaders = headers;
    return this;
  }

  build(): ValidatedConfig<typeof this.config> {
    if (!this.config.endpoint) {
      throw new Error("Endpoint is required");
    }

    return {
      endpoint: this.config.endpoint,
      timeout: this.config.timeout ?? 5000,
      retries: this.config.retries ?? 3,
      enableLogging: this.config.enableLogging ?? false,
      customHeaders: this.config.customHeaders,
    } as ValidatedConfig<typeof this.config>;
  }
}

// =============================================================================
// 7. PERFORMANCE OPTIMIZED TYPE UTILITIES
// =============================================================================

/**
 * Optimized deep merge avoiding excessive recursion
 */
type OptimizedDeepMerge<T, U> = T extends object
  ? U extends object
    ? {
        [K in keyof T | keyof U]: K extends keyof U
          ? K extends keyof T
            ? T[K] extends object
              ? U[K] extends object
                ? OptimizedDeepMerge<T[K], U[K]>
                : U[K]
              : U[K]
            : U[K]
          : K extends keyof T
          ? T[K]
          : never;
      }
    : T
  : U;

/**
 * Type-level string length calculation (basic type-level programming)
 */
type StringLength<
  S extends string,
  Counter extends any[] = []
> = S extends `${string}${infer Rest}`
  ? Counter["length"] extends 20 // Limit recursion depth
    ? number
    : StringLength<Rest, [...Counter, any]>
  : Counter["length"];

/**
 * Efficient type filtering
 */
type FilterByType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// =============================================================================
// 8. COMPREHENSIVE INTEGRATION EXAMPLE
// =============================================================================

/**
 * Complete Substrate client with all advanced type features
 */
class AdvancedSubstrateClient {
  private api: SubstrateAPI;
  private events: SubstrateEventEmitter;
  private config: ValidatedConfig<any>;

  constructor(config: Partial<SubstrateConfig>) {
    const builder = new SubstrateConfigBuilder();
    this.config = builder
      .endpoint(config.endpoint || "ws://localhost:9944")
      .timeout(config.timeout || 10000)
      .retries(config.retries || 5)
      .logging(config.enableLogging || true)
      .build();

    this.api = new SubstrateAPI(this.config.endpoint);
    this.events = new SubstrateEventEmitter();
  }

  // Type-safe RPC calls
  async rpc<T extends RPCMethodNames>(
    method: T,
    ...params: RPCMethodParams<T>
  ): Promise<RPCMethodReturn<T>> {
    return this.api.call(method, ...params);
  }

  // Type-safe event handling
  on<T extends keyof SubstrateEvents>(
    event: T,
    handler: (data: SubstrateEvents[T]) => void
  ): void {
    this.events.on(event, handler);
  }

  // Utility methods with advanced type inference
  async getBlockWithType<T extends "full" | "header">(
    hash?: string,
    type: T = "full" as T
  ): Promise<T extends "full" ? Block : Partial<Block>> {
    if (type === "full") {
      return this.rpc("chain_getBlock", hash) as any;
    } else {
      return this.rpc("chain_getHeader", hash) as any;
    }
  }

  // Configuration access with type safety
  getConfig(): ValidatedConfig<any> {
    return this.config;
  }
}

// =============================================================================
// 9. USAGE EXAMPLES & TESTING
// =============================================================================

/**
 * Example usage demonstrating all advanced type features
 */
async function demonstrateAdvancedTypes() {
  // 1. Client creation with type-safe configuration
  const client = new AdvancedSubstrateClient({
    endpoint: "wss://rpc.polkadot.io",
    timeout: 15000,
    enableLogging: true,
  });

  // 2. Type-safe RPC calls
  const block = await client.rpc("chain_getBlock");
  const blockHash = await client.rpc("chain_getBlockHash", 12345);
  const runtime = await client.rpc("state_getRuntimeVersion");

  // 3. Type-safe event handling
  client.on("balances.Transfer", (data) => {
    console.log(`Transfer: ${data.from} -> ${data.to}, amount: ${data.amount}`);
  });

  client.on("system.ExtrinsicFailed", (data) => {
    console.log(`Extrinsic failed: ${data.dispatchError}`);
  });

  // 4. Advanced type utilities in action
  type BlockIsArray = IsArray<Block[]>; // true
  type BlockPromise = ExtractPromiseValue<Promise<Block>>; // Block
  type ConfigReadonly = DeepReadonly<SubstrateConfig>;

  // 5. Template literal types
  type TransferEvent = SubstrateEventName<"balances", "Transfer">; // "balances.Transfer"
  type ChainGetBlock = SubstrateRPCMethod<"chain", "getBlock">; // "chain_getBlock"

  // 6. String manipulation
  type CamelCased = CamelCase<"substrate_api_client">; // "substrateApiClient"
  type KebabCased = KebabCase<"SubstrateAPIClient">; // "substrate-a-p-i-client"

  console.log("Advanced TypeScript type system demonstration complete!");
}

// =============================================================================
// 10. TYPE TESTING & VALIDATION
// =============================================================================

/**
 * Compile-time type tests to ensure correctness
 */
namespace TypeTests {
  // Test conditional types
  type Test1 = IsArray<string[]> extends true ? "pass" : "fail";
  type Test2 = IsFunction<() => void> extends true ? "pass" : "fail";
  type Test3 = ExtractPromiseValue<Promise<string>> extends string
    ? "pass"
    : "fail";

  // Test template literals
  type Test4 = SubstrateEventName<
    "balances",
    "Transfer"
  > extends "balances.Transfer"
    ? "pass"
    : "fail";
  type Test5 = CamelCase<"hello_world"> extends "helloWorld" ? "pass" : "fail";

  // Test mapped types
  type TestHandlers = EventHandlers<{ test: string }>;
  type Test6 = keyof TestHandlers extends "handleTest" ? "pass" : "fail";

  // Test RPC type inference
  type Test7 = RPCMethodReturn<"chain_getBlock"> extends Block
    ? "pass"
    : "fail";
  type Test8 = RPCMethodParams<"chain_getBlockHash">[0] extends
    | number
    | undefined
    ? "pass"
    : "fail";

  // All tests should resolve to 'pass'
  type AllTests = Test1 | Test2 | Test3 | Test4 | Test5 | Test6 | Test7 | Test8;
}

/**
 * Export types and utilities for testing and interview demonstration
 */
export type {
  // Basic conditional type utilities
  IsNever,
  IsArray,
  IsFunction,
  IsPromise,
  ExtractPromiseValue,
  ExtractArrayElement,
  ExtractFunctionReturn,
  ExtractFunctionParams,
  DeepReadonly,

  // Template literal types
  Capitalize,
  CamelCase,
  KebabCase,
  SubstrateEventName,
  SubstrateRPCMethod,
  SubstrateStorageKey,
  APIPath,
  ValidateAPIPath,

  // Mapped types
  EventHandlers,
  AsyncMethods,
  OptionalFields,
  ConfigWithDefaults,

  // Substrate API types
  Block,
  Extrinsic,
  RuntimeVersion,
  ChainInfo,
  SubstrateRPCMethods,
  RPCMethodNames,
  RPCMethodParams,
  RPCMethodReturn,
  SubstrateEvents,
  SubstrateEventHandlers,
  SubstrateConfig,
  ValidatedConfig,

  // Performance optimized types
  OptimizedDeepMerge,
  StringLength,
  FilterByType,
};

export {
  AdvancedSubstrateClient,
  SubstrateAPI,
  SubstrateEventEmitter,
  SubstrateConfigBuilder,
  demonstrateAdvancedTypes,
  TypeTests,
};

/**
 * INTERVIEW TALKING POINTS:
 *
 * 1. **Conditional Types Mastery**:
 *    - Complex type inference with multiple infer patterns
 *    - Recursive types with performance optimization
 *    - Distribution handling in conditional types
 *
 * 2. **Template Literal Innovation**:
 *    - Type-safe string manipulation utilities
 *    - API path validation at compile time
 *    - Event name generation and validation
 *
 * 3. **Mapped Type Sophistication**:
 *    - Key remapping for event handler generation
 *    - Configuration transformation with defaults
 *    - Async method generation from sync definitions
 *
 * 4. **Performance Awareness**:
 *    - Recursion depth limiting
 *    - Efficient type computations
 *    - Avoiding TypeScript compiler bottlenecks
 *
 * 5. **Real-world Application**:
 *    - Complete Substrate API type system
 *    - Type-safe configuration management
 *    - Compile-time validation for blockchain operations
 *
 * This demonstrates advanced TypeScript skills directly applicable to
 * Parity's substrate-api-sidecar and related blockchain infrastructure projects.
 */

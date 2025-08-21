/**
 * TypeScript Advanced Type Inference + Mapped Types
 * Focus: Mapped types, key remapping, and complex type inference patterns
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 16, 2025
 *
 * Learning Focus:
 * - Advanced mapped type patterns and key remapping techniques
 * - Complex type inference with nested infer keyword usage
 * - Substrate-specific type transformation systems
 * - Configuration object transformations and API generation
 * - Performance-aware type system design
 *
 * Key Concepts:
 * 1. Mapped Types: Transform object shapes with flexible property mapping
 * 2. Key Remapping: Use 'as' clause to rename properties during mapping
 * 3. Advanced Inference: Extract deeply nested type information
 * 4. Type Transformations: Build sophisticated type transformation pipelines
 * 5. Substrate Integration: Apply concepts to blockchain development scenarios
 *
 * Prerequisites: Understanding of conditional types and template literals
 * from 04_conditional_basic.ts, 04_conditional_advanced.ts, and 04_template_literals.ts
 */

// =============================================================================
// PART 1: FUNDAMENTAL MAPPED TYPES
// =============================================================================

// Basic mapped type syntax
type BasicMapping<T> = {
  [K in keyof T]: T[K];
};

// Adding modifiers
type ReadonlyVersion<T> = {
  readonly [K in keyof T]: T[K];
};

type OptionalVersion<T> = {
  [K in keyof T]?: T[K];
};

// Removing modifiers
type MutableVersion<T> = {
  -readonly [K in keyof T]: T[K];
};

type RequiredVersion<T> = {
  [K in keyof T]-?: T[K];
};

// Test types
interface SubstrateConfig {
  readonly endpoint: string;
  timeout?: number;
  retries: number;
}

type MutableConfig = MutableVersion<SubstrateConfig>;
type RequiredConfig = RequiredVersion<SubstrateConfig>;

// =============================================================================
// PART 2: KEY REMAPPING IN MAPPED TYPES
// =============================================================================

// Basic key remapping with 'as' clause
type GetterMethods<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Substrate event handler mapping
type SubstrateEventHandlers<T extends Record<string, any>> = {
  [K in keyof T as `handle_${string & K}`]: (data: T[K]) => void;
};

// API method mapping with conditional key transformation
type APIMethodMapping<T> = {
  [K in keyof T as K extends `${infer Prefix}_${infer Suffix}`
    ? `${Prefix}${Capitalize<Suffix>}`
    : K]: T[K];
};

// Filter keys based on value types
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

// Example: Substrate Chain API
interface ChainAPI {
  getBlock: (hash: string) => Promise<any>;
  getHeader: (hash: string) => Promise<any>;
  subscribeBlocks: (callback: Function) => void;
  metadata: string;
  version: number;
}

type ChainMethods = FunctionProperties<ChainAPI>;
type ChainGetters = GetterMethods<Pick<ChainAPI, "metadata" | "version">>;

// =============================================================================
// PART 3: ADVANCED TYPE INFERENCE WITH INFER
// =============================================================================

// Function parameter inference
type FunctionParams<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

// Return type inference
type FunctionReturn<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

// Promise value inference
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Array element inference
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Complex nested inference for Substrate responses
type ExtractSubstrateData<T> = T extends {
  data: {
    block: {
      header: infer H;
      extrinsics: infer E;
    };
  };
}
  ? { header: H; extrinsics: E }
  : never;

// Recursive inference for nested objects
type DeepExtract<T, K extends PropertyKey> = T extends Record<PropertyKey, any>
  ? K extends keyof T
    ? T[K]
    : {
        [P in keyof T]: T[P] extends Record<PropertyKey, any>
          ? DeepExtract<T[P], K>
          : never;
      }[keyof T]
  : never;

// =============================================================================
// PART 4: SUBSTRATE-SPECIFIC MAPPED TYPE PATTERNS
// =============================================================================

// Substrate RPC methods type mapping
interface SubstrateRPCMethods {
  chain_getBlock: (hash?: string) => Promise<any>;
  chain_getHeader: (hash?: string) => Promise<any>;
  state_getStorage: (key: string, at?: string) => Promise<string | null>;
  state_getRuntimeVersion: (at?: string) => Promise<any>;
  system_chain: () => Promise<string>;
  system_name: () => Promise<string>;
}

// Transform RPC method names to camelCase client methods
type RPCToClientMethods<T extends Record<string, any>> = {
  [K in keyof T as K extends `${infer Module}_${infer Method}`
    ? `${Module}${Capitalize<Method>}`
    : K]: T[K];
};

type SubstrateClient = RPCToClientMethods<SubstrateRPCMethods>;

// Event subscription patterns
type SubstrateEvents = {
  NewBlock: { hash: string; number: number };
  Finalized: { hash: string };
  RuntimeUpgrade: { version: number };
  ExtrinsicSuccess: { index: number; hash: string };
  ExtrinsicFailed: { index: number; error: string };
};

// Generate event listener methods
type EventListeners<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (
    callback: (data: T[K]) => void
  ) => () => void; // Returns unsubscribe function
};

type SubstrateEventListeners = EventListeners<SubstrateEvents>;

// Configuration object transformation
interface RawSubstrateConfig {
  WS_ENDPOINT: string;
  HTTP_ENDPOINT: string;
  MAX_CONNECTIONS: number;
  RETRY_ATTEMPTS: number;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
}

// Transform config keys to camelCase and make some optional
type TransformConfig<T> = {
  [K in keyof T as CamelCase<string & K>]: K extends
    | "LOG_LEVEL"
    | "RETRY_ATTEMPTS"
    ? T[K] | undefined
    : T[K];
};

// Helper type for camelCase conversion
type CamelCase<S extends string> = S extends `${infer P}_${infer Q}`
  ? `${Lowercase<P>}${Capitalize<CamelCase<Q>>}`
  : Lowercase<S>;

type ProcessedConfig = TransformConfig<RawSubstrateConfig>;

// =============================================================================
// PART 5: COMPLEX TYPE TRANSFORMATIONS
// =============================================================================

// Deep transformation with conditional mapping
type DeepTransform<T, U> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends any[]
      ? TransformArray<T[K], U>
      : DeepTransform<T[K], U>
    : T[K] extends string
    ? U extends "uppercase"
      ? Uppercase<T[K]>
      : U extends "lowercase"
      ? Lowercase<T[K]>
      : T[K]
    : T[K];
};

type TransformArray<T extends any[], U> = {
  [K in keyof T]: T[K] extends object
    ? DeepTransform<T[K], U>
    : T[K] extends string
    ? U extends "uppercase"
      ? Uppercase<T[K]>
      : T[K]
    : T[K];
};

// Substrate metadata transformation example
interface RawMetadata {
  modules: {
    name: string;
    calls: { name: string; args: string[] }[];
    events: { name: string; docs: string[] }[];
  }[];
  version: number;
}

type ProcessedMetadata = DeepTransform<RawMetadata, "uppercase">;

// Flexible API response wrapper
type APIResponseWrapper<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<
        | {
            success: true;
            data: UnwrapPromise<R>;
            timestamp: number;
          }
        | {
            success: false;
            error: string;
            timestamp: number;
          }
      >
    : never;
};

type WrappedSubstrateClient = APIResponseWrapper<SubstrateClient>;

// =============================================================================
// PART 6: ADVANCED INFERENCE PATTERNS
// =============================================================================

// Multi-level inference for complex data structures
type ExtractNestedType<
  T,
  Path extends string
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ExtractNestedType<T[Key], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

// Usage example
interface ComplexSubstrateResponse {
  result: {
    block: {
      header: {
        number: string;
        parentHash: string;
        stateRoot: string;
      };
      extrinsics: Array<{
        method: string;
        args: unknown[];
        signature?: string;
      }>;
    };
  };
}

type BlockNumber = ExtractNestedType<
  ComplexSubstrateResponse,
  "result.block.header.number"
>;
type ExtrinsicMethod = ExtractNestedType<
  ComplexSubstrateResponse,
  "result.block.extrinsics.0.method"
>;

// Conditional inference with multiple constraints
type SmartExtract<T, Condition> = T extends any[]
  ? T[number] extends infer U
    ? U extends Condition
      ? U
      : never
    : never
  : T extends Condition
  ? T
  : never;

// Pattern matching with inference
type ParseEventData<T extends string> =
  T extends `${infer EventType}:${infer Data}`
    ? {
        type: EventType;
        data: Data extends `${infer Key}=${infer Value},${infer Rest}`
          ? ParseKeyValuePairs<`${Key}=${Value},${Rest}`>
          : Data extends `${infer Key}=${infer Value}`
          ? { [K in Key]: Value }
          : {};
      }
    : never;

type ParseKeyValuePairs<T extends string> =
  T extends `${infer Key}=${infer Value},${infer Rest}`
    ? { [K in Key]: Value } & ParseKeyValuePairs<Rest>
    : T extends `${infer Key}=${infer Value}`
    ? { [K in Key]: Value }
    : {};

// =============================================================================
// PART 7: PRACTICAL EXERCISES & TESTING
// =============================================================================

// Exercise 1: Build a type-safe configuration system
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}

// TODO: Implement ConfigBuilder that transforms config to builder pattern
type ConfigBuilder<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (
    value: T[K]
  ) => ConfigBuilder<T>;
} & {
  build(): T;
};

// Exercise 2: Implement automatic validation type generation
type ValidationRules<T> = {
  [K in keyof T]-?: T[K] extends string
    ? { minLength?: number; maxLength?: number; pattern?: RegExp }
    : T[K] extends number
    ? { min?: number; max?: number }
    : T[K] extends boolean
    ? { required?: boolean }
    : { custom?: (value: T[K]) => boolean };
};

// Exercise 3: Build substrate extrinsic type system
interface ExtrinsicCall {
  module: string;
  method: string;
  args: Record<string, any>;
}

// TODO: Create type-safe extrinsic builder
type ExtrinsicBuilder<Modules extends Record<string, Record<string, any>>> = {
  [Module in keyof Modules]: {
    [Method in keyof Modules[Module]]: (
      args: Modules[Module][Method]
    ) => ExtrinsicCall & {
      module: Module;
      method: Method;
      args: Modules[Module][Method];
    };
  };
};

// Test interfaces for validation
interface TestUser {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

interface SubstrateModules extends Record<string, Record<string, any>> {
  balances: {
    transfer: { dest: string; value: number };
    transferKeepAlive: { dest: string; value: number };
  };
  staking: {
    bond: { controller: string; value: number; payee: string };
    unbond: { value: number };
  };
}

// Type tests to verify implementations
type TestConfigBuilder = ConfigBuilder<DatabaseConfig>;
type TestValidationRules = ValidationRules<TestUser>;
type TestExtrinsicBuilder = ExtrinsicBuilder<SubstrateModules>;

// =============================================================================
// LEARNING CHECKPOINTS & NEXT STEPS
// =============================================================================

/**
 * Learning Objectives Validation:
 * ✅ Master basic and advanced mapped type syntax
 * ✅ Understand key remapping with 'as' clause
 * ✅ Proficient with complex type inference patterns
 * ✅ Able to build flexible type transformation systems
 * ✅ Apply mapped types to Substrate-specific use cases
 *
 * 🎯 NEXT: Comprehensive Substrate API Type System Project
 * 📚 FOCUS: Integration of all learned concepts into real-world project
 *
 * 💡 KEY TAKEAWAYS:
 * 1. Mapped types are powerful for transforming object shapes
 * 2. Key remapping enables flexible API design patterns
 * 3. Complex inference can extract deeply nested type information
 * 4. Combining mapped types + inference creates sophisticated type systems
 * 5. Performance considerations important for deep transformations
 *
 * 🔧 PRACTICAL APPLICATIONS:
 * - Configuration object transformations
 * - API method generation from schemas
 * - Event handling system type safety
 * - Substrate metadata processing
 * - Type-safe builder pattern implementations
 *
 * Ready for comprehensive project integration!
 */

export type {
  // Basic mapped types
  BasicMapping,
  ReadonlyVersion,
  OptionalVersion,
  MutableVersion,
  RequiredVersion,

  // Key remapping
  GetterMethods,
  SubstrateEventHandlers,
  APIMethodMapping,
  FunctionProperties,

  // Type inference
  FunctionParams,
  FunctionReturn,
  UnwrapPromise,
  ArrayElement,
  ExtractSubstrateData,
  DeepExtract,

  // Substrate-specific
  RPCToClientMethods,
  SubstrateClient,
  EventListeners,
  SubstrateEventListeners,
  TransformConfig,
  ProcessedConfig,

  // Advanced transformations
  DeepTransform,
  APIResponseWrapper,
  WrappedSubstrateClient,
  ExtractNestedType,
  SmartExtract,
  ParseEventData,

  // Exercise types
  ConfigBuilder,
  ValidationRules,
  ExtrinsicBuilder,
};

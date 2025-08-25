/**
 * TypeScript Performance Optimization & Type-level Programming
 * Advanced Type System - Performance and Type-level Computation
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: 2025-08-25
 *
 * Learning Focus:
 * 1. TypeScript compilation performance optimization
 * 2. Avoiding recursion stack overflow
 * 3. Basic type-level programming concepts
 * 4. Efficient type utilities for Substrate/Polkadot projects
 */

// =====================================================
// SECTION 1: Performance Optimization Techniques
// =====================================================

/**
 * Problem: Deep recursion can cause TypeScript compiler performance issues
 * Solution: Use tail recursion optimization patterns
 */

// ❌ Inefficient - Can cause stack overflow
type InfficientDeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? InfficientDeepReadonly<T[P]>
    : T[P];
};

// ✅ Optimized - Depth-limited recursion with better performance
type EfficientDeepReadonly<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      readonly [P in keyof T]: T[P] extends object
        ? EfficientDeepReadonly<T[P], Subtract1<Depth>>
        : T[P];
    };

// Helper type for depth counting
type Subtract1<T extends number> = T extends 5
  ? 4
  : T extends 4
  ? 3
  : T extends 3
  ? 2
  : T extends 2
  ? 1
  : T extends 1
  ? 0
  : never;

/**
 * Optimized Deep Merge - Avoiding excessive recursion
 */
// ❌ Can be slow with deep objects
type SlowDeepMerge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? K extends keyof T
      ? T[K] extends object
        ? U[K] extends object
          ? SlowDeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : U[K]
    : K extends keyof T
    ? T[K]
    : never;
};

// ✅ Performance-optimized version
type EfficientDeepMerge<T, U, Depth extends number = 3> = Depth extends 0
  ? U
  : {
      [K in keyof T | keyof U]: K extends keyof U
        ? K extends keyof T
          ? T[K] extends object
            ? U[K] extends object
              ? EfficientDeepMerge<T[K], U[K], Subtract1<Depth>>
              : U[K]
            : U[K]
          : U[K]
        : K extends keyof T
        ? T[K]
        : never;
    };

/**
 * Performance-conscious type utilities for Substrate projects
 */
// Efficient array flattening (limited depth)
type FlattenArray<
  T extends readonly unknown[],
  Depth extends number = 2
> = Depth extends 0
  ? T
  : T extends readonly (infer U)[]
  ? U extends readonly unknown[]
    ? FlattenArray<U, Subtract1<Depth>>
    : U
  : T;

// Optimized key extraction for large objects
type ExtractKeys<T, MaxKeys extends number = 50> = keyof T extends infer K
  ? K extends string
    ? K
    : never
  : never;

// =====================================================
// SECTION 2: Type-level Programming Fundamentals
// =====================================================

/**
 * Basic Arithmetic at Type Level
 */

// Addition using tuple length
type Add<A extends number, B extends number> = [
  ...Tuple<A>,
  ...Tuple<B>
]["length"] extends number
  ? [...Tuple<A>, ...Tuple<B>]["length"]
  : never;

// Helper to create tuple of specific length
type Tuple<
  N extends number,
  Result extends unknown[] = []
> = Result["length"] extends N ? Result : Tuple<N, [...Result, unknown]>;

// String length calculation
type StringLength<
  S extends string,
  Counter extends unknown[] = []
> = S extends `${string}${infer Rest}`
  ? Counter["length"] extends 50 // Prevent infinite recursion
    ? number
    : StringLength<Rest, [...Counter, unknown]>
  : Counter["length"];

/**
 * Advanced String Manipulation
 */

// Efficient string reversal (limited length)
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : "";

// String contains check
type Contains<
  S extends string,
  Search extends string
> = S extends `${string}${Search}${string}` ? true : false;

// Extract substring between delimiters
type ExtractBetween<
  S extends string,
  Start extends string,
  End extends string
> = S extends `${string}${Start}${infer Middle}${End}${string}`
  ? Middle
  : never;

/**
 * Type-level List Operations
 */

// Get head of tuple
type Head<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...unknown[]
]
  ? H
  : never;

// Get tail of tuple
type Tail<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...infer Rest
]
  ? Rest
  : never;

// Reverse array/tuple
type Reverse<T extends readonly unknown[]> = T extends readonly [
  ...infer Rest,
  infer Last
]
  ? [Last, ...Reverse<Rest>]
  : [];

// Find element in tuple
type Includes<T extends readonly unknown[], U> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends U
    ? true
    : Includes<Rest, U>
  : false;

/**
 * Type-level Filtering and Mapping
 */

// Filter tuple by condition
type Filter<T extends readonly unknown[], Condition> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends Condition
    ? [First, ...Filter<Rest, Condition>]
    : Filter<Rest, Condition>
  : [];

// Map over tuple
type Map<T extends readonly unknown[], U> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? [U, ...Map<Rest, U>]
  : [];

// =====================================================
// SECTION 3: Substrate/Polkadot Specific Optimizations
// =====================================================

/**
 * Optimized Event Type System
 */

// Performance-conscious event handler mapping (moved outside namespace for export)
type EventHandlers<Events extends Record<string, unknown>> = {
  [K in keyof Events as K extends string ? `handle_${K}` : never]: (
    event: Events[K]
  ) => void;
};

namespace SubstrateOptimized {
  // Efficient event name generation
  type EventName<
    Pallet extends string,
    Event extends string
  > = `${Pallet}.${Event}`;

  // Optimized RPC method type generation
  export type RPCMethods<
    Sections extends Record<string, Record<string, unknown>>
  > = {
    [Section in keyof Sections]: {
      [Method in keyof Sections[Section]]: (
        ...args: Sections[Section][Method] extends (...args: infer P) => unknown
          ? P
          : []
      ) => Promise<
        Sections[Section][Method] extends (...args: unknown[]) => infer R
          ? R
          : unknown
      >;
    };
  };

  // Memory-efficient configuration validation
  type ValidateConfig<T, Schema> = T extends Schema
    ? T
    : {
        [K in keyof Schema]: K extends keyof T
          ? ValidateConfig<T[K], Schema[K]>
          : Schema[K] extends { required: true }
          ? never
          : Schema[K] extends { default: infer D }
          ? D
          : undefined;
      };

  // Example usage with Substrate types
  type SubstrateEvents = {
    "system.ExtrinsicSuccess": { weight: number };
    "balances.Transfer": { from: string; to: string; amount: number };
    "staking.Reward": { validator: string; amount: number };
    [key: string]: unknown; // Index signature to satisfy Record<string, unknown>
  };

  type Handlers = EventHandlers<SubstrateEvents>;
  // Result: { handle_system.ExtrinsicSuccess: ..., handle_balances.Transfer: ..., ... }
}

/**
 * Performance Monitoring Types
 */

// Type to measure compilation performance impact
type PerformanceTest<T> = T extends infer U ? U : never;

// Complexity measurement helper
type ComplexityLevel<T> = T extends string
  ? "simple"
  : T extends object
  ? keyof T extends never
    ? "empty"
    : "complex"
  : "primitive";

// =====================================================
// SECTION 4: Practical Exercises & Tests
// =====================================================

/**
 * Exercise 1: Implement efficient type-safe configuration merger
 */
type ConfigMerger<Base, Override> = EfficientDeepMerge<Base, Override, 2>;

interface BaseConfig {
  api: {
    endpoint: string;
    timeout: number;
  };
  cache: {
    ttl: number;
  };
}

interface UserConfig {
  api: {
    timeout: number;
    retries: number;
  };
  logging: {
    level: "info" | "debug";
  };
}

type MergedConfig = ConfigMerger<BaseConfig, UserConfig>;

/**
 * Exercise 2: Build type-safe substrate extrinsic builder
 */
namespace ExtrinsicBuilder {
  export type ExtrinsicCall<
    Pallet extends string,
    Call extends string,
    Args extends unknown[]
  > = {
    pallet: Pallet;
    call: Call;
    args: Args;
  };

  export type BuildExtrinsic<T> = T extends ExtrinsicCall<
    infer P,
    infer C,
    infer A
  >
    ? {
        section: P;
        method: C;
        args: A;
        toHex: () => string;
      }
    : never;

  // Usage example
  type BalanceTransfer = ExtrinsicCall<
    "balances",
    "transfer",
    [string, number]
  >;
  type TransferExtrinsic = BuildExtrinsic<BalanceTransfer>;
}

/**
 * Exercise 3: Performance-optimized blockchain data processor
 */
type ProcessBlockData<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends unknown[]
      ? U["length"]
      : U extends object
      ? keyof U
      : U
    : never;
};

/**
 * Exercise 4: Type-level validation for runtime metadata
 */
type ValidateRuntimeMetadata<T> = T extends {
  pallets: infer P;
  version: infer V;
}
  ? P extends unknown[]
    ? V extends number
      ? { valid: true; pallets: P; version: V }
      : { valid: false; error: "Invalid version type" }
    : { valid: false; error: "Invalid pallets type" }
  : { valid: false; error: "Missing required fields" };

// =====================================================
// SECTION 5: Testing & Validation
// =====================================================

// Test performance optimizations
type TestDeepReadonly = EfficientDeepReadonly<{
  level1: {
    level2: {
      level3: {
        value: string;
      };
    };
  };
}>;

// Test type-level computations
type Test1 = Add<3, 4>; // Should be 7
type Test2 = StringLength<"hello">; // Should be 5
type Test3 = ReverseString<"abc">; // Should be 'cba'
type Test4 = Contains<"hello world", "world">; // Should be true

// Test substrate-specific optimizations
type TestEventHandlers = EventHandlers<{
  "system.ExtrinsicSuccess": { weight: number };
  "balances.Transfer": { from: string; to: string; amount: number };
  [key: string]: unknown; // Index signature for Record<string, unknown> constraint
}>;

/**
 * Performance Guidelines for Production Use:
 *
 * 1. Limit recursion depth (max 5-10 levels)
 * 2. Use conditional types efficiently
 * 3. Avoid complex mapped type chains
 * 4. Consider compilation time vs. runtime safety trade-offs
 * 5. Use type-level caching where possible
 * 6. Profile TypeScript compilation performance regularly
 *
 * Remember: Complex types provide safety but impact compilation time.
 * Always balance type safety with development experience.
 */

// Export individual types for better tree-shaking and explicit imports
export type {
  EfficientDeepReadonly,
  EfficientDeepMerge,
  StringLength,
  Add,
  ReverseString,
  Contains,
  Filter,
  Map,
  Reverse,
  EventHandlers,
  ConfigMerger,
  ProcessBlockData,
  ValidateRuntimeMetadata,
};

// Export namespaces
export { SubstrateOptimized, ExtrinsicBuilder };

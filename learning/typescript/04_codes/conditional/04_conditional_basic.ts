/**
 * TypeScript Conditional Types - Basic Fundamentals
 * Focus: Core conditional syntax, distributive types, and Substrate API applications
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 12, 2025
 *
 * Learning Focus:
 * - Basic conditional type syntax (T extends U ? X : Y)
 * - Distributive conditional types with union types
 * - infer keyword for type extraction
 * - Substrate blockchain API type safety
 *
 * Key Concepts:
 * 1. Conditional Types: Type-level if-else logic
 * 2. Distribution: How conditionals work with union types
 * 3. Type Inference: Extracting types with infer keyword
 * 4. API Response Types: Type-safe blockchain data handling
 */

// =============================================================================
// 1. BASIC CONDITIONAL TYPE SYNTAX
// =============================================================================

/**
 * Basic conditional type: T extends U ? X : Y
 * If T is assignable to U, return X, otherwise return Y
 */

// Type checking utilities
type IsArray<T> = T extends readonly any[] ? true : false;

// Test cases
type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<number>; // false
type Test3 = IsArray<Array<any>>; // true

// Function type checker
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

// Test cases
type Test4 = IsFunction<() => void>; // true
type Test5 = IsFunction<string>; // false
type Test6 = IsFunction<(x: number) => string>; // true

// Promise type checker
type IsPromise<T> = T extends Promise<any> ? true : false;

// Test cases
type Test7 = IsPromise<Promise<string>>; // true
type Test8 = IsPromise<string>; // false
type Test9 = IsPromise<Promise<unknown>>; // true

// =============================================================================
// 2. SUBSTRATE-SPECIFIC TYPE APPLICATIONS
// =============================================================================

/**
 * Substrate blockchain data types
 */
interface SubstrateBlockHeader {
  number: number;
  hash: string;
  parentHash: string;
  stateRoot: string;
}

interface SubstrateBlock {
  header: SubstrateBlockHeader;
  extrinsics: string[];
}

interface SubstrateData {
  block?: SubstrateBlock;
  events?: string[];
  storage?: Record<string, any>;
}

/**
 * API Response type system using conditional types
 */
type ApiResponse<T> = T extends "success"
  ? { data: SubstrateData; error: null }
  : { data: null; error: string };

// Test cases
type SuccessResponse = ApiResponse<"success">;
// { data: SubstrateData; error: null }

type ErrorResponse = ApiResponse<"error">;
// { data: null; error: string }

/**
 * Advanced API response with status codes
 */
type SubstrateApiResponse<T extends number> = T extends 200
  ? { success: true; data: SubstrateData }
  : T extends 404
  ? { success: false; error: "Not Found" }
  : T extends 500
  ? { success: false; error: "Internal Server Error" }
  : { success: false; error: "Unknown Error" };

// Test cases
type Success200 = SubstrateApiResponse<200>; // { success: true; data: SubstrateData }
type NotFound404 = SubstrateApiResponse<404>; // { success: false; error: 'Not Found' }
type ServerError500 = SubstrateApiResponse<500>; // { success: false; error: 'Internal Server Error' }

// =============================================================================
// 3. DISTRIBUTIVE CONDITIONAL TYPES
// =============================================================================

/**
 * When conditional types act on union types, they distribute over each member
 */
type ToArray<T> = T extends any ? T[] : never;

// Test with union types - distributive behavior
type StringOrNumber = string | number;
type ArraysUnion = ToArray<StringOrNumber>; // string[] | number[]

/**
 * Non-distributive version (using tuple to prevent distribution)
 */
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type NonDistributiveResult = ToArrayNonDistributive<string | number>; // (string | number)[]

/**
 * Substrate event type distribution
 */
type SubstrateEvent =
  | { type: "NewBlock"; data: SubstrateBlock }
  | { type: "Transfer"; data: { from: string; to: string; amount: number } }
  | { type: "Error"; data: { message: string } };

// Extract event data types
type EventData<T> = T extends { type: any; data: infer D } ? D : never;

type AllEventData = EventData<SubstrateEvent>;
// SubstrateBlock | { from: string; to: string; amount: number } | { message: string }

// =============================================================================
// 4. BASIC INFER KEYWORD USAGE
// =============================================================================

/**
 * The infer keyword allows us to extract types within conditional types
 */

// Extract array element type
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

type StringElement = ArrayElement<string[]>; // string
type NumberElement = ArrayElement<number[]>; // number

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type FuncReturn1 = ReturnType<() => string>; // string
type FuncReturn2 = ReturnType<(x: number) => boolean>; // boolean

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : any[];

type FuncParams1 = Parameters<(a: string, b: number) => void>; // [string, number]
type FuncParams2 = Parameters<() => void>; // []

// Extract Promise resolved type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Awaited<Promise<string>>; // string
type NonPromise = Awaited<number>; // number

// =============================================================================
// 5. SUBSTRATE RPC METHOD TYPE SAFETY
// =============================================================================

/**
 * Substrate RPC methods categorization
 */
type SubstrateRPCMethods = {
  chain: {
    getBlock: (hash?: string) => Promise<SubstrateBlock>;
    getHeader: (hash?: string) => Promise<SubstrateBlockHeader>;
    getFinalizedHead: () => Promise<string>;
  };
  state: {
    getStorage: (key: string) => Promise<string | null>;
    getMetadata: () => Promise<string>;
    getRuntimeVersion: () => Promise<Record<string, any>>;
  };
  system: {
    health: () => Promise<{ peers: number; isSyncing: boolean }>;
    name: () => Promise<string>;
    version: () => Promise<string>;
  };
};

/**
 * Extract method categories
 */
type RPCCategory = keyof SubstrateRPCMethods; // 'chain' | 'state' | 'system'

/**
 * Extract methods for a specific category
 */
type CategoryMethods<C extends RPCCategory> = keyof SubstrateRPCMethods[C];

type ChainMethods = CategoryMethods<"chain">; // 'getBlock' | 'getHeader' | 'getFinalizedHead'
type StateMethods = CategoryMethods<"state">; // 'getStorage' | 'getMetadata' | 'getRuntimeVersion'

/**
 * Get method signature
 */
type MethodSignature<
  C extends RPCCategory,
  M extends CategoryMethods<C>
> = SubstrateRPCMethods[C][M];

type GetBlockSignature = MethodSignature<"chain", "getBlock">;
// (hash?: string) => Promise<SubstrateBlock>

// =============================================================================
// 6. PRACTICAL EXERCISES & UTILITIES
// =============================================================================

/**
 * Exercise 1: Implement type checkers
 */
type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;
type IsObject<T> = T extends object ? true : false;
type IsNull<T> = T extends null ? true : false;
type IsUndefined<T> = T extends undefined ? true : false;

/**
 * Exercise 2: Substrate-specific utilities
 */
type HasBlockData<T> = T extends { block: any } ? true : false;
type HasEvents<T> = T extends { events: any[] } ? true : false;

/**
 * Exercise 3: Error handling types
 */
type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

type SubstrateResult<T> = Result<
  T,
  "NetworkError" | "ParseError" | "UnknownError"
>;

/**
 * Exercise 4: Method parameter extraction
 */
type ExtractFirstParam<T> = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;
type ExtractLastParam<T> = T extends (...args: [...any[], infer L]) => any
  ? L
  : never;

// =============================================================================
// 7. TESTING SECTION
// =============================================================================

/**
 * Comprehensive tests for all implemented types
 */
namespace ConditionalTypeTests {
  // Basic type checkers
  const test1: IsArray<string[]> = true;
  const test2: IsFunction<() => void> = true;
  const test3: IsPromise<Promise<number>> = true;

  // Substrate API responses
  const successResponse: ApiResponse<"success"> = {
    data: {
      block: {
        header: {
          number: 1,
          hash: "0x123",
          parentHash: "0x000",
          stateRoot: "0x456",
        },
        extrinsics: [],
      },
    },
    error: null,
  };

  const errorResponse: ApiResponse<"error"> = {
    data: null,
    error: "Failed to fetch",
  };

  // Distributive types
  const arrayUnion: ToArray<string | number> = ["hello"]; // or [42]

  // Infer keyword usage
  const stringFromArray: ArrayElement<string[]> = "hello";
  const returnValue: ReturnType<() => number> = 42;

  // Method signature extraction
  type TestMethodSig = MethodSignature<"chain", "getBlock">;
  const methodTest: TestMethodSig = (hash?: string) =>
    Promise.resolve({
      header: {
        number: 1,
        hash: "0x123",
        parentHash: "0x000",
        stateRoot: "0x456",
      },
      extrinsics: [],
    });
}

// =============================================================================
// 8. LEARNING CHECKPOINT VALIDATION
// =============================================================================

/**
 * Learning Objectives Validation:
 * ✅ Understand T extends U ? X : Y syntax
 * ✅ Implement basic conditional type utilities
 * ✅ Grasp distributive conditional types concept
 * ✅ Apply conditional types to Substrate API scenarios
 * ✅ Basic usage of infer keyword
 */

export type {
  IsArray,
  IsFunction,
  IsPromise,
  ApiResponse,
  SubstrateApiResponse,
  ToArray,
  ToArrayNonDistributive,
  ArrayElement,
  ReturnType,
  Parameters,
  Awaited,
  SubstrateRPCMethods,
  MethodSignature,
  Result,
  SubstrateResult,
};

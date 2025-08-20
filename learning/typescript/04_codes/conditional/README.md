    # TypeScript Learning Project - Conditional Types Mastery

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** August 15, 2025

## Project Overview

This project demonstrates mastery of TypeScript's **Conditional Types** - one of the most powerful and advanced features of TypeScript's type system. Through comprehensive implementations targeting Substrate blockchain development, this project showcases real-world applications of conditional logic at the type level, advanced `infer` keyword patterns, and recursive type transformations.

## Files Structure

```
04_conditional_types/
├── 04_conditional_basic.ts           # Core conditional types fundamentals
├── 04_conditional_basic_test.ts      # Basic conditional types test suite
├── 04_conditional_advanced.ts        # Advanced patterns & recursive types
├── 04_conditional_advanced_test.ts   # Advanced patterns test suite
└── README.md                         # This documentation file
```

## Part 1: Core Implementation and Features

### 1. Basic Conditional Types (`04_conditional_basic.ts`)

#### Fundamental Concepts:

- **T extends U ? X : Y** - Core conditional syntax
- **Distributive Behavior** - How conditionals work with union types
- **Basic infer Usage** - Type extraction patterns
- **Substrate API Integration** - Blockchain-specific type safety

#### Key Type Implementations:

```typescript
// Type checking utilities
type IsArray<T> = T extends readonly any[] ? true : false;
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
type IsPromise<T> = T extends Promise<any> ? true : false;

// Substrate API response types
type ApiResponse<T> = T extends "success"
  ? { data: SubstrateData; error: null }
  : { data: null; error: string };

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never; // Distributes over unions

// Basic infer patterns
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

### 2. Advanced Conditional Types (`04_conditional_advanced.ts`)

#### Advanced Concepts:

- **Multiple infer** - Extract multiple types in single conditional
- **Recursive Conditionals** - Self-referencing type definitions
- **Pattern Matching** - String template literal parsing
- **Deep Transformations** - Nested object type manipulation

#### Complex Type Implementations:

```typescript
// Multiple infer extraction
type SwapParameters<T> = T extends (first: infer A, second: infer B) => any
  ? (first: B, second: A) => any
  : never;

// Recursive deep transformations
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// Pattern matching with string templates
type ParseExtrinsicCall<T extends string> =
  T extends `${infer Pallet}::${infer Method}`
    ? { pallet: Pallet; method: Method }
    : T extends `${infer Pallet}.${infer Method}`
    ? { pallet: Pallet; method: Method }
    : { pallet: never; method: never };

// Blockchain-specific utilities
type BalanceOperation<T> = T extends "transfer"
  ? { from: string; to: string; amount: bigint }
  : T extends "mint"
  ? { to: string; amount: bigint }
  : T extends "burn"
  ? { from: string; amount: bigint }
  : never;
```

## Part 2: Comprehensive Testing Results

### Basic Types Testing (`04_conditional_basic_test.ts`)

![Basic Test Results](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/04_codes/img/04_conditional_basic_testResults.png)

**Test Coverage:**

- ✅ Basic conditional type syntax validation
- ✅ Distributive conditional types behavior
- ✅ infer keyword functionality
- ✅ Substrate blockchain API type safety
- ✅ Real-world usage scenarios
- ✅ Edge cases and error handling

### Advanced Types Testing (`04_conditional_advanced_test.ts`)

![Advanced Test Results](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/04_codes/img/04_conditional_advanced_testResults.png)

**Advanced Test Coverage:**

- ✅ Advanced infer patterns (multiple, nested)
- ✅ Recursive conditional types
- ✅ Storage path extraction and filtering
- ✅ RPC return type extraction
- ✅ Pattern matching and parsing
- ✅ Blockchain-specific utilities
- ✅ Integration scenarios
- ✅ Edge cases and performance validation

## Part 3: Technical Implementation Highlights

### Core Conditional Type Patterns

#### 1. Basic Conditional Logic

```typescript
// Type-level if-else logic
type IsArray<T> = T extends readonly any[] ? true : false;

// Usage examples
type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<number>; // false
```

#### 2. Distributive Conditional Types

```typescript
// Distributes over union types
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumber = string | number;
type Result = ToArray<StringOrNumber>; // string[] | number[]
```

#### 3. Advanced infer Patterns

```typescript
// Multiple infer in single conditional
type SwapParameters<T> = T extends (first: infer A, second: infer B) => any
  ? (first: B, second: A) => any
  : never;

// Nested promise extraction
type ExtractNestedPromise<T> = T extends Promise<Promise<infer U>>
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
```

### Substrate Blockchain Applications

#### 1. RPC Method Type Safety

```typescript
type SubstrateRPCMethods = {
  chain: {
    getBlock: (hash?: string) => Promise<SubstrateBlock>;
    getHeader: (hash?: string) => Promise<SubstrateBlockHeader>;
    getFinalizedHead: () => Promise<string>;
  };
  // ... more categories
};

type MethodSignature<C, M> = SubstrateRPCMethods[C][M];
```

#### 2. Storage Path Extraction

```typescript
type StorageKeyPath<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? `${string & K}` | `${string & K}.${StorageKeyPath<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : never;

// Results in: "System" | "System.Account" | "Balances.TotalIssuance" | ...
```

#### 3. Event Filtering and Processing

```typescript
type FilterEventsByType<T, EventType> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends { type: EventType }
    ? [First, ...FilterEventsByType<Rest, EventType>]
    : FilterEventsByType<Rest, EventType>
  : [];
```

## Part 4: Key Learning Achievements

### Conditional Types Mastery:

1. **Basic Syntax** - `T extends U ? X : Y` patterns
2. **Distributive Behavior** - Union type handling
3. **infer Keyword** - Type extraction and inference
4. **Recursive Types** - Self-referencing definitions
5. **Pattern Matching** - String template parsing
6. **Complex Composition** - Multi-level type transformations

### Substrate Development Skills:

1. **Type-Safe APIs** - RPC method signatures
2. **Blockchain Data** - Block, extrinsic, event types
3. **Storage Systems** - Key path validation
4. **Runtime Safety** - Version compatibility checks
5. **Event Processing** - Type-safe event filtering
6. **Weight Calculations** - Performance type utilities

### Advanced TypeScript Patterns:

1. **Multiple infer** - Extract several types simultaneously
2. **Recursive Conditionals** - Build self-referencing types
3. **Deep Transformations** - Nested object manipulation
4. **String Parsing** - Template literal pattern matching
5. **Performance Optimization** - Efficient recursive algorithms
6. **Error Boundaries** - Safe type extraction with fallbacks

## Technical Specifications

### Type Complexity Examples:

```typescript
// Basic: Simple conditional check
type IsString<T> = T extends string ? true : false;

// Intermediate: infer with extraction
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Advanced: Multiple infer with transformation
type SwapParameters<T> = T extends (first: infer A, second: infer B) => any
  ? (first: B, second: A) => any
  : never;

// Expert: Recursive with pattern matching
type ParseExtrinsicCall<T extends string> =
  T extends `${infer Pallet}::${infer Method}`
    ? { pallet: Pallet; method: Method }
    : { pallet: never; method: never };

// Master: Complex recursive transformation
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};
```

## Running the Code

### Prerequisites:

```bash
node --version  # Ensure Node.js v18+ is installed
npm --version   # Ensure npm is available
```

### Setup:

```bash
git clone https://github.com/wls503pl/parity-learning.git
cd learning/typescript/04_codes/conditional_types
npm install -g tsx  # Install tsx for direct TypeScript execution
```

### Execution:

#### Run Basic Conditional Types Tests:

```bash
tsx 04_conditional_basic_test.ts
```

#### Run Advanced Conditional Types Tests:

```bash
tsx 04_conditional_advanced_test.ts
```

#### Expected Output:

- **Basic Tests**: 9 test suites with comprehensive type validation
- **Advanced Tests**: 8 test suites with complex pattern verification
- **All Tests Passing**: Complete type safety validation
- **Real-world Integration**: Substrate blockchain scenarios

## Performance Considerations

### Compile-Time Benefits:

- **Zero Runtime Cost** - All conditional types resolved at compile time
- **Early Error Detection** - Type errors caught during development
- **IDE Enhancement** - Superior autocomplete and type checking
- **Refactoring Safety** - Prevent breaking changes across codebase

### Type System Optimization:

- **Efficient Recursion** - Tail-recursive type definitions where possible
- **Memoization Patterns** - Reuse computed type results
- **Depth Limits** - Prevent infinite recursive type expansion
- **Performance Monitoring** - Track TypeScript compilation performance

## Advanced Usage Patterns

### Custom Conditional Utilities:

```typescript
// Create domain-specific conditional types
type IsSubstrateAddress<T> = T extends `${string}${string}${string}...`
  ? true
  : false;

type ExtractEventData<T> = T extends { type: any; data: infer D } ? D : never;

// Compose complex transformations
type SafeAPIResponse<T> = T extends Promise<infer U>
  ? U extends { success: true; data: infer D }
    ? D
    : never
  : never;
```

### Industry-Standard Patterns:

```typescript
// Result type pattern
type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

// Optional chain pattern
type SafeAccess<T, K extends keyof T> = T extends Record<K, infer U>
  ? U
  : undefined;
```

## Real-World Applications

### Blockchain Development:

- **Type-Safe RPC Calls** - Method signature validation
- **Storage Key Validation** - Compile-time path checking
- **Event Processing** - Type-safe event filtering
- **Runtime Compatibility** - Version upgrade validation

### API Development:

- **Response Type Extraction** - Safe API result handling
- **Parameter Validation** - Function signature checking
- **Data Transformation** - Type-safe data mapping
- **Error Handling** - Discriminated union patterns

### Library Development:

- **Generic Utilities** - Reusable type transformations
- **Framework Integration** - Type-safe plugin systems
- **Configuration Validation** - Compile-time config checking
- **Performance Optimization** - Zero-runtime type utilities

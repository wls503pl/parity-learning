# TypeScript Learning Project - Mapped Types & Advanced Inference Mastery

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** August 18, 2025

## Project Overview

This project demonstrates mastery of TypeScript's **Mapped Types** and **Advanced Type Inference** - sophisticated features that enable flexible object shape transformations and complex type extraction patterns. Through comprehensive implementations targeting Substrate blockchain development, this project showcases key remapping techniques, nested inference patterns, and advanced type transformation systems.

## Files Structure

```
mapped_inference/
├── 04_mapped_inference.ts          # Core mapped types and inference implementation
├── 04_mapped_inference_test.ts     # Comprehensive test suite
└── README.md                       # This documentation file
```

## Part 1: Core Implementation and Features

### 1. Fundamental Mapped Types (`04_mapped_inference.ts`)

#### Basic Concepts:

- **Mapped Type Syntax** - `{ [K in keyof T]: T[K] }` transformations
- **Modifier Management** - Adding/removing `readonly` and optional modifiers
- **Key Remapping** - Using `as` clause for property name transformations
- **Type Filtering** - Conditional property inclusion/exclusion
- **Substrate Integration** - Blockchain-specific type transformations

#### Key Type Implementations:

```typescript
// Basic mapped type patterns
type BasicMapping<T> = {
  [K in keyof T]: T[K];
};

// Modifier transformations
type ReadonlyVersion<T> = {
  readonly [K in keyof T]: T[K];
};

type RequiredVersion<T> = {
  [K in keyof T]-?: T[K]; // Remove optional modifier
};

// Key remapping with 'as' clause
type GetterMethods<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Substrate event handler mapping
type SubstrateEventHandlers<T extends Record<string, any>> = {
  [K in keyof T as `handle_${string & K}`]: (data: T[K]) => void;
};
```

### 2. Advanced Type Inference (`04_mapped_inference.ts`)

#### Advanced Concepts:

- **Function Signature Extraction** - Parameter and return type inference
- **Promise Unwrapping** - Extract inner promise values
- **Nested Object Navigation** - Deep property access patterns
- **Conditional Inference** - Multi-constraint type extraction
- **String Pattern Parsing** - Template literal decomposition

#### Complex Type Implementations:

```typescript
// Function analysis
type FunctionParams<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

type FunctionReturn<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

// Promise value extraction
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Deep nested inference
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

// Substrate-specific data extraction
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
```

## Part 2: Substrate-Specific Applications

### 1. RPC Method Transformation

```typescript
// Transform snake_case RPC methods to camelCase client methods
type RPCToClientMethods<T extends Record<string, any>> = {
  [K in keyof T as K extends `${infer Module}_${infer Method}`
    ? `${Module}${Capitalize<Method>}`
    : K]: T[K];
};

// Example transformation
interface SubstrateRPCMethods {
  chain_getBlock: (hash?: string) => Promise<any>;
  state_getStorage: (key: string) => Promise<string | null>;
  system_name: () => Promise<string>;
}

type SubstrateClient = RPCToClientMethods<SubstrateRPCMethods>;
// Results in: { chainGetBlock, stateGetStorage, systemName }
```

### 2. Event System Generation

```typescript
// Automatic event listener generation
type EventListeners<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (
    callback: (data: T[K]) => void
  ) => () => void; // Returns unsubscribe function
};

// Usage example
type SubstrateEvents = {
  NewBlock: { hash: string; number: number };
  Finalized: { hash: string };
  RuntimeUpgrade: { version: number };
};

type SubstrateEventListeners = EventListeners<SubstrateEvents>;
// Results in: { onNewBlock, onFinalized, onRuntimeUpgrade }
```

### 3. Configuration Transformation

```typescript
// Transform environment config to camelCase with optional handling
interface RawSubstrateConfig {
  WS_ENDPOINT: string;
  HTTP_ENDPOINT: string;
  MAX_CONNECTIONS: number;
  RETRY_ATTEMPTS: number;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
}

type TransformConfig<T> = {
  [K in keyof T as CamelCase<string & K>]: K extends
    | "LOG_LEVEL"
    | "RETRY_ATTEMPTS"
    ? T[K] | undefined
    : T[K];
};

type ProcessedConfig = TransformConfig<RawSubstrateConfig>;
// Results in: { wsEndpoint, httpEndpoint, maxConnections, retryAttempts?, logLevel? }
```

## Part 3: Comprehensive Testing Framework

### Test Suite Overview (`04_mapped_inference_test.ts`)

![Mapped Types Test Results](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/04_codes/img/04_mapped_inference_testResults.png)

**Test Coverage:**

- ✅ Basic mapped type transformations (5/5 tests)
- ✅ Key remapping patterns (4/4 tests)
- ✅ Type inference systems (6/6 tests)
- ✅ Substrate-specific patterns (3/3 tests)
- ✅ Advanced transformations (2/2 tests)
- ✅ Complex inference patterns (3/3 tests)
- ✅ Exercise implementations (3/3 tests)

**Total: 26/26 ✅ ALL TESTS PASSED**

### Test Categories:

#### 1. Basic Mapped Types Tests

```typescript
// Modifier transformations
interface TestInterface {
  readonly name: string;
  age?: number;
  email: string;
}

// ReadonlyVersion test
type ReadonlyTest = ReadonlyVersion<{ name: string; age: number }>;
// Result: { readonly name: string; readonly age: number } ✅

// RequiredVersion test
type RequiredTest = RequiredVersion<{ name?: string; age?: number }>;
// Result: { name: string; age: number } ✅
```

#### 2. Key Remapping Tests

```typescript
// Getter methods generation
type GetterTest = GetterMethods<{ name: string; age: number }>;
// Result: { getName: () => string; getAge: () => number } ✅

// Event handler mapping
type EventTest = SubstrateEventHandlers<{
  blockFinalized: { hash: string };
  newBlock: { number: number };
}>;
// Result: { handle_blockFinalized, handle_newBlock } ✅
```

#### 3. Type Inference Tests

```typescript
// Function parameter extraction
type ParamsTest = FunctionParams<(a: string, b: number) => void>;
// Result: [string, number] ✅

// Promise unwrapping
type UnwrapTest = UnwrapPromise<Promise<{ data: string }>>;
// Result: { data: string } ✅

// Nested type extraction
type NestedTest = ExtractNestedType<
  { user: { profile: { name: string } } },
  "user.profile.name"
>;
// Result: string ✅
```

## Part 4: Technical Implementation Highlights

### Core Mapped Type Patterns

#### 1. Property Transformation

```typescript
// Transform property names and types simultaneously
type APIMethodMapping<T> = {
  [K in keyof T as K extends `${infer Prefix}_${infer Suffix}`
    ? `${Prefix}${Capitalize<Suffix>}`
    : K]: T[K];
};

// snake_case → camelCase conversion
type APITest = APIMethodMapping<{
  get_user: () => string;
  create_post: () => void;
}>;
// Result: { getUser: () => string; createPost: () => void }
```

#### 2. Conditional Property Filtering

```typescript
// Extract only function properties
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

// Usage example
interface TestAPI {
  getData: () => string;
  version: number;
  config: object;
}

type OnlyMethods = FunctionProperties<TestAPI>;
// Result: { getData: () => string }
```

#### 3. Deep Object Transformations

```typescript
// Recursive transformation with conditions
type DeepTransform<T, U> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends any[]
      ? TransformArray<T[K], U>
      : DeepTransform<T[K], U>
    : T[K] extends string
    ? U extends "uppercase"
      ? Uppercase<T[K]>
      : T[K]
    : T[K];
};
```

### Advanced Inference Patterns

#### 1. Multi-Level Type Extraction

```typescript
// Navigate through nested object structures
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

// Example usage
interface ComplexResponse {
  result: {
    block: {
      header: { number: string; hash: string };
    };
  };
}

type BlockNumber = ExtractNestedType<
  ComplexResponse,
  "result.block.header.number"
>;
// Result: string
```

#### 2. Conditional Type Extraction

```typescript
// Smart extraction with multiple constraints
type SmartExtract<T, Condition> = T extends any[]
  ? T[number] extends infer U
    ? U extends Condition
      ? U
      : never
    : never
  : T extends Condition
  ? T
  : never;
```

#### 3. String Pattern Parsing

```typescript
// Parse structured string data
type ParseEventData<T extends string> =
  T extends `${infer EventType}:${infer Data}`
    ? {
        type: EventType;
        data: ParseKeyValuePairs<Data>;
      }
    : never;

// Usage example
type ParsedEvent = ParseEventData<"BlockFinalized:hash=0x123,number=100">;
// Result: { type: "BlockFinalized"; data: { hash: "0x123"; number: "100" } }
```

## Part 5: Practical Exercise Solutions

### 1. Configuration Builder Pattern

```typescript
type ConfigBuilder<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (
    value: T[K]
  ) => ConfigBuilder<T>;
} & {
  build(): T;
};

// Usage example
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
}

type Builder = ConfigBuilder<DatabaseConfig>;
// Results in: { setHost, setPort, setDatabase, build }
```

### 2. Validation Rules Generation

```typescript
type ValidationRules<T> = {
  [K in keyof T]-?: T[K] extends string
    ? { minLength?: number; maxLength?: number; pattern?: RegExp }
    : T[K] extends number
    ? { min?: number; max?: number }
    : T[K] extends boolean
    ? { required?: boolean }
    : { custom?: (value: T[K]) => boolean };
};

// Generates appropriate validation rules based on property types
```

### 3. Type-Safe Extrinsic Builder

```typescript
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

// Creates type-safe Substrate extrinsic builders
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
cd learning/typescript/04_codes/mapped_inference
npm install -g tsx  # Install tsx for direct TypeScript execution
```

### Execution:

#### Run Mapped Types & Inference Tests:

```bash
tsx 04_mapped_inference_test.ts
```

#### Expected Output:

```
🚀 Running Mapped Types & Inference Demos...

✅ Basic mapped type transformations validated at compile time
✅ Getter methods: { nameType: 'function', ageType: 'function' }
✅ Event handlers registered: {
  blockFinalizedHandler: 'function',
  newBlockHandler: 'function'
}
✅ API wrapper response: {
  success: true,
  hasData: true,
  hasTimestamp: true
}
✅ Config builder result: {
  host: 'localhost',
  port: 5432,
  database: 'testdb'
}

✅ All demos completed successfully!
```

## Key Learning Achievements

### Mapped Types Mastery:

1. **Basic Transformations** - Property modification and type mapping
2. **Key Remapping** - Advanced property name transformations with `as` clause
3. **Modifier Management** - Adding/removing `readonly` and optional modifiers
4. **Conditional Mapping** - Property filtering based on type conditions
5. **Complex Transformations** - Multi-step mapped type pipelines
6. **Performance Optimization** - Efficient type system design patterns

### Advanced Inference Skills:

1. **Function Analysis** - Parameter and return type extraction
2. **Promise Handling** - Nested promise value unwrapping
3. **Deep Navigation** - Multi-level object property access
4. **Pattern Matching** - String template and structure parsing
5. **Conditional Extraction** - Multi-constraint type filtering
6. **Recursive Processing** - Self-referencing type transformations

### Substrate Development Integration:

1. **RPC Method Safety** - Type-safe API method generation
2. **Event System Design** - Automatic handler and listener creation
3. **Configuration Management** - Environment variable transformation
4. **Metadata Processing** - Runtime information type extraction
5. **Extrinsic Building** - Type-safe transaction construction
6. **Storage Access** - Path-based type-safe data retrieval

## Performance Considerations

### Compile-Time Optimization:

- **Efficient Recursion** - Tail-recursive patterns where possible
- **Type Caching** - Reuse computed type results for complex transformations
- **Depth Limiting** - Prevent infinite recursive type expansion
- **Conditional Short-Circuiting** - Early termination for type computations

### Memory Management:

- **Union Type Optimization** - Efficient handling of large type unions
- **Template Literal Limits** - Avoid excessive string type combinations
- **Mapped Type Efficiency** - Minimize property iteration overhead
- **Inference Complexity** - Balance type safety with compilation performance

## Real-World Applications

### Blockchain Development:

- **API Client Generation** - Transform RPC definitions to typed clients
- **Event System Architecture** - Type-safe event handling frameworks
- **Configuration Systems** - Environment-aware configuration typing
- **Metadata Processing** - Runtime type information extraction
- **Transaction Safety** - Type-safe extrinsic construction and validation

### Enterprise Software:

- **Configuration Management** - Type-safe environment variable handling
- **API Design** - Automatic client generation from server definitions
- **Event Architectures** - Type-safe publish-subscribe systems
- **Data Transformation** - ETL pipeline type safety
- **Validation Systems** - Automatic validation rule generation

### Framework Development:

- **Plugin Systems** - Type-safe plugin architecture
- **ORM Design** - Database schema to TypeScript type mapping
- **State Management** - Type-safe state transformation systems
- **Middleware Pipelines** - Request/response transformation typing
- **Testing Frameworks** - Mock generation and type validation

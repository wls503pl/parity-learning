# TypeScript Learning Project - Template Literal Types Mastery

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** August 18, 2025

## Project Overview

This project demonstrates mastery of TypeScript's **Template Literal Types** - a powerful feature for type-safe string manipulation and pattern matching at the type level. Through comprehensive implementations targeting Substrate blockchain development, this project showcases string transformation utilities, type-safe API construction, and advanced event system generation.

## Files Structure

```
template_literals/
├── 04_template_literals.ts          # Core template literal types implementation
├── 04_template_literals_tests.ts    # Comprehensive test framework
└── README.md                        # This documentation file
```

## Part 1: Core Implementation and Features

### 1. Template Literal Types Foundation (`04_template_literals.ts`)

#### Fundamental Concepts:

- **`${string}` Patterns** - Basic template literal type syntax
- **String Transformations** - Case conversion utilities (camelCase, snake_case, kebab-case)
- **Pattern Matching** - Advanced string parsing with infer keyword
- **Type-Safe APIs** - Compile-time validation for URLs and method names
- **Event System Generation** - Automatic handler and subscription creation

#### Key Type Implementations:

```typescript
// Basic template literal construction
type Greeting<Name extends string> = `Hello, ${Name}!`;

// Substrate blockchain event naming
type SubstrateEventName<
  Pallet extends string,
  Event extends string
> = `${Pallet}_${Event}`;

// API endpoint generation
type SubstrateRPCEndpoint<
  Module extends string,
  Method extends string
> = `/api/v1/${Module}/${Method}`;

// String case transformations
type CamelToSnakeCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends Lowercase<First>
      ? `${First}${CamelToSnakeCase<Rest>}`
      : `_${Lowercase<First>}${CamelToSnakeCase<Rest>}`
    : S;
```

### 2. Advanced String Processing (`04_template_literals.ts`)

#### Advanced Concepts:

- **Recursive String Processing** - Complex pattern parsing
- **Multi-Step Transformations** - Chained string operations
- **Substrate-Specific Parsing** - Blockchain format handling
- **Event System Generation** - Type-safe handler creation
- **URL Construction** - Parameter extraction and validation

#### Complex Type Implementations:

```typescript
// Substrate pallet call parsing
type ParsePalletCall<T extends string> =
  T extends `${infer Pallet}::${infer Method}`
    ? { pallet: Pallet; method: Method }
    : never;

// Event signature parsing with parameters
type ParseEventSignature<T extends string> =
  T extends `${infer EventName}(${infer Params})`
    ? { eventName: EventName; params: ParseParams<Params> }
    : { eventName: T; params: [] };

// Automatic event handler generation
type EventToHandler<T extends string> = `handle${Capitalize<T>}`;
type EventToSubscription<T extends string> = `subscribe${Capitalize<T>}`;

// Complete event system type
type EventSystem<T extends Record<string, any>> = {
  [K in keyof T as EventToHandler<string & K>]: (data: T[K]) => void;
} & {
  [K in keyof T as EventToSubscription<string & K>]: (
    handler: (data: T[K]) => void
  ) => { unsubscribe: () => void };
};
```

## Part 2: Comprehensive Testing Framework

### Test Suite Overview (`04_template_literals_tests.ts`)

![Template Literals Test Results](test_results_template_literals.png)

**Test Coverage:**

- ✅ Basic template literal type construction
- ✅ String transformation functions (camelCase ↔ snake_case ↔ kebab-case)
- ✅ Substrate blockchain string parsing
- ✅ Event system type generation
- ✅ RPC method validation
- ✅ Address and hash validation
- ✅ Real-world integration scenarios

### Test Categories:

#### 1. Basic Template Literal Tests
```typescript
// Greeting generation
"World" → "Hello, World!" ✅
"TypeScript" → "Hello, TypeScript!" ✅

// Substrate event naming
"Balances" + "Transfer" → "Balances_Transfer" ✅
"System" + "NewAccount" → "System_NewAccount" ✅
```

#### 2. String Transformation Tests
```typescript
// CamelCase to snake_case
"userName" → "user_name" ✅
"getBlockHash" → "get_block_hash" ✅

// snake_case to CamelCase
"user_name" → "userName" ✅
"block_hash" → "blockHash" ✅

// CamelCase to kebab-case
"getUserName" → "get-user-name" ✅
```

#### 3. Substrate String Parsing Tests
```typescript
// Pallet call parsing
"Balances::transfer" → Pallet: "Balances", Method: "transfer" ✅
"System::remark" → Pallet: "System", Method: "remark" ✅

// Event signature parsing
"Transfer(AccountId,AccountId,Balance)" → 
  Event: "Transfer", Params: ["AccountId", "AccountId", "Balance"] ✅
```

#### 4. Event System Tests
```typescript
// Handler name generation
"transfer" → "handleTransfer" ✅
"newAccount" → "handleNewAccount" ✅

// Subscription method generation
"transfer" → "subscribeTransfer" ✅
"newBlock" → "subscribeNewBlock" ✅
```

#### 5. Validation Tests
```typescript
// RPC method validation
"chain_getBlock" → Valid ✅
"state_getStorage" → Valid ✅
"invalidmethod" → Invalid ✅

// Substrate address validation
"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" → Valid ✅
```

## Part 3: Technical Implementation Highlights

### Core Template Literal Patterns

#### 1. Basic String Construction
```typescript
// Simple template combination
type APIPath<Version extends string, Endpoint extends string> = 
  `/api/${Version}/${Endpoint}`;

type V1Users = APIPath<"v1", "users">; // "/api/v1/users"
```

#### 2. Recursive String Processing
```typescript
// Convert camelCase to snake_case recursively
type CamelToSnakeCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends Lowercase<First>
      ? `${First}${CamelToSnakeCase<Rest>}`
      : `_${Lowercase<First>}${CamelToSnakeCase<Rest>}`
    : S;
```

#### 3. Advanced Pattern Matching
```typescript
// Extract URL parameters
type ExtractRouteParams<T extends string> =
  T extends `${string}/:${infer Param}/${infer Rest}`
    ? [Param, ...ExtractRouteParams<`/${Rest}`>]
    : T extends `${string}/:${infer Param}`
    ? [Param]
    : [];

type UserParams = ExtractRouteParams<"/users/:userId/posts/:postId">;
// ["userId", "postId"]
```

### Substrate Blockchain Applications

#### 1. Type-Safe RPC Method Construction
```typescript
type SubstrateRPCMethods = {
  chain: ["getBlock", "getHeader", "getFinalizedHead"];
  state: ["getStorage", "getStorageAt", "getStorageSize"];
  system: ["name", "version", "chain", "properties"];
};

type IsValidRPCMethod<T extends string> = T extends `${string}_${string}`
  ? true
  : false;
```

#### 2. Event Handler Generation
```typescript
interface SubstrateEvents {
  transfer: { from: string; to: string; amount: bigint };
  newAccount: { account: string };
  balanceSet: { who: string; free: bigint };
}

// Automatically generates:
// handleTransfer, handleNewAccount, handleBalanceSet
// subscribeTransfer, subscribeNewAccount, subscribeBalanceSet
type Handlers = EventSystem<SubstrateEvents>;
```

#### 3. Storage Path Validation
```typescript
type StorageKeyPath<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? `${string & K}` | `${string & K}.${StorageKeyPath<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : never;

// Results in type-safe storage paths:
// "System" | "System.Account" | "Balances.TotalIssuance" | ...
```

## Part 4: Key Learning Achievements

### Template Literal Types Mastery:

1. **Basic Syntax** - `${string}` pattern construction
2. **String Interpolation** - Type-level string composition
3. **Pattern Matching** - Using infer with template literals
4. **Recursive Processing** - Self-referencing string transformations
5. **Case Transformations** - Converting between naming conventions
6. **Validation Patterns** - Format checking at compile time

### Substrate Development Skills:

1. **Event System Design** - Type-safe event handling
2. **RPC Method Safety** - Compile-time API validation
3. **Storage Path Construction** - Type-safe data access
4. **Address Validation** - Blockchain address format checking
5. **Transaction Processing** - Type-safe extrinsic handling
6. **Runtime Integration** - Version-aware type systems

### Advanced TypeScript Patterns:

1. **Recursive Templates** - Self-referencing string types
2. **Multi-Step Transformations** - Chained string operations
3. **Pattern Decomposition** - Breaking down complex strings
4. **Type-Safe APIs** - Compile-time endpoint validation
5. **Event Architecture** - Automatic handler generation
6. **Performance Optimization** - Efficient string processing

## Technical Specifications

### String Transformation Examples:

```typescript
// Basic: Simple concatenation
type Welcome<Name extends string> = `Welcome, ${Name}!`;

// Intermediate: Case conversion
type ToSnakeCase<T extends string> = CamelToSnakeCase<T>;

// Advanced: Pattern parsing
type ParseMethod<T extends string> = 
  T extends `${infer Module}_${infer Method}`
    ? { module: Module; method: Method }
    : never;

// Expert: Recursive transformation
type DeepPathExtraction<T, Path extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? Path extends ""
      ? DeepPathExtraction<T[K], `${string & K}`>
      : DeepPathExtraction<T[K], `${Path}.${string & K}`>
    : Path extends ""
    ? `${string & K}`
    : `${Path}.${string & K}`;
}[keyof T];
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
cd learning/typescript/04_codes/template_literals
npm install -g tsx  # Install tsx for direct TypeScript execution
```

### Execution:

#### Run Template Literals Tests:

```bash
tsx 04_template_literals_tests.ts
```

#### Expected Output:

- **Test 1**: Basic Template Literal Types validation
- **Test 2**: String Transformation Types verification
- **Test 3**: Substrate String Parsing tests
- **Test 4**: Event System Types generation
- **Test 5**: Validation Tests execution
- **Test Report**: Comprehensive results summary

#### Sample Test Output:

```
🚀 Starting TypeScript Template Literal Types Test Framework
Author: Peile Wu (peile.wu.1990@gmail.com)
Date: Aug 18, 2025
============================================================

🔥 Test 1: Basic Template Literal Types
============================================================
🔹 Greeting Generation Tests:
   "World" → "Hello, World!" ✅
   "TypeScript" → "Hello, TypeScript!" ✅
   "Blockchain" → "Hello, Blockchain!" ✅

🔗 Substrate Event Naming Tests:
   Balances + Transfer → "Balances_Transfer" ✅
   System + NewAccount → "System_NewAccount" ✅
   Staking + Reward → "Staking_Reward" ✅

📄 Test 2: String Transformation Types
============================================================
🐪➡️🐍 CamelCase to snake_case:
   "userName" → "user_name" ✅
   "getBlockHash" → "get_block_hash" ✅

🐍➡️🐪 snake_case to CamelCase:
   "user_name" → "userName" ✅
   "block_hash" → "blockHash" ✅

📊 COMPREHENSIVE TEST REPORT
============================================================
📈 Overall Statistics:
   Total Tests: 25
   Passed: 25 ✅
   Failed: 0 ❌
   Pass Rate: 100.00%

🎉 All tests passed!
```

## Performance Considerations

### Compile-Time Benefits:

- **Zero Runtime Cost** - All transformations happen at compile time
- **Early Error Detection** - String format errors caught during development
- **IDE Integration** - Superior autocomplete for string literals
- **Type Safety** - Prevent invalid string constructions

### Template Literal Optimization:

- **Efficient Recursion** - Tail-recursive string processing where possible
- **Pattern Reuse** - Cache common string transformation patterns
- **Depth Limits** - Prevent infinite recursive string expansion
- **Memory Management** - Optimize template literal union types

## Advanced Usage Patterns

### Custom String Utilities:

```typescript
// Create domain-specific string validators
type IsValidEmail<T extends string> = 
  T extends `${string}@${string}.${string}` ? true : false;

type IsValidURL<T extends string> = 
  T extends `http${"s" | ""}://${string}` ? true : false;

// Build complex string transformations
type CreateAPIEndpoint<
  Version extends string,
  Resource extends string,
  Action extends string
> = `/api/${Version}/${Lowercase<Resource>}/${Action}`;
```

### Industry-Standard Patterns:

```typescript
// REST API path construction
type RESTEndpoint<Resource extends string, ID extends string = ""> = 
  ID extends "" 
    ? `/api/v1/${Lowercase<Resource>}` 
    : `/api/v1/${Lowercase<Resource>}/${ID}`;

// Event naming convention
type EventName<Domain extends string, Action extends string> = 
  `${Lowercase<Domain>}:${Lowercase<Action>}`;
```

## Real-World Applications

### Blockchain Development:

- **Type-Safe RPC Calls** - Method name validation at compile time
- **Event System Design** - Automatic handler generation
- **Storage Key Validation** - Path checking for blockchain storage
- **Address Format Checking** - Validate blockchain addresses
- **Transaction Parsing** - Extract extrinsic information safely

### API Development:

- **Endpoint Construction** - Type-safe URL building
- **Parameter Extraction** - Parse URL parameters automatically
- **Method Validation** - Ensure API method format compliance
- **Response Typing** - Type-safe API response handling

### Configuration Management:

- **Environment Variables** - Type-safe config key validation
- **Feature Flags** - Compile-time feature toggle checking
- **Localization Keys** - Translation key validation
- **Theme Configuration** - Style property validation

## Integration Examples

### With Substrate Framework:

```typescript
// Integration with Polkadot.js API
interface SubstrateAPI {
  rpc: {
    [K in keyof SubstrateRPCMethods]: {
      [M in SubstrateRPCMethods[K][number]]: (...args: any[]) => Promise<any>;
    };
  };
}

// Type-safe storage queries
type StorageQuery<Pallet extends string, Item extends string> = 
  `${Pallet}.${Item}`;

// Event subscription system
type EventSubscription<T extends keyof SubstrateEvents> = 
  `subscribe${Capitalize<T>}`;
```

### With React Applications:

```typescript
// Type-safe component prop generation
type ComponentProps<T extends string> = {
  [K in `on${Capitalize<T>}`]: (event: Event) => void;
};

// CSS class name generation
type ClassName<Base extends string, Modifier extends string> = 
  `${Base}--${Modifier}`;
```

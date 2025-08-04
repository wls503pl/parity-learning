# TypeScript Learning Project - Union Types & Intersection Types

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** Aug 4, 2025

## Project Overview

This module focuses on mastering TypeScript's Union Types and Intersection Types, essential features for creating flexible and type-safe applications. The implementation covers blockchain transaction management and user authentication systems, demonstrating real-world applications of advanced type compositions.

## Files Structure

```
union_types/
├── 03_union_types.ts      # Union and intersection types implementation
├── 03_union_types_test.ts # Comprehensive testing suite
└── README.md              # This documentation file
```

## Part 1: Code Analysis and Implementation Results

### 1. Union Types Implementation (`03_union_types.ts`)

#### Key Features:

- **Discriminated Union Types**: Blockchain status with string literals
- **Type Safety**: Exhaustive checking with switch statements and `never` type
- **Intersection Type Composition**: Combining multiple interfaces into complete user types
- **Generic Union Types**: Flexible API response patterns with discriminated unions
- **Type Guards**: Runtime type checking with user-defined type predicates

#### Code Highlights:

```typescript
// Union type with string literals for blockchain status
type BlockchainStatus = "pending" | "confirmed" | "failed";

// Intersection type combining multiple interfaces
type CompleteUser = UserBasicInfo & UserPermissions;

// Generic discriminated union for API responses
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Exhaustive checking with never type
export function processBlockchainStatus(status: BlockchainStatus): string {
  switch (status) {
    case "pending":
      return "Transaction processing...";
    case "confirmed":
      return "Transaction confirmed";
    case "failed":
      return "Transaction failed";
    default:
      // TypeScript ensures all cases are handled
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}

// Type guard with intersection type constraint
export function isAdmin(
  user: CompleteUser
): user is CompleteUser & { role: "admin" } {
  return user.role === "admin";
}
```

### 2. Advanced Type Compositions

#### Intersection Types for Data Composition:

```typescript
// Base user information interface
interface UserBasicInfo {
  id: number;
  name: string;
  email: string;
}

// User permissions interface
interface UserPermissions {
  role: "admin" | "user" | "guest";
  permissions: string[];
  lastLogin: Date;
}

// Combined using intersection type
type CompleteUser = UserBasicInfo & UserPermissions;
```

#### Union Types for Payment Processing:

```typescript
// Payment method union type
type PaymentMethod = "credit_card" | "paypal" | "bitcoin" | "bank_transfer";

// Business logic with union type validation
export function processPayment(
  amount: number,
  method: PaymentMethod
): ApiResponse<{ transactionId: string; amount: number }> {
  if (amount <= 0) {
    return { success: false, error: "The amount must be greater than 0" };
  }

  // Special validation for Bitcoin payments
  if (method === "bitcoin" && amount > 10000) {
    return {
      success: false,
      error: "The single transaction limit for Bitcoin payment is 10,000",
    };
  }

  return {
    success: true,
    data: {
      transactionId: `txn_${Date.now()}_${method}`,
      amount,
    },
  };
}
```

### 3. Comprehensive Testing (`03_union_types_test.ts`)

#### Key Testing Areas:

- **Union Type Handling**: Testing all possible blockchain status values
- **Intersection Type Usage**: Validating merged user data structures
- **Discriminated Union Response**: Testing API response patterns
- **Type Guards**: Runtime type checking validation
- **Business Logic**: Payment processing with union type constraints

#### Code Highlights:

```typescript
// Testing discriminated union response patterns
test("Payment Processing - Success", () => {
  const result = processPayment(100, "credit_card");

  // Test the discriminated union - success case
  assertTrue(result.success);

  // Type narrowing: TypeScript knows result.data exists when success is true
  if (result.success) {
    assertEqual(result.data.amount, 100);
    assertTrue(result.data.transactionId.includes("credit_card"));
  }
});

// Testing intersection type composition
test("User information merging", () => {
  const basicInfo = {
    id: 2,
    name: "Li4",
    email: "li4@example.com",
  };

  const permissions = {
    role: "user" as const,
    permissions: ["read"],
    lastLogin: new Date(),
  };

  const completeUser = createCompleteUser(basicInfo, permissions);

  // Verify all properties are correctly merged
  assertEqual(completeUser.id, 2);
  assertEqual(completeUser.name, "Li4");
  assertEqual(completeUser.role, "user");
  assertTrue(Array.isArray(completeUser.permissions));
});
```

## Part 2: Successful Execution Results

### Union Types Testing Results:

![union_types_testResult](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/03_codes/img/03_union_types_testResult.png)

### Key Success Indicators:

- **100% Test Coverage**: All union and intersection type scenarios tested
- **Type Safety**: Exhaustive checking prevents runtime errors
- **Business Logic**: Real-world payment processing with type constraints
- **Type Guards**: Runtime type validation working correctly
- **API Design**: Discriminated unions provide excellent developer experience

## Part 3: Technical Implementation Details

### Advanced TypeScript Features Implemented

#### 1. Union Types (A | B)

- **String Literal Types**: Precise state management with compile-time checking
- **Discriminated Unions**: API responses with shared discriminant properties
- **Exhaustive Checking**: Using `never` type to ensure all cases are handled
- **Type Narrowing**: Conditional logic based on union type members

#### 2. Intersection Types (A & B)

- **Type Composition**: Combining multiple interfaces into comprehensive types
- **Object Merging**: Practical data composition using spread operator
- **Type Safety**: Ensuring all properties from intersected types are present
- **Flexible Design**: Creating specialized types through intersection constraints

#### 3. Generic Union Types

- **Parameterized Types**: `ApiResponse<T>` for flexible API design
- **Type Inference**: Automatic type detection in generic contexts
- **Reusable Patterns**: Common response patterns across different data types

#### 4. Type Guards

- **User-Defined Type Predicates**: `user is CompleteUser & { role: "admin" }`
- **Runtime Type Checking**: Bridging compile-time and runtime type safety
- **Type Narrowing**: Enabling TypeScript to refine types in conditional blocks

### Development Best Practices

#### Type Design Patterns:

- **Discriminated Unions**: Using common properties for type discrimination
- **Exhaustive Checking**: Ensuring all union members are handled
- **Type Composition**: Building complex types from simple building blocks
- **Generic Constraints**: Flexible yet type-safe generic implementations

#### Error Handling Strategy:

- **Type-Safe Errors**: Using discriminated unions for error handling
- **Descriptive Messages**: Clear error messages for different failure modes
- **Business Rules**: Type-level enforcement of business constraints

## Key Learning Outcomes

### TypeScript Type System Mastery:

1. **Union Types (A | B)**: Creating flexible types that accept multiple possibilities
2. **Intersection Types (A & B)**: Combining types to create comprehensive data structures
3. **Discriminated Unions**: Using shared properties for type safety and narrowing
4. **Type Guards**: Creating runtime type checking functions
5. **Exhaustive Checking**: Ensuring all cases are handled with `never` type
6. **Generic Union Types**: Creating reusable type patterns with generics

### Real-World Application Skills:

1. **API Design**: Creating type-safe API response patterns
2. **Payment Processing**: Implementing business logic with type constraints
3. **User Management**: Composing user data from multiple sources
4. **Blockchain Status**: Managing state with precise type definitions
5. **Validation Logic**: Combining compile-time and runtime type checking

### Professional Development Practices:

1. **Type Safety**: Preventing runtime errors through compile-time checking
2. **Code Reusability**: Creating generic patterns for common use cases
3. **Maintainability**: Using types to document intended behavior
4. **Developer Experience**: Providing excellent IDE support and error messages

## Technical Specifications

### Union Type Patterns:

```typescript
// Basic union type
type Status = "pending" | "confirmed" | "failed";

// Discriminated union with shared property
type Result = { success: true; data: any } | { success: false; error: string };

// Complex union with multiple types
type Input = string | number | boolean | null;
```

### Intersection Type Patterns:

```typescript
// Interface intersection
type Combined = InterfaceA & InterfaceB;

// Mixed intersection with inline types
type Enhanced = BaseType & {
  additionalProperty: string;
  optionalProperty?: number;
};

// Conditional intersection
type AdminUser = User & { role: "admin" };
```

### Type Guard Patterns:

```typescript
// Basic type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Complex type guard with intersection
function isAdmin(user: User): user is User & { role: "admin" } {
  return user.role === "admin";
}
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
cd learning/typescript/03_codes/union_types
npm install -g tsx  # Install tsx for direct TypeScript execution
```

### Execution:

```bash
# Run union types tests
tsx 03_union_types_test.ts

# Run individual functions (optional)
tsx -e "import('./03_union_types.js').then(m => console.log(m.processBlockchainStatus('pending')))"

# Alternative: Compile and run
tsc 03_union_types.ts
tsc 03_union_types_test.ts
node 03_union_types_test.js
```

### Expected Output:

- **Union Type Processing**: Correct handling of all blockchain status values
- **Intersection Type Composition**: Successful merging of user data structures
- **Payment Processing**: Business logic validation with type constraints
- **Type Guards**: Runtime type checking with proper type narrowing
- **API Responses**: Discriminated union responses with type safety

## Performance Considerations

### Compile-Time Benefits:

- **Zero Runtime Cost**: Union and intersection types are compile-time only
- **Type Checking**: Errors caught during development, not production
- **IntelliSense Support**: Excellent IDE autocomplete and error detection
- **Refactoring Safety**: Type system prevents breaking changes

### Best Practices:

- **Use Discriminated Unions**: For complex union types with shared properties
- **Prefer Type Guards**: For runtime type checking over type assertions
- **Keep Unions Small**: Large unions can impact compile performance
- **Document Complex Types**: Use comments for complex intersection types

## Advanced Usage Patterns

### Conditional Types with Unions:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type StringOrNumber<T> = T extends string ? string : number;
```

### Mapped Types with Intersections:

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type PartialUser = Partial<CompleteUser>;
```

### Utility Type Compositions:

```typescript
type PublicUser = Omit<CompleteUser, "password" | "permissions">;
type UserUpdate = Partial<Pick<CompleteUser, "name" | "email">>;
```

---

_This documentation covers the union_types module of the TypeScript learning journey, focusing on mastering Union Types (A | B) and Intersection Types (A & B) for creating flexible, type-safe applications with real-world blockchain and user management scenarios._

/**
 * TypeScript Union and Intersection Types Test Suite
 *
 * This file contains comprehensive tests for the union and intersection types
 * implementation, providing a simple testing framework and validation scenarios.
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: July 30, 2025
 *
 * Testing Framework Features:
 * - Simple, lightweight testing functions
 * - Clear pass/fail indicators with emojis
 * - Detailed error reporting
 * - Type-safe assertion functions
 *
 * Test Coverage:
 * 1. Blockchain Status Processing (Union Type Handling)
 * 2. User Information Merging (Intersection Type Usage)
 * 3. Payment Processing (Discriminated Union Response)
 * 4. Type Guards (Runtime Type Checking)
 * 5. Data Validation (Complex Type Validation)
 *
 * Test Categories:
 * - Positive Tests: Verify expected behavior works correctly
 * - Negative Tests: Ensure error conditions are handled properly
 * - Edge Cases: Test boundary conditions and special scenarios
 *
 * Usage:
 * Run with: npx ts-node 03_union_types_test.ts
 * Or compile and run: tsc && node 03_union_types_test.js
 */

// Import all functions and data from the main implementation file
import {
  processBlockchainStatus,
  createCompleteUser,
  processPayment,
  isAdmin,
  validateBlock,
  sampleUser,
  sampleBlock,
} from "./03_union_types";

/**
 * Simple test function that executes a test case and reports results
 *
 * @param name - Descriptive name for the test case
 * @param fn - Test function to execute (should throw on failure)
 *
 * Features:
 * - Try-catch mechanism for error handling
 * - Visual indicators for pass/fail status
 * - Descriptive test naming convention
 */
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name} - Passed`);
  } catch (error) {
    console.log(`❌ ${name} - Failed: ${error}`);
  }
}

/**
 * Generic assertion function for equality testing
 *
 * @param actual - The actual value received
 * @param expected - The expected value
 * @param message - Optional custom error message
 *
 * Type Safety:
 * - Uses generics to ensure type consistency
 * - Provides meaningful error messages
 * - Strict equality comparison (===)
 */
function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected: ${expected}, Actual: ${actual}`);
  }
}

/**
 * Boolean assertion function for condition testing
 *
 * @param condition - Boolean condition to test
 * @param message - Optional custom error message
 *
 * Usage:
 * - Verify truthy conditions
 * - Check object properties exist
 * - Validate function return values
 */
function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Condition is False");
  }
}

// ==================== TEST SUITE BEGINS ====================

// Test Category 1: Blockchain State Processing
/**
 * Tests the processBlockchainStatus function with different union type values
 * Verifies that each status value produces the correct output message
 */

test("Blockchain state processing - pending", () => {
  const result = processBlockchainStatus("pending");
  assertEqual(result, "Transaction processing...");
});

test("Blockchain state processing - confirmed", () => {
  const result = processBlockchainStatus("confirmed");
  assertEqual(result, "Transaction confirmed");
});

test("Blockchain state processing - failed", () => {
  const result = processBlockchainStatus("failed");
  assertEqual(result, "Transaction failed");
});

// Test Category 2: User Information Merging
/**
 * Tests the intersection type functionality by merging user data
 * Verifies that all properties from both types are preserved
 */
test("User information merging", () => {
  // Create separate objects representing different aspects of user data
  const basicInfo = {
    id: 2,
    name: "Li4",
    email: "li4@example.com",
  };

  const permissions = {
    role: "user" as const, // Type assertion to ensure literal type
    permissions: ["read"],
    lastLogin: new Date(),
  };

  // Test the intersection type creation
  const completeUser = createCompleteUser(basicInfo, permissions);

  // Verify all properties are correctly merged
  assertEqual(completeUser.id, 2);
  assertEqual(completeUser.name, "Li4");
  assertEqual(completeUser.role, "user");
  assertTrue(Array.isArray(completeUser.permissions));
});

// Test Category 3: Payment Processing
/**
 * Tests the discriminated union return type and business logic
 * Covers success cases, validation errors, and business rule enforcement
 */

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

test("Payment Processing - Wrong Amount", () => {
  const result = processPayment(-10, "paypal");

  // Test the discriminated union - error case
  assertTrue(!result.success);

  // Type narrowing: TypeScript knows result.error exists when success is false
  if (!result.success) {
    assertEqual(result.error, "The amount must be greater than 0");
  }
});

test("Payment Processing - Bitcoin Limits", () => {
  const result = processPayment(15000, "bitcoin");

  // Test business rule enforcement
  assertTrue(!result.success);
  if (!result.success) {
    assertEqual(
      result.error,
      "The single transaction limit for Bitcoin payment is 10,000"
    );
  }
});

// Test Category 4: Type Guards
/**
 * Tests type guard functionality for runtime type checking
 * Verifies that type narrowing works correctly in conditional blocks
 */

test("Admin Type Guard - is an admin", () => {
  // Test with sample admin user
  assertTrue(isAdmin(sampleUser));
});

test("Admin Type Guard - Not an Admin", () => {
  // Create a modified user with different role
  const regularUser = {
    ...sampleUser,
    role: "user" as const, // Type assertion for literal type
  };

  // Verify type guard correctly identifies non-admin users
  assertTrue(!isAdmin(regularUser));
});

// Test Category 5: Data Validation
/**
 * Tests complex object validation with multiple type constraints
 * Verifies both positive and negative validation scenarios
 */

test("Block Verification - Valid Blocks", () => {
  // Test with properly formatted sample block
  assertTrue(validateBlock(sampleBlock));
});

test("Block Verification - Invalid Block Hash", () => {
  // Test validation failure with incorrect hash length
  const invalidBlock = {
    ...sampleBlock,
    hash: "Short hash", // Invalid: too short
  };
  assertTrue(!validateBlock(invalidBlock));
});

test("Block Validation - Invalid State", () => {
  // Test validation failure with invalid status
  const invalidBlock = {
    ...sampleBlock,
    status: "invalid" as any, // Force invalid status
  };
  assertTrue(!validateBlock(invalidBlock));
});

// ==================== TEST EXECUTION ====================

/**
 * Initialize test execution with descriptive header
 * All tests above will be executed when this file is imported or run
 */
console.log("🚀 Starting to run union type tests...\n");

/**
 * Export function for programmatic test execution
 * Provides summary information about the testing concepts covered
 *
 * @returns void - Logs test summary and completion status
 *
 * Educational Summary:
 * - Demonstrates practical usage of union and intersection types
 * - Shows type narrowing with discriminated unions
 * - Illustrates type guard implementation and usage
 * - Provides examples of API response type design patterns
 */
export function runAllUnionTypesTests() {
  console.log("=== Union and Intersection type tests ===");

  // This will automatically run all the tests defined above
  console.log("\n📊 Test Summary:");
  console.log("- Union Type Syntax: A | B");
  console.log("- Intersection Type Syntax: A & B");
  console.log("- Use of type guards for runtime checking");
  console.log("- API response type design with discriminated unions");
  console.log("- Exhaustive checking with switch statements");
  console.log("- Generic union types for flexible APIs");
  console.log("✨ All testing completed!");
}

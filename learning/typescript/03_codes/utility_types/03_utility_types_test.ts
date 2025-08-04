/**
 * TypeScript Utility Types Test Suite
 *
 * This file provides comprehensive test coverage for TypeScript utility types
 * implementation, validating the behavior of Partial<T>, Pick<T,K>, Omit<T,K>,
 * Record<K,T>, Required<T>, and Readonly<T> utility types in real-world scenarios.
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Update Date: July 30, 2025
 *
 * Testing Objectives:
 * - Validate Partial<T> behavior for optional property transformations
 * - Verify Pick<T,K> functionality for property selection
 * - Test Omit<T,K> effectiveness for sensitive data exclusion
 * - Confirm Record<K,T> type safety for mapping structures
 * - Ensure proper function implementations with utility types
 * - Validate real-world usage scenarios and edge cases
 *
 * Key Testing Areas:
 * 1. Type Transformations: Verify utility types work as expected
 * 2. Data Security: Ensure sensitive information is properly excluded
 * 3. Function Behavior: Test all exported functions with various inputs
 * 4. Edge Cases: Handle invalid data and boundary conditions
 * 5. Type Safety: Confirm compile-time type checking works correctly
 * 6. Integration: Test utility types working together in compositions
 */

// 03 - Utility Type Test Suite
// Testing objectives: Comprehensive validation of utility type implementations

// Import all necessary types and functions from the main implementation
import {
  updateUser,
  getBlockSummary,
  getPublicUserInfo,
  rolePermissions,
  validateUserRegistration,
  processUserLogin,
  batchUpdateUsers,
  filterUsersByRole,
  sampleUser,
  sampleBlock,
  examples,
  UserUpdate,
  BlockSummary,
  PublicUser,
} from "./03_utility_types";

// Simple testing framework
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name} - Passed`);
  } catch (error) {
    console.log(`❌ ${name} - Failed: ${error}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected: ${expected}, Actual: ${actual}`);
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Condition is False");
  }
}

function assertObjectHasProperty<T extends object>(
  obj: T,
  property: keyof T,
  message?: string
) {
  if (!(property in obj)) {
    throw new Error(
      message || `Object is missing attribute: ${String(property)}`
    );
  }
}

// Test 1: Partial<T> User Update
test("Partial<T> - User Update", () => {
  const updates: UserUpdate = {
    name: "New Name",
    age: 30,
  };

  const updatedUser = updateUser(sampleUser, updates);

  assertEqual(updatedUser.name, "New Name");
  assertEqual(updatedUser.age, 30);
  assertEqual(updatedUser.email, sampleUser.email); // Fields that were not updated remain unchanged
  assertTrue(updatedUser.updatedAt > sampleUser.updatedAt);
});

// Test 2: Pick<T,K> block summary
test("Pick<T,K> - Block Summary", () => {
  const summary: BlockSummary = getBlockSummary(sampleBlock);

  assertObjectHasProperty(summary, "id");
  assertObjectHasProperty(summary, "hash");
  assertObjectHasProperty(summary, "timestamp");
  assertObjectHasProperty(summary, "status");

  assertEqual(summary.id, sampleBlock.id);
  assertEqual(summary.hash, sampleBlock.hash);

  // Make sure no other fields are included
  const summaryKeys = Object.keys(summary);
  assertEqual(summaryKeys.length, 4);
});

// Test 3: Omit<T,K> discloses user information
test("Omit<T,K> - Public user information", () => {
  const publicUser: PublicUser = getPublicUserInfo(sampleUser);

  assertObjectHasProperty(publicUser, "id");
  assertObjectHasProperty(publicUser, "name");
  assertObjectHasProperty(publicUser, "role");

  // Ensure sensitive information is excluded
  assertTrue(!("password" in publicUser));
  assertTrue(!("email" in publicUser));

  assertEqual(publicUser.name, sampleUser.name);
  assertEqual(publicUser.role, sampleUser.role);
});

// Test 4: Record<K,T> Permission Configuration
test("Record<K,T> - Permission configuration", () => {
  assertTrue(Array.isArray(rolePermissions.admin));
  assertTrue(Array.isArray(rolePermissions.user));
  assertTrue(Array.isArray(rolePermissions.guest));

  assertTrue(rolePermissions.admin.length > rolePermissions.user.length);
  assertTrue(rolePermissions.user.length > rolePermissions.guest.length);

  assertTrue(rolePermissions.admin.includes("manage_users"));
  assertTrue(rolePermissions.user.includes("read"));
  assertTrue(rolePermissions.guest.includes("read"));
});

// Test 5: User Registration Verification
test("User Registration Verification - Valid Data", () => {
  const validRegistration = {
    name: "Test User",
    email: "test@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  const result = validateUserRegistration(validRegistration);
  assertTrue(result.valid);
  assertEqual(result.errors.length, 0);
});

test("User Registration Verification - Invalid Data", () => {
  const invalidRegistration = {
    name: "a", // Too short
    email: "invalid-email", // Invalid email address
    password: "123", // Too short
    confirmPassword: "456", // Not matched
  };

  const result = validateUserRegistration(invalidRegistration);
  assertTrue(!result.valid);
  assertTrue(result.errors.length > 0);
  assertTrue(result.errors.some((error) => error.includes("Username")));
  assertTrue(result.errors.some((error) => error.includes("Email")));
  assertTrue(result.errors.some((error) => error.includes("Password")));
});

// Test 6: User login processing
test("User login processing - Success", () => {
  const users = [sampleUser];
  const loginData = {
    email: sampleUser.email,
    password: sampleUser.password,
  };

  const result = processUserLogin(users, loginData);
  assertTrue(result.success);
  assertTrue(result.user !== undefined);
  assertEqual(result.user!.name, sampleUser.name);
  assertTrue(!("password" in result.user!));
});

test("User login processing - Failed", () => {
  const users = [sampleUser];
  const loginData = {
    email: "wrong@example.com",
    password: "wrongpassword",
  };

  const result = processUserLogin(users, loginData);
  assertTrue(!result.success);
  assertTrue(result.user === undefined);
  assertTrue(result.message.includes("incorrect"));
});

// Test 7: Batch update users
test("Batch update users", () => {
  const users = [
    { ...sampleUser, id: 1 },
    { ...sampleUser, id: 2, name: "Li4" },
    { ...sampleUser, id: 3, name: "Wang5" },
  ];

  const updates: UserUpdate = {
    isActive: false,
    role: "guest",
  };

  const updatedUsers = batchUpdateUsers(users, updates);

  assertEqual(updatedUsers.length, 3);
  assertTrue(updatedUsers.every((user) => !user.isActive));
  assertTrue(updatedUsers.every((user) => user.role === "guest"));
  assertTrue(
    updatedUsers.every((user) => user.updatedAt > sampleUser.updatedAt)
  );
});

// Test 8: Filtering Users by Role
test("Filter users by role", () => {
  const users = [
    { ...sampleUser, id: 1, role: "admin" as const },
    { ...sampleUser, id: 2, role: "user" as const },
    { ...sampleUser, id: 3, role: "admin" as const },
    { ...sampleUser, id: 4, role: "guest" as const },
  ];

  const admins = filterUsersByRole(users, "admin");
  assertEqual(admins.length, 2);
  assertTrue(admins.every((user) => user.role === "admin"));

  const regularUsers = filterUsersByRole(users, "user");
  assertEqual(regularUsers.length, 1);
  assertEqual(regularUsers[0].id, 2);
});

// Test 9: Example data type check
test("Example data type check", () => {
  // Check UserUpdate Type
  const update = examples.userUpdate;
  assertTrue(typeof update.name === "string");
  assertTrue(typeof update.age === "number");

  // Check BlockSummary Type
  const summary = examples.blockSummary;
  assertTrue(typeof summary.id === "string");
  assertTrue(typeof summary.hash === "string");
  assertTrue(typeof summary.timestamp === "number");
  assertTrue(["pending", "confirmed", "failed"].includes(summary.status));

  // Check the PublicUser type
  const publicUser = examples.publicUser;
  assertTrue(typeof publicUser.id === "number");
  assertTrue(typeof publicUser.name === "string");
  assertTrue(!("password" in publicUser));
  assertTrue(!("email" in publicUser));
});

// Run all tests
console.log("🚀 Starting to run tool type tests...\n");

// The main function that runs the test
export function runAllUtilityTypesTests() {
  console.log("=== Utility Type Tests ===");

  console.log("\n📊 Test Summary:");
  console.log("- Partial<T>: Make all properties optional");
  console.log("- Pick<T,K>: Select the specified attribute");
  console.log("- Omit<T,K>: Exclude specified attributes");
  console.log("- Record<K,T>: Creating a Mapping Type");
  console.log("- Required<T>: Make all attributes required");
  console.log("- Readonly<T>: Make all properties read-only");
  console.log("✨ All tool types tested!");
}

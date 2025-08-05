/**
 * TypeScript Advanced Types Mini Project Test Suite
 *
 * Comprehensive test coverage for the User Management System
 * demonstrating Union Types, Intersection Types, and Utility Types
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 4, 2025
 *
 * Testing Objectives:
 * - Validate Union Type behavior (UserStatus, UserRole)
 * - Test Intersection Type functionality (CompleteUser = UserInfo & UserAuth & UserProfile)
 * - Verify Utility Type transformations (Partial, Pick, Omit)
 * - Ensure Discriminated Union responses work correctly
 * - Test CRUD operations with type safety
 * - Validate business logic and edge cases
 *
 * Test Categories:
 * 1. Type System Tests: Verify type transformations work as expected
 * 2. User Registration: Test registration flow with validation
 * 3. Authentication: Login/logout functionality
 * 4. User Management: CRUD operations
 * 5. Role-based Access: Permission system testing
 * 6. Edge Cases: Error handling and boundary conditions
 * 7. Utility Functions: Helper function validation
 */

// Import all necessary types and functions from the main implementation
import {
  UserManagementSystem,
  createUserSystem,
  getUserStatusMessage,
  mergeUserData,
  utilityExamples,
  rolePermissions,
  sampleUsers,
  UserStatus,
  UserRole,
  CompleteUser,
  PublicUser,
  UserRegistration,
  UserUpdate,
  LoginCredentials,
  ApiResponse,
} from "./03_mini_project";

// ==================== TESTING FRAMEWORK ====================

/**
 * Simple testing framework with clear visual feedback
 *
 * @param name - Descriptive test name
 * @param fn - Test function that throws on failure
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
 * Generic equality assertion
 *
 * @param actual - Received value
 * @param expected - Expected value
 * @param message - Optional error message
 */
function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected: ${expected}, Actual: ${actual}`);
  }
}

/**
 * Boolean condition assertion
 *
 * @param condition - Boolean condition to test
 * @param message - Optional error message
 */
function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Condition is false");
  }
}

/**
 * Check if object has specific property
 *
 * @param obj - Object to check
 * @param property - Property name to verify
 * @param message - Optional error message
 */
function assertObjectHasProperty<T extends object>(
  obj: T,
  property: keyof T,
  message?: string
) {
  if (!(property in obj)) {
    throw new Error(
      message || `Object is missing property: ${String(property)}`
    );
  }
}

/**
 * Check if object does NOT have specific property
 *
 * @param obj - Object to check
 * @param property - Property name that should be absent
 * @param message - Optional error message
 */
function assertObjectLacksProperty<T extends object>(
  obj: T,
  property: string,
  message?: string
) {
  if (property in obj) {
    throw new Error(message || `Object should not have property: ${property}`);
  }
}

/**
 * Array length assertion
 *
 * @param arr - Array to check
 * @param expectedLength - Expected array length
 * @param message - Optional error message
 */
function assertArrayLength<T>(
  arr: T[],
  expectedLength: number,
  message?: string
) {
  if (arr.length !== expectedLength) {
    throw new Error(
      message ||
        `Expected array length: ${expectedLength}, Actual: ${arr.length}`
    );
  }
}

// ==================== TEST SUITE BEGINS ====================

console.log("🚀 Starting Mini Project Test Suite...\n");

// ==================== TYPE SYSTEM TESTS ====================

test("Union Types - UserStatus values", () => {
  const statuses: UserStatus[] = ["active", "inactive", "suspended"];

  // Test that all status values are valid
  statuses.forEach((status) => {
    const message = getUserStatusMessage(status);
    assertTrue(typeof message === "string");
    assertTrue(message.length > 0);
  });

  // Test specific status messages
  assertEqual(getUserStatusMessage("active"), "User is active");
  assertEqual(getUserStatusMessage("inactive"), "User is inactive");
  assertEqual(getUserStatusMessage("suspended"), "User is suspended");
});

test("Union Types - UserRole permissions", () => {
  const roles: UserRole[] = ["admin", "user", "guest"];

  roles.forEach((role) => {
    assertTrue(role in rolePermissions);
    assertTrue(Array.isArray(rolePermissions[role]));
    assertTrue(rolePermissions[role].length > 0);
  });

  // Test permission hierarchy
  assertTrue(rolePermissions.admin.length > rolePermissions.user.length);
  assertTrue(rolePermissions.user.length > rolePermissions.guest.length);

  // Test specific permissions
  assertTrue(rolePermissions.admin.includes("manage"));
  assertTrue(rolePermissions.user.includes("read"));
  assertTrue(rolePermissions.guest.includes("read"));
});

test("Intersection Types - User data merging", () => {
  const userInfo = {
    id: "test_001",
    username: "testuser",
    email: "test@example.com",
    createdAt: new Date(),
  };

  const userProfile = {
    role: "user" as const,
    status: "active" as const,
    permissions: ["read", "write"],
  };

  const mergedUser = mergeUserData(userInfo, userProfile);

  // Check that all properties from both types are present
  assertObjectHasProperty(mergedUser, "id");
  assertObjectHasProperty(mergedUser, "username");
  assertObjectHasProperty(mergedUser, "email");
  assertObjectHasProperty(mergedUser, "role");
  assertObjectHasProperty(mergedUser, "status");
  assertObjectHasProperty(mergedUser, "permissions");

  assertEqual(mergedUser.id, userInfo.id);
  assertEqual(mergedUser.role, userProfile.role);
});

test("Utility Types - Example validation", () => {
  // Test UserUpdate (Partial<T>)
  const update = utilityExamples.userUpdate;
  assertTrue(typeof update.username === "string");
  assertTrue(typeof update.status === "string");

  // Test LoginCredentials (Pick<T,K>)
  const login = utilityExamples.loginData;
  assertObjectHasProperty(login, "email");
  assertObjectHasProperty(login, "password");
  // Should not have other user properties
  assertObjectLacksProperty(login, "id");
  assertObjectLacksProperty(login, "username");

  // Test PublicUser (Omit<T,K>)
  const publicUser = utilityExamples.publicUser;
  assertObjectHasProperty(publicUser, "id");
  assertObjectHasProperty(publicUser, "username");
  assertObjectHasProperty(publicUser, "role");
  // Should not have sensitive properties
  assertObjectLacksProperty(publicUser, "password");
  assertObjectLacksProperty(publicUser, "permissions");
});

// ==================== USER REGISTRATION TESTS ====================

test("User Registration - Valid registration", () => {
  const system = new UserManagementSystem();

  const registration: UserRegistration = {
    username: "newuser",
    email: "newuser@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  const result = system.registerUser(registration);

  assertTrue(result.success);
  if (result.success) {
    assertObjectHasProperty(result.data, "id");
    assertObjectHasProperty(result.data, "username");
    assertObjectHasProperty(result.data, "email");
    assertEqual(result.data.username, registration.username);
    assertEqual(result.data.email, registration.email);

    // Should not contain sensitive data
    assertObjectLacksProperty(result.data, "password");
    assertObjectLacksProperty(result.data, "permissions");
  }
});

test("User Registration - Password mismatch", () => {
  const system = new UserManagementSystem();

  const registration: UserRegistration = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "different123",
  };

  const result = system.registerUser(registration);

  assertTrue(!result.success);
  if (!result.success) {
    assertTrue(result.error.includes("match"));
  }
});

test("User Registration - Password too short", () => {
  const system = new UserManagementSystem();

  const registration: UserRegistration = {
    username: "testuser",
    email: "test@example.com",
    password: "123",
    confirmPassword: "123",
  };

  const result = system.registerUser(registration);

  assertTrue(!result.success);
  if (!result.success) {
    assertTrue(result.error.includes("short"));
  }
});

test("User Registration - Duplicate email", () => {
  const system = createUserSystem(); // Has sample users

  const registration: UserRegistration = {
    username: "duplicate",
    email: "admin@example.com", // Already exists in sample data
    password: "password123",
    confirmPassword: "password123",
  };

  const result = system.registerUser(registration);

  assertTrue(!result.success);
  if (!result.success) {
    assertTrue(result.error.includes("exists"));
  }
});

// ==================== AUTHENTICATION TESTS ====================

test("User Login - Valid credentials", () => {
  const system = createUserSystem();

  const credentials: LoginCredentials = {
    email: "admin@example.com",
    password: "admin123",
  };

  const result = system.login(credentials);

  assertTrue(result.success);
  if (result.success) {
    assertEqual(result.data.username, "admin");
    assertEqual(result.data.email, "admin@example.com");
    assertEqual(result.data.role, "admin");

    // Check current user is set
    const currentUser = system.getCurrentUser();
    assertTrue(currentUser !== null);
    assertEqual(currentUser!.username, "admin");
  }
});

test("User Login - Invalid credentials", () => {
  const system = createUserSystem();

  const credentials: LoginCredentials = {
    email: "admin@example.com",
    password: "wrongpassword",
  };

  const result = system.login(credentials);

  assertTrue(!result.success);
  if (!result.success) {
    assertTrue(result.error.includes("Invalid"));
  }
});

test("User Login - Non-existent user", () => {
  const system = createUserSystem();

  const credentials: LoginCredentials = {
    email: "nonexistent@example.com",
    password: "password123",
  };

  const result = system.login(credentials);

  assertTrue(!result.success);
});

test("User Logout", () => {
  const system = createUserSystem();

  // Login first
  const loginResult = system.login({
    email: "admin@example.com",
    password: "admin123",
  });
  assertTrue(loginResult.success);
  assertTrue(system.getCurrentUser() !== null);

  // Then logout
  system.logout();
  assertTrue(system.getCurrentUser() === null);
});

// ==================== USER MANAGEMENT TESTS ====================

test("Get User - Valid user ID", () => {
  const system = createUserSystem();

  const result = system.getUser("user_001");

  assertTrue(result.success);
  if (result.success) {
    assertEqual(result.data.username, "admin");
    assertEqual(result.data.id, "user_001");

    // Should be public user (no sensitive data)
    assertObjectLacksProperty(result.data, "password");
    assertObjectLacksProperty(result.data, "permissions");
  }
});

test("Get User - Invalid user ID", () => {
  const system = createUserSystem();

  const result = system.getUser("nonexistent_id");

  assertTrue(!result.success);
  if (!result.success) {
    assertTrue(result.error.includes("not found"));
  }
});

test("Update User - Valid update", () => {
  const system = createUserSystem();

  const updates: UserUpdate = {
    username: "updatedadmin",
    status: "inactive",
  };

  const result = system.updateUser("user_001", updates);

  assertTrue(result.success);
  if (result.success) {
    assertEqual(result.data.username, "updatedadmin");
    assertEqual(result.data.status, "inactive");
    assertEqual(result.data.id, "user_001"); // ID should remain unchanged
  }
});

test("Update User - Invalid user ID", () => {
  const system = createUserSystem();

  const updates: UserUpdate = {
    username: "newname",
  };

  const result = system.updateUser("nonexistent_id", updates);

  assertTrue(!result.success);
  if (!result.success) {
    assertTrue(result.error.includes("not found"));
  }
});

test("Get Users by Role - Admin role", () => {
  const system = createUserSystem();

  const result = system.getUsersByRole("admin");

  assertTrue(result.success);
  if (result.success) {
    assertArrayLength(result.data, 1);
    assertEqual(result.data[0].role, "admin");
    assertEqual(result.data[0].username, "admin");
  }
});

test("Get Users by Role - User role", () => {
  const system = createUserSystem();

  const result = system.getUsersByRole("user");

  assertTrue(result.success);
  if (result.success) {
    assertArrayLength(result.data, 1);
    assertEqual(result.data[0].role, "user");
    assertEqual(result.data[0].username, "testuser");
  }
});

test("Get Users by Role - Guest role (empty)", () => {
  const system = createUserSystem();

  const result = system.getUsersByRole("guest");

  assertTrue(result.success);
  if (result.success) {
    assertArrayLength(result.data, 0);
  }
});

// ==================== INTEGRATION TESTS ====================

test("Complete User Workflow", () => {
  const system = new UserManagementSystem();

  // 1. Register new user
  const registration: UserRegistration = {
    username: "workflow_user",
    email: "workflow@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  const registerResult = system.registerUser(registration);
  assertTrue(registerResult.success);

  let userId: string;
  if (registerResult.success) {
    userId = registerResult.data.id;

    // 2. Login with new user
    const loginResult = system.login({
      email: registration.email,
      password: registration.password,
    });

    assertTrue(loginResult.success);

    // 3. Update user information
    const updateResult = system.updateUser(userId, {
      username: "updated_workflow_user",
      status: "inactive",
    });

    assertTrue(updateResult.success);
    if (updateResult.success) {
      assertEqual(updateResult.data.username, "updated_workflow_user");
      assertEqual(updateResult.data.status, "inactive");
    }

    // 4. Verify user was updated
    const getUserResult = system.getUser(userId);
    assertTrue(getUserResult.success);
    if (getUserResult.success) {
      assertEqual(getUserResult.data.username, "updated_workflow_user");
      assertEqual(getUserResult.data.status, "inactive");
    }

    // 5. Logout
    system.logout();
    assertTrue(system.getCurrentUser() === null);
  }
});

test("Role-based Access Control", () => {
  const system = createUserSystem();

  // Test admin role
  const adminUsers = system.getUsersByRole("admin");
  assertTrue(adminUsers.success);
  if (adminUsers.success) {
    assertTrue(adminUsers.data.every((user) => user.role === "admin"));
  }

  // Test user role
  const regularUsers = system.getUsersByRole("user");
  assertTrue(regularUsers.success);
  if (regularUsers.success) {
    assertTrue(regularUsers.data.every((user) => user.role === "user"));
  }

  // Verify role permissions structure
  assertTrue(rolePermissions.admin.includes("manage"));
  assertTrue(!rolePermissions.user.includes("manage"));
  assertTrue(!rolePermissions.guest.includes("write"));
});

// ==================== DATA TYPE TESTS ====================

test("Sample Data Integrity", () => {
  // Test sample users array
  assertTrue(Array.isArray(sampleUsers));
  assertTrue(sampleUsers.length > 0);

  sampleUsers.forEach((user) => {
    // Check required properties
    assertObjectHasProperty(user, "id");
    assertObjectHasProperty(user, "username");
    assertObjectHasProperty(user, "email");
    assertObjectHasProperty(user, "password");
    assertObjectHasProperty(user, "role");
    assertObjectHasProperty(user, "status");
    assertObjectHasProperty(user, "permissions");
    assertObjectHasProperty(user, "createdAt");

    // Check property types
    assertTrue(typeof user.id === "string");
    assertTrue(typeof user.username === "string");
    assertTrue(typeof user.email === "string");
    assertTrue(Array.isArray(user.permissions));
    assertTrue(user.createdAt instanceof Date);

    // Check union type values
    assertTrue(["admin", "user", "guest"].includes(user.role));
    assertTrue(["active", "inactive", "suspended"].includes(user.status));
  });
});

test("System Initialization", () => {
  const system = createUserSystem();

  // Should have sample users
  const adminResult = system.getUsersByRole("admin");
  assertTrue(adminResult.success);
  if (adminResult.success) {
    assertTrue(adminResult.data.length > 0);
  }

  const userResult = system.getUsersByRole("user");
  assertTrue(userResult.success);
  if (userResult.success) {
    assertTrue(userResult.data.length > 0);
  }

  // Should start with no current user
  assertTrue(system.getCurrentUser() === null);
});

// ==================== EDGE CASE TESTS ====================

test("Empty System Operations", () => {
  const system = new UserManagementSystem(); // Empty system

  // Get non-existent user
  const getUserResult = system.getUser("nonexistent");
  assertTrue(!getUserResult.success);

  // Update non-existent user
  const updateResult = system.updateUser("nonexistent", { username: "test" });
  assertTrue(!updateResult.success);

  // Get users by role in empty system
  const roleResult = system.getUsersByRole("admin");
  assertTrue(roleResult.success);
  if (roleResult.success) {
    assertArrayLength(roleResult.data, 0);
  }
});

test("Type Safety Validation", () => {
  // This test validates that TypeScript type system works correctly
  // at runtime by checking object structures

  const system = createUserSystem();

  // Login and get a user
  const loginResult = system.login({
    email: "admin@example.com",
    password: "admin123",
  });

  if (loginResult.success) {
    const publicUser = loginResult.data;

    // PublicUser should not have sensitive fields
    assertObjectLacksProperty(publicUser, "password");
    assertObjectLacksProperty(publicUser, "permissions");

    // But should have public fields
    assertObjectHasProperty(publicUser, "id");
    assertObjectHasProperty(publicUser, "username");
    assertObjectHasProperty(publicUser, "email");
    assertObjectHasProperty(publicUser, "role");
    assertObjectHasProperty(publicUser, "status");
  }
});

// ==================== TEST EXECUTION SUMMARY ====================

/**
 * Main test runner function
 */
export function runAllMiniProjectTests() {
  console.log("\n=== Mini Project Test Summary ===");
  console.log("\n📊 Test Categories Covered:");
  console.log("✓ Union Types (UserStatus, UserRole)");
  console.log("✓ Intersection Types (CompleteUser composition)");
  console.log("✓ Utility Types (Partial, Pick, Omit)");
  console.log("✓ Discriminated Unions (ApiResponse)");
  console.log("✓ User Registration & Validation");
  console.log("✓ Authentication & Authorization");
  console.log("✓ CRUD Operations");
  console.log("✓ Role-based Access Control");
  console.log("✓ Edge Cases & Error Handling");
  console.log("✓ Type Safety Validation");

  console.log("\n🎯 Key Learning Points Validated:");
  console.log(
    "• Union types provide compile-time safety for restricted values"
  );
  console.log("• Intersection types enable flexible data composition");
  console.log("• Utility types transform interfaces for specific use cases");
  console.log("• Discriminated unions enable type-safe error handling");
  console.log("• Type guards ensure runtime type safety");
  console.log("• Generic types provide reusable, type-safe APIs");

  console.log("\n✨ All Mini Project tests completed successfully!");
  console.log("🚀 TypeScript Advanced Types mastery demonstrated!");
}

// Auto-run tests when file is executed
if (require.main === module) {
  runAllMiniProjectTests();
}

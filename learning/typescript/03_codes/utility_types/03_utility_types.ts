/**
 * TypeScript Utility Types Implementation
 *
 * This file demonstrates the practical usage of TypeScript's built-in utility types
 * including Partial<T>, Pick<T,K>, Omit<T,K>, and other essential utility types
 * for modern web application development.
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Update Date: July 30, 2025
 *
 * Learning Objectives:
 * - Master Partial<T> for optional property transformations
 * - Understand Pick<T,K> for selecting specific properties
 * - Learn Omit<T,K> for excluding sensitive or unwanted fields
 * - Implement Record<K,T> for type-safe mapping structures
 * - Practice Required<T> and Readonly<T> for data constraints
 * - Combine utility types for complex type compositions
 *
 * Key Concepts Covered:
 * 1. Utility Types: Built-in TypeScript types for common transformations
 * 2. Property Selection: Pick specific fields for API responses
 * 3. Property Exclusion: Omit sensitive data for public interfaces
 * 4. Optional Properties: Make all or some properties optional
 * 5. Type Composition: Combine multiple utility types effectively
 * 6. Real-world Applications: User management and blockchain scenarios
 */

// 03 - Utility Type Exercises
// Learning objectives: Master tool types such as Partial<T>, Pick<T,K>, and Omit<T,K>

// 1. Basic user types
/**
 * Base User interface defining the complete user data structure
 * This interface serves as the foundation for various utility type transformations
 *
 * Properties cover all aspects of user management:
 * - Identity: id, name, email
 * - Authentication: password
 * - Profile: age, role
 * - Metadata: timestamps, status
 */
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// 2. Block Type
/**
 * Blockchain Block interface representing a single block structure
 * Contains all necessary fields for blockchain operations and validation
 *
 * Includes:
 * - Cryptographic data: hash, previousHash
 * - Block metadata: timestamp, miner, nonce, difficulty
 * - Content: data payload
 * - Status: processing state
 */
interface Block {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;
  miner: string;
  nonce: number;
  difficulty: number;
  status: "pending" | "confirmed" | "failed";
}

// 3. Use Partial<T> to create a user update interface
/**
 * Partial<T> Utility Type Application
 * Makes all properties of User optional, perfect for update operations
 * where only some fields need to be modified
 *
 * Usage: Allows partial updates without requiring all user properties
 */
export type UserUpdate = Partial<User>;

// 4. Use Pick<T,K> to select some fields of the block
/**
 * Pick<T,K> Utility Type Application
 * Selects only specific properties from Block interface
 * Useful for creating lightweight data transfer objects
 *
 * Creates a type with only: id, hash, timestamp, status
 */
export type BlockSummary = Pick<Block, "id" | "hash" | "timestamp" | "status">;

// 5. Use Omit<T,K> to create a new user interface (excluding sensitive information)
/**
 * Omit<T,K> Utility Type Application
 * Excludes sensitive fields (password, email) from User interface
 * Essential for public API responses where privacy is crucial
 *
 * Removes: password, email while keeping all other properties
 */
export type PublicUser = Omit<User, "password" | "email">;

// 6. Use Required<T> to ensure all fields are required
/**
 * Required<T> Utility Type Application
 * Makes all properties of UserUpdate mandatory
 * Useful when you need to ensure complete data validation
 */
export type RequiredUserUpdate = Required<UserUpdate>;

// 7. Use Readonly<T> to create a read-only type
/**
 * Readonly<T> Utility Type Application
 * Makes all Block properties immutable
 * Important for blockchain data integrity where blocks shouldn't be modified
 */
export type ReadonlyBlock = Readonly<Block>;

// 8. Create a mapped type using Record<K,T>
/**
 * Record<K,T> Utility Type Application
 * Creates a mapping from user roles to their permissions
 * Ensures type safety for role-based access control systems
 *
 * Maps: "admin" | "user" | "guest" → string[]
 */
export type UserRolePermissions = Record<User["role"], string[]>;

// 9. Combination tool type: Create user registration data
/**
 * Combining Utility Types
 * Uses Pick to select registration fields and intersection to add confirmation
 * Demonstrates how utility types can be composed for complex requirements
 */
export type UserRegistration = Pick<User, "name" | "email" | "password"> & {
  confirmPassword: string;
};

// 10. Create user login data
/**
 * Login Data Type
 * Simple Pick application for authentication credentials
 * Only requires email and password for login operations
 */
export type UserLogin = Pick<User, "email" | "password">;

// 11. User update function
/**
 * User update function demonstrating Partial<T> usage
 *
 * @param currentUser - Existing user data
 * @param updates - Partial user data with only fields to update
 * @returns Updated user with new timestamp
 *
 * Features:
 * - Uses object spread for merging
 * - Automatically updates timestamp
 * - Type-safe partial updates
 */
export function updateUser(currentUser: User, updates: UserUpdate): User {
  return {
    ...currentUser,
    ...updates,
    updatedAt: new Date(),
  };
}

// 12. Get block summary information
/**
 * Block summary extraction using Pick<T,K> result type
 *
 * @param block - Complete block data
 * @returns BlockSummary with selected fields only
 *
 * Demonstrates:
 * - Destructuring with specific field selection
 * - Return type matches Pick utility type
 * - Data projection for API responses
 */
export function getBlockSummary(block: Block): BlockSummary {
  const { id, hash, timestamp, status } = block;
  return { id, hash, timestamp, status };
}

// 13. Obtaining public user information
/**
 * Public user info extraction using Omit<T,K> result type
 *
 * @param user - Complete user data including sensitive fields
 * @returns PublicUser without password and email
 *
 * Security Features:
 * - Excludes sensitive authentication data
 * - Safe for public API responses
 * - Uses destructuring with rest operator
 */
export function getPublicUserInfo(user: User): PublicUser {
  const { password, email, ...publicInfo } = user;
  return publicInfo;
}

// 14. Permission configuration
/**
 * Role-based permissions configuration using Record<K,T>
 * Type-safe mapping ensuring all roles have defined permissions
 *
 * Demonstrates:
 * - Hierarchical permission structure
 * - Complete role coverage
 * - String array permissions for flexibility
 */
export const rolePermissions: UserRolePermissions = {
  admin: ["read", "write", "delete", "manage_users", "system_config"],
  user: ["read", "write"],
  guest: ["read"],
};

// 15. Verify user registration data
/**
 * User registration validation with comprehensive error handling
 *
 * @param registration - UserRegistration data to validate
 * @returns Validation result with success flag and error messages
 *
 * Validation Rules:
 * - Name: minimum 2 characters
 * - Email: must contain @ symbol
 * - Password: minimum 6 characters
 * - Password confirmation: must match password
 */
export function validateUserRegistration(registration: UserRegistration): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!registration.name || registration.name.length < 2) {
    errors.push("Username must be at least 2 characters");
  }

  if (!registration.email || !registration.email.includes("@")) {
    errors.push("Please enter a valid Email address");
  }

  if (!registration.password || registration.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (registration.password !== registration.confirmPassword) {
    errors.push("The passwords entered twice do not match");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// 16. Handling user login
/**
 * User authentication with secure login processing
 *
 * @param users - Array of registered users
 * @param loginData - UserLogin credentials
 * @returns Authentication result with user data or error message
 *
 * Security Features:
 * - Validates email and password combination
 * - Checks account active status
 * - Returns PublicUser (no sensitive data)
 * - Provides descriptive error messages
 */
export function processUserLogin(
  users: User[],
  loginData: UserLogin
): { success: boolean; user?: PublicUser; message: string } {
  const user = users.find(
    (u) =>
      u.email === loginData.email &&
      u.password === loginData.password &&
      u.isActive
  );

  if (!user) {
    return {
      success: false,
      message:
        "The email address or password is incorrect, or the account has been disabled",
    };
  }

  return {
    success: true,
    user: getPublicUserInfo(user),
    message: "Login successful",
  };
}

// 17. Batch update users
/**
 * Batch user update operation using Partial<T>
 *
 * @param users - Array of users to update
 * @param updates - Partial updates to apply to all users
 * @returns Array of updated users
 *
 * Use Cases:
 * - Global settings changes
 * - Bulk status updates
 * - Administrative operations
 */
export function batchUpdateUsers(users: User[], updates: UserUpdate): User[] {
  return users.map((user) => updateUser(user, updates));
}

// 18. Filter users by role
/**
 * Generic role-based user filtering with type constraints
 *
 * @param users - Array of users to filter
 * @param role - Specific role to filter by
 * @returns Filtered array of users with specified role
 *
 * Generic Features:
 * - T extends User["role"] ensures valid role values
 * - Type-safe role parameter
 * - Maintains type information in results
 */
export function filterUsersByRole<T extends User["role"]>(
  users: User[],
  role: T
): User[] {
  return users.filter((user) => user.role === role);
}

// 19. Sample Data
/**
 * Sample user data for testing and demonstration
 * Represents a complete User object with all required properties
 */
export const sampleUser: User = {
  id: 1,
  name: "Zhang3",
  email: "zhang3@example.com",
  password: "123456",
  age: 25,
  role: "admin",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-07-29"),
  isActive: true,
};

/**
 * Sample blockchain block data for testing
 * Demonstrates a confirmed block with realistic hash values
 */
export const sampleBlock: Block = {
  id: "block_001",
  hash: "0x1234567890abcdef",
  previousHash: "0xfedcba0987654321",
  timestamp: Date.now(),
  data: "Blockchain transaction data",
  miner: "miner_001",
  nonce: 12345,
  difficulty: 4,
  status: "confirmed",
};

// 20. Blockchain transaction data
/**
 * Practical examples of utility type usage
 * Demonstrates how each utility type transforms the original interfaces
 */
export const examples = {
  // Partial Example
  /**
   * Partial<User> example - only some properties needed for updates
   */
  userUpdate: {
    name: "new name",
    age: 26,
  } as UserUpdate,

  // Pick Example
  /**
   * Pick<Block, ...> example - selected properties for summary view
   */
  blockSummary: {
    id: "block_001",
    hash: "0x1234567890abcdef",
    timestamp: Date.now(),
    status: "confirmed",
  } as BlockSummary,

  // Omit Example
  /**
   * Omit<User, ...> example - public user data without sensitive fields
   */
  publicUser: {
    id: 1,
    name: "Zhang3",
    age: 25,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  } as PublicUser,
};

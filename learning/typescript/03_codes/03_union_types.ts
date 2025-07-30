/**
 * TypeScript Union and Intersection Types Implementation
 *
 * This file demonstrates the practical usage of Union Types and Intersection Types
 * in TypeScript, featuring blockchain and user management examples.
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: July 30, 2025
 *
 * Learning Objectives:
 * - Master Union Types (A | B) syntax and usage
 * - Understand Intersection Types (A & B) for type composition
 * - Implement type guards for runtime type checking
 * - Design flexible API response types using generics
 * - Practice exhaustive checking with discriminated unions
 *
 * Key Concepts Covered:
 * 1. Union Types: Allow a value to be one of several types
 * 2. Intersection Types: Combine multiple types into one
 * 3. Type Guards: Functions that help TypeScript narrow types at runtime
 * 4. Discriminated Unions: Union types with a common discriminant property
 * 5. Generic Union Types: Flexible type definitions using generics
 *
 * File Structure:
 * - Type Definitions (lines 31-60)
 * - Utility Functions (lines 62-140)
 * - Sample Data (lines 142-158)
 */

// 1. Blockchain State Union Type
/**
 * Represents the possible states of a blockchain transaction
 * This is a discriminated union type with string literals
 */
type BlockchainStatus = "pending" | "confirmed" | "failed";

// 2. User basic information type
/**
 * Interface defining the core user information
 * Used as a base type for intersection with permissions
 */
interface UserBasicInfo {
  id: number;
  name: string;
  email: string;
}

// 3. User permission information type
/**
 * Interface defining user permissions and role-based access
 * Contains union type for role specification
 */
interface UserPermissions {
  role: "admin" | "user" | "guest";
  permissions: string[];
  lastLogin: Date;
}

// 4. Intersection type: Merge user information
/**
 * Intersection type combining UserBasicInfo and UserPermissions
 * Creates a new type that has all properties from both types
 * Syntax: A & B means the result must satisfy both A and B
 */
type CompleteUser = UserBasicInfo & UserPermissions;

// 5. Block information type
/**
 * Interface representing a blockchain block structure
 * Uses the BlockchainStatus union type for status field
 */
interface BlockInfo {
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;
  status: BlockchainStatus;
}

// 6. Payment method union type
/**
 * Union type defining supported payment methods
 * Each string literal represents a valid payment option
 */
type PaymentMethod = "credit_card" | "paypal" | "bitcoin" | "bank_transfer";

// 7. API Response Union Type
/**
 * Generic discriminated union for API responses
 * T is a generic type parameter for flexible data types
 * Discriminated by the 'success' property for type narrowing
 */
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 8. Utility functions: handling blockchain state
/**
 * Processes blockchain transaction status with exhaustive checking
 *
 * @param status - The current blockchain transaction status
 * @returns Human-readable status message
 *
 * Features:
 * - Uses switch statement for pattern matching
 * - Implements exhaustive checking with 'never' type
 * - TypeScript ensures all union members are handled
 */
export function processBlockchainStatus(status: BlockchainStatus): string {
  switch (status) {
    case "pending":
      return "Transaction processing...";
    case "confirmed":
      return "Transaction confirmed";
    case "failed":
      return "Transaction failed";
    default:
      // TypeScript will check that we handle all cases
      // This line will cause a compile error if we miss any status
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}

// 9. Create complete user information
/**
 * Combines basic user info with permissions using intersection types
 *
 * @param basicInfo - Core user information
 * @param permissions - User role and permissions data
 * @returns Complete user object with all properties
 *
 * Demonstrates:
 * - Object spread operator for merging objects
 * - Intersection type as return type
 * - Type safety in object composition
 */
export function createCompleteUser(
  basicInfo: UserBasicInfo,
  permissions: UserPermissions
): CompleteUser {
  return { ...basicInfo, ...permissions };
}

// 10. Payment processing function
/**
 * Processes payment requests with validation and different payment methods
 *
 * @param amount - Payment amount to process
 * @param method - Payment method from PaymentMethod union
 * @returns ApiResponse with transaction details or error
 *
 * Features:
 * - Uses discriminated union for return type
 * - Implements business logic with type safety
 * - Demonstrates conditional logic based on union type members
 */
export function processPayment(
  amount: number,
  method: PaymentMethod
): ApiResponse<{ transactionId: string; amount: number }> {
  // Validate payment amount
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

  // Return successful payment response
  return {
    success: true,
    data: {
      transactionId: `txn_${Date.now()}_${method}`,
      amount,
    },
  };
}

// 11. Type guard: Check if the user is an administrator
/**
 * Type guard function to check if a user has admin privileges
 *
 * @param user - Complete user object to check
 * @returns Type predicate indicating if user is admin
 *
 * Type Guard Features:
 * - Uses 'user is Type' syntax for type predicate
 * - Narrows the type within conditional blocks
 * - Provides compile-time type safety after the check
 * - Combines intersection type with specific role constraint
 */
export function isAdmin(
  user: CompleteUser
): user is CompleteUser & { role: "admin" } {
  return user.role === "admin";
}

// 12. Block verification function
/**
 * Validates blockchain block integrity and format
 *
 * @param block - Block information to validate
 * @returns Boolean indicating if block is valid
 *
 * Validation Rules:
 * - Hash must be 64 characters (simulated SHA-256)
 * - Previous hash must be 64 characters
 * - Timestamp must be positive
 * - Data must not be empty
 * - Status must be a valid BlockchainStatus value
 */
export function validateBlock(block: BlockInfo): boolean {
  return (
    block.hash.length === 64 && // Assume the hash length is 64
    block.previousHash.length === 64 &&
    block.timestamp > 0 &&
    block.data.length > 0 &&
    ["pending", "confirmed", "failed"].includes(block.status)
  );
}

// 13. Sample Data
/**
 * Sample user data demonstrating CompleteUser intersection type
 * Contains all required properties from both UserBasicInfo and UserPermissions
 */
export const sampleUser: CompleteUser = {
  id: 1,
  name: "Zhang3",
  email: "zhang3@example.com",
  role: "admin",
  permissions: ["read", "write", "delete"],
  lastLogin: new Date(),
};

/**
 * Sample blockchain block data for testing and demonstration
 * Uses realistic hash values and confirmed status
 */
export const sampleBlock: BlockInfo = {
  hash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  previousHash:
    "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
  timestamp: Date.now(),
  data: "Blockchain transaction data",
  status: "confirmed",
};

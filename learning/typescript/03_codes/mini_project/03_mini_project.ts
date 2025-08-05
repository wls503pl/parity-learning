/**
 * TypeScript Advanced Types Mini Project - User Management System
 *
 * This streamlined project focuses on essential Union Types, Intersection Types,
 * and Utility Types concepts without overwhelming complexity.
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 4, 2025
 *
 * Learning Focus:
 * - Union types for status and role management
 * - Intersection types for combining user data
 * - Essential utility types (Partial, Pick, Omit)
 * - Basic CRUD operations with type safety
 *
 * Key Concepts Demonstrated:
 * 1. Union Types (A | B): Allow values to be one of several specific types
 * 2. Intersection Types (A & B): Combine multiple types into one comprehensive type
 * 3. Utility Types: Built-in TypeScript helpers for type transformations
 * 4. Discriminated Unions: Union types with common properties for type narrowing
 * 5. Type Safety: Compile-time checking to prevent runtime errors
 */

// ==================== CORE TYPE DEFINITIONS ====================

/**
 * Union Types - Multiple possible values with type safety
 *
 * Union Type Syntax: type Name = "value1" | "value2" | "value3"
 * Benefits:
 * - Restricts values to specific options
 * - Enables exhaustive checking in switch statements
 * - Provides autocomplete in IDE
 */
export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole = "admin" | "user" | "guest";

/**
 * Base interfaces for intersection type composition
 *
 * Strategy: Break complex data into smaller, focused interfaces
 * This makes intersection types more manageable and reusable
 */

/**
 * UserInfo - Core identity information
 * Contains fields that identify and timestamp user creation
 */
interface UserInfo {
  id: string; // Unique identifier
  username: string; // Display name
  email: string; // Contact and login identifier
  createdAt: Date; // Registration timestamp
}

/**
 * UserAuth - Authentication and security data
 * Separated for security concerns - can be easily excluded from public APIs
 */
interface UserAuth {
  password: string; // Hashed password (in real apps)
  lastLogin?: Date; // Optional: track user activity
}

/**
 * UserProfile - Role and permissions data
 * Contains business logic related to user capabilities
 */
interface UserProfile {
  role: UserRole; // Uses our union type for role restriction
  status: UserStatus; // Uses our union type for status management
  permissions: string[]; // Array of permission strings
}

// ==================== INTERSECTION TYPES ====================

/**
 * Intersection Types - Combining multiple interfaces
 *
 * Intersection Type Syntax: type Combined = TypeA & TypeB & TypeC
 *
 * Key Points:
 * - Result type has ALL properties from ALL intersected types
 * - Useful for composing complete data models from smaller parts
 * - Provides type safety across complex object structures
 */

/**
 * Complete User Type (Intersection)
 * Combines all user-related interfaces into one comprehensive type
 *
 * Usage: Internal operations where all user data is needed
 * Contains: UserInfo + UserAuth + UserProfile = Complete user object
 */
export type CompleteUser = UserInfo & UserAuth & UserProfile;

/**
 * Safe User Type (Intersection without sensitive data)
 * Combines public information, excluding authentication details
 *
 * Usage: Internal operations that don't need password data
 * Contains: UserInfo + UserProfile (excludes UserAuth)
 */
export type SafeUser = UserInfo & UserProfile;

// ==================== UTILITY TYPES ====================

/**
 * Utility Types - Built-in TypeScript helpers for type transformations
 *
 * Essential Utility Types:
 * - Partial<T>: Makes all properties optional (great for updates)
 * - Pick<T, K>: Select only specified properties (great for forms)
 * - Omit<T, K>: Exclude specified properties (great for public APIs)
 * - Record<K, T>: Create object type with specific keys and values
 */

/**
 * Public User (Omit sensitive fields)
 *
 * Omit<T, K> Usage: Remove unwanted properties for public display
 *
 * Use Case: API responses, user profiles visible to others
 * Security: Excludes 'permissions' to prevent privilege information leakage
 */
export type PublicUser = Omit<SafeUser, "permissions">;

/**
 * User Registration (Pick required fields + additional)
 *
 * Pick<T, K> Usage: Select only fields needed for registration
 * Combined with intersection (&) to add registration-specific fields
 *
 * Pattern: Pick<OriginalType, 'field1' | 'field2'> & { additionalField: type }
 */
export type UserRegistration = Pick<
  CompleteUser,
  "username" | "email" | "password"
> & {
  confirmPassword: string; // Registration-specific validation field
};

/**
 * User Update (Partial for flexible updates)
 *
 * Partial<T> Usage: Make all fields optional for update operations
 * Combined with Omit to exclude fields that shouldn't be updated
 *
 * Pattern: Partial<Omit<OriginalType, 'immutableField1' | 'immutableField2'>>
 * Logic: Users can update most fields, but not ID or creation timestamp
 */
export type UserUpdate = Partial<Omit<CompleteUser, "id" | "createdAt">>;

/**
 * Login Credentials (Pick minimal fields)
 *
 * Pick<T, K> Usage: Select minimal required fields
 * Use Case: Authentication - only need email and password
 */
export type LoginCredentials = Pick<CompleteUser, "email" | "password">;

// ==================== API RESPONSE TYPES ====================

/**
 * Generic API Response (Discriminated Union)
 *
 * Discriminated Union Pattern:
 * - Uses a common property ('success') to distinguish between variants
 * - TypeScript can narrow types based on discriminant property
 * - Provides type safety for error handling
 *
 * Usage Pattern:
 * if (response.success) {
 *   // TypeScript knows response.data exists here
 *   console.log(response.data);
 * } else {
 *   // TypeScript knows response.error exists here
 *   console.log(response.error);
 * }
 */
export type ApiResponse<T> =
  | { success: true; data: T } // Success case: contains data
  | { success: false; error: string }; // Error case: contains error message

// ==================== ROLE PERMISSIONS ====================

/**
 * Role-based permissions using Record utility type
 *
 * Record<K, T> Usage: Create object type with specific key-value structure
 * - K: The type of keys (UserRole in this case)
 * - T: The type of values (string[] for permissions)
 *
 * Benefits:
 * - Ensures all roles have permission definitions
 * - Type-safe access to role permissions
 * - Autocomplete for role names
 */
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete", "manage"], // Full access
  user: ["read", "write"], // Standard access
  guest: ["read"], // Limited access
};

// ==================== CORE FUNCTIONS ====================

/**
 * User Management System - Simplified Version
 */
export class UserManagementSystem {
  private users: Map<string, CompleteUser> = new Map();
  private currentUser: PublicUser | null = null;

  /**
   * Register a new user
   *
   * Demonstrates:
   * - Using UserRegistration type (Pick + intersection)
   * - Returning ApiResponse discriminated union
   * - Converting CompleteUser to PublicUser (data hiding)
   *
   * Type Safety Features:
   * - Input validation with proper error messages
   * - Automatic role assignment using union type
   * - Safe data transformation for response
   */
  registerUser(registration: UserRegistration): ApiResponse<PublicUser> {
    // Basic validation
    if (registration.password !== registration.confirmPassword) {
      return { success: false, error: "Passwords don't match" };
    }

    if (registration.password.length < 6) {
      return { success: false, error: "Password too short" };
    }

    // Check for existing user
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.email === registration.email
    );

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Create new user
    const newUser: CompleteUser = {
      id: this.generateId(),
      username: registration.username,
      email: registration.email,
      password: registration.password,
      role: "user",
      status: "active",
      permissions: rolePermissions.user,
      createdAt: new Date(),
    };

    this.users.set(newUser.id, newUser);

    return {
      success: true,
      data: this.toPublicUser(newUser),
    };
  }

  /**
   * User login
   *
   * Demonstrates:
   * - Using LoginCredentials type (Pick utility)
   * - Union type checking (status === "active")
   * - Intersection type property access
   * - Type narrowing in conditional logic
   */
  login(credentials: LoginCredentials): ApiResponse<PublicUser> {
    const user = Array.from(this.users.values()).find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user || user.status !== "active") {
      return {
        success: false,
        error: "Invalid credentials or inactive account",
      };
    }

    // Update last login
    user.lastLogin = new Date();
    this.currentUser = this.toPublicUser(user);

    return {
      success: true,
      data: this.currentUser,
    };
  }

  /**
   * Update user (using Partial utility type)
   *
   * Key Concept: Partial<T> makes all properties optional
   * This allows flexible updates - users can update any combination of fields
   *
   * Type Safety:
   * - Can't update 'id' or 'createdAt' (excluded by Omit)
   * - All other fields are optional thanks to Partial
   * - Object spread maintains type integrity
   */
  updateUser(userId: string, updates: UserUpdate): ApiResponse<PublicUser> {
    const user = this.users.get(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Apply updates
    const updatedUser: CompleteUser = {
      ...user,
      ...updates,
    };

    this.users.set(userId, updatedUser);

    return {
      success: true,
      data: this.toPublicUser(updatedUser),
    };
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): ApiResponse<PublicUser> {
    const user = this.users.get(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: this.toPublicUser(user),
    };
  }

  /**
   * Get users by role (demonstrates union type filtering)
   *
   * Union Type Benefits:
   * - Parameter 'role' is restricted to valid UserRole values
   * - TypeScript prevents invalid role values at compile time
   * - IDE provides autocomplete for available roles
   * - Filter logic is type-safe
   */
  getUsersByRole(role: UserRole): ApiResponse<PublicUser[]> {
    const filteredUsers = Array.from(this.users.values())
      .filter((user) => user.role === role)
      .map((user) => this.toPublicUser(user));

    return {
      success: true,
      data: filteredUsers,
    };
  }

  /**
   * Get current user
   */
  getCurrentUser(): PublicUser | null {
    return this.currentUser;
  }

  /**
   * Logout
   */
  logout(): void {
    this.currentUser = null;
  }

  // ==================== HELPER METHODS ====================

  /**
   * Convert CompleteUser to PublicUser
   *
   * Demonstrates Omit<T, K> in practice:
   * - Uses destructuring to separate sensitive from public data
   * - Rest operator (...) collects remaining properties
   * - Result automatically matches PublicUser type
   *
   * Security Pattern: Always transform internal data before external exposure
   */
  private toPublicUser(user: CompleteUser): PublicUser {
    const { password, permissions, ...publicData } = user;
    return publicData;
  }

  /**
   * Generate unique user ID
   * Simple ID generation for demo purposes
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }
}

// ==================== SAMPLE DATA ====================

/**
 * Sample users for testing
 */
export const sampleUsers: CompleteUser[] = [
  {
    id: "user_001",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    status: "active",
    permissions: rolePermissions.admin,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "user_002",
    username: "testuser",
    email: "test@example.com",
    password: "test123",
    role: "user",
    status: "active",
    permissions: rolePermissions.user,
    createdAt: new Date("2025-02-01"),
  },
];

/**
 * Initialize system with sample data
 */
export function createUserSystem(): UserManagementSystem {
  const system = new UserManagementSystem();

  // Add sample users
  sampleUsers.forEach((user) => {
    system["users"].set(user.id, user);
  });

  return system;
}

// ==================== USAGE EXAMPLES ====================

/**
 * Demonstration functions showing key concepts in action
 */

/**
 * Union type usage with exhaustive checking
 *
 * Key Pattern: switch statement with union types
 * - TypeScript ensures all cases are handled
 * - 'never' type catches unhandled cases at compile time
 * - Provides compile-time safety for business logic
 */
export function getUserStatusMessage(status: UserStatus): string {
  switch (status) {
    case "active":
      return "User is active";
    case "inactive":
      return "User is inactive";
    case "suspended":
      return "User is suspended";
    default:
      // TypeScript error if we miss any UserStatus values
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}

/**
 * Intersection type usage in practice
 *
 * Shows how to combine separate data sources into complete objects
 * Common pattern: merge data from different APIs or database tables
 */
export function mergeUserData(info: UserInfo, profile: UserProfile): SafeUser {
  return { ...info, ...profile }; // Object spread combines all properties
}

/**
 * Utility type usage examples
 *
 * Real-world examples of how each utility type transforms data
 * These examples show the "before and after" of type transformations
 */
export const utilityExamples = {
  // Partial<T> - Perfect for update operations
  // Only specify fields you want to change
  userUpdate: {
    username: "newname",
    status: "inactive",
    // Notice: other fields are optional, don't need to specify all
  } as UserUpdate,

  // Pick<T,K> - Perfect for forms and API requests
  // Only the essential fields needed for login
  loginData: {
    email: "test@example.com",
    password: "password",
    // Notice: no other user fields needed
  } as LoginCredentials,

  // Omit<T,K> - Perfect for public data
  // All user fields except sensitive ones
  publicUser: {
    id: "user_001",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    createdAt: new Date(),
    // Notice: no 'password' or 'permissions' fields
  } as PublicUser,
};

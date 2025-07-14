# TypeScript Learning Project - Day 01

**Author:** Peile Wu  
**Email:**  peile.wu.1990@gmail.com  
**Date:**   July 12, 2025

## Project Overview

This repository contains TypeScript learning exercises focused on building foundational skills for blockchain development.
Day 01 covers essential TypeScript concepts including basic types, interfaces, utility types, and generics.

## Files Structure

```
day01_codes/
├── img/                      # screenshot of function execution result and some problems solution
├── node_modules/             # Running support module
├── day01_basic-types.js      # Compiled JavaScript output
├── day01_basic-types.ts      # Basic types and interface practice
├── day01_generic-practice.js
├── day01_generic-practice.ts # Generic classes and constraints
├── package-lock.json         # Project configuration
└── package.json              # Project configuration
```

## Part 1: Code Analysis and Successful Results

### 1. Basic Types and Interfaces (`day01_basic-types.ts`)

#### Key Features:
- **User Interface Definition**: Structured user data with optional properties
- **Utility Types**: Implementation of `Omit<>` and `Partial<>` for type safety
- **CRUD Operations**: Type-safe create and update functions
- **In-memory Storage**: Simple array-based data management

#### Code Highlights:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tags?: string[];  // Optional property
}

// Using Omit utility type to exclude 'id' from user creation
function createUser(userData: Omit<User, "id">): User {
  const newUser: User = {
    id: nextUserId++,
    ...userData,
  };
  users.push(newUser);
  return newUser;
}

// Using Partial utility type for flexible updates
function updateUser(id: number, updates: Partial<User>): User {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  Object.assign(user, updates);
  return user;
}
```

### 2. Generic Practice (`day01_generic-practice.ts`)

#### Key Features:
- **Generic Class**: `DataStore<T>` with type constraints
- **Type Constraints**: Ensuring objects have required properties
- **Keyof Operator**: Type-safe property access
- **Generic Methods**: Flexible find operations

#### Code Highlights:

```typescript
class DataStore<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById<K extends keyof T>(key: K, value: T[K]): T | undefined {
    return this.items.find((item) => item[key] === value);
  }
}
```

### 3. Successful Execution Results

Based on the terminal screenshots, the code executed successfully with the following results:

#### Basic Types Execution:
```bash
PS E:\parity-learning\learning\typescript\day01_codes> npx ts-node day01_basic-types.ts
# Successfully compiled and executed without errors
```

#### Generic Practice Results:
```bash
PS E:\parity-learning\learning\typescript\day01_codes> node day01_generic-practice.js
{ id: 1, name: 'Alice', email: 'a@a.com', isActive: true }
{ id: 2, name: 'Bob', email: 'b@b.com', isActive: false }
```
<br>
![Results](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/day01_codes/img/day01_generic_practice_result.png)
<br>

The generic `DataStore` class successfully:
- Stored User objects with type safety
- Retrieved users by ID using the generic `findById` method
- Maintained type constraints throughout operations

## Part 2: Error Troubleshooting and Solutions

### Error 1: Unknown File Extension ".ts"

**Error Message:**
```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for E:\parity-learning\learning\typescript\day01_codes\day01_basic-types.ts
```
<br>
![Issue](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/day01_codes/img/day01_cmd_issue_fix1.png)
<br>

**Root Cause:**
Node.js cannot directly execute TypeScript files (.ts) without proper configuration or compilation.

**Solutions Applied:**

#### Solution 1: Install TypeScript Dependencies
```bash
npm init -y
npm install typescript ts-node @types/node
```
<br>
![Solution](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/day01_codes/img/day01_cmd_issue_solved.png)
<br>

#### Solution 2: Use ts-node for Direct Execution
```bash
npx ts-node day01_basic-types.ts
```

#### Solution 3: Compile to JavaScript First
```bash
tsc day01_basic-types.ts
node day01_basic-types.js
```

### Error 2: Git Repository Access Issues

**Error Messages:**
```
fatal: unable to access 'https://github.com/wls503pl/parity-learning.git/': Failed to connect to github.com port 443
```
<br>
![Issue](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/day01_codes/img/git_pull_push_issue.png)
<br>

**Root Cause:**
Network connectivity issues or firewall blocking GitHub access.

**Solutions Applied:**

#### Solution 1: Set Git Remote URL
```bash
git remote set-url origin https://github.com/wls503pl/parity-learning.git
```

#### Solution 2: Successful Push
```bash
git push origin outstanding_projects
```

<br>
![Solution](https://github.com/wls503pl/parity-learning/blob/outstanding_projects/learning/typescript/day01_codes/img/git_pull_push_issue_solved.png)
<br>

### Error 3: Package.json Configuration

**Issue:** Missing proper TypeScript configuration for the project.

**Solution:** Created package.json with proper TypeScript setup:
```json
{
  "name": "day01_codes",
  "version": "1.0.0",
  "description": "",
  "main": "day01_basic-types.js",
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Key Learning Outcomes

### TypeScript Concepts Mastered:
1. **Interface Design**: Creating structured data types with optional properties
2. **Utility Types**: Leveraging `Omit<>` and `Partial<>` for flexible type manipulation
3. **Generic Programming**: Building reusable, type-safe data structures
4. **Type Constraints**: Ensuring generic types meet specific requirements
5. **Keyof Operator**: Accessing object properties in a type-safe manner

### Development Skills Gained:
1. **Environment Setup**: Configuring TypeScript development environment
2. **Error Resolution**: Debugging compilation and runtime issues
3. **Git Workflow**: Managing version control and remote repositories
4. **Package Management**: Using npm for dependency management

## Running the Code

### Prerequisites:
```bash
node --version  # Ensure Node.js is installed
npm --version   # Ensure npm is available
```

### Setup:
```bash
git clone https://github.com/wls503pl/parity-learning.git
cd learning/typescript/day01_codes
npm install typescript ts-node @types/node
```

### Execution:
```bash
# Direct TypeScript execution
npx ts-node day01_basic-types.ts
npx ts-node day01_generic-practice.ts

# Or compile and run JavaScript
tsc day01_basic-types.ts
node day01_basic-types.js
```

---

*This README documents the learning journey and troubleshooting process for TypeScript fundamentals, serving as a reference for future blockchain development projects.*

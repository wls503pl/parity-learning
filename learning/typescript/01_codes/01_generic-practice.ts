/**
 * TypeScript Generic Practice
 *
 * Author:  Peile Wu
 * Email:   peile.wu.1990@gmail.com
 * Date:    2025/7/12
 * Purpose: Learning TypeScript generics and constraint systems
 *          to gain competence for blockchain development positions
 *
 * Day 01:  Covers generic classes, type constraints, and keyof operator
 *          for building type-safe data storage utilities
 */

// Exercise: Generic Utility Class
class DataStore<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById<K extends keyof T>(key: K, value: T[K]): T | undefined {
    // Realization
    return this.items.find((item) => item[key] === value);
  }
}

// Test Realization
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tags?: string[];
}

// Test Realization
const userStore = new DataStore<User>();
userStore.add({ id: 1, name: "Alice", email: "a@a.com", isActive: true });
userStore.add({ id: 2, name: "Bob", email: "b@b.com", isActive: false });

console.log(userStore.findById("id", 1));
console.log(userStore.findById("id", 2));

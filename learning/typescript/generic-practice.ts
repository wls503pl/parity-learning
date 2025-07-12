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

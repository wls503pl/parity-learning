// Exercise: Defining types for user data
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tags?: string[];
}

let nextUserId = 1; // Generate unique ID
const users: User[] = []; // Simple in-memory data storage

// Create User
function createUser(userData: Omit<User, "id">): User {
  const newUser: User = {
    id: nextUserId++,
    ...userData,
  };
  users.push(newUser);
  return newUser;
}

// Update User
function updateUser(id: number, updates: Partial<User>): User {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }

  Object.assign(user, updates); // Overwrite existing fields with the update object
  return user;
}

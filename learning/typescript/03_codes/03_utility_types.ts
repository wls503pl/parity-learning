// Day 3 - 实用工具类型练习
// 学习目标：掌握Partial<T>、Pick<T,K>、Omit<T,K>等工具类型

// 1. 基础用户类型
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

// 2. 区块类型
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

// 3. 使用 Partial<T> 创建用户更新接口
export type UserUpdate = Partial<User>;

// 4. 使用 Pick<T,K> 选择区块部分字段
export type BlockSummary = Pick<Block, "id" | "hash" | "timestamp" | "status">;

// 5. 使用 Omit<T,K> 创建新用户接口（排除敏感信息）
export type PublicUser = Omit<User, "password" | "email">;

// 6. 使用 Required<T> 确保所有字段必填
export type RequiredUserUpdate = Required<UserUpdate>;

// 7. 使用 Readonly<T> 创建只读类型
export type ReadonlyBlock = Readonly<Block>;

// 8. 使用 Record<K,T> 创建映射类型
export type UserRolePermissions = Record<User["role"], string[]>;

// 9. 组合工具类型：创建用户注册数据
export type UserRegistration = Pick<User, "name" | "email" | "password"> & {
  confirmPassword: string;
};

// 10. 创建用户登录数据
export type UserLogin = Pick<User, "email" | "password">;

// 11. 用户更新函数
export function updateUser(currentUser: User, updates: UserUpdate): User {
  return {
    ...currentUser,
    ...updates,
    updatedAt: new Date(),
  };
}

// 12. 获取区块摘要信息
export function getBlockSummary(block: Block): BlockSummary {
  const { id, hash, timestamp, status } = block;
  return { id, hash, timestamp, status };
}

// 13. 获取公开用户信息
export function getPublicUserInfo(user: User): PublicUser {
  const { password, email, ...publicInfo } = user;
  return publicInfo;
}

// 14. 权限配置
export const rolePermissions: UserRolePermissions = {
  admin: ["read", "write", "delete", "manage_users", "system_config"],
  user: ["read", "write"],
  guest: ["read"],
};

// 15. 验证用户注册数据
export function validateUserRegistration(registration: UserRegistration): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!registration.name || registration.name.length < 2) {
    errors.push("用户名至少2个字符");
  }

  if (!registration.email || !registration.email.includes("@")) {
    errors.push("请输入有效的邮箱地址");
  }

  if (!registration.password || registration.password.length < 6) {
    errors.push("密码至少6个字符");
  }

  if (registration.password !== registration.confirmPassword) {
    errors.push("两次输入的密码不一致");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// 16. 处理用户登录
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
      message: "邮箱或密码错误，或账户已被禁用",
    };
  }

  return {
    success: true,
    user: getPublicUserInfo(user),
    message: "登录成功",
  };
}

// 17. 批量更新用户
export function batchUpdateUsers(users: User[], updates: UserUpdate): User[] {
  return users.map((user) => updateUser(user, updates));
}

// 18. 根据角色筛选用户
export function filterUsersByRole<T extends User["role"]>(
  users: User[],
  role: T
): User[] {
  return users.filter((user) => user.role === role);
}

// 19. 示例数据
export const sampleUser: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  password: "123456",
  age: 25,
  role: "admin",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-07-29"),
  isActive: true,
};

export const sampleBlock: Block = {
  id: "block_001",
  hash: "0x1234567890abcdef",
  previousHash: "0xfedcba0987654321",
  timestamp: Date.now(),
  data: "区块链交易数据",
  miner: "miner_001",
  nonce: 12345,
  difficulty: 4,
  status: "confirmed",
};

// 20. 工具类型使用示例
export const examples = {
  // Partial 示例
  userUpdate: {
    name: "新名字",
    age: 26,
  } as UserUpdate,

  // Pick 示例
  blockSummary: {
    id: "block_001",
    hash: "0x1234567890abcdef",
    timestamp: Date.now(),
    status: "confirmed",
  } as BlockSummary,

  // Omit 示例
  publicUser: {
    id: 1,
    name: "张三",
    age: 25,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  } as PublicUser,
};

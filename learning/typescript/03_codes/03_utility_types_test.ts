// Day 3 - 实用工具类型测试
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
} from "./day03_utility_types";

// 简单的测试框架
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name} - 通过`);
  } catch (error) {
    console.log(`❌ ${name} - 失败: ${error}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `期望: ${expected}, 实际: ${actual}`);
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "条件为假");
  }
}

function assertObjectHasProperty<T extends object>(
  obj: T,
  property: keyof T,
  message?: string
) {
  if (!(property in obj)) {
    throw new Error(message || `对象缺少属性: ${String(property)}`);
  }
}

// 测试1：Partial<T> 用户更新
test("Partial<T> - 用户更新", () => {
  const updates: UserUpdate = {
    name: "新名字",
    age: 30,
  };

  const updatedUser = updateUser(sampleUser, updates);

  assertEqual(updatedUser.name, "新名字");
  assertEqual(updatedUser.age, 30);
  assertEqual(updatedUser.email, sampleUser.email); // 未更新的字段保持不变
  assertTrue(updatedUser.updatedAt > sampleUser.updatedAt);
});

// 测试2：Pick<T,K> 区块摘要
test("Pick<T,K> - 区块摘要", () => {
  const summary: BlockSummary = getBlockSummary(sampleBlock);

  assertObjectHasProperty(summary, "id");
  assertObjectHasProperty(summary, "hash");
  assertObjectHasProperty(summary, "timestamp");
  assertObjectHasProperty(summary, "status");

  assertEqual(summary.id, sampleBlock.id);
  assertEqual(summary.hash, sampleBlock.hash);

  // 确保不包含其他字段
  const summaryKeys = Object.keys(summary);
  assertEqual(summaryKeys.length, 4);
});

// 测试3：Omit<T,K> 公开用户信息
test("Omit<T,K> - 公开用户信息", () => {
  const publicUser: PublicUser = getPublicUserInfo(sampleUser);

  assertObjectHasProperty(publicUser, "id");
  assertObjectHasProperty(publicUser, "name");
  assertObjectHasProperty(publicUser, "role");

  // 确保敏感信息被排除
  assertTrue(!("password" in publicUser));
  assertTrue(!("email" in publicUser));

  assertEqual(publicUser.name, sampleUser.name);
  assertEqual(publicUser.role, sampleUser.role);
});

// 测试4：Record<K,T> 权限配置
test("Record<K,T> - 权限配置", () => {
  assertTrue(Array.isArray(rolePermissions.admin));
  assertTrue(Array.isArray(rolePermissions.user));
  assertTrue(Array.isArray(rolePermissions.guest));

  assertTrue(rolePermissions.admin.length > rolePermissions.user.length);
  assertTrue(rolePermissions.user.length > rolePermissions.guest.length);

  assertTrue(rolePermissions.admin.includes("manage_users"));
  assertTrue(rolePermissions.user.includes("read"));
  assertTrue(rolePermissions.guest.includes("read"));
});

// 测试5：用户注册验证
test("用户注册验证 - 有效数据", () => {
  const validRegistration = {
    name: "测试用户",
    email: "test@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  const result = validateUserRegistration(validRegistration);
  assertTrue(result.valid);
  assertEqual(result.errors.length, 0);
});

test("用户注册验证 - 无效数据", () => {
  const invalidRegistration = {
    name: "a", // 太短
    email: "invalid-email", // 无效邮箱
    password: "123", // 太短
    confirmPassword: "456", // 不匹配
  };

  const result = validateUserRegistration(invalidRegistration);
  assertTrue(!result.valid);
  assertTrue(result.errors.length > 0);
  assertTrue(result.errors.some((error) => error.includes("用户名")));
  assertTrue(result.errors.some((error) => error.includes("邮箱")));
  assertTrue(result.errors.some((error) => error.includes("密码")));
});

// 测试6：用户登录处理
test("用户登录处理 - 成功", () => {
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

test("用户登录处理 - 失败", () => {
  const users = [sampleUser];
  const loginData = {
    email: "wrong@example.com",
    password: "wrongpassword",
  };

  const result = processUserLogin(users, loginData);
  assertTrue(!result.success);
  assertTrue(result.user === undefined);
  assertTrue(result.message.includes("错误"));
});

// 测试7：批量更新用户
test("批量更新用户", () => {
  const users = [
    { ...sampleUser, id: 1 },
    { ...sampleUser, id: 2, name: "李四" },
    { ...sampleUser, id: 3, name: "王五" },
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

// 测试8：按角色筛选用户
test("按角色筛选用户", () => {
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

// 测试9：示例数据类型检查
test("示例数据类型检查", () => {
  // 检查 UserUpdate 类型
  const update = examples.userUpdate;
  assertTrue(typeof update.name === "string");
  assertTrue(typeof update.age === "number");

  // 检查 BlockSummary 类型
  const summary = examples.blockSummary;
  assertTrue(typeof summary.id === "string");
  assertTrue(typeof summary.hash === "string");
  assertTrue(typeof summary.timestamp === "number");
  assertTrue(["pending", "confirmed", "failed"].includes(summary.status));

  // 检查 PublicUser 类型
  const publicUser = examples.publicUser;
  assertTrue(typeof publicUser.id === "number");
  assertTrue(typeof publicUser.name === "string");
  assertTrue(!("password" in publicUser));
  assertTrue(!("email" in publicUser));
});

// 运行所有测试
console.log("🚀 开始运行工具类型测试...\n");

// 运行测试的主函数
export function runAllUtilityTypesTests() {
  console.log("=== 实用工具类型测试 ===");

  console.log("\n📊 测试摘要:");
  console.log("- Partial<T>: 使所有属性可选");
  console.log("- Pick<T,K>: 选择指定属性");
  console.log("- Omit<T,K>: 排除指定属性");
  console.log("- Record<K,T>: 创建映射类型");
  console.log("- Required<T>: 使所有属性必填");
  console.log("- Readonly<T>: 使所有属性只读");
  console.log("✨ 所有工具类型测试完成!");
}

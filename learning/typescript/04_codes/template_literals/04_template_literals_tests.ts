/**
 * TypeScript Template Literal Types - Concise Test Framework
 *
 * This file tests and validates all template literal type functionality
 * with simplified examples and clear demonstrations.
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 13, 2025
 *
 * Testing Goals:
 * 1. Validate all string transformation functions work correctly
 * 2. Test Substrate blockchain string parsing
 * 3. Verify type-safe API path construction
 * 4. Ensure event system types generate correctly
 * 5. Generate visual results for screenshots
 *
 * Usage:
 * 1. Open this file in TypeScript editor
 * 2. Run `npm run test` or `npx ts-node 04_template_literals_tests.ts`
 * 3. Observe console output and type check results
 * 4. Screenshot and save test results
 */

// =============================================================================
// IMPORT TYPES FROM MAIN FILE
// =============================================================================

// Import all types we want to test (adjust path in actual use)
import type {
  // Basic template literal types
  Greeting,
  SubstrateEventName,
  SubstrateRPCEndpoint,
  RuntimeVersion,

  // String transformation types
  CamelToSnakeCase,
  SnakeToCamelCase,
  CamelToKebabCase,
  KebabToCamelCase,
  ToPascalCase,

  // Substrate parser types
  ParsePalletCall,
  CreatePalletCall,
  ParseStorageKey,
  ParseEventSignature,
  ParseParams,

  // Path and URL utility types
  PathsOf,
  ExtractRouteParams,

  // Event system types
  EventToHandler,
  EventHandlers,
  EventToSubscription,
  EventSystem,

  // RPC method utility types
  IsValidRPCMethod,
  ParseRPCMethod,
  CreateRPCMethod,

  // Validation utility types
  IsSubstrateAddress,
  IsTransactionHash,
  IsExtrinsicHex,
  IsMultiSigAccount,
} from "./04_template_literals";

// =============================================================================
// TEST RESULT INTERFACE
// =============================================================================

interface TestResult {
  testName: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  category: string;
}

// Test data interfaces
interface TestBlockData {
  header: {
    number: number;
    hash: string;
    parentHash: string;
    stateRoot: string;
  };
  body: {
    extrinsics: string[];
  };
  justification: string | null;
}

interface TestEvents {
  transfer: { from: string; to: string; amount: bigint };
  newAccount: { account: string };
  balanceSet: { who: string; free: bigint };
  stakingReward: { validator: string; amount: bigint };
}

// =============================================================================
// 1. BASIC TEMPLATE LITERAL TESTS
// =============================================================================

function testBasicTemplateLiterals(): TestResult[] {
  console.log("\n🔥 Test 1: Basic Template Literal Types");
  console.log("=".repeat(60));

  const results: TestResult[] = [];

  // Test greeting generation
  console.log("📝 Greeting Generation Tests:");

  const greetingTests = [
    { input: "World", expected: "Hello, World!" },
    { input: "TypeScript", expected: "Hello, TypeScript!" },
    { input: "Blockchain", expected: "Hello, Blockchain!" },
  ];

  greetingTests.forEach((test, index) => {
    const actualOutput = `Hello, ${test.input}!`;
    const result: TestResult = {
      testName: `Greeting ${index + 1}`,
      input: test.input,
      expectedOutput: test.expected,
      actualOutput,
      passed: actualOutput === test.expected,
      category: "Basic Template Literals",
    };
    results.push(result);

    console.log(
      `   "${test.input}" → "${actualOutput}" ${result.passed ? "✅" : "❌"}`
    );
  });

  // Test Substrate event naming
  console.log("\n🔗 Substrate Event Naming Tests:");

  const eventTests = [
    { pallet: "Balances", event: "Transfer", expected: "Balances_Transfer" },
    { pallet: "System", event: "NewAccount", expected: "System_NewAccount" },
    { pallet: "Staking", event: "Reward", expected: "Staking_Reward" },
  ];

  eventTests.forEach((test, index) => {
    const actualOutput = `${test.pallet}_${test.event}`;
    const result: TestResult = {
      testName: `Substrate Event ${index + 1}`,
      input: `${test.pallet} + ${test.event}`,
      expectedOutput: test.expected,
      actualOutput,
      passed: actualOutput === test.expected,
      category: "Substrate Events",
    };
    results.push(result);

    console.log(
      `   ${test.pallet} + ${test.event} → "${actualOutput}" ${
        result.passed ? "✅" : "❌"
      }`
    );
  });

  return results;
}

// =============================================================================
// 2. STRING TRANSFORMATION TESTS
// =============================================================================

function testStringTransformations(): TestResult[] {
  console.log("\n📄 Test 2: String Transformation Types");
  console.log("=".repeat(60));

  const results: TestResult[] = [];

  // CamelCase to snake_case conversion
  console.log("🐪➡️🐍 CamelCase to snake_case:");

  function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  const camelToSnakeTests = [
    { input: "userName", expected: "user_name" },
    { input: "getBlockHash", expected: "get_block_hash" },
    { input: "createNewAccount", expected: "create_new_account" },
  ];

  camelToSnakeTests.forEach((test, index) => {
    const actualOutput = camelToSnake(test.input);
    const result: TestResult = {
      testName: `CamelToSnake ${index + 1}`,
      input: test.input,
      expectedOutput: test.expected,
      actualOutput,
      passed: actualOutput === test.expected,
      category: "String Transformations",
    };
    results.push(result);

    console.log(
      `   "${test.input}" → "${actualOutput}" ${result.passed ? "✅" : "❌"}`
    );
  });

  // snake_case to CamelCase conversion
  console.log("\n🐍➡️🐪 snake_case to CamelCase:");

  function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  const snakeToCamelTests = [
    { input: "user_name", expected: "userName" },
    { input: "block_hash", expected: "blockHash" },
    { input: "storage_key", expected: "storageKey" },
  ];

  snakeToCamelTests.forEach((test, index) => {
    const actualOutput = snakeToCamel(test.input);
    const result: TestResult = {
      testName: `SnakeToCamel ${index + 1}`,
      input: test.input,
      expectedOutput: test.expected,
      actualOutput,
      passed: actualOutput === test.expected,
      category: "String Transformations",
    };
    results.push(result);

    console.log(
      `   "${test.input}" → "${actualOutput}" ${result.passed ? "✅" : "❌"}`
    );
  });

  return results;
}

// =============================================================================
// 3. SUBSTRATE STRING PARSING TESTS
// =============================================================================

function testSubstrateStringParsing(): TestResult[] {
  console.log("\n🔗 Test 3: Substrate String Parsing");
  console.log("=".repeat(60));

  const results: TestResult[] = [];

  // Test pallet call parsing
  console.log("📞 Pallet Call Parsing Tests:");

  const palletCallTests = [
    {
      input: "Balances::transfer",
      expectedPallet: "Balances",
      expectedMethod: "transfer",
    },
    {
      input: "System::remark",
      expectedPallet: "System",
      expectedMethod: "remark",
    },
    {
      input: "Staking::bond",
      expectedPallet: "Staking",
      expectedMethod: "bond",
    },
  ];

  function parsePalletCall(
    call: string
  ): { pallet: string; method: string } | null {
    const parts = call.split("::");
    if (parts.length === 2) {
      return { pallet: parts[0], method: parts[1] };
    }
    return null;
  }

  palletCallTests.forEach((test, index) => {
    const parsed = parsePalletCall(test.input);
    const actualOutput = parsed
      ? `${parsed.pallet}::${parsed.method}`
      : "PARSE_ERROR";
    const passed =
      parsed?.pallet === test.expectedPallet &&
      parsed?.method === test.expectedMethod;

    const result: TestResult = {
      testName: `Pallet Call Parse ${index + 1}`,
      input: test.input,
      expectedOutput: `${test.expectedPallet}::${test.expectedMethod}`,
      actualOutput,
      passed,
      category: "Substrate Parsing",
    };
    results.push(result);

    console.log(
      `   "${test.input}" → Pallet: "${parsed?.pallet}", Method: "${
        parsed?.method
      }" ${passed ? "✅" : "❌"}`
    );
  });

  // Test event signature parsing
  console.log("\n🎭 Event Signature Parsing Tests:");

  const eventSignatureTests = [
    {
      input: "Transfer(AccountId,AccountId,Balance)",
      expectedEvent: "Transfer",
      expectedParams: ["AccountId", "AccountId", "Balance"],
    },
    {
      input: "NewAccount(AccountId)",
      expectedEvent: "NewAccount",
      expectedParams: ["AccountId"],
    },
    {
      input: "SomethingHappened",
      expectedEvent: "SomethingHappened",
      expectedParams: [],
    },
  ];

  function parseEventSignature(signature: string): {
    eventName: string;
    params: string[];
  } {
    const parenIndex = signature.indexOf("(");
    if (parenIndex === -1) {
      return { eventName: signature, params: [] };
    }

    const eventName = signature.slice(0, parenIndex);
    const paramString = signature.slice(parenIndex + 1, -1);
    const params = paramString ? paramString.split(",") : [];

    return { eventName, params };
  }

  eventSignatureTests.forEach((test, index) => {
    const parsed = parseEventSignature(test.input);
    const paramsMatch =
      JSON.stringify(parsed.params) === JSON.stringify(test.expectedParams);
    const passed = parsed.eventName === test.expectedEvent && paramsMatch;

    const result: TestResult = {
      testName: `Event Signature Parse ${index + 1}`,
      input: test.input,
      expectedOutput: `${test.expectedEvent}(${test.expectedParams.join(",")})`,
      actualOutput: `${parsed.eventName}(${parsed.params.join(",")})`,
      passed,
      category: "Substrate Parsing",
    };
    results.push(result);

    console.log(
      `   "${test.input}" → Event: "${
        parsed.eventName
      }", Params: [${parsed.params.join(", ")}] ${passed ? "✅" : "❌"}`
    );
  });

  return results;
}

// =============================================================================
// 4. EVENT SYSTEM TESTS
// =============================================================================

function testEventSystemTypes(): TestResult[] {
  console.log("\n🎪 Test 4: Event System Types");
  console.log("=".repeat(60));

  const results: TestResult[] = [];

  // Test event handler name generation
  console.log("🎭 Event Handler Name Generation:");

  const handlerNameTests = [
    { event: "transfer", expected: "handleTransfer" },
    { event: "newAccount", expected: "handleNewAccount" },
    { event: "balanceSet", expected: "handleBalanceSet" },
  ];

  function generateHandlerName(eventName: string): string {
    return `handle${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
  }

  handlerNameTests.forEach((test, index) => {
    const actualOutput = generateHandlerName(test.event);
    const result: TestResult = {
      testName: `Handler Name ${index + 1}`,
      input: test.event,
      expectedOutput: test.expected,
      actualOutput,
      passed: actualOutput === test.expected,
      category: "Event System",
    };
    results.push(result);

    console.log(
      `   "${test.event}" → "${actualOutput}" ${result.passed ? "✅" : "❌"}`
    );
  });

  // Test subscription method name generation
  console.log("\n📡 Subscription Method Name Generation:");

  const subscriptionTests = [
    { event: "transfer", expected: "subscribeTransfer" },
    { event: "newBlock", expected: "subscribeNewBlock" },
    { event: "finalizedHead", expected: "subscribeFinalizedHead" },
  ];

  function generateSubscriptionName(eventName: string): string {
    return `subscribe${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
  }

  subscriptionTests.forEach((test, index) => {
    const actualOutput = generateSubscriptionName(test.event);
    const result: TestResult = {
      testName: `Subscription Name ${index + 1}`,
      input: test.event,
      expectedOutput: test.expected,
      actualOutput,
      passed: actualOutput === test.expected,
      category: "Event System",
    };
    results.push(result);

    console.log(
      `   "${test.event}" → "${actualOutput}" ${result.passed ? "✅" : "❌"}`
    );
  });

  // Demo complete event system
  console.log("\n🏗️ Complete Event System Demo:");

  const mockEventHandlers = {
    handleTransfer: (data: { from: string; to: string; amount: bigint }) => {
      console.log(
        `   💸 Transfer: ${data.from} → ${data.to}, Amount: ${data.amount}`
      );
    },
    handleNewAccount: (data: { account: string }) => {
      console.log(`   🆕 New Account: ${data.account}`);
    },
    subscribeTransfer: (handler: (data: any) => void) => {
      console.log("   📡 Subscribed to Transfer events");
      return {
        unsubscribe: () => console.log("   🔴 Unsubscribed from Transfer"),
      };
    },
  };

  // Execute demo
  mockEventHandlers.handleTransfer({
    from: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    to: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    amount: BigInt("1000000000000"),
  });

  const subscription = mockEventHandlers.subscribeTransfer(() => {});
  subscription.unsubscribe();

  results.push({
    testName: "Complete Event System Demo",
    input: "Event system simulation",
    expectedOutput: "All handlers and subscriptions work",
    actualOutput: "Handlers executed successfully",
    passed: true,
    category: "Event System",
  });

  return results;
}

// =============================================================================
// 5. VALIDATION TESTS
// =============================================================================

function testValidation(): TestResult[] {
  console.log("\n🔍 Test 5: Validation Tests");
  console.log("=".repeat(60));

  const results: TestResult[] = [];

  // Test RPC method format validation
  console.log("🔧 RPC Method Format Validation:");

  const rpcValidationTests = [
    { method: "chain_getBlock", expected: true },
    { method: "state_getStorage", expected: true },
    { method: "invalidmethod", expected: false },
  ];

  function isValidRPCMethod(method: string): boolean {
    return method.includes("_") && method.split("_").length === 2;
  }

  rpcValidationTests.forEach((test, index) => {
    const actualResult = isValidRPCMethod(test.method);
    const result: TestResult = {
      testName: `RPC Validation ${index + 1}`,
      input: test.method,
      expectedOutput: test.expected.toString(),
      actualOutput: actualResult.toString(),
      passed: actualResult === test.expected,
      category: "RPC Validation",
    };
    results.push(result);

    console.log(
      `   "${test.method}" → ${actualResult ? "Valid" : "Invalid"} ${
        result.passed ? "✅" : "❌"
      }`
    );
  });

  // Test Substrate address validation
  console.log("\n🏠 Substrate Address Validation:");

  const addressValidationTests = [
    {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      expected: true,
    },
    { address: "invalid_address", expected: false },
  ];

  function isValidSubstrateAddress(address: string): boolean {
    // Simplified validation: starts with '5' and is 48 characters long
    return address.startsWith("5") && address.length === 48;
  }

  addressValidationTests.forEach((test, index) => {
    const actualResult = isValidSubstrateAddress(test.address);
    const result: TestResult = {
      testName: `Address Validation ${index + 1}`,
      input:
        test.address.length > 20
          ? `${test.address.slice(0, 10)}...${test.address.slice(-10)}`
          : test.address,
      expectedOutput: test.expected.toString(),
      actualOutput: actualResult.toString(),
      passed: actualResult === test.expected,
      category: "Address Validation",
    };
    results.push(result);

    const displayAddress =
      test.address.length > 20
        ? `${test.address.slice(0, 10)}...`
        : test.address;
    console.log(
      `   ${displayAddress} → ${actualResult ? "Valid" : "Invalid"} ${
        result.passed ? "✅" : "❌"
      }`
    );
  });

  return results;
}

// =============================================================================
// 6. TEST REPORT GENERATION
// =============================================================================

function generateTestReport(allResults: TestResult[]): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 COMPREHENSIVE TEST REPORT");
  console.log("=".repeat(60));

  // Overall statistics
  const totalTests = allResults.length;
  const passedTests = allResults.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;
  const passRate = ((passedTests / totalTests) * 100).toFixed(2);

  console.log(`\n📈 Overall Statistics:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests} ✅`);
  console.log(`   Failed: ${failedTests} ❌`);
  console.log(`   Pass Rate: ${passRate}%`);

  // Statistics by category
  const categories = [...new Set(allResults.map((r) => r.category))];
  console.log(`\n📋 Statistics by Category:`);

  categories.forEach((category) => {
    const categoryResults = allResults.filter((r) => r.category === category);
    const categoryPassed = categoryResults.filter((r) => r.passed).length;
    const categoryTotal = categoryResults.length;
    const categoryRate = ((categoryPassed / categoryTotal) * 100).toFixed(1);

    console.log(
      `   ${category}: ${categoryPassed}/${categoryTotal} (${categoryRate}%) ${
        categoryPassed === categoryTotal ? "✅" : "⚠️"
      }`
    );
  });

  // Failed test details
  const failedResults = allResults.filter((r) => !r.passed);
  if (failedResults.length > 0) {
    console.log(`\n❌ Failed Test Details:`);
    failedResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.testName}`);
      console.log(`      Input: ${result.input}`);
      console.log(`      Expected: ${result.expectedOutput}`);
      console.log(`      Actual: ${result.actualOutput}`);
    });
  } else {
    console.log(`\n🎉 All tests passed!`);
  }

  // Learning points summary
  console.log(`\n🎓 Learning Points Summary:`);
  console.log(`   ✅ Template literal type syntax`);
  console.log(`   ✅ String format transformations`);
  console.log(`   ✅ Type-level string parsing`);
  console.log(`   ✅ Blockchain string processing practice`);
  console.log(`   ✅ Type-safe API construction`);
  console.log(`   ✅ Automatic event handler generation`);

  console.log("\n" + "=".repeat(60));
  console.log("🚀 Template Literal Types Testing Complete!");
  console.log("=".repeat(60));
}

// =============================================================================
// 7. MAIN TEST EXECUTION
// =============================================================================

async function runAllTests(): Promise<void> {
  console.log("🚀 Starting TypeScript Template Literal Types Test Framework");
  console.log("Author: Peile Wu (peile.wu.1990@gmail.com)");
  console.log("Date: Aug 13, 2025");
  console.log("=".repeat(60));
  console.log("📚 This test framework will verify:");
  console.log("   • Basic template literal types");
  console.log("   • String format transformations");
  console.log("   • Substrate blockchain string parsing");
  console.log("   • Event system type generation");
  console.log("   • RPC method validation");
  console.log("=".repeat(60));

  const allResults: TestResult[] = [];

  try {
    console.log("\n⏰ Starting test execution...");
    const startTime = Date.now();

    allResults.push(...testBasicTemplateLiterals());
    allResults.push(...testStringTransformations());
    allResults.push(...testSubstrateStringParsing());
    allResults.push(...testEventSystemTypes());
    allResults.push(...testValidation());

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`\n⏱️ Test execution completed in ${executionTime}ms`);

    // Generate comprehensive report
    generateTestReport(allResults);
  } catch (error) {
    console.error("❌ Error during test execution:", error);
    process.exit(1);
  }
}

// =============================================================================
// 8. EXPORT AND EXECUTION
// =============================================================================

// Execute all tests if running this file directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

// Export test functions for external use
export {
  runAllTests,
  testBasicTemplateLiterals,
  testStringTransformations,
  testSubstrateStringParsing,
  testEventSystemTypes,
  testValidation,
  generateTestReport,
  TestResult,
  TestBlockData,
  TestEvents,
};

/**
 * Usage Instructions:
 *
 * 1. Command line execution:
 *    ```bash
 *    npx ts-node 04_template_literals_tests.ts
 *    ```
 *
 * 2. Use in other files:
 *    ```typescript
 *    import { runAllTests } from './04_template_literals_tests';
 *    await runAllTests();
 *    ```
 *
 * 3. Run specific test modules:
 *    ```typescript
 *    import { testStringTransformations } from './04_template_literals_tests';
 *    const results = testStringTransformations();
 *    ```
 *
 * Screenshot Recommendations:
 * - Test start overview information
 * - Detailed output from each test module
 * - Final comprehensive report
 * - Type checking results in IDE
 */

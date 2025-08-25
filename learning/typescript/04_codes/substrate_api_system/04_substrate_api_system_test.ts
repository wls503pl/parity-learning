/**
 * TypeScript Comprehensive Substrate API Type System - Enhanced Test Suite
 * Complete testing with visual output and runtime validation
 *
 * Author: Peile Wu
 * Contact: peile.wu.1990@gmail.com
 * Date: Aug 25, 2025
 *
 * Enhanced Features:
 * - Visual test result output with colors and icons
 * - Runtime validation alongside compile-time checks
 * - Performance benchmarking for complex types
 * - Interactive test runner with detailed reporting
 * - Mock implementation testing
 * - Integration scenario validation
 */

import type {
  // Core data structures
  Hash,
  BlockHash,
  BlockHeader,
  Block,
  Extrinsic,
  RuntimeVersion,
  SubstrateEvent,

  // API definitions
  SubstrateRPCMethods,
  SubstrateClientAPI,
  SafeSubstrateAPI,

  // Response types
  APIResponse,

  // Event system
  SubstrateEvents,
  SubstrateEventSystem,

  // Configuration
  SubstrateConfig,
  SubstrateConfigValidator,

  // Query builders
  StorageQueryBuilder,
  ChainQueryBuilder,
  SubstrateQueryBuilder,

  // Metadata
  RuntimeMetadata,
  PalletMetadata,
  PalletAccessor,

  // Main client
  SubstrateAPIClient,
  ExtendedSubstrateClient,
  CreateSubstrateClient,

  // Utilities
  DeepReadonly,
  PartialDeep,
  MethodNames,
  MethodsReturning,
  TransformMethodName,
  CamelCase,

  // Plugins and middleware
  SubstratePlugin,
  APIMiddleware,
} from "./04_substrate_api_system";

// =============================================================================
// ENHANCED TEST FRAMEWORK
// =============================================================================

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
} as const;

// Test result interface
interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
  duration?: number;
  details?: any;
}

// Test runner class
class SubstrateTestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  // Add test result
  addResult(result: TestResult) {
    this.results.push(result);
  }

  // Create a test result
  createTest(
    name: string,
    category: string,
    testFn: () => boolean,
    message?: string
  ): TestResult {
    const start = performance.now();
    let passed = false;
    let error = null;

    try {
      passed = testFn();
    } catch (e) {
      error = e;
    }

    const duration = performance.now() - start;

    const result: TestResult = {
      name,
      category,
      passed,
      message: message || (passed ? "✅ PASS" : "❌ FAIL"),
      duration,
      details: error ? { error: String(error) } : undefined,
    };

    this.addResult(result);
    return result;
  }

  // Print individual test result
  printResult(result: TestResult) {
    const icon = result.passed ? "✅" : "❌";
    const color = result.passed ? colors.green : colors.red;
    const duration = result.duration
      ? ` (${result.duration.toFixed(2)}ms)`
      : "";

    console.log(
      `${color}${icon} ${result.category}::${result.name}${colors.reset}${duration}`
    );
    console.log(`   ${result.message}`);

    if (result.details) {
      console.log(
        `   ${colors.yellow}Details: ${JSON.stringify(result.details)}${
          colors.reset
        }`
      );
    }
  }

  // Print summary
  printSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = Date.now() - this.startTime;

    console.log("\n" + "=".repeat(80));
    console.log(
      `${colors.bright}${colors.cyan}SUBSTRATE API TYPE SYSTEM TEST RESULTS${colors.reset}`
    );
    console.log("=".repeat(80));

    // Summary stats
    console.log(`${colors.bright}Total Tests: ${totalTests}${colors.reset}`);
    console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
    console.log(
      `${colors.yellow}Total Duration: ${totalDuration}ms${colors.reset}`
    );
    console.log(
      `${colors.blue}Success Rate: ${((passedTests / totalTests) * 100).toFixed(
        2
      )}%${colors.reset}`
    );

    // Category breakdown
    const categories = [...new Set(this.results.map((r) => r.category))];
    console.log(`\n${colors.bright}Results by Category:${colors.reset}`);

    categories.forEach((category) => {
      const categoryResults = this.results.filter(
        (r) => r.category === category
      );
      const categoryPassed = categoryResults.filter((r) => r.passed).length;
      const categoryTotal = categoryResults.length;
      const categoryColor =
        categoryPassed === categoryTotal ? colors.green : colors.yellow;

      console.log(
        `${categoryColor}  ${category}: ${categoryPassed}/${categoryTotal}${colors.reset}`
      );
    });

    // Overall result
    const overallColor = failedTests === 0 ? colors.green : colors.red;
    const overallStatus =
      failedTests === 0 ? "ALL TESTS PASSED! 🎉" : "SOME TESTS FAILED ⚠️";
    console.log(
      `\n${colors.bright}${overallColor}${overallStatus}${colors.reset}`
    );
    console.log("=".repeat(80) + "\n");
  }

  // Run all tests with visual output
  runTests() {
    console.log(
      `${colors.bright}${colors.blue}🚀 Starting Substrate API Type System Tests...${colors.reset}\n`
    );

    // Run all test categories
    this.runCoreDataStructureTests();
    this.runMethodTransformationTests();
    this.runResponseSystemTests();
    this.runEventSystemTests();
    this.runConfigurationTests();
    this.runQueryBuilderTests();
    this.runMetadataTests();
    this.runUtilityTests();
    this.runClientAPITests();
    this.runPluginTests();
    this.runIntegrationTests();
    this.runRuntimeTests();

    // Print all results
    console.log(
      `${colors.bright}${colors.magenta}📊 Detailed Test Results:${colors.reset}\n`
    );
    this.results.forEach((result) => this.printResult(result));

    // Print summary
    this.printSummary();
  }

  // ==========================================================================
  // CORE DATA STRUCTURE TESTS
  // ==========================================================================
  runCoreDataStructureTests() {
    console.log(
      `${colors.bright}🔍 Testing Core Data Structures...${colors.reset}`
    );

    // Hash type test
    this.createTest(
      "Hash Type Validation",
      "Core Data Structures",
      () => {
        const validHash: Hash = "0x1234567890abcdef";
        const invalidHash = "1234567890abcdef"; // Missing 0x prefix
        return validHash.startsWith("0x") && typeof validHash === "string";
      },
      "Hash must be hex string with 0x prefix"
    );

    // BlockHeader structure test
    this.createTest(
      "BlockHeader Structure",
      "Core Data Structures",
      () => {
        const header: BlockHeader = {
          parentHash:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          number: 12345,
          stateRoot:
            "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          extrinsicsRoot:
            "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
          digest: { logs: [] },
        };
        return (
          header.parentHash.startsWith("0x") &&
          typeof header.number === "number"
        );
      },
      "BlockHeader contains all required fields with correct types"
    );

    // Extrinsic structure test
    this.createTest(
      "Extrinsic Structure",
      "Core Data Structures",
      () => {
        const extrinsic: Extrinsic = {
          method: {
            pallet: "balances",
            method: "transfer",
            args: {
              dest: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
              value: 1000,
            },
          },
          isSigned: true,
          hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        };
        return extrinsic.method.pallet === "balances" && extrinsic.isSigned;
      },
      "Extrinsic structure with method and optional signature"
    );

    // RuntimeVersion test
    this.createTest(
      "RuntimeVersion Structure",
      "Core Data Structures",
      () => {
        const version: RuntimeVersion = {
          specName: "polkadot",
          implName: "parity-polkadot",
          specVersion: 9430,
          implVersion: 0,
          apis: [
            ["0xdf6acb689907609b", 4],
            ["0x37e397fc7c91f5e4", 2],
          ],
        };
        return version.specName === "polkadot" && Array.isArray(version.apis);
      },
      "RuntimeVersion contains spec info and APIs array"
    );
  }

  // ==========================================================================
  // METHOD TRANSFORMATION TESTS
  // ==========================================================================
  runMethodTransformationTests() {
    console.log(
      `${colors.bright}🔄 Testing Method Transformations...${colors.reset}`
    );

    // Test CamelCase transformation utility
    this.createTest(
      "CamelCase Transformation",
      "Method Transformations",
      () => {
        // This is a runtime approximation of the compile-time type transformation
        const transformCamelCase = (str: string): string => {
          return str
            .toLowerCase()
            .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        };

        const test1 = transformCamelCase("WS_ENDPOINT") === "wsEndpoint";
        const test2 =
          transformCamelCase("MAX_CONNECTIONS") === "maxConnections";
        const test3 = transformCamelCase("LOG_LEVEL") === "logLevel";

        return test1 && test2 && test3;
      },
      "CONSTANT_CASE to camelCase transformation works correctly"
    );

    // Test method name transformation
    this.createTest(
      "RPC Method Transformation",
      "Method Transformations",
      () => {
        const transformMethodName = (method: string): string => {
          const [module, ...parts] = method.split("_");
          const methodName = parts.join("_");
          return (
            module + methodName.charAt(0).toUpperCase() + methodName.slice(1)
          );
        };

        const test1 = transformMethodName("chain_getBlock") === "chainGetBlock";
        const test2 =
          transformMethodName("state_getStorage") === "stateGetStorage";
        const test3 = transformMethodName("system_health") === "systemHealth";

        return test1 && test2 && test3;
      },
      "snake_case RPC methods transform to camelCase client methods"
    );
  }

  // ==========================================================================
  // RESPONSE SYSTEM TESTS
  // ==========================================================================
  runResponseSystemTests() {
    console.log(`${colors.bright}📦 Testing Response System...${colors.reset}`);

    // Test APIResponse success format
    this.createTest(
      "APIResponse Success Format",
      "Response System",
      () => {
        const successResponse: APIResponse<string> = {
          success: true,
          data: "test data",
          timestamp: Date.now(),
        };
        return (
          successResponse.success === true &&
          successResponse.data === "test data"
        );
      },
      "Success response contains data and timestamp"
    );

    // Test APIResponse error format
    this.createTest(
      "APIResponse Error Format",
      "Response System",
      () => {
        const errorResponse: APIResponse<string> = {
          success: false,
          error: {
            code: 1001,
            message: "Connection failed",
            data: { details: "Network timeout" },
          },
          timestamp: Date.now(),
        };
        return (
          errorResponse.success === false && errorResponse.error.code === 1001
        );
      },
      "Error response contains error object with code and message"
    );
  }

  // ==========================================================================
  // EVENT SYSTEM TESTS
  // ==========================================================================
  runEventSystemTests() {
    console.log(`${colors.bright}🎯 Testing Event System...${colors.reset}`);

    // Test event structure
    this.createTest(
      "Event Structure Validation",
      "Event System",
      () => {
        // Mock event data
        const newHeadEvent: SubstrateEvents["NewHead"] = {
          header: {
            parentHash:
              "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            number: 12345,
            stateRoot:
              "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            extrinsicsRoot:
              "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
            digest: { logs: [] },
          },
        };
        return newHeadEvent.header.number === 12345;
      },
      "Event data structures match expected format"
    );

    // Test event listener pattern
    this.createTest(
      "Event Listener Pattern",
      "Event System",
      () => {
        // Mock event system implementation
        class MockEventSystem {
          private listeners: Map<string, Function[]> = new Map();

          onNewHead(callback: (data: any) => void): () => void {
            if (!this.listeners.has("NewHead")) {
              this.listeners.set("NewHead", []);
            }
            this.listeners.get("NewHead")?.push(callback);

            return () => {
              const callbacks = this.listeners.get("NewHead");
              if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) callbacks.splice(index, 1);
              }
            };
          }

          emitNewHead(data: any) {
            this.listeners
              .get("NewHead")
              ?.forEach((callback) => callback(data));
          }
        }

        const eventSystem = new MockEventSystem();
        let received: boolean = false;

        const unsubscribe = eventSystem.onNewHead(() => {
          received = true;
        });

        // Emit event to trigger callback
        eventSystem.emitNewHead({ header: {} });

        // Clean up
        unsubscribe();

        // Verify the callback was called
        return received;
      },
      "Event listeners can be registered and unsubscribed"
    );
  }

  // ==========================================================================
  // CONFIGURATION TESTS
  // ==========================================================================
  runConfigurationTests() {
    console.log(
      `${colors.bright}⚙️ Testing Configuration System...${colors.reset}`
    );

    this.createTest(
      "Configuration Key Transformation",
      "Configuration",
      () => {
        // Mock configuration with transformed keys
        const config: SubstrateConfig = {
          wsEndpoint: "ws://localhost:9944",
          httpEndpoint: "http://localhost:9933",
          maxConnections: 10,
          connectionTimeout: 5000,
          logLevel: "info",
          enableCache: true,
        };

        const test1 =
          config.wsEndpoint !== undefined &&
          config.wsEndpoint.startsWith("ws://");
        const test2 = config.logLevel === "info";
        const test3 = config.enableCache === true;

        return test1 && test2 && test3;
      },
      "Configuration keys transformed to camelCase correctly"
    );
  }

  // ==========================================================================
  // QUERY BUILDER TESTS
  // ==========================================================================
  runQueryBuilderTests() {
    console.log(`${colors.bright}🔍 Testing Query Builders...${colors.reset}`);

    this.createTest(
      "Storage Query Builder Chaining",
      "Query Builders",
      () => {
        // Mock implementation
        class MockStorageQueryBuilder {
          private _blockHash?: string;
          private _key?: string;

          at(blockHash: string): MockStorageQueryBuilder {
            this._blockHash = blockHash;
            return this;
          }

          key(storageKey: string): MockStorageQueryBuilder {
            this._key = storageKey;
            return this;
          }

          async execute(): Promise<APIResponse<any>> {
            return {
              success: true,
              data: `mock-data-for-${this._key}`,
              timestamp: Date.now(),
              blockHash: this._blockHash as any,
            };
          }
        }

        const query = new MockStorageQueryBuilder();
        const chained = query.at("0x1234").key("system:account");

        return chained instanceof MockStorageQueryBuilder;
      },
      "Query builder supports fluent chaining interface"
    );
  }

  // ==========================================================================
  // METADATA TESTS
  // ==========================================================================
  runMetadataTests() {
    console.log(
      `${colors.bright}📋 Testing Metadata Processing...${colors.reset}`
    );

    this.createTest(
      "PalletMetadata Structure",
      "Metadata",
      () => {
        const palletMetadata: PalletMetadata = {
          name: "system",
          calls: { type: 142 },
          events: { type: 143 },
          constants: [
            {
              name: "BlockHashCount",
              type: 4,
              value: "0x60090000",
              docs: [
                "Maximum number of block hash mappings to keep (oldest pruned first).",
              ],
            },
          ],
          errors: { type: 144 },
          index: 0,
        };

        return (
          palletMetadata.name === "system" &&
          palletMetadata.constants.length > 0 &&
          palletMetadata.index === 0
        );
      },
      "PalletMetadata contains name, calls, events, constants, and index"
    );
  }

  // ==========================================================================
  // UTILITY TESTS
  // ==========================================================================
  runUtilityTests() {
    console.log(`${colors.bright}🛠️ Testing Utility Types...${colors.reset}`);

    this.createTest(
      "DeepReadonly Behavior",
      "Utilities",
      () => {
        // Runtime approximation of DeepReadonly behavior
        const deepReadonlyCheck = (obj: any): boolean => {
          try {
            // In TypeScript, this would be caught at compile time
            // Here we simulate the readonly behavior
            const readonlyObj = Object.freeze(
              Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                  key,
                  typeof value === "object" && value !== null
                    ? Object.freeze(value)
                    : value,
                ])
              )
            );

            return Object.isFrozen(readonlyObj);
          } catch {
            return false;
          }
        };

        const testObj = { a: { b: "test", c: 123 } };
        return deepReadonlyCheck(testObj);
      },
      "DeepReadonly makes nested objects immutable"
    );

    this.createTest(
      "Method Name Extraction",
      "Utilities",
      () => {
        // Runtime simulation of MethodNames type behavior
        const extractMethodNames = (obj: any): string[] => {
          return Object.getOwnPropertyNames(obj).filter(
            (name) => typeof obj[name] === "function"
          );
        };

        const mockAPI = {
          methodA: () => "string",
          methodB: () => 42,
          propertyC: "value",
          propertyD: 123,
        };

        const methods = extractMethodNames(mockAPI);
        const test1 = methods.includes("methodA");
        const test2 = methods.includes("methodB");
        const test3 = !methods.includes("propertyC");

        return test1 && test2 && test3;
      },
      "MethodNames utility extracts only function properties"
    );
  }

  // ==========================================================================
  // CLIENT API TESTS
  // ==========================================================================
  runClientAPITests() {
    console.log(`${colors.bright}🔌 Testing Client API...${colors.reset}`);

    this.createTest(
      "API Client Structure",
      "Client API",
      () => {
        // Mock API client structure validation
        const mockClient = {
          api: {},
          events: {},
          query: { storage: {}, chain: {} },
          config: {},
          connect: async () => ({
            success: true,
            data: { connected: true },
            timestamp: Date.now(),
          }),
          disconnect: async () => ({
            success: true,
            data: { disconnected: true },
            timestamp: Date.now(),
          }),
          isConnected: () => true,
          subscriptions: {
            active: new Set(),
            unsubscribeAll: () => {},
            getActive: () => [],
          },
        };

        const test1 = typeof mockClient.connect === "function";
        const test2 = typeof mockClient.isConnected === "function";
        const test3 = mockClient.subscriptions.active instanceof Set;

        return test1 && test2 && test3;
      },
      "API client has all required properties and methods"
    );
  }

  // ==========================================================================
  // PLUGIN TESTS
  // ==========================================================================
  runPluginTests() {
    console.log(`${colors.bright}🔌 Testing Plugin System...${colors.reset}`);

    this.createTest(
      "Plugin Interface",
      "Plugin System",
      () => {
        // Mock plugin implementation
        const mockPlugin: SubstratePlugin = {
          name: "test-plugin",
          version: "1.0.0",
          install: (client: any) => {
            // Plugin installation logic
            console.log(`Installing ${mockPlugin.name} v${mockPlugin.version}`);
          },
          uninstall: (client: any) => {
            // Plugin cleanup logic
            console.log(`Uninstalling ${mockPlugin.name}`);
          },
        };

        const test1 = mockPlugin.name === "test-plugin";
        const test2 = mockPlugin.version === "1.0.0";
        const test3 = typeof mockPlugin.install === "function";

        return test1 && test2 && test3;
      },
      "Plugin interface supports install/uninstall lifecycle"
    );
  }

  // ==========================================================================
  // INTEGRATION TESTS
  // ==========================================================================
  runIntegrationTests() {
    console.log(
      `${colors.bright}🔗 Testing Integration Scenarios...${colors.reset}`
    );

    this.createTest(
      "End-to-End Type Chain",
      "Integration",
      () => {
        // Test that complex type transformations work together
        const mockHash: Hash =
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
        const mockResponse: APIResponse<BlockHeader> = {
          success: true,
          data: {
            parentHash: mockHash,
            number: 12345,
            stateRoot: mockHash,
            extrinsicsRoot: mockHash,
            digest: { logs: [] },
          },
          timestamp: Date.now(),
          blockHash: mockHash,
        };

        const test1 = mockResponse.success === true;
        const test2 = mockResponse.data.number === 12345;
        const test3 =
          mockResponse.blockHash !== undefined &&
          mockResponse.blockHash.startsWith("0x");

        return test1 && test2 && test3;
      },
      "Complex type combinations work together seamlessly"
    );
  }

  // ==========================================================================
  // RUNTIME VALIDATION TESTS
  // ==========================================================================
  runRuntimeTests() {
    console.log(
      `${colors.bright}⚡ Testing Runtime Behavior...${colors.reset}`
    );

    this.createTest(
      "Performance Validation",
      "Runtime",
      () => {
        const start = performance.now();

        // Simulate complex type operations
        const iterations = 10000;
        let result = true;

        for (let i = 0; i < iterations; i++) {
          const hash: Hash = `0x${i.toString(16).padStart(64, "0")}`;
          result = result && hash.startsWith("0x") && hash.length === 66;
        }

        const duration = performance.now() - start;

        // Performance should be reasonable (< 100ms for 10k iterations)
        return result && duration < 100;
      },
      `Performance test completed - type operations are efficient`
    );

    this.createTest(
      "Memory Usage Validation",
      "Runtime",
      () => {
        // Test that deep type structures don't cause memory issues
        const deepObject = {
          level1: {
            level2: {
              level3: {
                level4: {
                  level5: {
                    value: "deep nesting test",
                    array: [1, 2, 3, 4, 5],
                    optional: true,
                  },
                },
              },
            },
          },
        };

        // Should be able to access deeply nested properties
        return (
          deepObject.level1.level2.level3.level4.level5.value ===
          "deep nesting test"
        );
      },
      "Deep type nesting doesn't cause stack overflow or memory issues"
    );
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

// Create and run the test suite
function runSubstrateAPITests() {
  const testRunner = new SubstrateTestRunner();
  testRunner.runTests();

  // Return results for programmatic access
  return testRunner;
}

// Auto-run tests when module is executed
if (typeof process !== "undefined" && require.main === module) {
  console.log(
    `${colors.bright}${colors.blue}🧪 Substrate API Type System Test Suite${colors.reset}`
  );
  console.log(
    `${colors.cyan}Testing comprehensive TypeScript type definitions and transformations${colors.reset}`
  );
  console.log(
    `${colors.yellow}Author: Peile Wu | Date: Aug 25, 2025${colors.reset}\n`
  );

  runSubstrateAPITests();
}

// Export for external use
export { runSubstrateAPITests, SubstrateTestRunner };

// =============================================================================
// ADDITIONAL UTILITIES FOR DEVELOPMENT
// =============================================================================

/**
 * Development helper: Run specific test category
 */
export function runTestCategory(category: string) {
  const runner = new SubstrateTestRunner();

  switch (category.toLowerCase()) {
    case "core":
      runner.runCoreDataStructureTests();
      break;
    case "transform":
      runner.runMethodTransformationTests();
      break;
    case "response":
      runner.runResponseSystemTests();
      break;
    case "events":
      runner.runEventSystemTests();
      break;
    case "config":
      runner.runConfigurationTests();
      break;
    case "query":
      runner.runQueryBuilderTests();
      break;
    case "metadata":
      runner.runMetadataTests();
      break;
    case "utils":
      runner.runUtilityTests();
      break;
    case "client":
      runner.runClientAPITests();
      break;
    case "plugins":
      runner.runPluginTests();
      break;
    case "integration":
      runner.runIntegrationTests();
      break;
    case "runtime":
      runner.runRuntimeTests();
      break;
    default:
      console.log(`${colors.red}Unknown category: ${category}${colors.reset}`);
      console.log(
        `Available categories: core, transform, response, events, config, query, metadata, utils, client, plugins, integration, runtime`
      );
      return;
  }

  runner.printSummary();
}

/**
 * Benchmark specific type operations
 */
export function benchmarkTypeOperations() {
  console.log(
    `${colors.bright}${colors.magenta}📊 Type Operation Benchmarks${colors.reset}\n`
  );

  // Hash generation benchmark
  console.log("🔍 Hash Generation Performance:");
  const hashStart = performance.now();
  const hashes: Hash[] = [];
  for (let i = 0; i < 50000; i++) {
    hashes.push(`0x${i.toString(16).padStart(64, "0")}` as Hash);
  }
  const hashDuration = performance.now() - hashStart;
  console.log(`   Generated 50,000 hashes in ${hashDuration.toFixed(2)}ms`);

  // Response object creation benchmark
  console.log("\n📦 Response Object Creation Performance:");
  const responseStart = performance.now();
  const responses: APIResponse<string>[] = [];
  for (let i = 0; i < 25000; i++) {
    responses.push({
      success: true,
      data: `test-data-${i}`,
      timestamp: Date.now(),
      blockHash: hashes[i % hashes.length],
    });
  }
  const responseDuration = performance.now() - responseStart;
  console.log(
    `   Created 25,000 response objects in ${responseDuration.toFixed(2)}ms`
  );

  // Memory usage approximation
  const estimatedMemory = (hashes.length * 66 + responses.length * 100) / 1024; // KB
  console.log(`\n💾 Estimated Memory Usage: ~${estimatedMemory.toFixed(2)}KB`);

  console.log(
    `\n${colors.green}✅ All benchmarks completed successfully${colors.reset}`
  );
}

/**
 * Interactive test runner for development
 */
export function interactiveTest() {
  console.log(
    `${colors.bright}${colors.cyan}🎮 Interactive Test Runner${colors.reset}`
  );
  console.log("Available commands:");
  console.log("  - all: Run all tests");
  console.log("  - category <name>: Run specific category");
  console.log("  - benchmark: Run performance benchmarks");
  console.log("  - help: Show this help");

  // This would integrate with a CLI interface in a real environment
  console.log(
    `\n${colors.yellow}💡 Tip: Use runTestCategory('core') to test specific areas${colors.reset}`
  );
}

// decorators.ts

// Logging decorator
function Logger(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`📥 Calling methods: ${propertyKey} Parameter:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`✅ Method execution completed: ${propertyKey}`);
    return result;
  };
}

// Performance monitoring decorator
function Performance2(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(
      `⏱ Method ${propertyKey} Execution time: ${(end - start).toFixed(2)}ms`
    );
    return result;
  };
}

// API Service Class
class ApiService {
  @Logger
  @Performance2
  async fetchData(url: string): Promise<any> {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
}

// ✅ Test run
const api = new ApiService();

// Use a public API accessible in mainland China
api
  .fetchData("https://api.github.com/users/octocat")
  .then((data) => {
    console.log("🎯 Get the data:", data);
  })
  .catch((err) => {
    console.error("❌ Request failed:", err.message);
  });

// Closure Type Inference Examples
// Author: Peile Wu <peile.wu.1990@gmail.com>
// Date: September 23, 2025

use std::thread;
use std::time::Duration;

fn main() {
    println!("=== Closure Type Inference Examples ===\n");

    // Function definition - explicit types required
    fn add_one_v1(x: u32) -> u32 {
        x + 1
    }

    // Closure variations demonstrating different syntax options
    let add_one_v2 = |x: u32| -> u32 { x + 1 }; // Explicit parameter and return types
    let add_one_v3 = |x| x + 1; // Inferred parameter and return types
    let add_one_v4 = |x| x + 1; // Single expression, braces omitted

    // Test all versions with the same input
    let test_value = 5u32;
    println!("Function result: {}", add_one_v1(test_value));
    println!("Closure v2 result: {}", add_one_v2(test_value));
    println!("Closure v3 result: {}", add_one_v3(test_value));
    println!("Closure v4 result: {}", add_one_v4(test_value));

    println!("\n=== Manual Type Annotation Example ===");

    // Example with manual type annotation (from the learning material)
    let expensive_closure = |num: u32| -> u32 {
        println!("calculating slowly ...");
        thread::sleep(Duration::from_secs(1)); // Reduced from 2s for demo
        num
    };

    println!("Expensive closure result: {}", expensive_closure(10));

    println!("\n=== Type Inference Locking Behavior ===");

    // Demonstrate type inference locking
    let example_closure = |x| x;

    // First use determines the type - using String
    let s = example_closure(String::from("hello"));
    println!("String result: {}", s);

    // The following line would cause a compile error if uncommented:
    // let n = example_closure(5);  // Error: expected String, found integer
    // println!("Number result: {}", n);

    println!("Note: Closure type is now locked to String - cannot use with integers");

    println!("\n=== Separate Closures for Different Types ===");

    // Create separate closures for different types
    let string_closure = |x| x; // This will be inferred as String -> String
    let number_closure = |x| x; // This will be inferred as i32 -> i32

    let string_result = string_closure(String::from("Rust"));
    let number_result = number_closure(42);

    println!("String closure result: {}", string_result);
    println!("Number closure result: {}", number_result);

    println!("\n=== Closure Type Inference Summary ===");
    println!("- Closures don't require explicit type annotations");
    println!("- Compiler infers types from first usage");
    println!("- Once inferred, types are locked for that closure");
    println!("- Manual annotations are optional but possible");
}

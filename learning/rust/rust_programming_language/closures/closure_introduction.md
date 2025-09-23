# Rust Closures Introduction

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 23, 2025

## Overview

Closures are one of Rust's functional programming features that significantly influence the language design. This document introduces closures through practical examples and demonstrates their usage in real code, including advanced patterns like memoization using generic parameters and Fn traits.

## What are Closures?

Closures are **anonymous functions that can capture values from their surrounding environment**. They represent a key functional programming concept in Rust.

## Key Characteristics of Closures

### 1. Anonymous Functions

- Closures are functions without explicit names
- They can be stored in variables for later execution

### 2. Flexible Usage Patterns

- **Pass as parameters** to other functions
- **Return as values** from other functions
- **Assign to variables** for deferred execution

### 3. Environment Capture

- Can **capture values** from their defining scope
- Enable **cross-context execution** - create in one place, call in another
- Maintain access to captured variables even after original scope ends

## Functional Programming Impact on Rust

Rust's functional programming features include:

1. **Functions as first-class citizens** - can be passed as parameters
2. **Higher-order functions** - functions that return other functions
3. **Variable assignment** - storing functions in variables for later execution

## Storing Closures with Generic Parameters and Fn Traits

### Creating a Struct that Holds Closures and Caches Results

One powerful pattern is creating a structure that holds a closure and caches its execution result. This implements:

- **Lazy evaluation**: Only executes the closure when needed (first call)
- **Memoization**: Caches the result for future use
- **Performance optimization**: Expensive calculations run only once

### The Challenge: How to Let Struct Hold Closures

When defining a struct, we need to know all field types, but closures present unique challenges:

- Each closure instance has its own **unique anonymous type**
- Even closures with identical signatures have different types
- Solution: Use **generic parameters** and **trait bounds**

### Fn Traits Overview

The standard library provides Fn traits that all closures implement at least one of:

- **`Fn`**: Can be called multiple times without mutating captured values
- **`FnMut`**: Can be called multiple times and may mutate captured values
- **`FnOnce`**: Can be called only once, may consume captured values

### Cacher Implementation Example

```rust
struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calculation: T,        // The closure to cache
    value: Option<u32>,    // Cached result (None before first execution)
}

impl<T> Cacher<T>
where
    T: Fn(u32) -> u32,
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: None,
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value {
            Some(v) => v,     // Return cached value if available
            None => {
                // Execute closure, cache and return result
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            }
        }
    }
}
```

### How the Caching Works

1. **Initial State**: `value` field is `None` before any execution
2. **First Call**: Execute the closure, store result in `value` field as `Some(result)`
3. **Subsequent Calls**: Return cached value directly without re-executing closure
4. **Performance Benefit**: Expensive calculation runs only once regardless of how many times `value()` is called

## Practical Example: Workout Generator with Caching

### Updated Implementation

```rust
fn generate_workout(intensity: u32, random_number: u32) {
    // Create a caching closure that only runs expensive calculation once
    let mut expensive_closure = Cacher::new(|num| {
        println!("calculating slowly ...");
        thread::sleep(Duration::from_secs(2));
        num
    });

    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            expensive_closure.value(intensity)  // First call: executes closure
        );

        println!(
            "Next, do {} situps!",
            expensive_closure.value(intensity)   // Second call: uses cached result
        );
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!(
                "Today, run for {} minutes!",
                expensive_closure.value(intensity)
            );
        }
    }
}
```

### Execution Output

![Closure Execution Result](img/using_closure.png)

The program execution demonstrates the caching behavior - notice that "calculating slowly ..." appears only once even though the closure result is used multiple times.

### Key Improvements Over Basic Closure

| Aspect              | Basic Closure                   | Cached Closure                       |
| ------------------- | ------------------------------- | ------------------------------------ |
| **Execution Count** | Runs every time it's called     | Runs only on first call              |
| **Performance**     | Repeated expensive calculations | One-time calculation, cached results |
| **Memory Usage**    | No state storage                | Minimal state for caching            |
| **Use Case**        | Simple, cheap operations        | Expensive, deterministic operations  |

## Cacher Implementation Limitations

### Current Limitations

1. **Single Parameter Assumption**: The current `Cacher` assumes the same input will always produce the same output
2. **Type Constraints**: Only accepts `u32` parameter and returns `u32` value

### Potential Improvements

#### 1. Multiple Parameter Support with HashMap

Instead of caching a single value, use a HashMap to cache results for different inputs:

```rust
use std::collections::HashMap;

struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calculation: T,
    values: HashMap<u32, u32>,  // key: input arg, value: result
}

impl<T> Cacher<T>
where
    T: Fn(u32) -> u32,
{
    fn value(&mut self, arg: u32) -> u32 {
        match self.values.get(&arg) {
            Some(&result) => result,
            None => {
                let result = (self.calculation)(arg);
                self.values.insert(arg, result);
                result
            }
        }
    }
}
```

#### 2. Generic Type Parameters for Flexibility

Support different parameter and return types using multiple generic parameters:

```rust
struct Cacher<T, P, R>
where
    T: Fn(P) -> R,
    P: Copy + Eq + std::hash::Hash,
    R: Copy,
{
    calculation: T,
    values: HashMap<P, R>,
}
```

This allows closures like:

- `|x: String| -> usize { x.len() }`
- `|x: f64| -> f64 { x * x }`
- `|x: &str| -> String { x.to_uppercase() }`

## Closure Type Inference

### Key Differences from Functions

Unlike functions defined with `fn`, closures do **not require explicit type annotations** for parameters and return values. This design difference exists because:

- **Functions** are part of explicit public interfaces exposed to users, helping establish consensus on parameter and return value types
- **Closures** are stored in variables and used in narrow contexts without being exposed to library users
- **Compiler inference** works well for closures due to their typically short and contextual nature

### Manual Type Annotations (Optional)

You can still manually add type annotations when needed:

```rust
let expensive_closure = |num: u32| -> u32 {
    println!("calculating slowly ...");
    thread::sleep(Duration::from_secs(2));
    num
};
```

### Function vs Closure Syntax Comparison

**Function Definition:**

```rust
fn add_one_v1(x: u32) -> u32 { x + 1 }  // Explicit parameter and return types
```

**Closure Variations:**

```rust
let add_one_v2 = |x: u32| -> u32 { x + 1 };  // Explicit parameter and return types
let add_one_v3 = |x| { x + 1 };              // Inferred parameter and return types
let add_one_v4 = |x| x + 1;                  // Single expression, braces can be omitted
```

### Type Inference Behavior

**Important**: Closures eventually infer **only one specific type** for parameters and return values:

```rust
fn main() {
    let example_closure = |x| x;  // Error: cannot infer concrete type before use

    // let s = example_closure(String::from("hello"));  // First use determines type as String
    // let n = example_closure(5);  // Error: type mismatch - expected String, found integer
}
```

Once a closure is used with a specific type, the compiler locks in that type for all future uses.

## Closure vs Regular Functions

| Aspect           | Regular Function                          | Closure                       |
| ---------------- | ----------------------------------------- | ----------------------------- |
| **Name**         | Named (`simulated_expensive_calculation`) | Anonymous                     |
| **Definition**   | `fn name() {}`                            | `\|params\| {}`               |
| **Scope Access** | Limited to parameters                     | Can capture environment       |
| **Storage**      | Cannot be stored in variables directly    | Can be assigned to variables  |
| **Caching**      | Manual implementation required            | Easy integration with structs |

## Advanced Patterns and Use Cases

### 1. Memoization Pattern

Perfect for expensive calculations that may be called multiple times with the same inputs.

### 2. Lazy Evaluation

Defer computation until actually needed, improving performance for conditional code paths.

### 3. Configuration Closures

Store configuration logic that can be applied consistently across different contexts.

### 4. Event Handlers

Cache callback functions that respond to events without re-creating handler logic.

## Benefits of Cached Closures

1. **Performance Optimization**: Expensive operations execute only once
2. **Memory Efficiency**: Store results rather than recompute
3. **Code Reusability**: Same caching pattern works across different closure types
4. **Maintainability**: Centralized caching logic in reusable struct
5. **Type Safety**: Compile-time guarantees through generic constraints

## Conclusion

Closures provide a powerful way to write more functional and flexible Rust code. The combination of closures with generic parameters and Fn traits enables sophisticated patterns like memoization and lazy evaluation. Key takeaways:

- **Environment capture** for accessing surrounding scope
- **Anonymous function definition** for inline logic
- **Variable storage** for reusable function objects
- **Caching capabilities** through struct-based memoization
- **Type flexibility** via generic parameters and trait bounds
- **Performance benefits** from lazy evaluation patterns

The evolution from basic closures to cached implementations demonstrates Rust's power in combining functional programming concepts with systems-level performance optimizations. This makes closures not just syntactic conveniences, but fundamental tools for building efficient, maintainable applications.

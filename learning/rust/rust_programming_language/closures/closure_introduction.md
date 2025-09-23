# Rust Closures Introduction

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 23, 2025

## Overview

Closures are one of Rust's functional programming features that significantly influence the language design. This document introduces closures through practical examples and demonstrates their usage in real code.

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

## Practical Example: Workout Generator

Let's examine a practical implementation using closures:

### Execution Output

![Closure Execution Result](img/using_closure.png)

The program execution demonstrates the closure in action with the following output showing the simulated expensive calculations being performed.

### Implementation Analysis

```rust
fn generate_workout(intensity: u32, random_number: u32) {
    // Closure definition: anonymous function stored in a variable
    let expensive_closure = |num| {
        println!("calculating slowly ...");
        thread::sleep(Duration::from_secs(2));
        num
    };

    // Closure usage in conditional logic
    if intensity < 25 {
        println!("Today, do {} pushups!", expensive_closure(intensity));
        println!("Next, do {} situps!", expensive_closure(intensity));
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!("Today, run for {} minutes!", expensive_closure(intensity));
        }
    }
}
```

### Key Implementation Points

1. **Closure Syntax**: `|num| { /* body */ }` - parameters between pipes `|`
2. **Variable Storage**: `let expensive_closure = |num| {...};` - stored as a variable
3. **Reusability**: The same closure is called multiple times with different contexts
4. **Statement Termination**: Closure definition ends with semicolon as it's a statement

### Runtime Execution

The program demonstrates closure behavior through simulated expensive calculations:

- **Input Parameters**: `intensity = 10`, `random_number = 7`
- **Execution Flow**: Since intensity < 25, both pushup and situp calculations execute
- **Output**: Each closure call triggers the 2-second delay simulation

## Closure vs Regular Functions

| Aspect           | Regular Function                          | Closure                      |
| ---------------- | ----------------------------------------- | ---------------------------- |
| **Name**         | Named (`simulated_expensive_calculation`) | Anonymous                    |
| **Definition**   | `fn name() {}`                            | `\|params\| {}`              |
| **Scope Access** | Limited to parameters                     | Can capture environment      |
| **Storage**      | Cannot be stored in variables directly    | Can be assigned to variables |

## Benefits in This Example

1. **Code Reusability**: Single closure definition used multiple times
2. **Maintainability**: Changes to expensive calculation logic in one place
3. **Flexibility**: Easy to modify or replace the closure implementation
4. **Performance Consistency**: Same calculation method across all calls

## Conclusion

Closures provide a powerful way to write more functional and flexible Rust code. They enable:

- **Environment capture** for accessing surrounding scope
- **Anonymous function definition** for inline logic
- **Variable storage** for reusable function objects
- **Cross-context execution** for flexible program flow

This workout generator example demonstrates how closures can replace traditional function calls while providing additional flexibility and maintaining clean, readable code structure.

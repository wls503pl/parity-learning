# Rust Match Control Flow Examples

This project demonstrates various uses of Rust's `match` control flow operator and `if let` expressions, showing how to handle pattern matching, value extraction, and exhaustive matching scenarios.

## Overview

The `match` operator in Rust allows a value to be matched against a series of patterns, executing code corresponding to the matching pattern. Patterns can be literal values, variable names, wildcards, and more complex structures.

## Table of Contents

- [Basic Match with Enum](#1-basic-match-with-enum)
- [Pattern Binding - Extracting Values](#2-pattern-binding---extracting-values)
- [Matching Option\<T\>](#3-matching-optiont)
- [Exhaustive Matching with Wildcard](#4-exhaustive-matching-with-wildcard)
- [if let vs match Comparison](#5-if-let-vs-match-comparison)
- [Complex if let Patterns](#6-complex-if-let-patterns)
- [Optional String Processing](#7-optional-string-processing)
- [Running the Examples](#running-the-examples)

## Examples and Output

### 1. Basic Match with Enum

**Code:**

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

**Output:**

```
1. Basic Match with Enum:
Lucky penny!
Penny value: 1 cents
Quarter value: 25 cents
```

### 2. Pattern Binding - Extracting Values

**Code:**

```rust
enum CoinWithState {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents_with_state(coin: CoinWithState) -> u8 {
    match coin {
        CoinWithState::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
        // ... other patterns
    }
}
```

**Output:**

```
2. Pattern Binding - Extracting Values:
State quarter from Alaska!
Alaska quarter value: 25 cents
State quarter from Texas!
Texas quarter value: 25 cents
```

### 3. Matching Option<T>

**Code:**

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn describe_option(x: Option<i32>) {
    match x {
        None => println!("No value present"),
        Some(value) => println!("Value is: {}", value),
    }
}
```

**Output:**

```
3. Matching Option<T>:
Value is: 5
Value is: 6
No value present
```

### 4. Exhaustive Matching with Wildcard

**Code:**

```rust
fn process_number(v: u8) {
    match v {
        1 => println!("One"),
        3 => println!("Three"),
        5 => println!("Five"),
        7 => println!("Seven"),
        _ => println!("Something else"), // Wildcard - must be last
    }
}
```

**Output:**

```
4. Exhaustive Matching with Wildcard:
One
Something else
Three
Something else
Five
Something else
Seven
Something else
```

### 5. if let vs match Comparison

**Code:**

```rust
// Using match for single pattern
fn check_specific_value_match(v: Option<u8>) {
    match v {
        Some(3) => println!("Found three with match!"),
        _ => println!("Not three or no value"),
    }
}

// Using if let for the same logic
fn check_specific_value_if_let(v: Option<u8>) {
    if let Some(3) = v {
        println!("Found three with if let!");
    } else {
        println!("Not three or no value");
    }
}
```

**Output:**

```
5. if let vs match comparison:
Testing Some(1): Not three or no value
Testing Some(3): Found three with match!
Testing Some(5): Not three or no value
Testing None: Not three or no value

Testing Some(1): Not three or no value
Testing Some(3): Found three with if let!
Testing Some(5): Not three or no value
Testing None: Not three or no value
```

### 6. Complex if let Patterns

**Code:**

```rust
fn process_coin_if_let(coin: CoinWithState) {
    // Only care about quarters from Alaska
    if let CoinWithState::Quarter(UsState::Alaska) = coin {
        println!("Alaska quarter found!");
    } else {
        println!("Not an Alaska quarter");
    }
}
```

**Output:**

```
6. Complex if let patterns:
Alaska quarter found!
Not an Alaska quarter
Not an Alaska quarter
Not an Alaska quarter
```

### 7. Optional String Processing

**Code:**

```rust
fn extract_some_value(opt: Option<String>) {
    if let Some(text) = opt {
        println!("Text content: {}", text);
    }
    // No else clause needed if we don't care about None case
}
```

**Output:**

```
7. Optional string processing:
Text content: Hello, World!
Text content: Rust is awesome!
```

## Key Concepts

### Match vs if let

| Feature            | `match`                                   | `if let`                                      |
| ------------------ | ----------------------------------------- | --------------------------------------------- |
| **Exhaustiveness** | Must handle all possible patterns         | Only handles the pattern you care about       |
| **Code Volume**    | More verbose for single patterns          | Less code, less indentation                   |
| **Use Case**       | When you need to handle multiple patterns | When you only care about one specific pattern |
| **Template Code**  | More boilerplate for simple cases         | Minimal boilerplate                           |

### Pattern Types

1. **Literal Values**: `1`, `"hello"`, `true`
2. **Variable Binding**: `Some(x)`, `Quarter(state)`
3. **Wildcards**: `_` (matches anything)
4. **Multiple Patterns**: `1 | 2 | 3`
5. **Range Patterns**: `1..=5`
6. **Struct/Enum Destructuring**: `Point { x, y }`

### Important Rules

- **Exhaustive Matching**: `match` expressions must cover all possible values
- **Order Matters**: Patterns are checked from top to bottom
- **Wildcard Placement**: `_` patterns must come last
- **Move Semantics**: Values are moved into match arms unless borrowed

## Running the Examples

To run this code:

```bash
# Clone or download the repository
# Navigate to the project directory
cargo run

### Complete Expected Output Text:

=== Rust Match Control Flow Examples ===

1. Basic Match with Enum:
Lucky penny!
Penny value: 1 cents
Quarter value: 25 cents

2. Pattern Binding - Extracting Values:
State quarter from Alaska!
Alaska quarter value: 25 cents
State quarter from Texas!
Texas quarter value: 25 cents

3. Matching Option<T>:
Value is: 5
Value is: 6
No value present

4. Exhaustive Matching with Wildcard:
One
Something else
Three
Something else
Five
Something else
Seven
Something else

5. if let vs match comparison:
Testing Some(1): Not three or no value
Testing Some(3): Found three with match!
Testing Some(5): Not three or no value
Testing None: Not three or no value

Testing Some(1): Not three or no value
Testing Some(3): Found three with if let!
Testing Some(5): Not three or no value
Testing None: Not three or no value

6. Complex if let patterns:
Alaska quarter found!
Not an Alaska quarter
Not an Alaska quarter
Not an Alaska quarter

7. Optional string processing:
Text content: Hello, World!
Text content: Rust is awesome!
```

## Advanced Features

The code also includes examples of:

- **Match Guards**: Conditional matching with `if` expressions
- **Multiple Patterns**: Using `|` to match multiple values
- **Range Patterns**: Matching ranges of values with `..=`

## Best Practices

1. **Use `match` when you need exhaustive handling**
2. **Use `if let` for single-pattern scenarios**
3. **Place more specific patterns before general ones**
4. **Use `_` to handle remaining cases explicitly**
5. **Consider performance implications of pattern complexity**

## Requirements

- Rust 1.0+ (uses standard library features only)
- No external dependencies

This comprehensive example demonstrates the power and flexibility of Rust's pattern matching system, showing how it enables safe, expressive, and efficient code.

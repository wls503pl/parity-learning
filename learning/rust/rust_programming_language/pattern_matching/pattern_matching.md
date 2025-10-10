# Pattern Matching in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 10, 2025

---

## Overview

Pattern matching is a special syntax in Rust used for matching structures of both complex and simple types. By combining patterns with match expressions and other constructs, you gain better control over your program's control flow.

## Pattern Composition

Patterns are composed of combinations of the following elements:

- Literals
- Destructured arrays, enums, structs, and tuples
- Variables
- Wildcards
- Placeholders

To use a pattern, you compare it against a value. If the pattern matches, you can use the corresponding parts of that value in your code.

---

## Places Where Patterns Can Be Used

### 1. Match Arms

The `match` expression allows you to compare a value against a series of patterns:

```rust
match VALUE {
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
}
```

**Match Expression Requirements:**

- Must be exhaustive (cover all possible cases)
- Use the special pattern `_` (underscore) to match anything without binding to a variable
- The `_` pattern is typically used as the last arm or to ignore certain values

### 2. Conditional `if let` Expressions

The `if let` expression is primarily a shorthand way to handle a single match case, serving as an equivalent to a `match` with only one matching arm.

**Features:**

- Can optionally include `else`, `else if`, and `else if let` clauses
- Does **not** check for exhaustiveness

**Example:**

```rust
fn main() {
    let favorite_color: Option<&str> = None;
    let is_Tuesday = false;
    let age: Result<u8, _> = "34".parse();

    if let Some(color) = favorite_color {
        println!("Using your favorite color, {}, as the background", color);
    } else if is_Tuesday {
        println!("Tuesday is green day!");
    } else if let Ok(age) = age {
        if age > 30 {
            println!("Using purple as the background color");
        } else {
            println!("Using orange as the background color");
        }
    } else {
        println!("Using blue as the background color");
    }
}
```

### 3. `while let` Conditional Loops

The `while let` construct allows a while loop to run as long as a pattern continues to match.

**Example:**

```rust
fn main() {
    let mut stack = Vec::new();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
}
```

This loop continues popping elements from the stack until `pop()` returns `None`.

### 4. `for` Loops

The `for` loop is the most common loop construct in Rust. In a `for` loop, the pattern is the value that follows the `for` keyword.

**Example:**

```rust
fn main() {
    let v = vec!['a', 'b', 'c'];

    for (index, value) in v.iter().enumerate() {
        println!("{} is at index {}", value, index);
    }
}
```

Here, `(index, value)` is a pattern that destructures the tuple returned by `enumerate()`.

### 5. `let` Statements

The `let` statement itself is a pattern:

```rust
let PATTERN = EXPRESSION;
```

**Examples:**

```rust
fn main() {
    let a = 5;
    let (x, y, z) = (1, 2, 3);
}
```

In the second example, the tuple pattern `(x, y, z)` destructures the tuple `(1, 2, 3)`.

### 6. Function Parameters

Function parameters can also be patterns, allowing for destructuring directly in the function signature.

**Examples:**

```rust
fn foo(x: i32) {
    // x is a simple pattern
}

fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Current location: ({}, {})", x, y);
}

fn main() {
    let point = (3, 5);
    print_coordinates(&point);
}
```

The `print_coordinates` function destructures the tuple reference directly in its parameter list.

---

## Summary

Pattern matching is a powerful feature in Rust that enables:

- Cleaner, more expressive code
- Safe destructuring of complex data types
- Better control flow management
- Compile-time exhaustiveness checking (in `match` expressions)

By understanding and utilizing patterns in various contexts—from `match` expressions to function parameters—you can write more idiomatic and robust Rust code.

---

## Project Structure

```
pattern_matching/
├── src/
│   ├── for.rs
│   ├── function_parameters.rs
│   ├── if_let.rs
│   └── while_let.rs
├── target/
├── Cargo.lock
└── Cargo.toml
```

Each example file demonstrates a specific use case of pattern matching in Rust.

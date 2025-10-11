# Pattern Matching in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 11, 2025

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

## Refutability: Whether Patterns Might Fail to Match

**Update Date:** October 11, 2025

### Two Forms of Patterns

**Refutable Patterns:**

- Patterns that can fail to match for some possible values
- Example: `if let Some(x) = a_value;` - if `a_value` is `None`, the pattern fails to match

**Irrefutable Patterns:**

- Patterns that match any possible value passed to them
- Example: `let x = 5;` - this always matches

### Pattern Requirements by Context

**Contexts that accept ONLY irrefutable patterns:**

- Function parameters
- `let` statements
- `for` loops

**Contexts that accept BOTH refutable and irrefutable patterns:**

- `if let` expressions
- `while let` expressions
- Note: Using an irrefutable pattern in these contexts will trigger a compiler warning about possible failure

### Common Error: Refutable Pattern in `let` Statement

```rust
fn main() {
    let a: Option<i32> = Some(5);
    let Some(x) = a;  // ERROR: refutable pattern in local binding
}
```

**Error Explanation:**

- Since `a` could be `None`, and `let` statements require irrefutable patterns
- `Some(x)` is refutable, causing a compilation error
- The compiler error: `refutable pattern in local binding`
- Note: `pattern 'None' not covered`

**Solution 1: Use `if let`**

```rust
if let Some(x) = a {
    // Handle the Some case
}
```

**Solution 2: Use `let else`**

```rust
let Some(x) = a else { todo!() };
```

### Warning: Irrefutable Pattern in `if let`

If you use an irrefutable pattern with `if let`, the compiler will warn you:

```rust
if let x = 5 {
    // Warning: irrefutable pattern in if let
}
```

This should just be a regular `let` statement instead.

---

## Updated Project Structure

```
pattern_matching/
├── img/
│   └── refutable_error.png
├── src/
│   ├── for.rs
│   ├── function_parameters.rs
│   ├── if_let.rs
│   ├── refutability.rs
│   └── while_let.rs
├── target/
├── Cargo.lock
├── Cargo.toml
└── pattern_matching.md
```

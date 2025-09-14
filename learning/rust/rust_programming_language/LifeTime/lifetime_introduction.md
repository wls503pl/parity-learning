# Rust Lifetime Introduction

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 14, 2025

# Part 1

## What is Lifetime?

Every reference in Rust has its own **lifetime**.

**Lifetime**: the scope for which a reference remains valid.

- Most of the time: lifetimes are implicit and can be inferred
- When reference lifetimes may relate to each other in different ways: manual lifetime annotation is required
- Main goal of lifetimes: **prevent dangling references**

## Dangling Reference Problem

```rust
fn main() {
    let r;              // r declared without initialization

    {
        let x = 5;
        r = &x;         // Error: borrowed value does not live long enough
    }                   // x is dropped here while still borrowed

    println!("r: {}", r); // borrow later used here
}
```

**Execution flow:**

1. Declare `r` in outer scope (uninitialized)
2. Enter inner scope `{}`
3. Create variable `x = 5`
4. Let `r` reference `x`'s memory address: `r = &x`
5. Leave inner scope, `x` is destroyed
6. Try to print `r`, but the memory `r` points to is now invalid

**Rust compiler error:**

```
error[E0597]: `x` does not live long enough
 --> src/main.rs:6:9
  |
6 |     r = &x;
  |         ^^ borrowed value does not live long enough
7 |     }
  |       - `x` dropped here while still borrowed
8 |     println!("r: {}", r);
  |                       - borrow later used here
```

## Core Concept

This example demonstrates Rust's **lifetime** concept:

- `x`'s lifetime is limited to the inner scope
- `r`'s lifetime extends to the outer scope
- Rust doesn't allow a reference's lifetime to exceed the lifetime of the referenced object

We can name the lifetimes of `r` and `x` as `'a` and `'b` respectively:

- `r` has lifetime `'a` (longer)
- `x` has lifetime `'b` (shorter)

During compilation, Rust compiler compares the lengths of `'a` and `'b`, finds that `r`'s lifetime (`'a`) points to `x`'s lifetime (`'b`), but the referenced object `x` has a shorter lifetime than its reference `r`, so compilation fails.

**Solution**: Make `'b` no shorter than `'a` by moving `x`'s definition before `r`.

## Generic Lifetimes in Functions

```rust
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}

fn longest(x: &str, y: &str) -> &str {  // Error: missing lifetime specifier
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

Although the logic is simple, this code produces an error because the compiler doesn't know the lifetimes of parameters `x` and `y`.

**Solution**: Add a generic lifetime parameter

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

This indicates that the return type and both `x` and `y` have the same lifetime `'a`.

## Key Points

- Lifetimes ensure memory safety by preventing dangling references
- Most lifetimes are inferred automatically by the compiler
- Manual lifetime annotation is needed when the compiler cannot determine the relationship between references
- Lifetime parameters describe the relationship between references, not their actual duration
- The `'a` syntax is used to name lifetime parameters

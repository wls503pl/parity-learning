# Vector Introduction in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 8, 2025

## Table of Contents
1. [Overview](#overview)
2. [Common Collections](#common-collections)
3. [Creating Vectors](#creating-vectors)
4. [Updating Vectors](#updating-vectors)
5. [Reading Vector Elements](#reading-vector-elements)
6. [Ownership and Borrowing Rules](#ownership-and-borrowing-rules)
7. [Iterating Over Vectors](#iterating-over-vectors)
8. [Memory Management](#memory-management)
9. [Code Examples](#code-examples)

## Overview

Vectors are one of the most commonly used collections in Rust. Unlike arrays and tuples that are stored on the stack, vectors store their data on the heap, which means their size doesn't need to be known at compile time and can grow or shrink during runtime.

## Common Collections

Rust provides several built-in collections that store data on the heap:

- **Vector (`Vec<T>`)** - Stores multiple values of the same type
- **String** - UTF-8 encoded text
- **HashMap** - Key-value pairs

## Creating Vectors

### Method 1: Using `Vec::new()`

```rust
fn main() {
    // Creates an empty vector - Rust cannot infer the type automatically
    let v: Vec<i32> = Vec::new();
}
```

### Method 2: Using the `vec!` macro (More Common)

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];
}
```

The `vec!` macro is more commonly used because it allows you to create a vector with initial values, and Rust can automatically infer the type from the initial values.

## Updating Vectors

To add elements to a vector, use the `push` method:

```rust
fn main() {
    let mut v = Vec::new();
    
    // The type is inferred from the first element added
    v.push(1);
    v.push(2);
    v.push(3);
}
```

**Note:** The vector must be declared as `mut` (mutable) to modify it.

## Reading Vector Elements

There are two main ways to access elements in a vector:

### Method 1: Indexing with `[]`

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];
    let third: &i32 = &v[2];
    println!("The third element is {}", third);
}
```

### Method 2: Using the `get` method

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];
    
    match v.get(2) {
        Some(third) => println!("The 3rd element is {}", third),
        None => println!("There is no 3rd element"),
    }
}
```

### Handling Out-of-Bounds Access

The two methods handle invalid indices differently:

- **Indexing (`&v[index]`)**: Causes a **panic** if the index is out of bounds
- **`get` method**: Returns `None` if the index is out of bounds (safer approach)

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];
    
    // This will panic!
    // let element = &v[100];
    
    // This is safe
    match v.get(100) {
        Some(element) => println!("Element: {}", element),
        None => println!("Index out of bounds"), // This will be printed
    }
}
```

## Ownership and Borrowing Rules

You cannot have mutable and immutable references to the same vector simultaneously:

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    let first = &v[0];  // Immutable borrow occurs here
    
    // This would cause a compile error!
    // v.push(6);  // Mutable borrow occurs here
    
    println!("The first element is {}", first); // Immutable borrow used here
}
```

**Why this restriction exists:** When a vector grows, it might need to allocate new memory and copy all elements to the new location, making existing references invalid.

## Iterating Over Vectors

### Immutable Iteration

```rust
fn main() {
    let v = vec![100, 32, 57];
    for item in &v {
        println!("{}", item);
    }
}
```

### Mutable Iteration

```rust
fn main() {
    let mut v = vec![100, 32, 57];
    for item in &mut v {
        *item += 50;  // Dereference to modify the value
        println!("{}", item);
    }
}
```

### Taking Ownership

```rust
fn main() {
    let v = vec![100, 32, 57];
    for item in v {  // Takes ownership of v
        println!("{}", item);
    }
    // v is no longer accessible here
}
```

## Memory Management

Vectors automatically manage their memory:

- When a vector goes out of scope, it and all its elements are automatically cleaned up
- No manual memory management required
- The vector's destructor handles deallocation

```rust
fn main() {
    {
        let v = vec![1, 2, 3, 4, 5];
        // v is valid here
    } // v goes out of scope and is cleaned up here
}
```

## Code Examples

### Complete Example: Vector Operations

```rust
fn main() {
    // Creating vectors
    let v1 = vec![1, 2, 3];
    
    let mut v2 = Vec::new();
    v2.push(1);
    v2.push(2);
    v2.push(3);
    
    // Reading elements
    let v3 = vec![1, 2, 3, 4, 5];
    let third: &i32 = &v3[2];
    println!("The third element is {}", third);
    
    // Safe element access
    match v3.get(2) {
        Some(third) => println!("The 3rd element is {}", third),
        None => println!("There is no 3rd element"),
    }
    
    // Iterating and modifying
    let mut v4 = vec![100, 32, 57];
    for i in &mut v4 {
        *i += 50;
        println!("{}", i);
    }
}
```

### Example with Borrowing Rules

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    let first = &v[0];
    
    // Uncommenting the next line would cause a compile error
    // v.push(6);
    
    println!("The first element is {}", first);
    
    // After using the immutable reference, we can modify the vector
    v.push(6);
    println!("Vector after push: {:?}", v);
}
```

## Key Points to Remember

1. **Vectors store elements of the same type contiguously in memory**
2. **Use `Vec::new()` for empty vectors or `vec![]` macro for vectors with initial values**
3. **Vectors must be mutable (`mut`) to modify them**
4. **Use indexing for direct access (panics on invalid index) or `get()` for safe access**
5. **Respect Rust's borrowing rules - no simultaneous mutable and immutable references**
6. **Vectors automatically clean up their memory when they go out of scope**
7. **Use `&v` for immutable iteration, `&mut v` for mutable iteration, or `v` to take ownership**

Vectors are a fundamental and powerful data structure in Rust that provide dynamic arrays with memory safety guarantees. Understanding their behavior and Rust's ownership system is crucial for effective Rust programming.
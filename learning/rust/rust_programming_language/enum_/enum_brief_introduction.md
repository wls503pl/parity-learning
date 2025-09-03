# Rust Enums Introduction

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** September 3, 2025

## Overview

This project demonstrates the basic usage of enums in Rust, showcasing different ways to define and use enumeration types for IP address handling.

## What are Enums?

Enums (enumerations) in Rust allow you to define a type by enumerating its possible variants. They are particularly powerful because each variant can hold different types and amounts of data.

## Code Examples

### Basic Enum Definition

```rust
enum IpAddrKind {
    V4,
    V6,
}
```

### Using Enums with Structs

```rust
struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};
```

### Enums with Associated Data

Rust enums can store data directly in their variants, eliminating the need for separate structs:

```rust
enum IpAddr {
    V4(String),      // String data
    V6(String),
}

// Or with different data types:
enum IpAddr {
    V4(u8, u8, u8, u8),  // Four u8 values
    V6(String),          // String data
}
```

### Advanced Usage

Enums can even hold complex types like structs:

```rust
enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

## Key Advantages

1. **Type Safety**: Enums ensure you can only use valid variants
2. **Data Association**: Each variant can carry different types of data
3. **Memory Efficiency**: Rust stores enum variants efficiently
4. **Pattern Matching**: Works seamlessly with `match` statements

## Running the Code

```bash
rustc enum_define.rs
./enum_define
```

## Enum Methods

Just like structs, enums can have methods defined using `impl` blocks:

```rust
enum Message {
    Quit,                       // No associated data
    Move { x: i32, y: i32 },   // Anonymous struct
    Write(String),             // String data
    ChangeColor(i32, i32, i32), // Tuple data
}

impl Message {
    fn call(&self) {
        // Method implementation
    }
}

// Usage
let m = Message::Move { x: 12, y: 24 };
m.call(); // Call method on enum instance
```

### Enum Variant Types

Enums support multiple data association patterns:

- **Unit variants**: `Quit` - No associated data
- **Struct variants**: `Move { x: i32, y: i32 }` - Named fields
- **Tuple variants**: `Write(String)`, `ChangeColor(i32, i32, i32)` - Unnamed fields

## Learn More

This example covers basic enum usage and methods. Explore Rust's pattern matching with `match` statements to unlock the full power of enums!

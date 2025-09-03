# Rust Struct Methods and Debug Trait Implementation

**Author**: Peile Wu  
**Contact**: peile.wu.1990@gmail.com  
**Date**: September 3, 2025

## Project Overview

This project demonstrates Rust struct implementation with methods, associated functions, and Debug trait formatting. The example showcases how to define and use struct methods, handle automatic referencing/dereferencing, and implement proper debugging output.

## Project Structure

```
struct_example/
├── img/
├── src/
│   ├── main.rs
│   └── struct_func.rs
├── target/
├── Cargo.lock
├── Cargo.toml
└── README.md
```

## Code Structure Analysis

### Rectangle Struct Definition

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    length: u32,
}
```

The `Rectangle` struct automatically derives the Debug trait, enabling debug formatting output.

### Method Implementation

The project demonstrates three types of functions in `impl` blocks:

#### 1. Instance Methods

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.length
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.length > other.length
    }
}
```

- `area()`: Calculates rectangle area using borrowed reference
- `can_hold()`: Checks if current rectangle can contain another rectangle

#### 2. Associated Functions (Constructors)

```rust
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            length: size,
        }
    }
}
```

- `square()`: Creates a square rectangle with equal width and length
- Called using `Rectangle::square()` syntax (similar to `String::from()`)

### Key Rust Concepts Demonstrated

#### Automatic Referencing and Dereferencing

Rust automatically handles referencing and dereferencing when calling methods:

```rust
// These two lines are equivalent:
p1.distance(&p2);
(&p1).distance(&p2);
```

#### Debug Trait and Formatting

The program demonstrates three formatting approaches:

1. **`{}`** - Display formatting (requires `std::fmt::Display` trait)
2. **`{:?}`** - Debug formatting (requires `std::fmt::Debug` trait)
3. **`{:#?}`** - Pretty Debug formatting (multi-line, readable format)

## Running the Program

### Compile and Run

```bash
cargo run --bin struct_func
```

### Expected Output

```
1500
Rectangle {
    width: 30,
    length: 50,
}
true
false
```

## Key Learning Points

### Method vs Function Distinctions

**Methods**:

- Defined within `impl` block context
- First parameter is `self` (represents the struct instance)
- Called using dot notation: `rect.area()`

**Associated Functions**:

- Defined in `impl` block but don't take `self` parameter
- Called using `::` syntax: `Rectangle::square(80)`
- Often used as constructors

### Debug Trait Implementation

The `#[derive(Debug)]` attribute automatically implements the Debug trait, which:

- Enables debug formatting with `{:?}` and `{:#?}`
- Provides essential debugging capabilities
- Is commonly used during development

### Method Parameter Patterns

- `&self` - Borrows the instance (most common)
- `self` - Takes ownership of the instance
- `&mut self` - Mutably borrows the instance

## Technical Insights

### Rust's Ownership System

The example demonstrates Rust's ownership principles:

- Methods can borrow (`&self`) rather than take ownership
- Multiple immutable borrows are allowed simultaneously
- The compiler ensures memory safety at compile time

### Trait System Benefits

- Automatic trait derivation reduces boilerplate code
- Compiler provides clear error messages when traits are missing
- Type safety is enforced at compile time

## Best Practices Demonstrated

1. **Always derive Debug for development structs**
2. **Use `{:#?}` for readable debug output**
3. **Prefer borrowing (`&self`) over ownership in methods**
4. **Use associated functions for constructors**
5. **Leverage Rust's automatic referencing/dereferencing**

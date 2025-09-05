# Rust Code Organization and Module System Example

**Author**: Peile Wu  
**Contact**: peile.wu.1990@gmail.com  
**Date**: September 5, 2025

## Project Overview

This project demonstrates the core concepts of Rust's code organization and module system, including the usage of Package, Crate, Module, and Path.

## Project Structure

```
Package/
├── Cargo.toml          # Package configuration file
├── src/
│   ├── main.rs         # Entry point for binary crate
│   └── lib.rs          # Entry point for library crate
└── img/
    └── create_package.png
```

## Core Concepts of Rust Module System

### 1. Main Functions of Code Organization

Rust's code organization primarily includes:

- Deciding which details can be exposed and which details are private
- Deciding which names are valid within scope

These features are sometimes called the "module system".

### 2. Module System Components

#### Package

- A Cargo feature that lets you build, test, and share crates
- Located at the top level
- Contains a `Cargo.toml` file that describes how to build crates

#### Crate

- A tree structure of modules
- Can produce either a library or an executable file
- Located at the second level

**Crate Types**:

- `binary`: Executable file
- `library`: Library file

**Crate Root**:

- Source code entry file
- Starting point for the Rust compiler

#### Module

- Uses the `use` keyword
- Controls code organization, scope, and private paths
- Can be nested and contain definitions of other items

#### Path

- A way of naming items like struct, function, or module

## Cargo Conventions

### Binary Crate

- `src/main.rs` is the crate root of a binary crate
- Crate name matches the package name

### Library Crate

- `src/lib.rs` is the crate root of a library crate
- Crate name matches the package name

### Mixed Mode

A Package can contain both:

- `src/main.rs` (binary crate)
- `src/lib.rs` (library crate)
- Names match the package name

### Multiple Binary Crates

- Files are placed in the `src/bin/` directory
- Each file is a separate binary crate

## Project Files Description

### Cargo.toml

```toml
[package]
name = "Package"
version = "0.1.0"
edition = "2024"

[dependencies]
```

### main.rs

```rust
fn main() {
    println!("Hello, world!");
}
```

- Entry point for the binary crate
- Contains the main function of the program

### lib.rs

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}
```

## Module Tree Structure

The module tree structure in this project is as follows:

```
crate
  │
  └─── front_of_house
         ├─── hosting
         │      ├─── add_to_waitlist
         │      └─── seat_at_table
         └─── serving
                ├─── take_order
                ├─── serve_order
                └─── take_payment
```

### Module Characteristics

- **Group code within crate**: Improves code organization
- **Increase readability**: Easier to understand and maintain
- **Easy to reuse**: Modular design facilitates code reuse
- **Control privacy**: Manages public and private access permissions
- **Prevent naming conflicts**: Isolation through scopes

## Purpose of Crates

1. **Function grouping**: Combines related functionality into one scope
2. **Inter-project sharing**: Facilitates code sharing between different projects
3. **Conflict prevention**: Avoids naming conflicts through namespaces

For example, when using the `rand` crate, you need to access it through its name: `rand::...`

## Running the Project

```bash
# Compile the project
cargo build

# Run the project
cargo run

# Run tests
cargo test
```

## Important Notes

- `src/main.rs` and `src/lib.rs` are called crate roots
- The entire module tree is under an implicit crate module
- Modules are private by default; use the `pub` keyword to make them public
- Use the `use` keyword to bring paths into scope

## Learning Resources

- [Official Rust Documentation - Module System](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html)
- [Official Cargo Documentation](https://doc.rust-lang.org/cargo/)

---

_This project is designed for learning and demonstrating the basic concepts and best practices of Rust's module system._

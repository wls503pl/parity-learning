# Rust Code Organization and Module System Example

**Author**: Peile Wu  
**Contact**: peile.wu.1990@gmail.com  
**Date**: September 6, 2025

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

### lib.rs (Initial Version with Errors)

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

pub fn eat_at_restaurant() {
    // Absolute path call
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path call
    front_of_house::hosting::add_to_waitlist();
}
```

**This code will produce compilation errors** because the modules and functions are private by default.

## Path

To find an item in Rust's module system, you need to use a **path**.

### Two Types of Paths

- **Absolute path**: Starts from the crate root, using the crate name or the literal `crate`
- **Relative path**: Starts from the current module, using `self` (current module), `super` (parent module), or an identifier in the current module

A path consists of at least one identifier. If there are multiple identifiers, they are separated by `::`

### Path Examples

In the code above:

```rust
pub fn eat_at_restaurant() {
    // Absolute path call
    // The crate literal is followed by the module front_of_house, then the hosting module
    // Finally the add_to_waitlist function, separated by ::
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path call
    // Since the function eat_at_restaurant and the module front_of_house are at the same level,
    // we can use the module name front_of_house to find the function add_to_waitlist
    front_of_house::hosting::add_to_waitlist();
}
```

**Same Level Explanation**:

- The function `eat_at_restaurant` and the module `front_of_house` are both in the lib.rs file, so they are both in the same crate
- The contents of lib.rs implicitly form a module named `crate`. Therefore, absolute paths start with this crate name
- The crate name corresponding to lib.rs is the `crate` literal

## Privacy Boundary

Modules can not only organize code, but also define **privacy boundaries**.

If you want to make functions or structs private, you can put them in a module.

**Important Rules**:

- All items in Rust (functions, methods, structs, enums, modules, constants) are **private by default**
- Parent modules cannot access private items in child modules
- Child modules can use all items in their ancestor modules

### Privacy Error Demonstration

The initial code will produce compilation errors because:

```rust
mod front_of_house { ... } // No pub keyword, so the contents are private
// The hosting module is also private
// The add_to_waitlist function is also private
```

While the function `pub fn eat_at_restaurant()` has the pub keyword and can be accessed externally, it cannot access private modules and functions.

**Compilation Error Messages**:

```
error[E0603]: module `hosting` is private
error[E0603]: function `add_to_waitlist` is not publicly re-exported
```

### The pub Keyword

Use the `pub` keyword to mark certain items as public

### lib.rs (Corrected Version)

```rust
// Library crate root
pub mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
        fn seat_at_table() {} // Still private
    }

    mod serving { // Still a private module
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}

/*
 * Same level
 * The function eat_at_restaurant and the module front_of_house are both in the lib.rs file,
 * so they are both in the same crate.
 * The contents of lib.rs implicitly form a module named crate. Therefore, absolute paths
 * start with this crate name.
 * The crate name corresponding to lib.rs is the crate literal.
 */
pub fn eat_at_restaurant() {
    /*
     * Absolute path call
     * The crate literal is followed by the module front_of_house, which is followed by the hosting module
     * The add_to_waitlist function is followed by ::.
     */
    crate::front_of_house::hosting::add_to_waitlist();

    /*
     * Relative path call
     * Since the function eat_at_restaurant and the module front_of_house are at the same level,
     * we can use the module name front_of_house to find the function add_to_waitlist
     */
    front_of_house::hosting::add_to_waitlist();
}
```

### Why Relative Path Calls Don't Error

```rust
front_of_house::hosting::add_to_waitlist();
```

Because `front_of_house` and `eat_at_restaurant` are both at the root level of this file, they can call each other.

## Module Tree Structure

The module tree structure in this project is as follows:

```
crate
  │
  └─── front_of_house (pub)
         ├─── hosting (pub)
         │      ├─── add_to_waitlist (pub)
         │      └─── seat_at_table (private)
         └─── serving (private)
                ├─── take_order (private)
                ├─── serve_order (private)
                └─── take_payment (private)
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

# Compile only the library
cargo build --lib

# Run the project
cargo run

# Run tests
cargo test
```

## Common Compilation Errors and Solutions

### Error: Module is Private

```
error[E0603]: module `hosting` is private
```

**Solution**: Add `pub` keyword to make the module public:

```rust
pub mod hosting { ... }
```

### Error: Function is Not Publicly Re-exported

```
error[E0603]: function `add_to_waitlist` is not publicly re-exported
```

**Solution**: Add `pub` keyword to make the function public:

```rust
pub fn add_to_waitlist() {}
```

## Important Notes

- `src/main.rs` and `src/lib.rs` are called crate roots
- The entire module tree is under an implicit crate module
- Modules are private by default; use the `pub` keyword to make them public
- Use the `use` keyword to bring paths into scope
- Rust's privacy rules help maintain clear boundaries between internal implementation and public API

## Learning Resources

- [Official Rust Documentation - Module System](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html)
- [Official Cargo Documentation](https://doc.rust-lang.org/cargo/)

---

_This project is designed for learning and demonstrating the basic concepts and best practices of Rust's module system, including proper usage of paths and privacy boundaries._

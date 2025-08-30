# Rust Learning Project - Number Guessing Game

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** August 30, 2025

## Project Overview

This project implements a classic **Number Guessing Game** in Rust, demonstrating fundamental Rust programming concepts including external crate usage, random number generation, user input handling, and basic error management. The project serves as a practical introduction to Rust's ownership system, trait usage, and the `rand` crate integration.

## Features

- **Random Number Generation** - Uses the `rand` crate for secure random number generation
- **User Input Handling** - Demonstrates Rust's `std::io` module for reading user input
- **Trait Implementation** - Shows practical usage of the `Rng` trait
- **Error Handling** - Basic error management with `expect()` method
- **Modern Rust Syntax** - Updated for `rand` crate v0.8+ with range syntax

## Key Learning Concepts

### Core Rust Features:

- **External Crates** - Integration with `rand` crate via Cargo.toml
- **Traits** - Understanding and using the `Rng` trait interface
- **Ownership & Borrowing** - Mutable references with `&mut` syntax
- **Error Handling** - `Result<T, E>` types and `expect()` method
- **String Handling** - Creating and manipulating `String` objects

### Rust Syntax Highlights:

```rust
// Modern range syntax (rand 0.8+)
let secret_number = rand::thread_rng().gen_range(1..101);

// Mutable string creation
let mut guess = String::new();

// Reference passing with mutability
io::stdin().read_line(&mut guess).expect("can't read line!");

// String interpolation
println!("The number you guess is: {}", guess);
```

## Project Structure

```
guessing_game/
├── img/                # Screenshots and documentation images
├── src/
│   └── main.rs         # Main game implementation
├── target/             # Compiled binaries and build artifacts
├── Cargo.lock          # Dependency lock file
├── Cargo.toml          # Project configuration with rand dependency
└── README.md           # This documentation
```

## Dependencies

### Cargo.toml Configuration:

```toml
[package]
name = "guessing_game"
version = "0.1.0"
edition = "2024"

[dependencies]
rand = "^0.8"
```

## Running the Game

### Prerequisites:

- Rust toolchain installed (rustc 1.70+)
- Cargo package manager

### Execution:

```bash
# Clone and navigate to project
cd guessing_game

# Run the game
cargo run

# Build only (without running)
cargo build
```

### Expected Output:

![Game Execution Result](../img/guessing_game.png)

```
Guess a number:
66
The number you guess is: 66
The secret number is: 2.
```

The game successfully compiles and runs, demonstrating:

- **Successful compilation** - No errors with updated `rand` crate syntax
- **Random number generation** - Working `gen_range(1..101)` implementation
- **User input capture** - Functional `stdin().read_line()` operation
- **Output formatting** - Proper string interpolation with `println!` macro

## Technical Notes

### Rand Crate Version Update:

This project uses `rand` crate v0.8+, which introduced breaking changes from previous versions:

- **Old syntax**: `gen_range(1, 101)` (two parameters)
- **New syntax**: `gen_range(1..101)` (single range parameter)

The new syntax aligns with Rust's native range operators and provides better type safety and consistency with standard library patterns.

### Learning Outcomes:

- Understanding Rust's module system and external crate integration
- Practical experience with ownership, borrowing, and mutability
- Introduction to trait-based programming in Rust
- Basic error handling patterns using `Result` types
- Modern Rust syntax and best practices

This foundational project demonstrates essential Rust concepts that form the building blocks for more complex systems programming tasks.

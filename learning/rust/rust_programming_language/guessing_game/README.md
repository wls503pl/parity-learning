# Rust Learning Project - Number Guessing Game

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** August 31, 2025

## Project Overview

This project implements a classic **Number Guessing Game** in Rust, demonstrating fundamental Rust programming concepts including external crate usage, random number generation, user input handling, string parsing, pattern matching, and basic error management. The project serves as a practical introduction to Rust's ownership system, trait usage, enum handling, and the `rand` crate integration.

## Features

- **Random Number Generation** - Uses the `rand` crate for secure random number generation (1-100)
- **User Input Handling** - Demonstrates Rust's `std::io` module for reading user input
- **String Parsing & Type Conversion** - Shows Rust's shadowing feature and string-to-integer conversion
- **Pattern Matching** - Uses `match` expressions with `Ordering` enum for comparison logic
- **Trait Implementation** - Shows practical usage of the `Rng` trait
- **Error Handling** - Basic error management with `expect()` method for both I/O and parsing operations
- **Modern Rust Syntax** - Updated for `rand` crate v0.8+ with range syntax

## Game Flow

1. **Generate Secret Number** - Random number between 1-100
2. **Get User Input** - Read guess from stdin
3. **Parse Input** - Convert string to u32 with error handling
4. **Compare & Feedback** - Use pattern matching to provide hints:
   - "Too small!" if guess < secret number
   - "Too big!" if guess > secret number
   - "You get it!" if guess equals secret number

## Key Learning Concepts

### Core Rust Features:

- **External Crates** - Integration with `rand` crate via Cargo.toml
- **Traits** - Understanding and using the `Rng` trait interface
- **Enums & Pattern Matching** - `std::cmp::Ordering` enum with `match` expressions
- **Ownership & Borrowing** - Mutable references with `&mut` syntax
- **Variable Shadowing** - Reusing variable names with type conversion
- **Error Handling** - `Result<T, E>` types and `expect()` method
- **String Handling** - Creating, trimming, and parsing `String` objects

### Rust Syntax Highlights:

```rust
// Modern range syntax (rand 0.8+)
let secret_number = rand::thread_rng().gen_range(1..101);

// Mutable string creation
let mut guess = String::new();

// Reference passing with mutability
io::stdin().read_line(&mut guess).expect("can't read line!");

// Variable shadowing with type conversion
let guess: u32 = guess.trim().parse().expect("Please type a number!");

// Pattern matching with enum
match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal => println!("You get it!"),
}
```

## Project Structure

```
guessing_game/
├── img/                # Screenshots and documentation images
├── src/
│   └── main.rs         # Main game implementation with comparison logic
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
edition = "2021"

[dependencies]
rand = "0.8"
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

### Example Game Sessions:

**Session 1:**

```
Guess a number:
18
The number you guess is: 18

The secret number is: 73.
Too small!
```

**Session 2:**

```
Guess a number:
88
The number you guess is: 88

The secret number is: 24.
Too big!
```

The game successfully compiles and runs, demonstrating:

- **Successful compilation** - No errors with updated `rand` crate syntax
- **Random number generation** - Working `gen_range(1..101)` implementation
- **User input capture** - Functional `stdin().read_line()` operation
- **String parsing** - Robust conversion from String to u32
- **Comparison logic** - Pattern matching provides appropriate feedback
- **Output formatting** - Proper string interpolation with `println!` macro

## Technical Implementation Details

### Random Number Generation:

The program uses `rand::thread_rng().gen_range(1..101)` to generate numbers from 1 to 100 (inclusive). The `thread_rng()` function provides a thread-local random number generator that's cryptographically secure.

### Input Processing Pipeline:

1. **Read** - `io::stdin().read_line()` captures raw input including newline
2. **Trim** - `.trim()` removes whitespace and newline characters
3. **Parse** - `.parse()` converts the cleaned string to u32 type
4. **Handle Errors** - `.expect()` provides graceful error messages for invalid input

### Type System & Shadowing:

The code demonstrates Rust's variable shadowing feature, where a new variable with the same name can shadow (hide) the previous one. This is commonly used for type conversions:

```rust
let mut guess = String::new();        // guess is String
// ... read input ...
let guess: u32 = guess.trim().parse().expect(...); // guess is now u32
```

### Comparison Logic:

Uses Rust's `Ord` trait via the `.cmp()` method, which returns an `Ordering` enum. The `match` expression handles all three possible outcomes exhaustively, ensuring compile-time safety.

## Learning Outcomes

This foundational project demonstrates essential Rust concepts

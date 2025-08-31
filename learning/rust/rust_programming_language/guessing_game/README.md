# Rust Learning Project - Number Guessing Game

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** August 30, 2025

## Project Overview

This project implements a classic **Number Guessing Game** in Rust, demonstrating fundamental Rust programming concepts including external crate usage, random number generation, user input handling, string parsing, pattern matching, and basic error management. The project serves as a practical introduction to Rust's ownership system, trait usage, enum handling, and the `rand` crate integration.

## Features

- **Random Number Generation** - Uses the `rand` crate for secure random number generation (1-100)
- **Interactive Game Loop** - Continuous gameplay until correct guess with `loop` and `break`
- **User Input Handling** - Demonstrates Rust's `std::io` module for reading user input
- **String Parsing & Type Conversion** - Shows Rust's shadowing feature and string-to-integer conversion
- **Advanced Error Handling** - Uses `match` expressions for graceful error recovery instead of panicking
- **Pattern Matching** - Uses `match` expressions with `Ordering` enum for comparison logic
- **Trait Implementation** - Shows practical usage of the `Rng` trait
- **Modern Rust Syntax** - Updated for `rand` crate v0.8+ with range syntax

## Game Flow

1. **Generate Secret Number** - Random number between 1-100 (generated once at startup)
2. **Game Loop** - Continuous gameplay until correct guess:
   - Prompt user for input
   - Read and validate user guess
   - Handle invalid input gracefully (continue loop without crashing)
   - Compare guess with secret number
   - Provide feedback and continue or exit on correct guess
3. **Graceful Termination** - Game ends with success message when number is guessed correctly

## Key Learning Concepts

### Core Rust Features:

- **External Crates** - Integration with `rand` crate via Cargo.toml
- **Traits** - Understanding and using the `Rng` trait interface
- **Control Flow** - `loop`, `break`, and `continue` for game flow control
- **Enums & Pattern Matching** - `std::cmp::Ordering` enum with `match` expressions
- **Advanced Error Handling** - `Result<T, E>` types with `match` for graceful error recovery
- **String Handling** - Creating, trimming, and parsing `String` objects

### Rust Syntax Highlights:

```rust
// Modern range syntax (rand 0.8+)
let secret_number = rand::thread_rng().gen_range(1..101);

// Game loop for continuous play
loop {
    println!("Guess a number:");

    // Mutable string creation
    let mut guess = String::new();

    // Reference passing with mutability
    io::stdin().read_line(&mut guess).expect("can't read line!");

    // Advanced error handling with match (instead of expect)
    let guess: u32 = match guess.trim().parse() {
        Ok(num) => num,
        Err(_) => continue,  // Skip invalid input, continue loop
    };

    // Pattern matching with enum and game termination
    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => {
            println!("You get it!");
            break;  // Exit the game loop
        }
    }
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

**Complete Game Session:**

```
The secret number is: 42.
Guess a number:
50
The number you guess is: 50

Too big!
Guess a number:
25
The number you guess is: 25

Too small!
Guess a number:
abc
The number you guess is: abc

Guess a number:
42
The number you guess is: 42

You get it!
```

The game successfully compiles and runs, demonstrating:

- **Interactive Loop** - Continuous gameplay until correct guess
- **Error Recovery** - Invalid input (like "abc") is handled gracefully without crashing
- **Successful compilation** - No errors with updated `rand` crate syntax
- **Random number generation** - Working `gen_range(1..101)` implementation
- **User input capture** - Functional `stdin().read_line()` operation
- **String parsing** - Robust conversion from String to u32 with fallback
- **Comparison logic** - Pattern matching provides appropriate feedback
- **Game termination** - Clean exit when correct number is guessed

## Technical Implementation Details

### Random Number Generation:

The program uses `rand::thread_rng().gen_range(1..101)` to generate numbers from 1 to 100 (inclusive). The `thread_rng()` function provides a thread-local random number generator that's cryptographically secure.

### Input Processing Pipeline:

1. **Read** - `io::stdin().read_line()` captures raw input including newline
2. **Trim** - `.trim()` removes whitespace and newline characters
3. **Parse** - `.parse()` converts the cleaned string to u32 type
4. **Handle Errors** - `match` expression handles parsing errors gracefully by continuing the loop

### Advanced Error Handling:

The latest version uses `match` expressions instead of `expect()` for parsing errors, demonstrating a more robust approach:

```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,        // Valid input - proceed with game logic
    Err(_) => continue,    // Invalid input - skip to next iteration
};
```

This pattern allows the game to handle invalid input (like letters or special characters) without crashing, providing a better user experience.

### Type System & Shadowing:

The code demonstrates Rust's variable shadowing feature, where a new variable with the same name can shadow (hide) the previous one. This is commonly used for type conversions:

```rust
let mut guess = String::new();        // guess is String
// ... read input ...
let guess: u32 = guess.trim().parse().expect(...); // guess is now u32
```

### Game Loop & Control Flow:

The program now implements a complete game experience using Rust's loop control mechanisms:

```rust
loop {
    // Get user input
    // Handle parsing errors with continue
    // Compare and provide feedback
    // Break on correct guess
}
```

The `continue` statement skips invalid input gracefully, while `break` terminates the game upon success, demonstrating Rust's elegant control flow patterns.

## Learning Outcomes

This foundational project demonstrates essential Rust concepts:

- **Memory Safety** - Ownership and borrowing without garbage collection
- **Type Safety** - Compile-time type checking and explicit conversions
- **Pattern Matching** - Exhaustive enum handling with `match` expressions
- **Trait System** - Interface-like behavior through traits (`Rng`, `Ord`)
- **Error Handling** - Rust's `Result` type system for recoverable errors
- **Modern Syntax** - Contemporary Rust idioms and best practices

The project provides hands-on experience with Rust's unique approach to systems programming, emphasizing safety, performance, and expressiveness. The complete game loop implementation showcases how Rust's control flow mechanisms enable robust, user-friendly applications without sacrificing memory safety or performance. These concepts form the foundation for more advanced Rust development including concurrent programming, web development, and systems-level programming.

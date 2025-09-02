# Cargo: Rust's Build System and Package Manager

## Overview

Cargo is Rust's official build system and package manager that comes automatically installed with Rust. It provides comprehensive project management, dependency management, and build functionality for Rust projects.

## Basic Commands

### Version Check

```bash
cargo --version  # Check Cargo version
```

### Project Creation

```bash
cargo new hello_cargo  # Create a new Cargo project
```

When creating a project, Cargo automatically generates the project structure including:

- `Cargo.toml` - Project configuration file
- `src/main.rs` - Main source code file

### Project Building

```bash
cargo build  # Create executable file
```

This command will:

- Generate executable files in the `target\debug\` directory (`.exe` files on Windows)
- Create a `Cargo.lock` file on first execution to track precise dependency versions

### Code Checking

```bash
cargo check  # Check code compilation without producing executable files
```

This command is much faster than `cargo build` and is perfect for periodic checks during development to ensure code compiles correctly.

### Quick Run

```bash
cargo run  # Build and run the compiled file quickly
```

This command automatically builds the project and runs the generated executable, ideal for development and testing phases.

## Release Build

### Optimized Build

```bash
cargo build --release  # Release version build
```

Release build characteristics:

- Performs code optimization for faster runtime
- Takes longer to compile
- Generates executable files in `target/release` directory instead of `target/debug`

## Rust Ownership System

### Understanding Ownership

Rust's ownership system is one of its most distinctive features, ensuring memory safety without a garbage collector. Understanding ownership is crucial for writing effective Rust code.

#### Basic Ownership Rules

1. Each value in Rust has a variable that's called its owner
2. There can only be one owner at a time
3. When the owner goes out of scope, the value will be dropped

#### String Types and Memory Management

Rust provides two main string types:

- **String literals (`&str`)**: Stored in the program binary, immutable and known at compile time
- **String type (`String`)**: Allocated on the heap, mutable and can store unknown amounts of text at compile time

```rust
// Creating a String from a string literal
let mut s = String::from("Hello");
s.push_str(", World!");  // This is possible because String is mutable
```

#### String Memory Layout

When working with `String` types, understanding the memory layout is crucial:

```
Stack (Variable s1)          Heap (String data)
┌─────────┬─────────┐       ┌─────┬─────┐
│  name   │  value  │       │index│value│
├─────────┼─────────┤       ├─────┼─────┤
│   ptr   │    ●────┼──────>│  0  │  h  │
├─────────┼─────────┤       ├─────┼─────┤
│   len   │    5    │       │  1  │  e  │
├─────────┼─────────┤       ├─────┼─────┤
│capacity │    5    │       │  2  │  l  │
└─────────┴─────────┘       ├─────┼─────┤
                            │  3  │  l  │
                            ├─────┼─────┤
                            │  4  │  o  │
                            └─────┴─────┘
```

The `String` structure contains:

- **ptr**: Pointer to heap memory location
- **len**: Current length of the string
- **capacity**: Total allocated space

#### Move Semantics

When assigning heap-allocated data (like `String`) to another variable, Rust performs a "move" rather than a copy:

```rust
let s1 = String::from("Hello");
let s2 = s1;  // s1 is moved to s2
// println!("{}", s1);  // This would cause a compile error!
```

![move_error](./img/move_error.png)

This prevents double-free errors and ensures memory safety.

#### Clone for Deep Copying

To create a deep copy of heap data, use the `clone()` method:

```rust
let s1 = String::from("Hello");
let s2 = s1.clone();  // Creates a deep copy
println!("s1: {}, s2: {}", s1, s2);  // Both are valid
```

![clone](./img/clone.png)

### References and Borrowing

#### What are References?

The `&` symbol represents a reference in Rust. References allow you to refer to a value without taking ownership of it. This solves the problem of having to transfer ownership back and forth between functions.

```rust
fn main() {
    let s1 = String::from("Hello");

    // &s1 creates a reference to s1, but doesn't own s1
    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);  // s1 is still valid!
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s goes out of scope, but since it doesn't own the string, nothing is dropped
```

![owner_refer](./img/owner_reference.png)

#### Borrowing Rules

The act of creating a reference is called **borrowing**. Key characteristics:

- References are **immutable by default**
- You can reference a value without taking ownership
- When the reference goes out of scope, the value it points to is **not** dropped
- No need to return values to give back ownership since you never had it

#### Benefits of References

Using references eliminates the need for complex ownership transfers:

```rust
// Without references - ownership transfer required
fn calculate_length_ownership(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // Must return the String to give back ownership
}

// With references - no ownership transfer needed
fn calculate_length(s: &String) -> usize {
    s.len()  // Simple and clean
}
```

### String Slices

#### What are String Slices?

A string slice is a reference to a portion of a string. String slices have the type `&str` and provide a way to reference part of a `String` or string literal without taking ownership.

#### String Slice Syntax

The syntax for creating a string slice is:

```rust
&string_variable[start_index..end_index]
```

- **start_index**: The starting position of the slice (inclusive)
- **end_index**: The ending position of the slice (exclusive)

#### Basic String Slice Examples

```rust
fn main() {
    let s = String::from("Hello world");

    let hello = &s[0..5];   // "Hello" - can be shortened to &s[..5]
    let world = &s[6..11];  // "world" - can be shortened to &s[6..]
    let whole = &s[..];     // "Hello world" - entire string slice

    println!("{}, {}", hello, world);
}
```

#### Slice Shorthand Syntax

Rust provides convenient shorthand for common slice patterns:

```rust
let s = String::from("Hello world");

// These are equivalent:
let hello1 = &s[0..5];
let hello2 = &s[..5];    // Start from beginning

// These are equivalent:
let world1 = &s[6..11];
let world2 = &s[6..s.len()];
let world3 = &s[6..];    // Go to the end

// These are equivalent:
let whole1 = &s[0..s.len()];
let whole2 = &s[..];     // Entire string
```

#### UTF-8 Character Boundaries

**Critical**: String slice indices must occur at valid UTF-8 character boundaries. Attempting to slice in the middle of a multi-byte character will cause a panic.

**UTF-8 Encoding Basics:**

```rust
fn main() {
    let s = "Hello";      // Each character takes 1 byte
    let s2 = "你好";       // Each Chinese character takes 3 bytes

    println!("Hello length: {} bytes", s.len());     // 5 bytes
    println!("你好 length: {} bytes", s2.len());      // 6 bytes
}
```

**Valid Character Boundary Slicing:**

```rust
fn main() {
    let s = "Hello世界";

    // ✅ Correct: Valid UTF-8 character boundaries
    let hello = &s[0..5];    // "Hello" (ASCII chars, 1 byte each)
    let world = &s[5..11];   // "世界" (Chinese chars, 3 bytes each)

    println!("First part: {}", hello);  // Hello
    println!("Second part: {}", world); // 世界
}
```

**Invalid Character Boundary Slicing (Will Panic!):**

```rust
fn main() {
    let s = "Hello世界";

    // ❌ Error: Attempting to slice from middle of "世" character
    // "世" occupies bytes 5,6,7, but we're trying to slice from byte 6
    let bad_slice = &s[6..9];  // This will panic!
}
```

#### Practical String Slice Usage

Here's a practical example that finds the first word in a string:

```rust
fn main() {
    let s = String::from("Hello world");
    let word = first_word(&s);  // Can pass &String or &str
    println!("First word: {}", word);

    let s2 = "hello world!";
    let word2 = first_word(s2); // String literals work directly
    println!("First word: {}", word2);
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];  // Return slice up to space
        }
    }
    &s[..]  // Return entire string if no space found
}
```

#### Why Use `&str` Instead of `&String`?

Using `&str` as a parameter type is more flexible because:

- It can accept both `String` references (`&String`) and string literals (`&str`)
- `&String` can be automatically coerced to `&str`
- String literals are already `&str` type

```rust
// More flexible - accepts both String and &str
fn process_text(s: &str) -> &str {
    // Implementation
}

// Less flexible - only accepts String references
fn process_text_limited(s: &String) -> &str {
    // Implementation
}
```

#### String Slices and Borrowing Rules

String slices follow the same borrowing rules as other references:

```rust
fn main() {
    let mut s = String::from("Hello world");
    let word = first_word(&s);

    // s.clear();  // Error: cannot borrow 's' as mutable because
                   // it is also borrowed as immutable through 'word'

    println!("First word: {}", word);
}
```

The slice `word` maintains an immutable reference to `s`, preventing any mutable operations on `s` until the slice goes out of scope.

### Ownership and Functions

#### Function Parameters

Passing values to functions follows the same ownership rules as variable assignment:

- **Move occurs**: For heap-allocated types like `String`
- **Copy occurs**: For stack-allocated types like integers (`i32`, `i64`, etc.)

```rust
fn main() {
    let s = String::from("Hello World");
    take_ownership(s);  // s is moved into the function
    // println!("{}", s);  // This would error - s is no longer valid

    let x = 5;
    make_copy(x);  // x is copied
    println!("x: {}", x);  // x is still valid
}

fn take_ownership(some_string: String) {
    println!("{}", some_string);
    // some_string goes out of scope and is dropped
}

fn make_copy(some_number: i32) {
    println!("{}", some_number);
    // some_number goes out of scope, but since it's Copy, nothing special happens
}
```

![owner_func](./img/owner_func.png)

#### Return Values and Ownership Transfer

Functions can transfer ownership through their return values:

```rust
fn gives_ownership() -> String {
    let some_string = String::from("hello");
    some_string  // Ownership is moved to the caller
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string  // Ownership is moved back to the caller
}
```

#### Key Ownership Principles

- **Move pattern**: A value is moved when assigned to another variable
- **Scope-based cleanup**: When a variable containing heap data goes out of scope, its value is cleared by the `Drop` function (unless ownership was transferred)
- **Single ownership**: Each piece of data has exactly one owner at any given time

### Development Tips

When working with ownership in Cargo projects:

1. Use `cargo check` frequently to catch ownership errors early (like error E0382: borrow of moved value)
2. Understand when to use `clone()` vs. references (borrowing) for performance
3. Pay attention to function signatures - they indicate ownership transfer vs borrowing
4. Use `cargo run --bin <name>` to test specific ownership examples
5. Organize learning examples in separate `.rs` files with dedicated binary targets
6. Keep documentation files (`.md`) at the project root for easy reference

### Common Ownership Errors and Solutions

**Move Error Example** (from `move_error.rs`):

```rust
let s1 = String::from("Hello");
let s2 = s1;  // s1 is moved to s2
println!("{}", s1);  // ERROR E0382: borrow of moved value
```

**Solutions**:

- Use `clone()`: `let s2 = s1.clone();`
- Use references: `let s2 = &s1;` (for borrowing without ownership transfer)

**Reference Success Example** (from `owner_reference.rs`):

```rust
let s1 = String::from("Hello");
let len = calculate_length(&s1);  // Borrowing with &s1
println!("The length of '{}' is {}.", s1, len);  // s1 still valid!
```

**String Slice Success Example** (from `owner_slice.rs`):

```rust
let s = String::from("Hello world");
let word = first_word(&s);  // Borrowing with slice
println!("First word: {}", word);  // Both s and word are valid
```

## Important Files

- **Cargo.toml**: Project configuration file containing project metadata and dependency information
- **Cargo.lock**: Dependency lock file that tracks precise dependency versions (auto-generated, no manual editing needed)

## Development Best Practices

Experienced Rust engineers typically:

1. Periodically run `cargo check` to ensure compilation passes
2. Use `cargo run` for quick testing during development
3. Use `cargo build --release` for optimized builds before release
4. Prefer `&str` over `&String` for function parameters when possible
5. Use string slices to work with portions of strings efficiently

## Project Structure

For learning Rust ownership concepts, a more comprehensive project structure might look like:

```
ownership/
├── Cargo.toml
├── Cargo.lock
├── README.md
├── ownership_introduction.md
├── img/                     # Image resources
├── src/
│   ├── done.rs                  # Completed ownership examples
│   ├── move_error.rs            # Demonstrates ownership move errors
│   ├── owner_func.rs            # Ownership and function relationships
│   ├── owner_reference.rs       # Ownership and reference relationships
│   ├── owner_return.rs          # Ownership and return values
│   └── owner_slice.rs           # String slices and borrowing
└── target/
    ├── debug/
    └── release/
```

### Working with Multiple Source Files and Binary Targets

When your project contains multiple `.rs` files for learning ownership concepts, you can configure them as separate binary targets in `Cargo.toml`:

```toml
[[bin]]
name = "move_error"
path = "src/move_error.rs"

[[bin]]
name = "owner_func"
path = "src/owner_func.rs"

[[bin]]
name = "owner_return"
path = "src/owner_return.rs"

[[bin]]
name = "owner_reference"
path = "src/owner_reference.rs"

[[bin]]
name = "owner_slice"
path = "src/owner_slice.rs"

[[bin]]
name = "clone"
path = "src/clone.rs"
```

To run specific examples:

```bash
# Run individual ownership examples
cargo run --bin owner_func      # Demonstrates function ownership transfer
cargo run --bin owner_return    # Shows return value ownership
cargo run --bin owner_reference # Demonstrates borrowing with references
cargo run --bin owner_slice     # String slice examples and UTF-8 boundaries
cargo run --bin clone           # Shows cloning behavior

# Note: move_error.rs intentionally contains compilation errors for demonstration
# cargo run --bin move_error    # This will show compiler error E0382
```

### Cargo Commands for Ownership Development

```bash
cargo check                    # Quick compilation check for ownership errors
cargo run --bin <binary_name>  # Run specific ownership example
cargo build                    # Build all binaries
cargo clean                    # Clean target directory
```

## Conclusion

Cargo makes Rust project management simple and efficient, serving as an indispensable tool in the Rust ecosystem. Its design philosophy of "convention over configuration" provides an out-of-the-box development experience while maintaining flexibility for complex project requirements. Understanding Rust's ownership system, including concepts like borrowing, references, and string slices, alongside Cargo's build tools enables developers to write safe, efficient, and maintainable code.

The combination of ownership rules, borrowing mechanics, and string slices provides Rust with its unique ability to guarantee memory safety without requiring a garbage collector, making it an excellent choice for systems programming and performance-critical applications.

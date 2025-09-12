# Rust Panic and Unrecoverable Errors

## Overview of Rust Error Handling

Rust's reliability is built on robust error handling mechanisms that catch and address most errors at compile time. Rust categorizes errors into two main types:

### Error Categories

**Recoverable Errors**

- Examples: File not found, network timeout
- Can be handled gracefully and allow the program to continue
- Handled using the `Result<T, E>` type

**Unrecoverable Errors**

- Examples: Array index out of bounds, null pointer dereference
- Represent bugs or critical failures that should terminate the program
- Handled using the `panic!` macro

Unlike many other programming languages, Rust does not have traditional exception handling. Instead, it provides:

- `Result<T, E>` for recoverable errors
- `panic!` macro for unrecoverable errors

## Unrecoverable Errors and `panic!`

### What Happens When `panic!` Executes

When the `panic!` macro is triggered, your program will:

1. **Print an error message** - Shows the panic reason and location
2. **Unwind and clean up the call stack** - Deallocates memory and runs destructors
3. **Exit the program** - Terminates with a non-zero exit code

### Panic Response Strategies

Rust offers two strategies for handling panics:

#### 1. Stack Unwinding (Default)

- **Process**: Rust walks back through the call stack
- **Cleanup**: Automatically deallocates memory and runs destructors for each function
- **Cost**: Requires more work and results in larger binary size
- **Benefit**: Ensures proper cleanup of resources

#### 2. Abort on Panic

- **Process**: Immediately terminates the program without cleanup
- **Cleanup**: Operating system reclaims memory after program termination
- **Cost**: Smaller binary size, faster termination
- **Trade-off**: No automatic resource cleanup

### Configuring Panic Behavior

To change from unwinding to aborting, add this to your `Cargo.toml`:

```toml
[profile.release]
panic = 'abort'

# For development builds (optional)
[profile.dev]
panic = 'abort'
```

The `[profile.release]` setting means that in production builds, panics will immediately abort execution, letting the OS handle memory cleanup.

## Panic Examples

### Simple Panic Example

```rust
fn main() {
    panic!("crash and burn");
}
```

**Output:**

```
thread 'main' panicked at 'crash and burn', src\main.rs:2:5
```

This shows the panic occurred in the main function at line 2, character 5 of `src\main.rs`.

### Panic from Standard Library

```rust
fn main() {
    let v = vec![1, 2, 3];
    v[99]; // This will panic - index out of bounds
}
```

**Output:**

```
thread 'main' panicked at 'index out of bounds: the len is 3 but the index is 99', src\main.rs:6:6
```

## Getting Panic Backtraces

### Enabling Backtraces

To see the full call stack that led to a panic, set the `RUST_BACKTRACE` environment variable:

```bash
# Basic backtrace
RUST_BACKTRACE=1 cargo run

# Full detailed backtrace
RUST_BACKTRACE=full cargo run

# On Windows PowerShell
$env:RUST_BACKTRACE=1; cargo run
```

![panic_occur](./src/panic_occur.png)

_Image 3: Simple panic output without backtrace - shows basic error message and location_

When you don't set `RUST_BACKTRACE`, you only get the basic panic message and location.

![otherPlace_panic](./src/otherPlace_panic.png)

_Image 4: Panic output with note about setting RUST_BACKTRACE=1 for more details_

Notice the helpful note: "run with `RUST_BACKTRACE=1` environment variable to display a backtrace"

### Understanding Backtrace Output

A typical backtrace shows:

1. **Your code** - Functions you wrote that led to the panic
2. **Standard library code** - Rust's core library functions
3. **Third-party dependencies** - External crates your code uses

The backtrace helps you trace back from the panic point to identify the root cause in your code.

### Backtrace Requirements

- **Debug symbols required** - Don't use `--release` flag when debugging
- **Default behavior** - Debug builds include symbols by default
- **Release builds** - Strip debug information for smaller binaries

## Sources of Panics

Panics can originate from:

### 1. Your Code

- Explicit `panic!` macro calls
- Logic errors that trigger assertions
- Unsafe code violations

### 2. Dependencies

- Standard library functions (like array indexing)
- Third-party crates
- System-level failures

### Best Practices

1. **Use backtraces** - Always investigate the full call stack
2. **Prefer `Result`** - Handle recoverable errors gracefully
3. **Strategic panics** - Only panic for truly unrecoverable situations
4. **Test panic paths** - Use `#[should_panic]` in tests
5. **Document panic conditions** - Clearly state when functions might panic

## Example: Handling Potential Panics

Instead of panicking:

```rust
let v = vec![1, 2, 3];
let item = v[99]; // Panics!
```

Use safe alternatives:

```rust
let v = vec![1, 2, 3];
match v.get(99) {
    Some(item) => println!("Found: {}", item),
    None => println!("Index out of bounds"),
}
```

## When to Use `panic!` - Detailed Guidelines

### General Principle

In Rust, errors are mainly divided into two categories: recoverable and unrecoverable errors.

- **Calling `panic!` macro** = Unrecoverable error - the program terminates
- **Returning `Result`** = Recoverable error - error propagation allows the caller to decide how to handle it

### Decision Framework

**Use `panic!` when:**

- You can make the decision on behalf of the code caller that certain situations are unrecoverable
- The calling context cannot meaningfully recover from the error

**Return `Result` when:**

- You want to give error handling authority to the code caller
- The caller can decide based on their specific situation whether to recover from the error
- The caller might still choose to call `panic!` if they determine the error is unrecoverable

### Scenarios Where `panic!` is Appropriate

#### 1. Example Code, Prototypes, and Tests

**Demonstrating concepts:**

```rust
// Using unwrap to demonstrate concepts clearly
let value = some_result.unwrap();
```

**Prototype code:**

```rust
// Quick prototyping with unwrap/expect
let config = load_config().expect("Config file must exist");
```

**Testing:**

```rust
#[test]
fn test_something() {
    let result = risky_operation().unwrap(); // OK in tests
    assert_eq!(result, expected);
}
```

#### 2. When You Have More Information Than the Compiler

**Certain `Result` is `Ok`:**

```rust
use std::net::IpAddr;

fn main() {
    // We know "127.0.0.1" is a valid IP address
    let home: IpAddr = "127.0.0.1".parse().unwrap();
    // This will never panic because the input is guaranteed valid
}
```

#### 3. Error Handling Guidelines for Production Code

**Use `panic!` when your code might be in a corrupted state:**

- Invalid, contradictory, or missing values are passed to your code
- **AND** one of the following conditions applies:
  - This corrupted state is not expected to occur occasionally
  - Your code cannot function in this state
  - There's no good way to encode this information in the types you're using

#### 4. Specific Scenarios

**Caller passes meaningless parameter values:**

```rust
pub fn calculate_interest(principal: f64, rate: f64) -> f64 {
    if principal < 0.0 || rate < 0.0 {
        panic!("Principal and rate must be non-negative");
    }
    principal * rate
}
```

**External uncontrollable code returns illegal state that you cannot fix:**

```rust
fn process_external_data() {
    let data = external_library_call();
    if !data.is_valid() {
        panic!("External library returned invalid data that cannot be recovered");
    }
    // ... process data
}
```

**If failure is predictable and handleable:**

```rust
// Use Result instead of panic
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Cannot divide by zero".to_string())
    } else {
        Ok(a / b)
    }
}
```

**Validate values before operations (security consideration):**

```rust
fn access_array(arr: &[i32], index: usize) -> i32 {
    if index >= arr.len() {
        panic!("Index {} out of bounds for array length {}", index, arr.len());
    }
    arr[index] // This is why the standard library panics on out-of-bounds access
}
```

### Creating Custom Types for Validation

**Encapsulate validation logic in the constructor:**

```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must between 1 and 100, got {}", value);
        }
        Guess { value }
    }

    // Getter: Returns field data
    // Fields are private, external code cannot assign values directly
    pub fn value(&self) -> i32 {
        self.value
    }
}

fn main() {
    loop {
        // ...
        let guess = "32";
        let guess: i32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        let guess = Guess::new(guess); // Validation happens here
        // ...
        break;
    }
}
```

This pattern ensures that:

- Invalid values cannot create a `Guess` instance
- Once created, a `Guess` is guaranteed to be valid
- The type system enforces the validation contract

### Summary

The key principle is **responsibility**: use `panic!` when you can reasonably decide that a situation is unrecoverable on behalf of your caller. Use `Result` when the caller is better positioned to make that decision. This approach leads to more robust and maintainable code by putting error handling decisions at the appropriate level of abstraction.

## Conclusion

Rust's panic system provides a clear distinction between recoverable and unrecoverable errors. While panics should be avoided in most cases by using proper error handling with `Result`, they serve as a crucial safety net for detecting bugs and preventing undefined behavior. Understanding how to debug panics with backtraces and when to use different panic strategies is essential for writing robust Rust applications.

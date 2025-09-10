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

## Conclusion

Rust's panic system provides a clear distinction between recoverable and unrecoverable errors. While panics should be avoided in most cases by using proper error handling with `Result`, they serve as a crucial safety net for detecting bugs and preventing undefined behavior. Understanding how to debug panics with backtraces and when to use different panic strategies is essential for writing robust Rust applications.

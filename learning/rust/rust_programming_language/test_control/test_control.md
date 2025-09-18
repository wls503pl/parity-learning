# Rust Test Control Guide

## Project Structure

```
test_control/
├── src/
│   ├── lib.rs          # Main library file with test code
│   └── main.rs         # Main program entry point
├── img/                # Image resources directory
│   ├── cargo_test____help.png
│   ├── cargo_test__help.png
│   ├── println!_notShow.png
│   └── println!_show.png
├── target/             # Build output directory
├── Cargo.lock          # Dependency lock file
└── Cargo.toml          # Project configuration file
```

## Controlling Test Execution

The Cargo test framework provides multiple ways to control test execution behavior. By adding command-line arguments, we can modify the default behavior of `cargo test`.

### Default Test Behavior

Rust tests have the following default behaviors:

- **Parallel execution**: Uses multiple threads to run tests simultaneously for improved speed
- **Run all tests**: Executes all test cases in the project
- **Capture output**: Doesn't display `println!` and other output when tests pass, only shows output when tests fail

This design benefit makes test result output cleaner and easier to read test-related information.

## Command Line Arguments Classification

### Cargo Test Command Arguments

These arguments follow directly after `cargo test`:

```bash
cargo test --help
```

![Cargo Test Help](img/cargo_test__help.png)

### Test Executable Arguments

These arguments need to be placed after `--`, passed directly to the test executable:

```bash
cargo test -- --help
```

![Cargo Test Binary Help](img/cargo_test____help.png)

## Parallel/Sequential Test Execution

### Parallel Execution (Default)

By default, Rust uses multiple threads to run tests in parallel, with the following characteristics:

- **Fast execution**: Multi-threaded concurrent execution
- **Important considerations**: Tests should not depend on each other
- **Avoid shared state**: Don't rely on shared resources like environment variables, working directories, etc.

### Controlling Thread Count

If you need to control concurrency or use single-threaded execution, you can use the `--test-threads` parameter:

```bash
# Run all tests using a single thread
cargo test -- --test-threads=1

# Use a specified number of threads
cargo test -- --test-threads=4
```

This is useful in the following situations:

- Tests have dependencies between them
- Need precise control over resource usage
- When debugging test issues

## Displaying Function Output

### Default Output Behavior

The Rust test library captures all content printed to standard output by default:

- **Test passes**: Doesn't display `println!` and other output content
- **Test fails**: Shows `println!` output and failure information

### Example Code

```rust
fn prints_and_returns_10(a: i32) -> i32 {
    println!("I got the value {}", a);
    10
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn this_test_will_pass() {
        let value = prints_and_returns_10(6);
        assert_eq!(10, value);
    }

    #[test]
    fn this_test_will_fail() {
        let value = prints_and_returns_10(8);
        assert_eq!(5, value);  // This will fail because function returns 10, not 5
    }
}
```

### Default Output Result

When running tests with default settings, you'll only see output from failing tests:

![Default Output](img/println!_notShow.png)

From the image, you can see:

- The successful test `this_test_will_pass` doesn't show `println!` output
- The failed test `this_test_will_fail` shows "I got the value 8" output

### Show All Output

If you want to see `println!` output from all tests (including successful ones), use:

```bash
cargo test -- --show-output
```

![Show All Output](img/println!_show.png)

After using the `--show-output` parameter:

- Successful tests also display their `println!` output: "I got the value 6"
- Failed tests continue to show output and error information

## Practical Tips

### Debugging Tests

1. **Use `--show-output`** to view all output for debugging
2. **Use `--test-threads=1`** to avoid concurrency issues
3. **Combine both**: `cargo test -- --test-threads=1 --show-output`

### Running Specific Tests

```bash
# Run tests whose names contain a specific string
cargo test specific_test_name

# Run tests from a specific module
cargo test tests::module_name
```

### Ignoring Tests

```rust
#[test]
#[ignore]
fn expensive_test() {
    // Time-consuming test code
}
```

```bash
# Run ignored tests
cargo test -- --ignored

# Run all tests (including ignored ones)
cargo test -- --include-ignored
```

## Summary

Cargo's test control features provide flexible test execution options:

- Control test behavior through command-line arguments
- Support both parallel and sequential execution modes
- Selectively display test output
- Facilitate debugging and problem identification

Proper use of these features can significantly improve testing efficiency and development experience.

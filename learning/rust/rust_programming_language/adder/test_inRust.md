# Rust Testing Guide

## How to Write and Run Tests

### What is Testing

In Rust, a test is a function that verifies whether non-test code functions as expected.

Test function bodies typically perform 3 operations:

1. **Arrange** the required data and state
2. **Act** by running the code being tested
3. **Assert** the results

### Anatomy of Test Functions

Test functions need to be annotated with the `test` attribute:

- **Attribute** is metadata for a piece of Rust code. It doesn't change the logic of the code it decorates, only provides decoration or annotation
- Adding `#[test]` on the line above a function turns it into a test function

### Creating a Test Project

Create a library project called `adder` with the following command:

```bash
cargo new adder --lib
```

Opening the `lib.rs` file, you can see there's a `tests` module and test function:

![Test code structure](./img/test_content.png)

**Note:** `it_works()` is a test function because it's decorated with the `#[test]` attribute, not because it's located in a `tests` module. The `tests` module can also contain regular non-test functions.

## Running Tests

Use the `cargo test` command to run all test functions:

- Rust builds a Test Runner executable file
- It runs functions annotated with `test` and reports whether they run successfully
- When creating a library project with cargo, it generates a test module with a test function
- You can add any number of test modules or functions to a project

### Test Execution Process

The test execution order is:

1. **Compilation phase**: `Compiling adder`
2. **Compilation complete**: `Finished`, also prints compilation time
3. **Running tests**: `Running`, executes the generated `adder-***.exe` located in the `target\debug\deps\` folder

![Successful test run](./img/cargo_run_test.png)

### Understanding Test Results

When running `cargo test`, the output includes the following information:

![Test results with one test](./img/testPassed_explaination.png)

The metrics mean:

- **1 passed**: 1 test passed
- **0 failed**: 0 tests failed
- **0 ignored**: 0 tests were ignored (tests can be marked to be ignored and skipped during execution)
- **0 measured**: indicates 0 performance tests
- **0 filtered out**: indicates no tests were filtered out

**Doc-tests adder**: This is the result of documentation tests. Rust can compile code that appears in API documentation, ensuring documentation always stays synchronized with actual code.

## Test Failures

When a test function triggers a `panic`, it indicates test failure.

- Each test runs in an independent thread
- The main thread monitors these threads; when it sees a thread crash, that test is marked as failed

### Intentionally Failing Test Example

```rust
#[test]
fn another() {
    panic!("Make this test fail")
}
```

When running code containing failing tests, the output looks like this:

![Failed test output](./img/test_error.png)

Failure information includes:

- Which specific test failed
- The reason for failure (panic message)
- Location of failure (file and line number)
- Option to use `RUST_BACKTRACE=1` environment variable to display detailed stack trace

## Practical Code Example

Based on the provided `lib.rs` file, here's a complete test example:

```rust
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exploration() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn another() {
        panic!("Make this test fail")
    }
}
```

This example includes:

- A simple `add` function
- A successful test `exploration`
- An intentionally failing test `another`

When running both tests, you can see the mixed results.

## Summary

Rust's testing system provides powerful and easy-to-use testing functionality:

1. Use the `#[test]` attribute to mark test functions
2. Use `cargo test` to run all tests
3. Tests run in independent threads without interfering with each other
4. Provides detailed test results and failure information
5. Supports documentation testing to keep code and documentation synchronized

Writing and running tests ensures code correctness and reliability, which is one of the best practices in Rust development.

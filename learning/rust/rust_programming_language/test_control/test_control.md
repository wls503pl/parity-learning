# Rust Test Control Guide

## Project Structure

![testControl_structure](./img/test_control_structure.png)

## Integration Tests Setup

For this project, we use integration tests by creating a `tests` directory at the project root level (same level as `src`). This approach is recommended when you already have unit tests in your `lib.rs` file and want to run tests independently.

### Integration Test File Examples

#### Basic Integration Test

```rust
// tests/test_byName.rs
pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_two_and_two() {
        assert_eq!(4, add_two(2));
    }

    #[test]
    fn add_three_and_two() {
        assert_eq!(5, add_two(3));
    }

    #[test]
    fn one_hundred() {
        assert_eq!(102, add_two(100));
    }
}
```

#### Integration Test with Ignored Tests

```rust
// tests/test_ignore.rs
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(4, 2 + 2);
    }

    #[test]
    #[ignore]
    fn expensive_test() {
        assert_eq!(5, 1 + 1 + 1 + 1 + 1);
    }
}
```

## Running Tests by Name

### Running Specific Integration Test Files

To run a specific integration test file:

```bash
cargo test --test test_byName
```

This command runs all tests within the `test_byName.rs` file.

### Running Single Test by Name

To run a single specific test function:

```bash
cargo test --test test_byName add_two_and_two
```

![Running Single Test](img/test_by_name/run_single_test.png)

This runs only the `add_two_and_two` test function from the `test_byName.rs` file.

### Running Multiple Tests by Name Pattern

If you want to run multiple tests that match a pattern (e.g., all tests starting with "add"):

```bash
cargo test --test test_byName add
```

![Running Multiple Tests by Pattern](img/test_by_name/run_multiple_test.png)

This command runs both `add_two_and_two` and `add_three_and_two` tests because both contain "add" in their names.

### Running Tests by Subset of Names

You can pass test names as arguments to `cargo test`. Note that you can only pass one pattern argument, but it can match multiple tests:

```bash
# Run tests containing "two" in their names
cargo test --test test_byName two

# Run tests containing "hundred" in their names
cargo test --test test_byName hundred
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

## Test Selection Examples

### Running All Tests in Project

```bash
cargo test
```

### Running Only Integration Tests

```bash
cargo test --test '*'
```

### Running Specific Integration Test File

```bash
cargo test --test test_byName
```

### Running Specific Test Function in Integration Test

```bash
cargo test --test test_byName add_two_and_two
```

### Running Tests by Name Pattern in Integration Test

```bash
# Run all tests containing "add" in the name
cargo test --test test_byName add

# Run all tests containing "two" in the name
cargo test --test test_byName two
```

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

# Run specific integration test with pattern
cargo test --test test_file_name pattern
```

### Ignoring Tests

Sometimes you have tests that are time-consuming and you want to skip them during regular test runs to save time. You can use the `#[ignore]` attribute to mark these tests.

```rust
#[test]
#[ignore]
fn expensive_test() {
    // Time-consuming test code
}
```

#### Example: Test File with Ignored Tests

```rust
// tests/test_ignore.rs
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(4, 2 + 2);
    }

    #[test]
    #[ignore]
    fn expensive_test() {
        assert_eq!(5, 1 + 1 + 1 + 1 + 1);
    }
}
```

#### Running Ignored Tests

**Important Note**: The `--ignored` parameter must be placed **after** `--`, not directly after `cargo test`.

```bash
# ❌ Wrong: This will cause an error
cargo test --test test_ignore --ignored

# ✅ Correct: Run only ignored tests
cargo test --test test_ignore -- --ignored

# ✅ Run all tests including ignored ones
cargo test --test test_ignore -- --include-ignored

# ✅ Run only normal tests (default behavior)
cargo test --test test_ignore
```

#### Test Execution Results

When running normal tests (default behavior):
![Normal Test Run](img/test_ignore/expensive_ignored.png)

The output shows:

- `it_works` test passes normally
- `expensive_test` is ignored (not executed)
- Result: "1 passed; 0 failed; 1 ignored"

When running only ignored tests:
![Running Ignored Tests](img/test_ignore/run_ignored.png)

The output shows:

- Only `expensive_test` is executed
- `it_works` is filtered out
- Result: "1 passed; 0 failed; 0 ignored; 1 filtered out"

#### Time-Efficient Testing Strategy

This approach allows for efficient time management:

- **During development**: Skip time-consuming tests with default `cargo test`
- **Before release**: Run all tests including ignored ones with `-- --include-ignored`
- **Specific testing**: Run only expensive tests when needed with `-- --ignored`

## Important Notes About Integration Tests

1. **No `#[cfg(test)]` needed**: Integration test files don't need the `#[cfg(test)]` attribute at the file level
2. **Import your crate**: Use `use your_crate_name::*;` to import functions from your library
3. **Independent execution**: Each integration test file is compiled as a separate crate
4. **Public API only**: Integration tests can only access public APIs of your crate

## Summary

Cargo's test control features provide flexible test execution options:

- Control test behavior through command-line arguments
- Support both parallel and sequential execution modes
- Selectively display test output
- Run specific tests or test patterns by name
- Support both unit tests and integration tests
- Facilitate debugging and problem identification

Proper use of these features can significantly improve testing efficiency and development experience. The integration test approach is particularly useful when you want to test your crate's public API in isolation from unit tests.

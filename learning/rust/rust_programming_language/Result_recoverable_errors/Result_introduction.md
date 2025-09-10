# Result and Recoverable Errors in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 10, 2025

## Introduction

In Rust, error handling is a fundamental aspect of writing robust and reliable code. The `Result` enum is Rust's primary mechanism for handling recoverable errors, providing a type-safe way to represent operations that might fail.

## The Result Enum

The `Result` enum is defined as follows:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Where:

- **T**: The data type returned by the `Ok` variant when the operation succeeds (操作成功的情况下，Ok 变体里面返回的数据类型)
- **E**: The data type returned by the `Err` variant when the operation fails (操作失败情况下，Err 变体里面返回的数据类型)

The `Result` enum allows functions to communicate whether an operation succeeded or failed, and if it failed, what kind of error occurred. The `open` function needs some way to notify users whether this call was successful, which is exactly the functionality provided by the `Result` enum.

## Handling Result with Match Expressions

### Basic Error Handling

The most fundamental way to handle `Result` is using a `match` expression. Like the `Option` enum, `Result` and its variants are imported by the prelude, so you don't need the `Result::` prefix when using the `Ok` and `Err` variants:

```rust
use std::fs::File;

fn main() {
    // File::open returns std::result::Result<std::fs::File, std::io::Error>
    let f = File::open("hello.txt"); // File doesn't exist

    let _f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("Error opening file {:?}", error);
        }
    };
}
```

In this example:

- `File::open()` returns `std::result::Result<std::fs::File, std::io::Error>`
- We use pattern matching to handle both success and failure cases
- Like `Option`, `Result` and its variants (`Ok`, `Err`) are imported by the prelude, so no `Result::` prefix is needed

**Output when file doesn't exist:**

![file_not_found.png](./src/file_not_found.png)
_Figure 1: Error output when using basic match expression - shows panic message with error details_

### Matching Different Error Types

For more sophisticated error handling, you can match on specific error kinds. While `match` is very useful, it can be quite primitive when you have many nested matches:

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let _f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Error creating file: {:?}", e),
            },
            other_error => panic!("Error opening the file: {:?}", other_error),
        },
    };
}
```

This example demonstrates nested matching:

- First, we match on the `Result`
- If it's an error, we match on the specific `ErrorKind`
- For `NotFound` errors, we attempt to create the file
- For other errors, we panic with a descriptive message

The above example uses many `match` statements. While `match` is powerful, it can become verbose for simple cases. Later, we'll use closures with `Result<T, E>` methods that:

- Accept closures as parameters
- Are implemented using `match` internally
- Make code more concise

## Convenience Methods: unwrap and expect

### The unwrap Method

`unwrap()` is a shortcut method that simplifies the basic match pattern:

```rust
use std::fs::File;

/*
 * fn main()
 * {
 *   let f = File::open("hello.txt");
 *
 *   let f = match f {
 *       Ok(file) => file,
 *       Err(error) => {
 *           panic!("Error opening file {:?}", error);
 *       }
 *   }
 * }
 */

// The above code can be shortened to
fn main() {
    // If the result of Result is Ok, return the value in Ok; if the result of Result is Err, call the panic! macro
    // 'unwrap' cannot customize error messages
    let _f = File::open("hello.txt").unwrap();
}
```

**Important Notes about unwrap:**

- Returns the value if `Ok`, panics if `Err`
- Cannot customize error messages (unwrap 无法自定义错误信息)
- Should be used sparingly in production code
- Useful for prototyping and examples where you want to fail fast

**Output when using unwrap:**

![Result_unwrap.png](./src/Result_unwrap.png)
_Figure 2: Error output when using unwrap() method - shows default panic message_

### The expect Method

`expect()` is similar to `unwrap()` but allows you to specify a custom error message:

```rust
use std::fs::File;

fn main() {
    // Similar to 'unwrap', but 'expect' can specify an error message
    let _f = File::open("hello.txt").expect("Can't open File hello.txt!");
}
```

**Advantages of expect over unwrap:**

- Provides meaningful context when panicking
- Makes debugging easier by showing intent
- Better for cases where failure indicates a programming error

**Output when using expect:**

![Result_expect.png](./src/Result_expect.png)
_Figure 3: Error output when using expect() method - shows custom error message followed by underlying error details_

## Error Output Comparison

Based on the execution results from the three approaches:

1. **Basic match failure**: Shows custom panic message with error debugging information
2. **unwrap failure**: Shows the default panic message with file path and error details using `Result::unwrap()`
3. **expect failure**: Shows the custom message "Can't open File hello.txt!" followed by the underlying error details

## Best Practices

1. **Use match for complex error handling** where you need different behavior for different error types
2. **Use expect for cases where failure indicates a programming error** and you want meaningful error messages
3. **Avoid unwrap in production code** unless you're certain the operation cannot fail
4. **Consider using the `?` operator** for propagating errors (covered in advanced topics)
5. **Use closures and Result's methods** for more concise error handling (covered in advanced topics)

## Advanced Topics (Preview)

The `Result<T, E>` type has many methods that accept closures as parameters. These methods are implemented using `match` internally but provide more concise and functional programming approaches to error handling. Topics for future exploration include:

- The `?` operator for error propagation
- Combinators like `map`, `map_err`, `and_then`, `or_else`
- Converting between `Result` and `Option`
- Custom error types and the `From` trait

## Conclusion

The `Result` enum is a cornerstone of Rust's approach to reliable error handling. By forcing developers to explicitly handle both success and failure cases, Rust helps prevent many common programming errors while maintaining zero-cost abstractions. Understanding `Result` and its associated methods is essential for writing idiomatic and robust Rust code.

---

## Code Examples Summary

### Result_1.rs - Basic Match Expression

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt"); // here hello.txt doesn't exist

    let _f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("Error opening file {:?}", error);
        }
    };
}
```

### Result_unwrap.rs - Using unwrap Method

```rust
use std::fs::File;

fn main() {
    let _f = File::open("hello.txt").unwrap();
}
```

### Result_ErrorKind.rs - Matching Different Error Types

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let _f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Error creating file: {:?}", e),
            },
            other_error => panic!("Error opening the file: {:?}", other_error),
        },
    };
}
```

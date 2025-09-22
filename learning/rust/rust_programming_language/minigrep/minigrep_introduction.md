# Minigrep Project Introduction

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 20, 2025  
**Last Updated:** September 22, 2025

## Project Overview

This document outlines the current progress of implementing a minigrep program, similar to the Linux `grep` command, using Rust programming language. The project follows a structured approach to build a command-line tool that searches for text patterns within files.

## Current Progress

### Phase 1: Basic Command Line Argument Handling ✅

The initial implementation successfully handles command line arguments using Rust's standard library:

- **Environment Integration**: Utilizes `std::env` to collect command line arguments
- **File Reading**: Implements basic file reading functionality with `std::fs`
- **Argument Processing**: Converts command line arguments into a vector of strings using `env::args().collect()`

**Key Features Implemented:**

- Command line argument collection and validation
- Basic file content reading and display
- Error handling with `expect()` for file operations

**Unicode Considerations:**

- Current implementation uses `env::args()` which handles standard Unicode
- For illegal Unicode characters, `env::args_os()` would be required (noted for future enhancement)

### Phase 2: Code Structure Analysis ✅

Identified several architectural improvements needed:

**Current Issues:**

- `main()` function handles multiple responsibilities (argument parsing + file reading)
- Variables `query` and `filename` serve as configuration storage
- Variable `contents` handles business logic
- Error handling is scattered throughout the code
- Generic error messages don't provide clear user guidance

### Phase 3: Refactoring - Module and Error Handling Improvements ✅

**Architectural Improvements Implemented:**

#### 1. Configuration Structure

- Created `Config` struct to encapsulate program configuration
- Centralized `query` and `filename` parameters
- Improved code organization and variable tracking

#### 2. Enhanced Error Handling

- Replaced `panic!` with proper `Result<T, E>` return types
- Implemented `Config::new()` constructor with error validation
- Added user-friendly error messages
- Integrated `unwrap_or_else()` for graceful error handling

#### 3. Process Management

- Added `std::process` for controlled program termination
- Implemented proper exit codes (status code 1 for errors)
- Improved error message presentation to users

**Code Structure:**

```rust
struct Config {
    query: String,
    filename: String,
}

impl Config {
    fn new(args: &[String]) -> Result<Config, &'static str> {
        // Validation and construction logic
    }
}
```

### Phase 4: Binary Program Separation of Concerns ✅

Following Rust best practices for binary program organization:

- **main.rs responsibilities:**

  - Command line argument parsing
  - Configuration setup
  - Calling library functions
  - Error handling from library operations

- **lib.rs responsibilities:**
  - Core business logic implementation
  - File processing algorithms
  - Search functionality
  - `run()` function with proper error handling using `Result<(), Box<dyn Error>>`

### Phase 5: Test-Driven Development (TDD) Implementation ✅

**TDD Methodology Applied:**

Test-Driven Development follows a specific cycle that has been implemented in this project:

1. **Write a failing test** - Create a test that fails, ensuring it fails for the expected reason
2. **Write minimal code** - Implement just enough code to make the new test pass
3. **Refactor** - Clean up the code while ensuring all tests continue to pass
4. **Repeat** - Return to step 1 and continue the cycle

**TDD Benefits Realized:**

- **Design Guidance**: TDD helps guide the design decisions during development
- **High Test Coverage**: Writing tests first maintains high test coverage throughout development
- **Confidence in Refactoring**: Comprehensive tests provide safety net for code changes

**Search Functionality Implementation:**

The core search functionality was developed using TDD principles:

```rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }

    results
}
```

**Test Implementation:**

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.
Duct tape."; // Add 'Duct' with a capital letter to make it case-sensitive.

        assert_eq!(vec!["safe, fast, productive."], search(query, contents))
    }
}
```

### Phase 6: Environment Variable Integration ✅

**Implementation Completed:**

Environment variable support has been successfully implemented to control case sensitivity behavior:

**Key Features:**

- **CASE_INSENSITIVE Environment Variable**: The program now checks for the `CASE_INSENSITIVE` environment variable
- **Dynamic Behavior Control**: When `CASE_INSENSITIVE` is set (to any value), the program performs case-insensitive searches
- **Default Case-Sensitive**: When the environment variable is not set, the program defaults to case-sensitive searching

**Technical Implementation:**

```rust
// Added to Config struct
pub struct Config {
    pub query: String,
    pub filename: String,
    pub case_sensitive: bool,  // New field added
}

// Environment variable logic in Config::new()
let case_sensitive = env::var("CASE_INSENSITIVE").is_err();
```

**Logic Explanation:**

- `env::var("CASE_INSENSITIVE")` returns `Result<String, VarError>`
- If the environment variable exists, it returns `Ok(value)`, making `is_err()` return `false`
- If the environment variable doesn't exist, it returns `Err`, making `is_err()` return `true`
- Therefore: `case_sensitive = true` when `CASE_INSENSITIVE` is **not** set (default behavior)
- And: `case_sensitive = false` when `CASE_INSENSITIVE` **is** set (case-insensitive mode)

### Phase 7: Case-Insensitive Search Implementation ✅

**New Functionality Added:**

Case-insensitive search capability has been implemented following TDD principles:

**Core Function:**

```rust
pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    let query = query.to_lowercase();

    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }

    results
}
```

**Integration with Main Logic:**

The `run()` function now dynamically selects the appropriate search function based on the configuration:

```rust
let results = if config.case_sensitive {
    search(&config.query, &contents)
} else {
    search_case_insensitive(&config.query, &contents)
};
```

**Test Coverage:**

Added comprehensive test for case-insensitive functionality:

```rust
#[test]
fn case_insensitive() {
    let query = "rUsT";
    let contents = "\
Rust:
safe, fast, productive.
Pick three.
Trust me.";

    assert_eq!(
        vec!["Rust:", "Trust me."],
        search_case_insensitive(query, contents)
    )
}
```

**Test Analysis:**

- Query `"rUsT"` (mixed case) successfully matches both `"Rust:"` and `"Trust me."`
- Demonstrates proper case-insensitive matching regardless of input case variations
- Validates that original line content is preserved in results (not converted to lowercase)

## Implementation Verification

**Command Line Usage Examples:**

1. **Default Case-Sensitive Search:**

```bash
cargo run body poem.txt
```

Output: Shows only lines containing "body" with exact case matching

2. **Case-Insensitive Search:**

```bash
$env:CASE_INSENSITIVE=1; cargo run to poem.txt
```

Output: Shows all lines containing "to", "TO", "To", etc.

**Test Results:**

Based on the provided execution screenshots, the program successfully:

- ✅ Handles basic case-sensitive search (`cargo run body poem.txt`)
- ✅ Returns appropriate results for non-matching queries (`cargo run 111 poem.txt` - no output)
- ✅ Processes environment variable configuration (`$env:CASE_INSENSITIVE=1; cargo run to poem.txt`)
- ✅ Executes case-insensitive searches correctly

## Technical Specifications

**Language:** Rust  
**Dependencies:**

- `std::env` - Environment variable access and command line arguments
- `std::fs` - File system operations
- `std::process` - Process control
- `std::error::Error` - Error trait for comprehensive error handling

**Error Handling Strategy:**

- Result-based error propagation
- User-friendly error messages
- Graceful program termination
- `Box<dyn Error>` for flexible error type handling

**Testing Framework:**

- Built-in Rust testing with `#[cfg(test)]`
- Unit tests for core functionality
- Test-driven development approach
- Comprehensive test coverage for both case-sensitive and case-insensitive scenarios

**Lifetime Management:**

- Proper lifetime annotations (`<'a>`) for string slice returns
- Memory-safe reference handling in search functions
- Zero-copy string processing for performance efficiency

## Current Status

The project has successfully completed all major foundational phases:

- ✅ Basic argument handling
- ✅ Initial refactoring for better code organization
- ✅ Improved error handling mechanisms
- ✅ Configuration structure implementation
- ✅ Separation of concerns (main.rs/lib.rs split)
- ✅ Core search functionality with TDD
- ✅ Comprehensive testing framework
- ✅ **Environment variable integration**
- ✅ **Case-insensitive search functionality**

**Completed Features:**

1. **Robust Command Line Interface**: Proper argument validation and error handling
2. **Flexible Search Modes**: Both case-sensitive and case-insensitive search capabilities
3. **Environment-Based Configuration**: Dynamic behavior control via environment variables
4. **Comprehensive Testing**: Full test coverage for all search scenarios
5. **Production-Ready Error Handling**: Graceful failure modes and user-friendly messages

## Planned Future Enhancements

### Phase 8: Standard Error Output (Planned)

- Redirect error messages to standard error stream (`stderr`)
- Separate error output from standard program output (`stdout`)
- Improve integration with shell pipelines and redirection

### Phase 9: Performance Optimization (Planned)

- Large file handling optimizations
- Memory usage improvements
- Streaming search for very large files

### Phase 10: Advanced Features (Planned)

- Regular expression support
- Multi-file search capabilities
- Recursive directory searching
- Line number reporting

## Learning Outcomes

This project demonstrates practical application of:

- Rust command line programming
- Error handling best practices
- Code refactoring techniques
- Modular programming principles
- **Test-driven development (TDD) methodology**
- **Lifetime annotations in Rust**
- **Iterator patterns and functional programming concepts**
- **Environment variable integration**
- **String manipulation and case handling**

**TDD Specific Learning:**

- Understanding the red-green-refactor cycle
- Writing tests before implementation
- Maintaining high test coverage
- Using tests to drive API design decisions
- Iterative development with continuous validation

**Advanced Rust Concepts:**

- Lifetime parameter usage (`<'a>`) for memory safety
- Reference borrowing patterns in search functions
- Environment variable handling and integration
- Dynamic function dispatch based on configuration
- Error propagation with `?` operator

The minigrep implementation serves as an excellent introduction to building robust command-line tools in Rust while following industry best practices for code organization, error management, test-driven development, and feature extensibility.

## Project Structure

```
minigrep/
├── src/
│   ├── lib.rs          # Core library functionality
│   ├── main.rs         # Binary entry point
├── poem.txt            # Test file
├── Cargo.toml          # Project configuration
└── target/             # Build artifacts
```

**File Responsibilities:**

- **lib.rs**: Contains `Config` struct with case sensitivity support, `run()` function, `search()` and `search_case_insensitive()` functions, and comprehensive tests
- **main.rs**: Handles command line interface and calls library functions
- **poem.txt**: Sample text file for testing search functionality

**Final Implementation Status:**

The minigrep project is now feature-complete for its initial scope, providing a fully functional grep-like utility with both case-sensitive and case-insensitive search capabilities, robust error handling, and comprehensive test coverage. The implementation demonstrates professional-level Rust programming practices and serves as an excellent foundation for further enhancements.

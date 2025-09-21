# Minigrep Project Introduction

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 20, 2025  
**Last Updated:** September 21, 2025

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
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents))
    }
}
```

**Functional Integration:**

The search function is now integrated into the main program flow:

- `run()` function calls `search()` with query and file contents
- Results are iterated and printed line by line
- Proper error handling maintains robustness

**Test Execution Results:**

Based on the provided terminal output, the program successfully:

- Searches for "body" in poem.txt and finds matching lines
- Searches for "111" in poem.txt (no matches found, no output)
- Demonstrates working search functionality

## Planned Implementation Phases

### Phase 6: Environment Variable Integration (Planned)

- Support for environment-based configuration
- Enhanced flexibility for different operating environments

### Phase 7: Standard Error Output (Planned)

- Redirect error messages to standard error stream
- Separate error output from standard program output

### Phase 8: Case-Insensitive Search (Planned)

- Add environment variable support for case-insensitive searching
- Implement additional test cases for case sensitivity scenarios

## Technical Specifications

**Language:** Rust  
**Dependencies:**

- `std::env` - Environment variable access
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

## Current Status

The project has successfully completed the foundational phases including:

- ✅ Basic argument handling
- ✅ Initial refactoring for better code organization
- ✅ Improved error handling mechanisms
- ✅ Configuration structure implementation
- ✅ Separation of concerns (main.rs/lib.rs split)
- ✅ Core search functionality with TDD
- ✅ Comprehensive testing framework

**Next Steps:**

1. Add environment variable support for case-insensitive search
2. Implement standard error output redirection
3. Add more comprehensive test scenarios
4. Performance optimization for large files

## Learning Outcomes

This project demonstrates practical application of:

- Rust command line programming
- Error handling best practices
- Code refactoring techniques
- Modular programming principles
- **Test-driven development (TDD) methodology**
- **Lifetime annotations in Rust**
- **Iterator patterns and functional programming concepts**

**TDD Specific Learning:**

- Understanding the red-green-refactor cycle
- Writing tests before implementation
- Maintaining high test coverage
- Using tests to drive API design decisions

The minigrep implementation serves as an excellent introduction to building robust command-line tools in Rust while following industry best practices for code organization, error management, and test-driven development.

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

- **lib.rs**: Contains `Config` struct, `run()` function, `search()` function, and tests
- **main.rs**: Handles command line interface and calls library functions
- **poem.txt**: Sample text file for testing search functionality

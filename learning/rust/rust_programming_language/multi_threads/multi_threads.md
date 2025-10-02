# Rust Multi-Threading: Fearless Concurrency

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 2, 2025

---

## Core Concepts

### Concurrency vs Parallelism

- **Concurrent**: Different parts execute independently
- **Parallel**: Different parts run simultaneously

Rust's **Fearless Concurrency** enables bug-free concurrent code that's easy to refactor.

### Threading Challenges

- **Race conditions**: Inconsistent data access order
- **Deadlocks**: Threads waiting for each other's resources
- **Non-deterministic bugs**: Hard to reproduce and fix

### Rust's Threading Model

Rust standard library provides **1:1 model** (OS-level threads) for minimal runtime overhead.

---

## Creating and Managing Threads

### Basic Thread Creation

```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
    // Spawned thread stops when main thread ends
}
```

### Using JoinHandle

`JoinHandle` ensures threads complete before program exits:

```rust
let handle = thread::spawn(|| {
    for i in 1..10 {
        println!("hi number {} from the spawned thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
});

for i in 1..5 {
    println!("hi number {} from the main thread!", i);
    thread::sleep(Duration::from_millis(1));
}

handle.join().unwrap(); // Blocks until spawned thread completes
```

---

## Move Closures

### The Problem

Without `move`, closures borrow variables, but spawned threads may outlive those variables:

```rust
let v = vec![1, 2, 3];
let handle = thread::spawn(|| {
    println!("Here's a vector: {:?}", v); // ERROR: v might be dropped
});
```

### The Solution

Use `move` to transfer ownership:

```rust
let v = vec![1, 2, 3];
let handle = thread::spawn(move || {
    println!("Here's a vector: {:?}", v); // OK: ownership transferred
});
handle.join().unwrap();
```

---

## Execution Results

### Success with `move`

![Successful execution with move closure](img/move_closure.png)

Program executes successfully, printing: `Here's a vector: [1, 2, 3]`

### Error without `move`

![Compilation error without move keyword](img/ownership_error.png)

**Compiler Error:**

```
error[E0373]: closure may outlive the current function, but it borrows `v`
  --> src\move_closure.rs:5:32
   |
5  |     let handle = thread::spawn(|| {
   |                                ^^ may outlive borrowed value `v`
```

**Explanation:** The closure borrows `v` but the spawned thread requires `'static` lifetime. Using `move` transfers ownership, satisfying the lifetime requirement.

---

## Key Takeaways

1. **Ownership rules** prevent data races at compile time
2. **JoinHandle** ensures thread completion
3. **Move closures** transfer ownership for thread safety
4. Rust catches concurrency bugs before runtime

The compiler's strict checks enable safe, concurrent programming without runtime overhead.

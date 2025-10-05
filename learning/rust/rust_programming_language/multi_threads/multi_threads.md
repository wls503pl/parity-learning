# Rust Multi-Threading: Fearless Concurrency

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 6, 2025

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

---

## Message Passing with Channels

### Philosophy

Go language motto: **"Don't communicate by sharing memory; share memory by communicating"**

Rust achieves safe concurrency through **message passing** - threads (or actors) communicate by sending data to each other.

### Channel Basics

**Channel** consists of two parts:

- **Sender (Transmitter)**: Sends data
- **Receiver**: Checks and receives incoming data

A channel "closes" when either the sender or receiver is dropped.

### Creating Channels

Use `mpsc::channel` to create a channel:

- **mpsc** = Multiple Producer, Single Consumer
- Returns a tuple: `(sender, receiver)`

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### Sender Methods

**`send()`** method:

- Parameter: Data to send
- Returns: `Result<T, E>`
- Returns error if receiver has been dropped

### Receiver Methods

**`recv()`** method:

- Blocks current thread until a value arrives
- Returns `Result<T, E>` when value received
- Returns error when sender is closed

**`try_recv()`** method:

- Non-blocking
- Immediately returns `Result<T, E>`:
  - `Ok` with data if available
  - `Err` if no data
- Typically used in a loop to check for messages

### Ownership Transfer in Channels

Ownership plays a crucial role in message passing, ensuring safe concurrent code:

```rust
thread::spawn(move || {
    let val = String::from("hi");
    tx.send(val).unwrap();
    println!("val is {}", val); // ERROR: val moved
});
```

![Ownership error after send](img/move_inChannel.png)

**Error:** After `send(val)`, ownership is transferred to the channel. Attempting to use `val` afterwards causes a compilation error. This prevents data races by ensuring only one thread can access the data at a time.

### Sending Multiple Values

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

The receiver can iterate over the channel, blocking until each message arrives.

### Multiple Producers

Create multiple senders by cloning:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx1 = mpsc::Sender::clone(&tx);

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    thread::spawn(move || {
        let vals = vec![
            String::from("1: hi"),
            String::from("1: from"),
            String::from("1: the"),
            String::from("1: thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

![Multiple senders execution result](img/multi_sender.png)

**Result:** Messages from both senders are interleaved as they arrive. The receiver processes all messages from multiple producers through a single channel, demonstrating the "multiple producer, single consumer" pattern.

---

## Shared-State Concurrency with Mutex

### Philosophy

While message passing is excellent for concurrency, shared memory is another valid approach. Rust's motto extended: **"Share memory by communicating, but when you need shared state, use Mutex safely."**

### What is Mutex?

**Mutex** (mutual exclusion) allows only one thread to access data at a time.

Key concepts:

- **Lock**: Must be acquired before accessing data
- **Unlock**: Must be released after finishing with data
- Rust's type system prevents forgetting to acquire/release locks

### Mutex API

- `Mutex::new(data)`: Creates a new mutex wrapping the data
- `lock()`: Acquires the lock, blocking if necessary
  - Returns `LockResult<MutexGuard<T>>`
  - `unwrap()` handles potential poisoning (when a thread panics while holding the lock)
- **MutexGuard**: Smart pointer that automatically releases the lock when dropped

### Single-Threaded Mutex Example

```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    } // lock Drop here

    println!("m = {:?}", m);
}
```

![Single mutex execution](img/single_mutex.png)

**Output:** `m = Mutex { data: 6, poisoned: false, .. }`

**Explanation:** The mutex wraps the value `5`. We acquire the lock, modify the value to `6`, and the lock is automatically released when `num` goes out of scope. The debug output shows the mutex's internal state including the data value.

### Multi-Threaded Mutex with Arc

To share a mutex across multiple threads, we need **Arc** (Atomic Reference Counting):

- `Arc<T>`: Thread-safe reference counting pointer
- Similar to `Rc<T>` but uses atomic operations
- Safe to use across multiple threads

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

![Multiple mutex execution](img/multi_mutex.png)

**Output:** `Result: 10`

**Explanation:** Ten threads each increment a shared counter protected by a mutex. The `Arc` allows multiple ownership across threads, while the `Mutex` ensures only one thread can modify the counter at a time. All threads complete successfully, and the final result is `10`, demonstrating safe concurrent mutation.

### Why Arc Instead of Rc?

`Rc<T>` is not thread-safe because:

- It doesn't use atomic operations for reference counting
- Multiple threads could simultaneously modify the count, causing data races

`Arc<T>` uses atomic operations, providing thread-safe reference counting at a small performance cost.

### Mutex Safety Guarantees

Rust's type system provides several guarantees:

1. **Cannot forget to acquire lock**: The data inside `Mutex<T>` is only accessible through `lock()`
2. **Cannot access data without lock**: Type system enforces this at compile time
3. **Automatic lock release**: `MutexGuard` implements `Drop`, ensuring the lock is released
4. **Send + Sync traits**: Compiler verifies the mutex can be safely shared across threads

### Potential Issues with Mutex

**Deadlock risk:** While Rust prevents data races, it cannot prevent logical errors like deadlocks:

```rust
// Example: Potential deadlock scenario
let m1 = Arc::new(Mutex::new(1));
let m2 = Arc::new(Mutex::new(2));

// Thread 1: locks m1, then m2
// Thread 2: locks m2, then m1
// Can cause deadlock if timing is unfortunate
```

**Best practices:**

- Keep critical sections (locked code) short
- Avoid nested locks when possible
- Use consistent lock ordering if multiple locks are needed
- Consider using channels instead of shared state when appropriate

---

## Extensible Concurrency with Send and Sync Traits

### Understanding Rust's Concurrency Model

Rust's concurrency features are primarily provided by the **standard library** rather than the language itself. This design allows for:

- **Flexibility**: You're not limited to standard library concurrency primitives
- **Extensibility**: You can implement custom concurrency solutions
- **Language simplicity**: Core language remains minimal

However, two concurrency concepts are embedded in the language: **`std::marker::Send`** and **`std::marker::Sync`**.

### Marker Traits

Both `Send` and `Sync` are **marker traits**:

- They define no methods
- They exist purely to convey semantic guarantees to the compiler
- They enable the type system to enforce thread safety at compile time

---

### The Send Trait

**`Send`** indicates a type's ownership can be transferred between threads.

#### Characteristics

- **Almost universal**: Nearly all Rust types implement `Send`
- **Notable exception**: `Rc<T>` does not implement `Send`
  - `Rc<T>` is designed for single-threaded scenarios only
  - Using `Rc<T>` across threads could cause race conditions in reference counting
- **Composability**: Any type composed entirely of `Send` types is automatically `Send`
- **Primitive types**: Almost all primitive types are `Send`
  - Exception: Raw pointers are not `Send`

#### Why Rc is Not Send

```rust
// This won't compile - Rc is not Send
use std::rc::Rc;
use std::thread;

let rc = Rc::new(5);
thread::spawn(move || {
    println!("{}", rc); // ERROR: Rc cannot be sent between threads
});
```

**Solution**: Use `Arc<T>` (Atomic Rc) for thread-safe reference counting.

---

### The Sync Trait

**`Sync`** indicates it's safe to reference a type from multiple threads.

#### Key Concept

A type `T` is `Sync` if and only if `&T` is `Send`:

- If you can safely send an immutable reference to another thread, the type is `Sync`
- This ensures multiple threads can safely hold references to the same data

#### Characteristics

- **Primitive types**: All basic types are `Sync`
- **Composability**: Types composed entirely of `Sync` types are automatically `Sync`
- **Common non-Sync types**:
  - `Rc<T>`: Not thread-safe for the same reasons it's not `Send`
  - `RefCell<T>` and `Cell<T>`: Interior mutability without synchronization
  - Raw pointers

#### Thread-Safe Types

- **`Mutex<T>` is `Sync`**: Provides safe shared mutable access across threads
- **`Arc<T>` is both `Send` and `Sync`**: When `T` is `Send + Sync`
  - Enables safe shared ownership across threads

#### Example: Why RefCell is Not Sync

```rust
// RefCell provides interior mutability without thread safety
use std::cell::RefCell;

let cell = RefCell::new(5);
// Cannot share &cell across threads - RefCell is not Sync
// The borrow checking happens at runtime, not thread-safe
```

---

### Relationships Between Send and Sync

Understanding how these traits interact:

| Type                      | Send? | Sync? | Reason                                   |
| ------------------------- | ----- | ----- | ---------------------------------------- |
| `i32`, `String`, `Vec<T>` | ✓     | ✓     | Basic types, safe to share               |
| `Rc<T>`                   | ✗     | ✗     | Non-atomic reference counting            |
| `Arc<T>`                  | ✓     | ✓     | Atomic reference counting                |
| `RefCell<T>`, `Cell<T>`   | ✓     | ✗     | Runtime borrow checking, not thread-safe |
| `Mutex<T>`                | ✓     | ✓     | Synchronized access                      |
| `MutexGuard<T>`           | ✗     | ✓     | Lock must be released on same thread     |

---

### Manual Implementation is Unsafe

**Implementing `Send` and `Sync` manually requires `unsafe` code.**

```rust
// Implementing these traits is unsafe
unsafe impl Send for MyType {}
unsafe impl Sync for MyType {}
```

#### Why Manual Implementation is Dangerous

- You must **guarantee thread safety** manually
- The compiler cannot verify your implementation is correct
- Mistakes can lead to data races and undefined behavior
- Requires deep understanding of:
  - Memory ordering
  - Synchronization primitives
  - Platform-specific thread behavior

#### Best Practice

**Don't manually implement `Send` and `Sync` unless absolutely necessary.**

Instead:

- Build types from components that are already `Send`/`Sync`
- The compiler will automatically implement these traits
- Let Rust's type system ensure thread safety

```rust
// This struct is automatically Send + Sync
// because Arc and Mutex are Send + Sync
struct ThreadSafeCounter {
    counter: Arc<Mutex<i32>>,
}

// No manual implementation needed!
// The compiler knows this is safe
```

---

### Compiler Enforcement

Rust's compiler uses `Send` and `Sync` to prevent concurrency bugs:

```rust
use std::rc::Rc;
use std::thread;

let rc = Rc::new(5);

// Compiler error: Rc<i32> cannot be sent between threads
thread::spawn(move || {
    println!("{}", rc);
});
// Error: `Rc<i32>` cannot be sent between threads safely
```

The error occurs at **compile time**, preventing potential runtime crashes.

---

### Summary

The `Send` and `Sync` traits form the foundation of Rust's thread safety:

1. **Send**: Enables transferring ownership between threads
2. **Sync**: Enables sharing references between threads
3. **Automatic implementation**: Most types automatically implement these traits
4. **Compiler verified**: Thread safety is checked at compile time
5. **Unsafe to implement manually**: Requires careful reasoning and `unsafe` code

By leveraging these traits, Rust achieves **fearless concurrency** - the compiler prevents data races while allowing powerful concurrent programming patterns.

---

## Complete Examples Summary

The project structure demonstrates key concurrency patterns:

```
multi_threads/
├── src/
│   ├── main.rs              # Main entry point
│   ├── channel.rs           # Message passing examples
│   ├── move_closure.rs      # Ownership transfer in threads
│   ├── single_mutex.rs      # Single-threaded mutex
│   └── multi_mutex.rs       # Multi-threaded mutex with Arc
├── img/
│   ├── move_closure.png     # Successful move execution
│   ├── ownership_error.png  # Ownership error example
│   ├── move_inChannel.png   # Channel ownership transfer
│   ├── multi_sender.png     # Multiple producers result
│   ├── single_mutex.png     # Single mutex output
│   └── multi_mutex.png      # Multi-threaded counter result
└── multi_threads.md         # This documentation
```

---

## Conclusion

Rust's approach to concurrency leverages three key principles:

1. **Ownership and borrowing**: Prevents data races at compile time
2. **Type system**: Enforces safe concurrent access patterns
3. **Zero-cost abstractions**: Safety without runtime overhead

Choose your concurrency primitive based on your needs:

- **Channels**: When threads need to communicate by passing data
- **Mutex + Arc**: When threads need shared mutable state
- **Thread spawning**: When you need true parallelism

Rust's compiler catches most concurrency bugs before your code runs, enabling **fearless concurrency** - write concurrent code with confidence that it's safe.

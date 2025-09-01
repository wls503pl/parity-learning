# Rust Ownership: A Complete Guide

## What is Ownership?

Ownership is Rust's most unique feature that enables **memory safety without garbage collection**.

### The Problem Ownership Solves

Before Rust, languages handled memory in two ways:

- **Garbage Collection (GC)**: Runtime system automatically finds and cleans unused memory
- **Manual Management**: Programmers manually allocate and free memory (error-prone)

Rust uses a **third approach**: an ownership system with compile-time rules that ensure memory safety without runtime overhead.

### What Ownership Manages

1. **Tracking** which parts of code use which heap data
2. **Minimizing** duplicate data on the heap
3. **Cleaning up** unused heap data to prevent memory leaks

---

## The Three Ownership Rules

1. **Each value has exactly one owner** (a variable that owns it)
2. **Only one owner at a time** (no shared ownership)
3. **When the owner goes out of scope, the value is dropped**

---

## Memory Allocation: Stack vs Heap

### String Literals (Stack)

```rust
let s = "hello";  // Fixed size, stored on stack
```

- Content known at compile time
- Fast and efficient due to immutability
- Hardcoded into the executable

### String Type (Heap)

```rust
let mut s = String::from("hello");  // Dynamic size, stored on heap
```

- Supports mutability and unknown sizes
- Memory requested from OS at runtime
- Must be returned to OS when finished

---

## How Memory is Structured

When you create a `String`, it consists of three parts stored on the **stack**:

- **Pointer**: Points to the actual data on the heap
- **Length**: Current size of the string content
- **Capacity**: Total memory allocated by the OS

The actual string content lives on the **heap**.

```
Stack (s1):              Heap:
┌──────────┬───────┐       ┌───────┬───────┐
│   ptr    │   ●───┼─────▶│   0   │   h   │
├──────────┼───────┤       ├───────┼───────┤
│   len    │   5   │       │   1   │   e   │
├──────────┼───────┤       ├───────┼───────┤
│ capacity │   5   │       │   2   │   l   │
└──────────┴───────┘       ├───────┼───────┤
                           │   3   │   l   │
                           ├───────┼───────┤
                           │   4   │   o   │
                           └───────┴───────┘
```

---

## Move Semantics

### What Happens During Assignment

```rust
let s1 = String::from("hello");
let s2 = s1;  // This is a MOVE, not a copy
```

**What gets copied**: Only the stack data (pointer, length, capacity)
**What doesn't get copied**: The heap data itself

**Important**: After the move, `s1` becomes **invalid** and cannot be used.

### Code Example and Error Demonstration

Here's a practical example showing what happens when you try to use a moved value:

```rust
fn main() {
    let mut s1 = String::from("Hello");
    s1.push_str(", World!");
    println!("{}", s1);

    let s2 = s1;  // s1 is moved to s2
    println!("{}", s1);  // ERROR: s1 is no longer valid
}
```

![move_error](./img/move_error.png)

The error message clearly shows:

- **Error E0382**: `borrow of moved value: 's1'`
- **Explanation**: `move occurs because 's1' has type 'String', which does not implement the 'Copy' trait`
- **Result**: `value borrowed here after move`

### Why Move Instead of Copy?

This prevents the **double-free error**:

- If both `s1` and `s2` pointed to the same heap data
- When they go out of scope, both would try to free the same memory
- This would cause a crash

### The Design Principle

> **Rust's guarantee**: All automatic operations are cheap operations

- `let s2 = s1;` → Automatic, so it must be fast (Move)
- `let s2 = s1.clone();` → Explicit, can be expensive (Deep copy)

This means you always know the performance cost of your code just by looking at it.

---

## Deep Copying with Clone

If you truly want to perform a **deep copy** of heap data (not just the stack metadata), you can use the `clone()` method:

```rust
fn main() {
    let s1 = String::from("Hello");
    let s2 = s1.clone();  // Deep copy: both stack and heap data

    println!("s1:{}, s2:{}", s1, s2);  // Both s1 and s2 are valid
}
```

![clone()](./img/clone.png)

### Memory Layout After Clone

When you use `clone()`, both the stack data and heap data are duplicated:

```
Stack (s1):              Heap:
┌──────────┬───────┐       ┌───────┬───────┐
│   ptr    │   ●───┼─────▶│   0   │   h   │
├──────────┼───────┤       ├───────┼───────┤
│   len    │   5   │       │   1   │   e   │
├──────────┼───────┤       ├───────┼───────┤
│ capacity │   5   │       │   2   │   l   │
└──────────┴───────┘       ├───────┼───────┤
                           │   3   │   l   │
Stack (s2):                ├───────┼───────┤
┌──────────┬───────┐       │   4   │   o   │
│   ptr    │   ●───┼─┐     └───────┴───────┘
├──────────┼───────┤ │
│   len    │   5   │ │     ┌───────┬───────┐
├──────────┼───────┤ └───▶│   0   │   h   │
│ capacity │   5   │       ├───────┼───────┤
└──────────┴───────┘       │   1   │   e   │
                           ├───────┼───────┤
                           │   2   │   l   │
                           ├───────┼───────┤
                           │   3   │   l   │
                           ├───────┼───────┤
                           │   4   │   o   │
                           └───────┴───────┘
```

**Key Point**: `clone()` is **explicit** and potentially **expensive**, so you'll always know when deep copying occurs.

---

## Copy vs Move Behavior

### Types with Copy Trait

```rust
let x = 5;
let y = x;  // x is still valid (Copy)
```

Simple types like integers implement `Copy` trait and are actually duplicated.

#### What is the Copy Trait?

The `Copy` trait can be used for types that are stored entirely on the stack (like integers). If a type implements the `Copy` trait, the old variable remains usable after assignment.

**Important Rule**: If a type or any part of it implements the `Drop` trait, Rust will not allow it to implement the `Copy` trait (this would cause a compile-time error).

#### Types That Implement Copy

Some types that have the `Copy` trait:

- **All integer types**: `u32`, `i32`, etc.
- **Boolean type**: `bool`
- **Character type**: `char`
- **All floating-point types**: `f64`, `f32`, etc.
- **Tuples**: Only if all their fields are `Copy`
  - `(u32, i32)` implements `Copy`
  - `(u32, String)` does **NOT** implement `Copy`

Any simple scalar combinations can be `Copy`. Any types that need to allocate memory or resources are **NOT** `Copy`.

### Types without Copy Trait

```rust
let s1 = String::from("hello");
let s2 = s1;  // s1 is no longer valid (Move)
```

Complex types like `String` don't implement `Copy` and are moved instead.

---

## Summary: Copy, Move, and Clone

| Operation | When It Happens                | Performance           | Original Variable |
| --------- | ------------------------------ | --------------------- | ----------------- |
| **Copy**  | Automatic for `Copy` types     | Fast (stack only)     | Remains valid     |
| **Move**  | Automatic for non-`Copy` types | Fast (stack only)     | Becomes invalid   |
| **Clone** | Explicit call to `.clone()`    | Potentially expensive | Remains valid     |

---

## Key Takeaways

1. **Ownership prevents memory bugs** at compile time
2. **Move semantics** ensure no hidden performance costs
3. **One owner rule** eliminates data races and double-free errors
4. **Explicit cloning** when you actually need deep copies
5. **Copy trait** allows cheap duplication for stack-only types
6. **Zero runtime cost** - all checks happen at compile time

Understanding ownership means you rarely need to think about stack vs heap - the system handles memory safety automatically while maintaining performance.

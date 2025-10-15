# Advanced Features in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 25, 2025

---

## Part 1: Unsafe Rust

### Introduction

Rust has a hidden second language that doesn't enforce memory safety guarantees: **Unsafe Rust**.

#### Why Does Unsafe Rust Exist?

- **Static analysis is conservative**: The compiler may reject valid programs to ensure safety
- **Trust and responsibility**: Using unsafe Rust means telling the compiler "I know what I'm doing, and I accept the risks"
- **Low-level requirements**: Computer hardware is inherently unsafe, and Rust needs to support low-level systems programming

### The `unsafe` Keyword

Use the `unsafe` keyword to switch to unsafe Rust and create a block containing unsafe code.

#### Four Actions Permitted in Unsafe Rust

1. Dereferencing raw pointers
2. Calling unsafe functions or methods
3. Accessing or modifying mutable static variables
4. Implementing unsafe traits

#### Important Notes

- `unsafe` does **NOT** disable the borrow checker or other safety checks
- Memory safety errors must be contained within `unsafe` blocks
- Isolate unsafe code as much as possible—ideally, encapsulate it in safe abstractions that provide safe APIs

---

### 1. Dereferencing Raw Pointers

#### Raw Pointer Types

- **Immutable raw pointer**: `*const T` (cannot be directly assigned after dereferencing)
- **Mutable raw pointer**: `*mut T`

**Note:** The `*` here is part of the type name, not the dereference operator.

#### Differences Between Raw Pointers and References

Raw pointers:

- Can ignore borrowing rules (e.g., having both immutable and mutable pointers to the same location)
- Are not guaranteed to point to valid memory
- Can be null
- Do not implement automatic cleanup

**Trade-off:** You sacrifice guaranteed safety for better performance and the ability to interface with other languages or hardware.

#### Example Code

```
fn main()
{
    let mut num = 5;

    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    println!("r1: {}", *r1);
    println!("r2: {}", *r2);

    /*
     * Create a raw pointer using an address.
     * There may be no data at the address, but no error will be reported here.
     */
    let address = 0x12345usize;
    let r = address as *const i32;
}
```

![Error without unsafe block](./img/dereferencing_raw_pointer.png)

#### Why Use Raw Pointers?

- **FFI**: Interfacing with C language code
- **Custom abstractions**: Building safe abstractions that the borrow checker cannot understand

---

### 2. Calling Unsafe Functions or Methods

An **unsafe function or method** is defined with the `unsafe` keyword before its definition.

#### Requirements

- You must manually satisfy certain conditions before calling (documented in function documentation)
- Rust cannot verify these conditions automatically
- Must be called within an `unsafe` block

#### Example

```rust
unsafe fn dangerous() {}

fn main() {
    unsafe {
        dangerous();
    }
}
```

#### Creating Safe Abstractions Over Unsafe Code

A function containing unsafe code doesn't necessarily need to be marked as `unsafe` itself. Wrapping unsafe code in a safe function is a common abstraction pattern.

**Example:** Custom implementation of `split_at_mut`

```rust
fn split_at_mut(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = slice.len();
    assert!(mid <= len);

    // This would error: Rust cannot recognize the intent of this slice operation
    // (&mut slice[..mid], &mut slice[mid..])

    // Safe abstraction using unsafe code:
    let ptr = slice.as_mut_ptr();
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5, 6];
    let r = &mut v[..];
    let (a, b) = r.split_at_mut(3);

    assert_eq!(a, &mut [1, 2, 3]);
    assert_eq!(b, &mut [4, 5, 6]);
}
```

---

### 3. Using `extern` Functions to Call External Code

The `extern` keyword simplifies the creation and use of **Foreign Function Interface (FFI)**.

**FFI (Foreign Function Interface):** Allows one programming language to define functions that other languages can call.

#### Example: Calling C Functions

```rust
extern "C" {
    // Any function declared in an extern block is unsafe
    fn abs(input: i32) -> i32;
}

fn main() {
    unsafe {
        println!("Absolute value of -3 according to C: {}", abs(-3));
    }
}
```

#### Application Binary Interface (ABI)

**ABI (Application Binary Interface):** Defines how functions are called at the assembly level.

- `"C"` is the most common ABI, following the C language ABI convention

#### Calling Rust Functions from Other Languages

You can use `extern` to create an interface allowing other languages to call Rust functions.

**Steps:**

1. Add `extern` keyword before `fn` and specify the ABI
2. Add `#[no_mangle]` annotation to prevent Rust from changing the function name during compilation

```rust
#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Just called a Rust function from C!");
}

fn main() {}
```

---

### 4. Accessing or Modifying Mutable Static Variables

Rust supports global variables, called **static variables**, but they can cause issues like data races due to ownership rules.

#### Static Variables

```rust
static HELLO_WORLD: &str = "Hello, world!";

fn main() {
    println!("name is: {}", HELLO_WORLD);
}
```

#### Characteristics of Static Variables

- Similar to constants
- Naming convention: `SCREAMING_SNAKE_CASE`
- Type must be explicitly annotated
- Can only store references with `'static` lifetime (no need to explicitly annotate)
- Accessing immutable static variables is safe

#### Differences Between Constants and Immutable Static Variables

| Static Variables                                         | Constants                         |
| -------------------------------------------------------- | --------------------------------- |
| Have a fixed memory address; always access the same data | Allow data to be copied when used |
| Can be mutable                                           | Always immutable                  |

#### Mutable Static Variables

Accessing and modifying mutable static variables is **unsafe**.

```rust
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

fn main() {
    add_to_count(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}
```

---

### 5. Implementing Unsafe Traits

A trait is considered **unsafe** when at least one of its methods contains invariants that the compiler cannot verify.

#### Declaration and Implementation

```rust
unsafe trait Foo {
    // methods go here
}

unsafe impl Foo for i32 {
    // method implementations go here
}

fn main() {}
```

**Note:** Unsafe traits can only be implemented within `unsafe` blocks.

---

### When to Use Unsafe Code

The compiler cannot guarantee memory safety in unsafe code, and ensuring unsafe code correctness is not simple.

#### Guidelines

- Use unsafe code when you have a **compelling reason**
- When you do use it, explicitly mark it as `unsafe`
- This makes it easy to locate problems when they occur

#### Key Principle

With great power comes great responsibility. Unsafe Rust gives you powerful capabilities, but you must manually ensure correctness and safety.

---

## Summary

Unsafe Rust is a powerful tool that allows you to:

- Work directly with raw pointers
- Call functions from other languages
- Implement low-level optimizations
- Build safe abstractions over unsafe operations

However, it requires careful attention to detail and thorough understanding of memory safety principles. Always prefer safe Rust when possible, and use unsafe only when necessary and with proper encapsulation.

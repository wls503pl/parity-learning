# RefCell<T> and Interior Mutability in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 29, 2025

## Table of Contents

- [Introduction](#introduction)
- [Interior Mutability Pattern](#interior-mutability-pattern)
- [Understanding RefCell<T>](#understanding-refcellt)
- [Comparison: Box<T>, Rc<T>, and RefCell<T>](#comparison-boxt-rct-and-refcellt)
- [Practical Examples](#practical-examples)
- [Best Practices](#best-practices)

## Introduction

This document explores one of Rust's most powerful design patterns: **interior mutability**. Through practical examples and detailed explanations, we'll understand how `RefCell<T>` enables mutation through immutable references while maintaining Rust's safety guarantees.

## Interior Mutability Pattern

Interior mutability is a design pattern in Rust that allows you to mutate data even when there are immutable references to that data. This pattern uses `unsafe` code internally to bend Rust's usual borrowing rules, but exposes a safe API to users.

### Key Characteristics

- Allows modification of data through immutable references
- Defers borrow checking from compile-time to runtime
- Particularly useful in scenarios requiring self-modification in immutable contexts
- Only applicable in single-threaded scenarios

## Understanding RefCell<T>

### What is RefCell<T>?

Unlike `Rc<T>`, which provides shared ownership, `RefCell<T>` represents single ownership of data but with interior mutability capabilities.

### Borrowing Rules Recap

Rust's fundamental borrowing rules are:

1. At any given time, you can have either one mutable reference OR any number of immutable references
2. References must always be valid

### RefCell<T> vs Box<T>

| Feature         | Box<T>                 | RefCell<T>                             |
| --------------- | ---------------------- | -------------------------------------- |
| Borrow checking | Compile-time           | Runtime                                |
| Error detection | Early (at compilation) | Deferred (at runtime)                  |
| Performance     | No runtime overhead    | Slight overhead from borrow counting   |
| Flexibility     | Standard approach      | Enables specific memory-safe scenarios |

### When to Use Runtime Checking

**Compile-time checking (default):**

- Exposes problems early
- Zero runtime overhead
- Best choice for most scenarios

**Runtime checking (RefCell<T>):**

- Problems surface at runtime (possibly in production)
- Minor performance cost from borrow counting
- Enables certain memory-safe scenarios impossible at compile-time
- Required when compiler cannot verify safety but programmer knows code is safe

## Comparison: Box<T>, Rc<T>, and RefCell<T>

| Type           | Ownership       | Mutability & Borrow Checking                         |
| -------------- | --------------- | ---------------------------------------------------- |
| **Box<T>**     | Single owner    | Mutable and immutable borrows (compile-time checked) |
| **Rc<T>**      | Multiple owners | Immutable borrows only (compile-time checked)        |
| **RefCell<T>** | Single owner    | Mutable and immutable borrows (runtime checked)      |

**Important:** Even when `RefCell<T>` itself is immutable, you can still modify the value stored inside it.

## Practical Examples

### Example 1: Mock Messenger with RefCell<T>

This example demonstrates interior mutability in a testing scenario where we need to track messages sent through an immutable interface.

```rust
pub trait Messenger {
    fn send(&self, msg: &str);
}

pub struct LimitTracker<'a, T: 'a + Messenger> {
    messenger: &'a T,
    value: usize,
    max: usize,
}

impl<'a, T> LimitTracker<'a, T>
where
    T: Messenger,
{
    pub fn new(messenger: &T, max: usize) -> LimitTracker<T> {
        LimitTracker {
            messenger,
            value: 0,
            max,
        }
    }

    pub fn set_value(&mut self, value: usize) {
        self.value = value;

        let percentage_of_max = self.value as f64 / self.max as f64;
        if percentage_of_max >= 1.0 {
            self.messenger.send("Error: You are over your quota!");
        } else if percentage_of_max >= 0.9 {
            self.messenger
                .send("Urgent warning: You've used up over 90% of your quota!");
        } else if percentage_of_max >= 0.75 {
            self.messenger
                .send("Warning: You've used up over 75% of your quota!");
        }
    }
}
```

**Test Implementation:**

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;

    struct MockMessenger {
        sent_messages: RefCell<Vec<String>>,
    }

    impl MockMessenger {
        fn new() -> MockMessenger {
            MockMessenger {
                sent_messages: RefCell::new(vec![]),
            }
        }
    }

    impl Messenger for MockMessenger {
        fn send(&self, message: &str) {
            self.sent_messages.borrow_mut().push(String::from(message));
        }
    }

    #[test]
    fn it_sends_an_over_75_percent_warning_message() {
        let mock_messenger = MockMessenger::new();
        let mut limit_tracker = LimitTracker::new(&mock_messenger, 100);

        limit_tracker.set_value(80);
        assert_eq!(mock_messenger.sent_messages.borrow().len(), 1);
    }
}
```

**Key Points:**

- The `Messenger` trait requires `&self` (immutable reference)
- `MockMessenger` uses `RefCell<Vec<String>>` to allow mutation through immutable reference
- `borrow_mut()` provides mutable access to add messages
- `borrow()` provides immutable access to verify message count

### Example 2: Combining Rc<T> and RefCell<T>

This example shows how to create data structures with multiple ownership AND mutability.

```rust
#[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

use crate::List::{Cons, Nil};
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let value = Rc::new(RefCell::new(5));
    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    let b = Cons(Rc::new(RefCell::new(6)), Rc::clone(&a));
    let c = Cons(Rc::new(RefCell::new(10)), Rc::clone(&a));

    *value.borrow_mut() += 10;

    println!("a after = {:?}", a);
    println!("b after = {:?}", b);
    println!("c after = {:?}", c);
}
```

**Output:**

```
a after = Cons(RefCell { value: 15 }, Nil)
b after = Cons(RefCell { value: 6 }, Cons(RefCell { value: 15 }, Nil))
c after = Cons(RefCell { value: 10 }, Cons(RefCell { value: 15 }, Nil))
```

**Key Points:**

- `Rc<RefCell<i32>>` combines multiple ownership with mutability
- Multiple list nodes (`a`, `b`, `c`) share ownership of the same value
- Modifying through `value.borrow_mut()` affects all references
- Both `b` and `c` see the updated value (15) in their shared reference to `a`

## Borrow Tracking at Runtime

### RefCell<T> Methods

RefCell provides two safe methods for borrowing:

1. **`borrow()`** - Returns `Ref<T>` (immutable smart pointer implementing `Deref`)
2. **`borrow_mut()`** - Returns `RefMut<T>` (mutable smart pointer implementing `Deref`)

### Borrow Counting Mechanism

RefCell tracks the number of active `Ref<T>` and `RefMut<T>` smart pointers:

**Immutable Borrow Counting:**

- Each `borrow()` call: counter += 1
- When any `Ref<T>` goes out of scope: counter -= 1

**Mutable Borrow Counting:**

- Each `borrow_mut()` call: counter += 1
- When any `RefMut<T>` goes out of scope: counter -= 1

**Enforcement:**
At any given time, you can have either:

- Multiple immutable borrows, OR
- One mutable borrow

Violating these rules triggers a **panic at runtime**.

## Best Practices

### When to Use RefCell<T>

✅ **Good use cases:**

- Mock objects in tests that need to track state
- Implementing patterns where the compiler cannot verify safety but you know it's safe
- Caching or memoization within immutable structures
- Graph structures with shared, mutable nodes

❌ **Avoid when:**

- Compile-time checking is sufficient
- Working with multi-threaded code (use `Mutex<T>` instead)
- Performance is critical and runtime overhead is unacceptable

### Safety Considerations

1. **Panic Risk:** Runtime borrow violations cause panics, not compile errors
2. **Testing:** Thoroughly test code using RefCell to catch borrow violations
3. **Scope Management:** Keep borrow scopes as small as possible
4. **Documentation:** Document why runtime checking is necessary

## Other Interior Mutability Types

- **`Cell<T>`** - Provides interior mutability for `Copy` types through copying
- **`Mutex<T>`** - Thread-safe interior mutability for multi-threaded scenarios
- **`RwLock<T>`** - Allows multiple readers or one writer (thread-safe)

## Project Structure

```
Ref_Cell/
├── src/
│   ├── lib.rs      # LimitTracker and Messenger implementation
│   └── main.rs     # List example with Rc<RefCell<T>>
├── Cargo.toml
└── Cargo.lock
```

## Conclusion

`RefCell<T>` is a powerful tool in Rust's arsenal for handling scenarios where compile-time borrow checking is too restrictive. By moving borrow checking to runtime, it enables patterns that would otherwise be impossible while maintaining memory safety. However, this flexibility comes with the responsibility of ensuring correctness through careful testing and design.

The combination of `Rc<T>` and `RefCell<T>` is particularly powerful, enabling shared ownership with mutation capabilities—a pattern that's essential for certain data structures and designs.

---

**Remember:** Interior mutability should be used judiciously. When the compiler's borrow checker can verify your code's safety at compile-time, that's always preferable. Use `RefCell<T>` when you need the flexibility and you're confident in the safety of your code.

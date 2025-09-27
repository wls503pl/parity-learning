# Deref Trait - Customizing Dereference Operator Behavior

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 27, 2025

## Overview

The `Deref` trait allows you to customize the behavior of the dereference operator `*`. By implementing the `Deref` trait, smart pointers can be treated like regular references, enabling seamless interaction with existing code that expects references.

## What is Dereference?

Dereference means accessing the value that a pointer or reference points to. In Rust, regular references are a type of pointer.

## Basic Reference Example

```rust
fn main() {
    let x = 5;
    let y = &x;  // y is a reference to x

    assert_eq!(5, x);
    assert_eq!(5, *y);  // Dereference y to get the value it points to
}
```

## Using Box<T> as a Reference

`Box<T>` can replace regular references in the above example because it implements the `Deref` trait:

```rust
fn main() {
    let x = 5;
    let y = Box::new(x);  // Box<T> instead of reference

    assert_eq!(5, x);
    assert_eq!(5, *y);    // Works because Box<T> implements Deref
}
```

## Creating Our Own Smart Pointer

Let's define our own smart pointer similar to `Box<T>`:

### Initial Implementation (Without Deref)

```rust
struct MyBox<T>(T);  // Tuple struct with one element

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);  // ERROR: No dereference functionality implemented for "MyBox"
}
```

**Problem:** This code will fail to compile because `MyBox` doesn't implement the dereference functionality.

## Implementing the Deref Trait

The standard library's `Deref` trait requires us to implement a `deref` method that:

- Borrows `self`
- Returns a reference to the inner data

### Complete Implementation

```rust
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;  // Associated type specifying what we dereference to

    fn deref(&self) -> &T {
        &self.0  // Return a reference to the inner value (first tuple element)
    }
}

fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);  // SUCCESS: Rust implicitly expands *y to *(y.deref())
}
```

## How Deref Works Behind the Scenes

When you write `*y`, Rust actually performs the following transformation:

```
*y  →  *(y.deref())
```

This means:

1. Call the `deref()` method on `y` to get a reference `&T`
2. Apply the standard dereference operator `*` to that reference

## Key Components of Deref Implementation

### 1. Associated Type

```rust
type Target = T;
```

This specifies what type the dereference operation should return a reference to.

### 2. deref Method

```rust
fn deref(&self) -> &T {
    &self.0
}
```

- Takes `&self` (immutable reference to the smart pointer)
- Returns `&T` (reference to the inner data)
- In our tuple struct, `self.0` accesses the first (and only) field

## Benefits of Implementing Deref

1. **Seamless Integration**: Your smart pointer can be used anywhere a regular reference is expected
2. **Ergonomic API**: Users can use the familiar `*` operator
3. **Deref Coercion**: Automatic conversion from smart pointer to reference when needed
4. **Code Reusability**: Existing functions that take references can work with your smart pointer

## Memory Layout Comparison

### Regular Reference

```
Stack: [x: 5] [y: &x (pointer to stack location)]
```

### MyBox Smart Pointer

```
Stack: [x: 5] [y: MyBox(5)]
                    └─ Contains the actual value
```

### Box<T> Smart Pointer

```
Stack: [x: 5] [y: Box (pointer to heap)]
Heap:  [5]
```

## Important Notes

- **Ownership**: `MyBox` takes ownership of the value, unlike references which only borrow
- **Copy vs Move**: When creating `MyBox::new(x)`, the value `x` is moved (or copied if it implements `Copy`)
- **Deref vs DerefMut**: There's also `DerefMut` for mutable dereferencing (not covered here)

## Real-world Applications

The `Deref` trait is commonly implemented by:

- `Box<T>` - Heap-allocated smart pointer
- `Rc<T>` - Reference-counted smart pointer
- `Arc<T>` - Atomic reference-counted smart pointer
- `Vec<T>` - Can be dereferenced to `&[T]`
- `String` - Can be dereferenced to `&str`

## Conclusion

The `Deref` trait is a powerful feature that enables smart pointers to behave like regular references. By implementing this trait, you can create custom smart pointers that integrate seamlessly with Rust's ownership system and provide an intuitive API for users.

The automatic expansion of `*smart_pointer` to `*(smart_pointer.deref())` demonstrates Rust's commitment to zero-cost abstractions - providing high-level functionality without runtime overhead.

---

_This document is part of a Rust smart pointers learning series._

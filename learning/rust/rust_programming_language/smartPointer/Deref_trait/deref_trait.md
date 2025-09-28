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

## Deref Coercion

**Implicit Dereference Conversion for Functions and Methods**

Deref Coercion is a convenience feature provided for functions and methods that enables automatic type conversion when passing arguments.

### How Deref Coercion Works

- **Automatic Conversion**: When type `T` implements the `Deref` trait, Deref Coercion can convert a reference to `T` into a reference to the type that `T` dereferences to
- **Function Parameter Matching**: When you pass a reference to a function or method, but its type doesn't match the defined parameter type, Deref Coercion automatically occurs
- **Compile-time Resolution**: The compiler performs a series of `deref` calls to convert the reference to the required parameter type, with no runtime performance overhead

### Deref Coercion Example

```rust
use std::ops::Deref;

fn hello(name: &str) {
    println!("Hello, {}", name);
}

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    // &m type is &MyBox<String>
    // deref &MyBox<String> => &String => &str
    hello(&m);  // Deref coercion: &MyBox<String> -> &String -> &str
}
```

### Deref Coercion Chain

In the example above, the conversion happens in steps:

1. `&m` has type `&MyBox<String>`
2. `MyBox<String>` implements `Deref` with `Target = String`, so `&MyBox<String>` can be converted to `&String`
3. `String` implements `Deref` with `Target = str`, so `&String` can be converted to `&str`
4. The `hello` function expects `&str`, so the coercion is successful

**Without Deref Coercion**, you would need to write:

```rust
hello(&(*m)[..]);  // Manually dereference and slice
```

**With Deref Coercion**, you can simply write:

```rust
hello(&m);  // Automatic conversion
```

## Deref and Mutability

### DerefMut Trait

For mutable references, Rust provides the `DerefMut` trait that allows overloading the `*` operator for mutable references.

```rust
use std::ops::{Deref, DerefMut};

impl<T> DerefMut for MyBox<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}
```

### Deref Coercion Rules with Mutability

Rust performs deref coercion in the following three scenarios:

1. **Immutable to Immutable**: When `T: Deref<Target=U>`, allows `&T` to be converted to `&U`
2. **Mutable to Mutable**: When `T: DerefMut<Target=U>`, allows `&mut T` to be converted to `&mut U`
3. **Mutable to Immutable**: When `T: Deref<Target=U>`, allows `&mut T` to be converted to `&U`

**Important Note**: The reverse conversion (immutable to mutable) is **not allowed** because it would violate Rust's borrowing rules.

### Mutability Coercion Examples

```rust
// Valid conversions:
let mut boxed = MyBox::new(String::from("hello"));

// 1. &mut MyBox<String> -> &mut String -> &mut str
fn modify_str(s: &mut str) { /* ... */ }
modify_str(&mut boxed);

// 2. &mut MyBox<String> -> &String -> &str
fn read_str(s: &str) { /* ... */ }
read_str(&mut boxed);

// 3. &MyBox<String> -> &String -> &str
read_str(&boxed);
```

## Benefits of Implementing Deref

1. **Seamless Integration**: Your smart pointer can be used anywhere a regular reference is expected
2. **Ergonomic API**: Users can use the familiar `*` operator
3. **Automatic Coercion**: Enables implicit conversion in function calls and method invocations
4. **Code Reusability**: Existing functions that take references can work with your smart pointer
5. **Zero-cost Abstraction**: All conversions happen at compile time with no runtime overhead

## Memory Layout Comparison

### Regular Reference

```
Stack: [x: 5] [y: &x (pointer to stack location)]
```

### MyBox Smart Pointer

```
Stack: [x: 5] [y: MyBox(5)]
                    └── Contains the actual value
```

### Box<T> Smart Pointer

```
Stack: [x: 5] [y: Box (pointer to heap)]
Heap:  [5]
```

## Important Notes

- **Ownership**: `MyBox` takes ownership of the value, unlike references which only borrow
- **Copy vs Move**: When creating `MyBox::new(x)`, the value `x` is moved (or copied if it implements `Copy`)
- **Compile-time Resolution**: All deref coercion happens at compile time, ensuring zero runtime cost
- **Mutability Rules**: Deref coercion respects Rust's borrowing rules regarding mutability

## Real-world Applications

The `Deref` trait is commonly implemented by:

- `Box<T>` - Heap-allocated smart pointer
- `Rc<T>` - Reference-counted smart pointer
- `Arc<T>` - Atomic reference-counted smart pointer
- `Vec<T>` - Can be dereferenced to `&[T]`
- `String` - Can be dereferenced to `&str`
- `PathBuf` - Can be dereferenced to `&Path`
- `OsString` - Can be dereferenced to `&OsStr`

## Best Practices

1. **Use Deref Sparingly**: Only implement `Deref` when your type acts as a smart pointer to another type
2. **Don't Use for Conversions**: `Deref` is not meant for general type conversions - use `From`/`Into` for that
3. **Maintain Semantic Meaning**: The target of deref should be semantically related to your type
4. **Consider DerefMut**: If your type should support mutable access, implement `DerefMut` as well

## Conclusion

The `Deref` trait is a powerful feature that enables smart pointers to behave like regular references. Combined with deref coercion, it provides seamless integration between smart pointers and existing APIs that expect references. By implementing this trait thoughtfully, you can create custom smart pointers that integrate seamlessly with Rust's ownership system and provide an intuitive API for users.

The automatic expansion of `*smart_pointer` to `*(smart_pointer.deref())` and the compile-time deref coercion demonstrate Rust's commitment to zero-cost abstractions - providing high-level functionality without runtime overhead.

---

_This document is part of a Rust smart pointers learning series._

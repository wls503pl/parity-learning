# Advanced Features in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 18, 2025

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
- Isolate unsafe code as much as possibleâ€"ideally, encapsulate it in safe abstractions that provide safe APIs

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

```rust
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

## Part 2: Advanced Trait Features

### Introduction

Rust traits provide powerful abstractions for defining shared behavior. This section covers advanced trait features including associated types, generic parameters, operator overloading, fully qualified syntax for calling methods, supertrait relationships, and the newtype pattern.

---

### 1. Associated Types

#### Overview

**Associated types** are type placeholders within traits that can be used in trait method signatures. This allows you to define traits containing certain types without knowing what those types are until the trait is implemented.

#### The `Iterator` Trait Example

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}
```

The `type Item;` declaration is an associated type placeholder. When implementing `Iterator`, you specify what concrete type `Item` should be.

---

### 2. Associated Types vs. Generic Parameters

Associated types and generic parameters both allow for flexibility, but they differ in important ways:

| Aspect                   | Associated Types                                                                   | Generic Parameters                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Type Annotation          | No need to annotate the type each time                                             | Must annotate the type for each implementation                                           |
| Multiple Implementations | Can only implement a trait once per type                                           | Can implement a trait multiple times for the same type with different generic parameters |
| Use Case                 | When there's a one-to-one relationship between a type and the trait implementation | When a type should implement the same trait in multiple ways                             |

#### Example Comparison

```rust
// With Associated Types
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        None
    }
}

// With Generic Parameters
pub trait Iterator2<T> {
    fn next(&mut self) -> Option<T>;
}

impl Iterator2<String> for Counter {
    fn next(&mut self) -> Option<String> {
        None
    }
}

impl Iterator2<u32> for Counter {
    fn next(&mut self) -> Option<u32> {
        None
    }
}

struct Counter {}

fn main() {
    println!("Hello, world!");
}
```

In this example, `Counter` implements `Iterator` only once, but can implement `Iterator2` multiple times with different type parameters.

---

### 3. Default Generic Parameters and Operator Overloading

#### Syntax

You can specify a default concrete type for a generic parameter using the syntax: `<PlaceholderType=ConcreteType>`

#### Operator Overloading

Rust does not allow you to create custom operators or overload arbitrary operators. However, you can overload some operators by implementing the corresponding traits from `std::ops`.

#### Example: Implementing the `Add` Trait

```rust
use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
        Point { x: 3, y: 3 }
    );
}
```

By implementing the `Add` trait for `Point`, we enable the use of the `+` operator between two `Point` instances.

#### Primary Use Cases for Default Generic Parameters

- **Extend a type without breaking existing code**: New implementations can use different type parameters while maintaining backward compatibility
- **Allow customization in specific scenarios**: Provide defaults that work for the majority of users while allowing specialized customization where needed

---

### 4. Fully Qualified Syntax for Disambiguation

#### The Problem: Calling Methods with the Same Name

When a type implements multiple traits or has its own methods, some may share the same name. This creates ambiguity when calling them.

#### The Solution: Fully Qualified Syntax

Rust provides fully qualified syntax to explicitly specify which trait method or associated function you want to call.

**Syntax:** `<Type as Trait>::function(receiver_if_method, next_arg, ...);`

This syntax can be used anywhere you call a function or method. It allows you to omit parts that can be inferred from other contexts. Use it when Rust cannot determine which specific implementation you intend to call.

#### Example with Trait Methods

```rust
trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}

fn main() {
    let person = Human;

    person.fly();           // Calls the struct's own method
    Pilot::fly(&person);    // Calls Pilot trait's fly method
    Wizard::fly(&person);   // Calls Wizard trait's fly method
}
```

#### Output

```
*waving arms furiously*
This is your captain speaking.
Up!
```

#### How It Works

- `person.fly()` calls the method directly on `Human` (prioritized when available)
- `Pilot::fly(&person)` explicitly calls the `fly` method from the `Pilot` trait
- `Wizard::fly(&person)` explicitly calls the `fly` method from the `Wizard` trait

#### Calling Associated Functions

For associated functions (functions that don't take `self` as a parameter), you must use the fully qualified syntax:

```rust
trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

fn main() {
    // Direct call to the struct's associated function
    println!("A baby dog is called a {}", Dog::baby_name());

    // Fully qualified syntax to call the trait's associated function
    println!("A baby dog is called a {}", <Dog as Animal>::baby_name());
}
```

#### Output

```
A baby dog is called a Spot
A baby dog is called a puppy
```

---

### 5. Supertraits: Requiring Trait Functionality Within Traits

#### Overview

When you need to use another trait's functionality within a trait definition, you can require that implementing types also implement that other trait. The required trait is called a **supertrait** of your trait.

#### Syntax

Specify the supertrait dependency using the syntax: `trait MyTrait: SuperTrait`

#### Example

```rust
use std::fmt;

trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("*{}*", " ".repeat(len + 2));
        println!("* {} *", output);
        println!("*{}*", " ".repeat(len + 2));
        println!("{}", "*".repeat(len + 4));
    }
}

struct Point {
    x: i32,
    y: i32,
}

impl OutlinePrint for Point {}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let point = Point { x: 1, y: 3 };
    point.outline_print();
}
```

#### How It Works

- `OutlinePrint: fmt::Display` declares that any type implementing `OutlinePrint` must also implement `fmt::Display`
- The `outline_print` method calls `self.to_string()`, which requires the `Display` trait implementation
- When implementing `OutlinePrint` for `Point`, we must also implement `fmt::Display` for `Point`
- This ensures all required functionality is available when the method is called

#### Key Benefits

- **Type safety**: The compiler verifies that all required traits are implemented
- **Code reusability**: Access to all supertrait functionality within your trait methods
- **Clear contracts**: Explicitly documents dependencies between traits

---

### 6. The Newtype Pattern for External Traits on External Types

#### The Problem: The Orphan Rule

Rust has a coherence rule, often called the **orphan rule**, which states: you can only implement a trait on a type if either the trait or the type (or both) is defined in your local package. This prevents conflicts and ambiguity in the type system.

This rule prevents you from implementing external traits on external types. For example, you cannot implement the `Display` trait from the standard library on `Vec<String>`.

#### The Solution: The Newtype Pattern

Use the **newtype pattern** to work around the orphan rule by creating a new wrapper type around an external type. This is a lightweight wrapper structure, typically implemented using a tuple struct.

#### Example

```rust
use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![
        String::from("hello"),
        String::from("world")
    ]);
    println!("w = {}", w);
}
```

#### Output

```
w = [hello, world]
```

#### How It Works

- `Wrapper` is a new type that wraps `Vec<String>`
- We can now implement `Display` for `Wrapper` (a local type)
- The internal `Vec<String>` is accessed via `self.0`
- This pattern is zero-cost: the wrapper is optimized away at compile time

#### Advantages of the Newtype Pattern

- **Bypasses the orphan rule**: Implement external traits on external types indirectly
- **Semantic clarity**: Gives a meaningful name to the wrapped type
- **Type safety**: Creates a distinct type, preventing accidental mixing with unwrapped values
- **Zero overhead**: No runtime cost due to compiler optimizations
- **Flexibility**: Can add methods and implement other traits for the wrapper

#### When to Use the Newtype Pattern

- Implementing a trait not defined in your crate on a type not defined in your crate
- Creating type-safe wrappers around primitive types
- Adding domain-specific functionality to standard library types
- Improving code readability by giving meaningful names to wrapped values

---

## Summary

Advanced trait features in Rust provide powerful mechanisms for:

- **Associated types**: Define flexible trait contracts without knowing concrete types upfront
- **Generic parameters**: Enable multiple trait implementations for the same type with different type parameters
- **Operator overloading**: Customize operators by implementing traits from `std::ops`
- **Fully qualified syntax**: Disambiguate method calls when multiple implementations exist
- **Supertraits**: Establish trait dependencies and ensure required functionality is available
- **Newtype pattern**: Implement external traits on external types while maintaining type safety

Combined with unsafe Rust capabilities, these features give you the tools to build both safe abstractions and high-performance systems code.

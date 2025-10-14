# Pattern Matching in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 11, 2025

---

## Overview

Pattern matching is a special syntax in Rust used for matching structures of both complex and simple types. By combining patterns with match expressions and other constructs, you gain better control over your program's control flow.

## Pattern Composition

Patterns are composed of combinations of the following elements:

- Literals
- Destructured arrays, enums, structs, and tuples
- Variables
- Wildcards
- Placeholders

To use a pattern, you compare it against a value. If the pattern matches, you can use the corresponding parts of that value in your code.

---

## Places Where Patterns Can Be Used

### 1. Match Arms

The `match` expression allows you to compare a value against a series of patterns:

```rust
match VALUE {
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
}
```

**Match Expression Requirements:**

- Must be exhaustive (cover all possible cases)
- Use the special pattern `_` (underscore) to match anything without binding to a variable
- The `_` pattern is typically used as the last arm or to ignore certain values

### 2. Conditional `if let` Expressions

The `if let` expression is primarily a shorthand way to handle a single match case, serving as an equivalent to a `match` with only one matching arm.

**Features:**

- Can optionally include `else`, `else if`, and `else if let` clauses
- Does **not** check for exhaustiveness

**Example:**

```rust
fn main() {
    let favorite_color: Option<&str> = None;
    let is_Tuesday = false;
    let age: Result<u8, _> = "34".parse();

    if let Some(color) = favorite_color {
        println!("Using your favorite color, {}, as the background", color);
    } else if is_Tuesday {
        println!("Tuesday is green day!");
    } else if let Ok(age) = age {
        if age > 30 {
            println!("Using purple as the background color");
        } else {
            println!("Using orange as the background color");
        }
    } else {
        println!("Using blue as the background color");
    }
}
```

### 3. `while let` Conditional Loops

The `while let` construct allows a while loop to run as long as a pattern continues to match.

**Example:**

```rust
fn main() {
    let mut stack = Vec::new();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
}
```

This loop continues popping elements from the stack until `pop()` returns `None`.

### 4. `for` Loops

The `for` loop is the most common loop construct in Rust. In a `for` loop, the pattern is the value that follows the `for` keyword.

**Example:**

```rust
fn main() {
    let v = vec!['a', 'b', 'c'];

    for (index, value) in v.iter().enumerate() {
        println!("{} is at index {}", value, index);
    }
}
```

Here, `(index, value)` is a pattern that destructures the tuple returned by `enumerate()`.

### 5. `let` Statements

The `let` statement itself is a pattern:

```rust
let PATTERN = EXPRESSION;
```

**Examples:**

```rust
fn main() {
    let a = 5;
    let (x, y, z) = (1, 2, 3);
}
```

In the second example, the tuple pattern `(x, y, z)` destructures the tuple `(1, 2, 3)`.

### 6. Function Parameters

Function parameters can also be patterns, allowing for destructuring directly in the function signature.

**Examples:**

```rust
fn foo(x: i32) {
    // x is a simple pattern
}

fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Current location: ({}, {})", x, y);
}

fn main() {
    let point = (3, 5);
    print_coordinates(&point);
}
```

The `print_coordinates` function destructures the tuple reference directly in its parameter list.

---

## Summary

Pattern matching is a powerful feature in Rust that enables:

- Cleaner, more expressive code
- Safe destructuring of complex data types
- Better control flow management
- Compile-time exhaustiveness checking (in `match` expressions)

By understanding and utilizing patterns in various contexts—from `match` expressions to function parameters—you can write more idiomatic and robust Rust code.

---

## Refutability: Whether Patterns Might Fail to Match

**Update Date:** October 11, 2025

### Two Forms of Patterns

**Refutable Patterns:**

- Patterns that can fail to match for some possible values
- Example: `if let Some(x) = a_value;` - if `a_value` is `None`, the pattern fails to match

**Irrefutable Patterns:**

- Patterns that match any possible value passed to them
- Example: `let x = 5;` - this always matches

### Pattern Requirements by Context

**Contexts that accept ONLY irrefutable patterns:**

- Function parameters
- `let` statements
- `for` loops

**Contexts that accept BOTH refutable and irrefutable patterns:**

- `if let` expressions
- `while let` expressions
- Note: Using an irrefutable pattern in these contexts will trigger a compiler warning about possible failure

### Common Error: Refutable Pattern in `let` Statement

```rust
fn main() {
    let a: Option<i32> = Some(5);
    let Some(x) = a;  // ERROR: refutable pattern in local binding
}
```

**Error Explanation:**

- Since `a` could be `None`, and `let` statements require irrefutable patterns
- `Some(x)` is refutable, causing a compilation error
- The compiler error: `refutable pattern in local binding`
- Note: `pattern 'None' not covered`

**Solution 1: Use `if let`**

```rust
if let Some(x) = a {
    // Handle the Some case
}
```

**Solution 2: Use `let else`**

```rust
let Some(x) = a else { todo!() };
```

### Warning: Irrefutable Pattern in `if let`

If you use an irrefutable pattern with `if let`, the compiler will warn you:

```rust
if let x = 5 {
    // Warning: irrefutable pattern in if let
}
```

This should just be a regular `let` statement instead.

---

## Pattern Syntax

### Matching Literal Values

Patterns can directly match literal values:

```rust
fn main() {
    let x = 1;

    match x {
        1 => println!("one"),
        2 => println!("two"),
        3 => println!("three"),
        _ => println!("anything"),
    }
}
```

### Matching Named Variables

Named variables are irrefutable patterns that can match any value:

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(y) => println!("Matched, y = {:?}", y),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

**Output:**

- `Matched, y = 5`
- `at the end: x = Some(5), y = 10`

**Explanation:**

The `let x` is an irrefutable pattern. Inside the `match`, `Some(y)` matches `Some(x)`, so the match prints `y = 5`. The final statement prints the outer variable `y`, resulting in `x = Some(5), y = 10`.

### Multiple Patterns

In `match` expressions, use the `|` syntax (meaning "or") to match multiple patterns:

```rust
fn main() {
    let x = 1;

    match x {
        1 | 2 => println!("one or two"),
        3 => println!("three"),
        _ => println!("anything"),
    }
}
```

### Matching Ranges with `..=`

Use `..=` to match a range of values:

```rust
fn main() {
    let x = 5;

    match x {
        1..=5 => println!("one through five"),  // matches when x is 1 to 5
        _ => println!("something else"),  // outside the 1-5 range
    }

    let x = 'c';

    match x {
        'a'..='j' => println!("early ASCII letter"),  // a to j
        'k'..='z' => println!("late ASCII letter"),  // k to z
        _ => println!("something else"),  // outside both character ranges
    }
}
```

### Destructuring to Break Apart Values

You can use patterns to destructure structs, enums, and tuples to reference different parts of these types.

#### Destructuring Structs

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };
    let Point { x: a, y: b } = p;
    assert_eq!(0, a);
    assert_eq!(7, b);

    match p {
        Point { x, y: 0 } => println!("On the x axis at {}", x),  // if y is 0, x is any value
        Point { x: 0, y } => println!("On the y axis at {}", y),  // if x is 0, y is any value
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),  // if neither matches above
    }
}
```

#### Destructuring Enums

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg = Message::ChangeColor(0, 160, 255);

    match msg {
        Message::Quit => {
            println!("The Quit variant has no data to destructure.")
        }
        Message::Move { x, y } => {
            println!("Move in the x direction {} and in the y direction {}", x, y)
        }
        Message::Write(text) => println!("Text message: {}", text),
        Message::ChangeColor(r, g, b) => {
            println!("Change the color to red {}, green {}, and blue {}", r, g, b)
        }
    }
}
```

#### Destructuring Nested Structs and Enums

```rust
enum Color {
    Rgb(i32, i32, i32),
    Hsv(i32, i32, i32),
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(Color),
}

fn main() {
    let msg = Message::ChangeColor(Color::Hsv(0, 160, 255));

    match msg {
        Message::ChangeColor(Color::Rgb(r, g, b)) => {
            println!("Change the color to red {}, green {}, and blue {}", r, g, b)
        }
        Message::ChangeColor(Color::Hsv(h, s, v)) => {
            println!("Change the color to hue {}, saturation {} and value {}", h, s, v)
        }
        _ => (),
    }
}
```

#### Destructuring Structs and Tuples

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let ((feet, inches), Point {x, y}) = ((3, 10), Point {x: 3, y: -10});
}
```

---

## Ignoring Values in Patterns

There are several ways to ignore entire values or parts of values in patterns.

### Using `_` to Ignore an Entire Value

```rust
fn foo(_: i32, y: i32) {
    println!("This code only uses the y parameter: {}", y);
}

fn main() {
    foo(3, 4);  // 4 is used, 3 is unused
}
```

### Using Nested `_` to Ignore Parts of a Value

```rust
fn main() {
    let mut setting_value = Some(5);
    let new_setting_value = Some(10);

    match (setting_value, new_setting_value) {
        (Some(_), Some(_)) => {  // ignore the actual values, only care that both are Some
            println!("Can't overwrite an existing customized value");
        }
        _ => {
            setting_value = new_setting_value;
        }
    }

    println!("setting is {:?}", setting_value);

    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (first, _, third, _, fifth) => {  // ignore 2nd and 4th values
            println!("Some numbers: {}, {}, {}", first, third, fifth)
        }
    }
}
```

### Ignoring Unused Variables by Starting with `_`

```rust
fn main() {
    let _x = 5;  // starts with _, won't trigger warning
    let y = 10;  // will trigger unused variable warning
}
```

**Important Difference Between `_` and `_s`:**

```rust
fn main() {
    let s = Some(String::from("Hello!"));

    if let Some(_s) = s {
        println!("found a string");
    }

    println!("{:?}", s);  // ERROR: ownership has been moved to _s
}
```

This causes an ownership transfer error. However, if you change `_s` to `_`, it works:

```rust
fn main() {
    let s = Some(String::from("Hello!"));

    if let Some(_) = s {
        println!("found a string");
    }

    println!("{:?}", s);  // OK: _ doesn't bind, so no move occurs
}
```

### Using `..` to Ignore Remaining Parts of a Value

```rust
struct Point {
    x: i32,
    y: i32,
    z: i32,
}

fn main() {
    let origin = Point { x: 0, y: 0, z: 0 };

    match origin {
        Point {x, ..} => println!("x is {}", x),
    }

    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (first, .., last) => {
            println!("Some numbers: {}, {}", first, last);
        }
    }

    // This will cause an error - ambiguous pattern
    match numbers {
        (.., second, ..) => {  // ERROR: which value is second? 4? 8? 16?
            println!("Some numbers: {}", second)
        },
    }
}
```

---

## Match Guards for Extra Conditions

A match guard is an additional `if` condition after a match arm pattern. The condition must also be satisfied for that arm to be chosen.

Match guards are useful for expressing more complex conditions than patterns alone allow:

```rust
fn main() {
    let num = Some(4);

    match num {
        Some(x) if x < 5 => println!("less than five: {}", x),  // matches this arm
        Some(x) => println!("{}", x),
        None => (),
    }
}
```

### Match Guards with Outer Variables

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {:?}", n),
        _ => println!("Default case, x = {:?}", x),  // outputs: Default case, x = Some(5)
    }

    println!("at the end: x = {:?}, y = {:?}", x, y);  // outputs: x = Some(5), y = 10
}
```

### Match Guards with Multiple Patterns

```rust
fn main() {
    let x = 4;
    let y = false;

    match x {
        4 | 5 | 6 if y => println!("yes"),  // if x is 4, 5, or 6 AND y is true
        _ => println!("no"),
    }
}
```

---

## @ Bindings

The `@` operator lets us create a variable that holds a value while simultaneously testing that value against a pattern:

```rust
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };

    match msg {
        Message::Hello {
            id: id_variable @ 3..=7,  // require id to be in 3-7 range, and bind the value to id_variable
        } => {
            println!("Found an id in range: {}", id_variable)  // prints 5
        }
        Message::Hello { id: 10..=12 } => {
            println!("Found an id in another range")
        }
        Message::Hello { id } => {
            println!("Found some other id: {}", id)
        }
    }
}
```

---

## Updated Project Structure

```
pattern_matching/
├── img/
│   └── refutable_error.png
├── src/
│   ├── for.rs
│   ├── function_parameters.rs
│   ├── if_let.rs
│   ├── refutability.rs
│   └── while_let.rs
├── target/
├── Cargo.lock
├── Cargo.toml
└── pattern_matching.md
```

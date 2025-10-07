# Object-Oriented Programming Features in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** October 7, 2025

## Introduction

Rust is influenced by multiple programming paradigms, including object-oriented programming (OOP). Object-oriented programming typically includes the following characteristics:

- Named objects
- Encapsulation
- Inheritance

## Objects Contain Data and Behavior

- Object-oriented programs are composed of objects
- Objects encapsulate data and the procedures that operate on that data
- These procedures are typically called methods or operations

### Is Rust Object-Oriented?

Based on this definition, **Rust can be considered object-oriented**:

- `struct` and `enum` contain data
- `impl` blocks provide methods for them
- However, `struct` and `enum` with methods are not explicitly called "objects" in Rust

## Encapsulation

**Encapsulation** means that code outside an object cannot directly access the object's internal implementation details. The only way to interact with an object is through its publicly exposed API.

### Encapsulation in Rust

Rust uses the `pub` keyword to determine which modules, types, functions, and methods are public.

**Example:**

```rust
pub struct AverageCollection {
    list: Vec<i32>,
    average: f64,
}

impl AveragedCollection {
    pub fn add(&mut self, value: i32) {
        self.list.push(value);
        self.update_average();
    }

    pub fn remove(&mut self) -> Option<i32> {
        let result = self.list.pop();
        match result {
            Some(value) => {
                self.update_average();
                Some(value)
            },
            None => None,
        }
    }

    pub fn average(&self) -> f64 {
        self.average
    }

    fn update_average(&mut self) {
        let total: i32 = self.list.iter().sum();
        self.average = total as f64 / self.list.len() as f64;
    }
}
```

In this example:

- The `list` and `average` fields are private
- Public methods (`add`, `remove`, `average`) provide controlled access
- The private `update_average` method encapsulates internal logic

## Inheritance

**Inheritance** allows objects to inherit data and behavior from another object without redefining the related code.

### Rust Does Not Have Inheritance

**However, Rust does not support traditional inheritance.**

### Why Use Inheritance?

There are two main reasons for using inheritance:

#### 1. Code Reuse

- **In Rust:** Default trait methods enable code sharing

#### 2. Polymorphism

- Allowing subtypes to be used where a parent type is expected
- **In Rust:** Generics and trait bounds provide polymorphism (bounded parametric polymorphism)

### Modern Perspective

Many modern programming languages no longer use inheritance as a built-in design pattern. Rust follows this trend by providing alternative mechanisms like traits and composition instead of classical inheritance.

---

## Summary

Rust incorporates object-oriented concepts through:

- **Encapsulation** via the `pub` keyword and visibility modifiers
- **Data and behavior** through structs, enums, and impl blocks
- **Polymorphism** through traits and generics rather than inheritance
- **Code reuse** through default trait implementations and composition

While Rust does not support classical inheritance, it provides powerful alternatives that maintain type safety and avoid common pitfalls associated with inheritance hierarchies.

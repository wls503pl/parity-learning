# Memory Leaks and Reference Cycles in Rust

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 30, 2025

## Table of Contents

- [Introduction](#introduction)
- [Understanding Reference Cycles](#understanding-reference-cycles)
- [Demonstrating Memory Leaks](#demonstrating-memory-leaks)
- [Strong vs Weak References](#strong-vs-weak-references)
- [Preventing Memory Leaks with Weak<T>](#preventing-memory-leaks-with-weakt)
- [Practical Example: Tree Structure](#practical-example-tree-structure)
- [Best Practices](#best-practices)

## Introduction

While Rust's ownership system provides strong memory safety guarantees, **memory leaks are still possible**. One common scenario that can cause memory leaks is creating **reference cycles** using `Rc<T>` and `RefCell<T>`.

This document explores how reference cycles occur, why they cause memory leaks, and how to prevent them using `Weak<T>`.

## Understanding Reference Cycles

### What is a Reference Cycle?

A reference cycle occurs when two or more values reference each other in a loop, preventing their reference counts from ever reaching zero. This means the memory will never be deallocated, causing a memory leak.

### Memory Leak in Rust

- Rust's memory safety mechanisms make memory leaks **difficult but not impossible**
- Reference cycles created with `Rc<T>` and `RefCell<T>` can lead to memory leaks
- The reference count of each item never becomes 0, so values are never dropped

## Demonstrating Memory Leaks

### Example: Creating a Reference Cycle

```rust
use std::cell::RefCell;
use std::rc::Rc;
use crate::List::{Cons, Nil};

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    println!("a initial rc count = {}", Rc::strong_count(&a));
    println!("a next item = {:?}", a.tail());

    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
    println!("a rc count after b creation = {}", Rc::strong_count(&a));
    println!("b initial rc count = {}", Rc::strong_count(&b));
    println!("b next item = {:?}", b.tail());

    // Creating the cycle
    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }

    println!("b rc count after changing a = {}", Rc::strong_count(&b));
    println!("a rc count after changing a = {}", Rc::strong_count(&a));

    // Uncomment the next line to see that we have a cycle;
    // it will overflow the stack.
    // println!("a next item = {:?}", a.tail());
}
```

### Visual Representation of the Cycle

**Before creating the cycle:**

```
a -> 5 -> Nil
b -> 10 -> a -> 5 -> Nil
```

**After creating the cycle:**

```
a -> 5 -> b -> 10 -> a -> 5 -> b -> 10 -> a -> ... (infinite loop)
     ↑____________________|
```

### What Happens When You Uncomment the Last Line?

If you uncomment `println!("a next item = {:?}", a.tail());`, the program will:

1. Try to print `a`
2. Need to print its tail (which is `b`)
3. Need to print `b`'s tail (which is `a`)
4. Need to print `a`'s tail (which is `b`)
5. ... infinite recursion
6. **Stack overflow!**

### Actual Output

```
error: process didn't exit successfully: `target\debug\Memory_leaks.exe`
(exit code: 0xc00000fd, STATUS_STACK_OVERFLOW)
```

The error shows the program crashed due to stack overflow caused by the infinite cycle.

## Strong vs Weak References

### Strong References - Rc<T>

- **Represent ownership** of an `Rc<T>` instance
- Created with `Rc::clone()`
- Increment `strong_count` by 1
- The value is only cleaned up when `strong_count` reaches 0
- Strong references prevent deallocation

### Weak References - Weak<T>

- **Do not represent ownership**
- Created with `Rc::downgrade()`
- Increment `weak_count` by 1
- `weak_count` being non-zero does **not** prevent the value from being dropped
- Automatically broken when `strong_count` reaches 0
- Must check if the value still exists before using it

### Key Differences

| Feature               | Strong Reference (Rc<T>) | Weak Reference (Weak<T>)    |
| --------------------- | ------------------------ | --------------------------- |
| Ownership             | Shares ownership         | Does not express ownership  |
| Prevents deallocation | Yes                      | No                          |
| Created by            | `Rc::clone()`            | `Rc::downgrade()`           |
| Counter affected      | `strong_count`           | `weak_count`                |
| Automatic cleanup     | When `strong_count == 0` | When `strong_count == 0`    |
| Usage                 | Direct access            | Must call `upgrade()` first |

## Preventing Memory Leaks with Weak<T>

### Using Weak References to Break Cycles

Replace `Rc<T>` with `Weak<T>` for one direction of the relationship to prevent cycles.

**Strategy:**

- Some references express ownership (use `Rc<T>`)
- Some references don't express ownership (use `Weak<T>`)
- Only ownership relationships affect value cleanup

### Accessing Values Through Weak<T>

Before using a `Weak<T>`, you must verify the value still exists:

```rust
// Call upgrade() method on Weak<T>
// Returns Option<Rc<T>>
let strong_ref: Option<Rc<T>> = weak_ref.upgrade();

match strong_ref {
    Some(rc) => {
        // Value still exists, use it
    }
    None => {
        // Value has been dropped
    }
}
```

## Practical Example: Tree Structure

### Node Structure with Parent-Child Relationships

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,      // Weak reference to parent
    children: RefCell<Vec<Rc<Node>>>, // Strong references to children
}
```

**Design rationale:**

- **Children → Parent**: Weak reference (child doesn't own parent)
- **Parent → Children**: Strong reference (parent owns children)
- This prevents cycles while maintaining proper ownership semantics

### Complete Example with Reference Counting

```rust
fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf)
    );

    {
        let branch = Rc::new(Node {
            value: 5,
            parent: RefCell::new(Weak::new()),
            children: RefCell::new(vec![Rc::clone(&leaf)]),
        });

        *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

        println!(
            "branch strong = {}, weak = {}",
            Rc::strong_count(&branch),
            Rc::weak_count(&branch)
        );
        println!(
            "leaf strong = {}, weak = {}",
            Rc::strong_count(&leaf),
            Rc::weak_count(&leaf)
        );
    } // branch goes out of scope here

    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf)
    );
}
```

### Expected Output

```
leaf parent = None
leaf strong = 1, weak = 0
branch strong = 1, weak = 1
leaf strong = 2, weak = 0
leaf parent = None
leaf strong = 1, weak = 0
```

### Analysis of Reference Counts

**Inside the inner scope:**

- `branch strong = 1`: Only one strong reference to branch exists
- `branch weak = 1`: The leaf's parent holds a weak reference to branch
- `leaf strong = 2`: Two strong references (original + branch's children vector)
- `leaf weak = 0`: No weak references to leaf

**After the scope ends:**

- `branch` is dropped (strong_count was 1, now 0)
- The weak reference from leaf to branch is automatically broken
- `leaf.parent.borrow().upgrade()` returns `None` (branch no longer exists)
- `leaf strong = 1`: Back to just the original reference
- `leaf weak = 0`: Still no weak references to leaf

## Best Practices

### When to Use Weak<T>

✅ **Use Weak<T> for:**

- Parent references in tree structures
- Back-references in graphs
- Cache entries that can be invalidated
- Observer patterns
- Any reference that shouldn't prevent deallocation

✅ **Use Rc<T> for:**

- Primary ownership relationships
- References that should keep the value alive
- Shared immutable data

### Preventing Memory Leaks

1. **Rely on developers, not just Rust's guarantees**

   - Rust cannot automatically detect all reference cycles
   - You must design your data structures carefully

2. **Reorganize data structures**

   - Some references express ownership (use `Rc<T>`)
   - Some references don't express ownership (use `Weak<T>`)
   - Only ownership relationships affect value cleanup

3. **Always check upgraded references**

   ```rust
   if let Some(parent) = node.parent.borrow().upgrade() {
       // Safe to use parent
   } else {
       // Parent has been dropped
   }
   ```

4. **Use scopes to control lifetimes**
   - Inner scopes can help visualize when values are dropped
   - Makes reference counting behavior more predictable

### Common Patterns

**Tree Structure:**

```rust
struct Node {
    parent: RefCell<Weak<Node>>,      // Weak: child doesn't own parent
    children: RefCell<Vec<Rc<Node>>>, // Strong: parent owns children
}
```

**Graph Structure:**

```rust
struct GraphNode {
    edges: RefCell<Vec<Weak<GraphNode>>>, // Weak: avoid cycles
    data: i32,
}
```

**Observer Pattern:**

```rust
struct Subject {
    observers: RefCell<Vec<Weak<dyn Observer>>>, // Weak: don't prevent cleanup
}
```

## Key Takeaways

1. **Memory leaks are possible in Rust** through reference cycles with `Rc<T>` and `RefCell<T>`

2. **Strong references (`Rc<T>`)** represent ownership and prevent deallocation while they exist

3. **Weak references (`Weak<T>`)** don't express ownership and don't prevent deallocation

4. **Breaking cycles** requires using `Weak<T>` for at least one direction of mutual references

5. **Always verify** that weak references are still valid using `upgrade()` before accessing them

6. **Design matters**: Thoughtful data structure design prevents cycles from forming in the first place

## Conclusion

Reference cycles represent one of the few scenarios where Rust's memory safety guarantees don't automatically prevent memory leaks. However, Rust provides the tools (`Weak<T>`) and patterns needed to handle these situations safely.

By understanding the distinction between strong and weak references, and carefully designing your data structures with ownership semantics in mind, you can build complex, interconnected data structures without memory leaks.

Remember: **Use `Rc<T>` for ownership, `Weak<T>` for references that shouldn't keep values alive.**

---

## Further Reading

- [The Rust Book - Reference Cycles Can Leak Memory](https://doc.rust-lang.org/book/ch15-06-reference-cycles.html)
- [Rust API Documentation - std::rc::Weak](https://doc.rust-lang.org/std/rc/struct.Weak.html)
- [Rust API Documentation - std::rc::Rc](https://doc.rust-lang.org/std/rc/struct.Rc.html)

/*
 * Struct's function:
 * Methods are similar to functions:
 * They have the fn keyword, a name, a function, parameters, and a return value.
 *
 * Differences between methods and functions:
 * 1. Methods are defined within the context of a struct (or enum or trait object).
 * 2. The first parameter is self, which represents the instance of the struct on which the method is being called.
 */

// According to the error message
#[derive(Debug)] // Let Rectangle(struct) be derived from Debug(trait)

struct Rectangle {
    width: u32,
    length: u32,
}

/*
 * The definition method needs to be defined in the impl block
 * The first argument of a method can be &self (self can be inferred to be of type Rectangle),
 * or it can take ownership of it (self) or borrow it mutably (mut &self)
 */
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.length
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.length > other.length
    }
}

/*
 * You can define functions in an impl block that don't take self as their first argument. These are called associated functions.
 * For example: String::from()
 * Associated functions are often used in constructors.
 */
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            length: size,
        }
    }
}

fn main() {
    let square = Rectangle::square(80); // Call the associated function

    let rect1 = Rectangle {
        width: 30,
        length: 50,
    };

    let rect2 = Rectangle {
        width: 10,
        length: 40,
    };

    let rect3 = Rectangle {
        width: 35,
        length: 55,
    };

    /*
     * println print format method:
     * std::fmt::Display
     * std::fmt::Debug
     */
    println!("{}", rect1.area());

    // {} will report an error, {:?} will also report an error without adding debug information
    // {:#?} can make the struct print more formatted
    println!("{:#?}", rect1);

    println!("{}", rect1.can_hold(&rect2));
    println!("{}", rect1.can_hold(&rect3));
}

/*
 * Rust doesn't have a -> operator, but Rust automatically references and dereferences objects.
 * This behavior occurs when calling a method:
 * Rust automatically adds &, &mut, or * as appropriate so that the object matches the method signature.
 */
// The following two lines of code have the same effect
// - p1.distance(&p2);
// - (&p1).distance(&p2);

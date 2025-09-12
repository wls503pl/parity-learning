/*
 * struct Point<T>
 * {
 *   x: T,
 *   y: T,
 * }
 */

// Note: Put T after the 'impl' keyword to implement the method on type T
/*
 * impl<T> Point<T>
 * {
 *   fn x(&self) -> &T
 *   {
 *       &self.x
 *   }
 * }
 */

// You can also target specific types, such as i32
/*
 * impl Point<i32>
 * {
 *   fn x1(&self) -> &i32
 *   {
 *       &self.x
 *   }
 * }
 */

// The type parameters in the structure can be different from the generic parameters of the method
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p = Point { x: 5, y: Some(10) };
    println!("p.x = {}", p.x);

    let p1 = Point { x: 6, y: 8 };
    let p2 = Point { x: "Hello", y: "c" };
    let p3 = p1.mixup(p2);

    println!("p3.x = {}, p3.y = {}", p3.x, p3.y);
}

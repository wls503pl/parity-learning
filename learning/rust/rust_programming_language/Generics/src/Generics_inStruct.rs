struct Point<T> {
    x: T,
    y: T,
}

// Multiple generic type parameters can be used in the structure
// But if there are too many type parameters, the code needs to be reorganized into multiple smaller units
struct Point2<T, U> {
    x: T,
    y: U,
}

fn main() {
    let integer = Point { x: 5, y: 10 }; // The types must be the same
    let mix = Point2 { x: 1.0, y: "one" }; // The former is float and the latter is String type
}

fn main() {
    let integer = Some(5);
    let float = Some(0.5); // Use the Some() variants of the 'Option' enum, with 'T' being i32 and f64 respectively
}

/*
 * When Rust compiles this code, it implements monomorphism.
 * The compiler first reads the values ​​used in the Option<T> enumeration instance and identifies two types of Option<T>:
 * Option<i32> and Option<f64>.
 * Therefore, the compiler expands the generic definition of Option<T> into Option_i32 and Option_f64.
 * This means that the generic definition (Some(5), Some(0.5) are generic,
 * representing both Some<i32> and Some<f64>) is expanded into the following two enumerations.
 */
/*
enum Option_i32 {
    Some(i32),
    None,
}
*/

/*
enum Option_f64 {
    Some(f64),
    None,
}
*/

// The main() function after the single state becomes as follows
/*
fn main() {
    let integer = Option_i32::Some(5);
    let float = Option_f64::Some(0.5);
}
*/

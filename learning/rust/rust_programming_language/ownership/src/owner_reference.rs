/*
 * How to let a function use a value without taking ownership of it?
 * The & symbol represents a reference: it allows you to reference a value without taking ownership of it.
 */
fn main() {
    let s1 = String::from("Hello");

    /*
     * The parameter type is &String instead of String
     * &s1 means it refers to s1, but does not own s1
     */
    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but does not own the string it points to, so the value it points to will not be cleaned up.

/*
 * So when a function takes a reference instead of a real value as its parameter,
 * it is not necessary to return the value in order to return ownership. (Because in this case the string is not owned at all)
 * The act of using a reference as a function parameter is called borrowing. Like variables, references are immutable by default
 * (so borrowed objects cannot be modified).
 */

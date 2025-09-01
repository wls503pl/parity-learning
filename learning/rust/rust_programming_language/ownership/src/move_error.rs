/*
 * Description:
 * Create a function with an error to demonstrate ownership transfer
 */
fn main() {
    /*
     * Rust provides a second string type: 'String'
     * Which allocate on the heap. Can store an unknown amount of text at compile time.
     * You can use the from function to create a 'String' type from a string literal.
     */
    let mut s1 = String::from("Hello");
    s1.push_str(", World!");
    println!("{}", s1);

    let s2 = s1;
    println!("{}", s1); // Notice: here will be an error, this file cannot be executed correctly, It is just for "Error" demonstration
}

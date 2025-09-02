/*
 * Description: Understand and master slice
 * Write a function that takes a string as an argument and returns the first word it finds in the string.
 * If the function does not find any spaces, the entire string is returned.
 */

fn main() {
    let s = String::from("Hello world");
    let word_index = first_word(&s[..]); // Immutable reference borrowing, here transfer String type to &str
    println!("{}", word_index);

    let s2 = "hello world!";
    let word_index = first_word(s2);

    // s.clear(); // Error: cannot borrow 's' as mutable because it is also borrowed as immutable
    println!("{}", word_index);
}

fn first_word(/*s: &String*/ s: &str) -> &str // &str is a slice of String, if parameter use this type it can receive both String and &str type
{
    let bytes = s.as_bytes(); // Get a byte array through as_bytes

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i]; // A string literal is actually a slice, it is stored directly in the binary program
        }
    }
    &s[..]
}

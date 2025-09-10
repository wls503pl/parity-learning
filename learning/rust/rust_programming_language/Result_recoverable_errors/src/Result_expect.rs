use std::fs::File;

fn main() {
    // Similar to 'unwrap', but 'expect' can specify an error message
    let _f = File::open("hello.txt").expect("Can't open File hello.txt!");
}

use std::fs::File;

fn main() {
    let f = File::open("hello.txt"); // here hello.txt doesn't exist

    let _f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("Error opening file {:?}", error);
        }
    };
}

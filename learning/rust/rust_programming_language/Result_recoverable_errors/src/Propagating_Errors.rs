use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let f = File::open("hello.txt");

    /*
     * This is a statement,
     * "let mut f = [match expression];" (everything inside the quotes forms a statement, and a statement ends with ';')
     */
    let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e), // Here you need to manually call 'return' to return to the function 'read_username_from_file'
    };

    let mut s = String::new();

    /*
     * The underscore '_' in Ok(_) is a wildcard pattern,
     * meaning "I don't care what the value is." read_to_string() returns Ok(usize) on success, where usize is the number of bytes read.
     * Since we only care about success, not the exact number of bytes read, we use '_' to ignore the value.
     */
    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    } // This is a 'match' expression, the result of which will be used as the return value of the function 'read_username_from_file'.
}

fn main() {
    let result = read_username_from_file();
}

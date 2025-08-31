// trait: Traits can be thought of as interfaces, where many methods can be defined.
// The Rng trait defines some of the methods that a random number generator needs to implement.
use rand::Rng;

use std::cmp::Ordering; // Ordering is an enumeration type, which has 3 values {Less, Greater, Equal}
use std::io; // prelude

fn main() {
    // Rust itself does not have the function of generating random numbers,
    // but the Rust team provides a library called 'rand' that can create random numbers.
    // Rust Lib address(for rand): https://crates.io/crates/rand

    // pub fn thread_rng() -> ThreadRng;
    // gen_range() is defined in trait Rng, it now takes a range parameter (1..101) means 1~100.
    let secret_number = rand::thread_rng().gen_range(1..101);
    println!("The secret number is: {}.", secret_number);

    loop {
        println!("Guess a number:");

        let mut guess = String::new(); // empty string object
        io::stdin().read_line(&mut guess).expect("can't read line!"); // read_line's parameter here is a reference, using symbol '&' and need to set to mutable so use 'mut' keywords
                                                                      // read_line func's return value is io::Result (2 values: Ok or Err)
                                                                      // (If Err, expect will break this process and print "can't read a line";
                                                                      // if Ok, expect will extract the value appended to OK and return it to User)
                                                                      // notice secret_number's type, 'guess' is a string
        println!("The number you guess is: {}", guess); // {} is a placeholder, it will be replaced to the parameter after comma, .e.g ("{}{},para1,para2);

        /*
         * Here, Rust allows new variables with the same name by using 'shadow' feature
         * In the case of type conversion, the new variable hides the old variable with the same name
         * The 'guess' on the right side of the '=' is the previous guess: String::new()
         * pub fn trim(&self) -> &str; trim() function remove spaces at both ends of string, cause the User presses 'Enter' when entering, this is a blank(\n)
         * pub fn parse<F: FromStr>(&self) -> Result<F, F::Err>; parses a string into an integer, it may fail, here we also use 'expect()' to handle
         * 'parse()' can parse a string into a certain numeric type, which may be i32, u32, i64, etc., so you need to indicate the type you want to parse after guess
         */

        // Using 'match' instead of 'expect' to handle errors is a common practice in rust
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        /*
         * The type of secret_number is originally i32 when it is declared. When it is compared with guess (specified as u32),
         * it is implicitly converted to u32.
         */
        match guess.cmp(&secret_number) {
            // cmp's return type is Ordering, using match to consider what to do next according to cmp's return value.
            Ordering::Less => println!("Too small!"), // This is called 'arm', if cmp's return value matchs one of below arms, it will exec "=> sentence"
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You get it!");
                break;
            }
        }
    }
}

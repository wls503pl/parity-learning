// trait: Traits can be thought of as interfaces, where many methods can be defined.
// The Rng trait defines some of the methods that a random number generator needs to implement.
use rand::Rng;

use std::io; // prelude

fn main() {
    println!("Guess a number:");

    // Rust itself does not have the function of generating random numbers,
    // but the Rust team provides a library called rand that can create random numbers.
    // Rust Lib address(for rand): https://crates.io/crates/rand

    // pub fn thread_rng() -> ThreadRng;
    // gen_range() is defined in trait Rng, it now takes a range parameter (1..101) means 1~100.
    let secret_number = rand::thread_rng().gen_range(1..101);

    let mut guess = String::new(); // empty string object
    io::stdin().read_line(&mut guess).expect("can't read line!"); // read_line's parameter here is a reference, using symbol '&' and need to set to mutable so use 'mut' keywords
                                                                  //read_line func's return value is io::Result (2 values: Ok or Err)
                                                                  // (If Err, expect will break this process and print "can't read a line";
                                                                  // if Ok, expect will extract the value appended to OK and return it to User)
    println!("The number you guess is: {}", guess); // {} is a placeholder, it will be replaced to the parameter after comma, .e.g ("{}{},para1,para2);
    println!("The secret number is: {}.", secret_number);
}

use std::io;

fn main() {
    println!("Guess a number:");

    let mut guess = String::new(); // empty string object
    io::stdin().read_line(&mut guess).expect("can't read line!"); // read_line's parameter here is a reference, using symbol '&' and need to set to mutable so use 'mut' keywords
                                                                  //read_line func's return value is io::Result (2 values: Ok or Err)
                                                                  // (If Err, expect will break this process and print "can't read a line";
                                                                  // if Ok, expect will extract the value appended to OK and return it to User)
    println!("The number you guess is: {}", guess); // {} is a placeholder, it will be replaced to the parameter after comma, .e.g ("{}{},para1,para2);
}

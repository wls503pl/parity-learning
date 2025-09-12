pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must between 1 and 100, got {}", value);
        }
        Guess { value }
    }

    /*
     * Getter: Returns field data.
     * Fields are private and cannot be assigned values ​​directly from outside.
     */
    pub fn value(&self) -> i32 {
        self.value
    }
}

fn main() {
    loop {
        // ...
        let guess = "32";
        let guess: i32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        let guess = Guess::new(guess);
        // ...
        break;
    }
}

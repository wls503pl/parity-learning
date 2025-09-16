pub struct Guess {
    value: u32,
}

impl Guess {
    pub fn new(value: u32) -> Guess {
        // if value < 1 || value > 100
        // if value < 1
        //{
        //    panic!("Guess value must between 1 and 100, got {}.", value)
        //}

        if value < 1 {
            panic!(
                "Guess value must be greater than or equal to 1, got {}.",
                value
            )
        } else if value > 100 {
            panic!(
                "Guess value must be less than or equal to 100, got {}.",
                value
            )
        }

        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    // If a panic occurs because this value is greater than 100,
    // the panic content will include the content specified by the expected parameter
    #[should_panic(expected = "Guess value must be less than or equal to 100")]
    fn greater_than_100() {
        // Passing 0, we take another panic branch, and this test will fail even though it will panic.
        Guess::new(0);
    }
}

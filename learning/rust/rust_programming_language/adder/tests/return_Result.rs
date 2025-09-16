#[cfg(test)]
mod tests {
    #[test]
    fn it_works() -> Result<(), String> {
        if 2 + 3 == 6 {
            Ok(())
        } else {
            Err(String::from("two plus two does not equal four"))
        }
    }
}

pub fn greeting(name: &str) -> String {
    format!("Hello!")
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn greetings_contain_name() {
        let result = greeting("Carol");
        assert!(
            result.contains("Carol"),
            "Greeting didn't contain name, value was '{}'",
            result
        );
    }
}

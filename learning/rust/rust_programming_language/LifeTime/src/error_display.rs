fn main() {
    let string1 = String::from("abcd");
    let result;

    {
        // Previously this was let string2 = "xyz";
        // But note: the lifecycle of a string literal runs through the entire program
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
    }
    println!("The longest string is {}", result);
}

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

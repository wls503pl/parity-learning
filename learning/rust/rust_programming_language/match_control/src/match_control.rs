// Rust Match Control Flow Examples
// Demonstrates various uses of match and if let patterns

// ========================================
// 1. Basic Match with Enum
// ========================================

#[derive(Debug)]
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

// ========================================
// 2. Pattern Binding - Extracting Values
// ========================================

#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
    California,
    Texas,
}

enum CoinWithState {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents_with_state(coin: CoinWithState) -> u8 {
    match coin {
        CoinWithState::Penny => {
            println!("Lucky penny!");
            1
        }
        CoinWithState::Nickel => 5,
        CoinWithState::Dime => 10,
        CoinWithState::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}

// ========================================
// 3. Matching Option<T> Enum
// ========================================

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn describe_option(x: Option<i32>) {
    match x {
        None => println!("No value present"),
        Some(value) => println!("Value is: {}", value),
    }
}

// ========================================
// 4. Exhaustive Matching with Wildcard
// ========================================

fn process_number(v: u8) {
    match v {
        1 => println!("One"),
        3 => println!("Three"),
        5 => println!("Five"),
        7 => println!("Seven"),
        _ => println!("Something else"), // Wildcard pattern - must be last
    }
}

// ========================================
// 5. if let - Simplified Control Flow
// ========================================

fn check_specific_value_match(v: Option<u8>) {
    // Using match for single pattern
    match v {
        Some(3) => println!("Found three with match!"),
        _ => println!("Not three or no value"),
    }
}

fn check_specific_value_if_let(v: Option<u8>) {
    // Using if let for the same logic
    if let Some(3) = v {
        println!("Found three with if let!");
    } else {
        println!("Not three or no value");
    }
}

// ========================================
// 6. More Complex if let Examples
// ========================================

fn process_coin_if_let(coin: CoinWithState) {
    // Only care about quarters from Alaska
    if let CoinWithState::Quarter(UsState::Alaska) = coin {
        println!("Alaska quarter found!");
    } else {
        println!("Not an Alaska quarter");
    }
}

fn extract_some_value(opt: Option<String>) {
    if let Some(text) = opt {
        println!("Text content: {}", text);
    }
    // No else clause needed if we don't care about None case
}

// ========================================
// Main Function - Demonstrating All Examples
// ========================================

fn main() {
    println!("=== Rust Match Control Flow Examples ===\n");

    // 1. Basic Match Examples
    println!("1. Basic Match with Enum:");
    let penny = Coin::Penny;
    let quarter = Coin::Quarter;
    println!("Penny value: {} cents", value_in_cents(penny));
    println!("Quarter value: {} cents", value_in_cents(quarter));
    println!();

    // 2. Pattern Binding Examples
    println!("2. Pattern Binding - Extracting Values:");
    let alaska_quarter = CoinWithState::Quarter(UsState::Alaska);
    let texas_quarter = CoinWithState::Quarter(UsState::Texas);
    println!(
        "Alaska quarter value: {} cents",
        value_in_cents_with_state(alaska_quarter)
    );
    println!(
        "Texas quarter value: {} cents",
        value_in_cents_with_state(texas_quarter)
    );
    println!();

    // 3. Option<T> Matching Examples
    println!("3. Matching Option<T>:");
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    describe_option(five);
    describe_option(six);
    describe_option(none);
    println!();

    // 4. Exhaustive Matching Examples
    println!("4. Exhaustive Matching with Wildcard:");
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8];
    for num in numbers {
        process_number(num);
    }
    println!();

    // 5. if let vs match Examples
    println!("5. if let vs match comparison:");
    let test_values = vec![Some(1), Some(3), Some(5), None];

    for value in &test_values {
        print!("Testing {:?}: ", value);
        check_specific_value_match(*value);
    }
    println!();

    for value in &test_values {
        print!("Testing {:?}: ", value);
        check_specific_value_if_let(*value);
    }
    println!();

    // 6. More Complex if let Examples
    println!("6. Complex if let patterns:");
    let coins = vec![
        CoinWithState::Quarter(UsState::Alaska),
        CoinWithState::Quarter(UsState::California),
        CoinWithState::Penny,
        CoinWithState::Dime,
    ];

    for coin in coins {
        process_coin_if_let(coin);
    }
    println!();

    // 7. Optional String Processing
    println!("7. Optional string processing:");
    let texts = vec![
        Some("Hello, World!".to_string()),
        Some("Rust is awesome!".to_string()),
        None,
    ];

    for text in texts {
        extract_some_value(text);
    }
}

// ========================================
// Additional Utility Functions
// ========================================

#[allow(dead_code)]
fn demonstrate_match_guards() {
    let number = Some(4);

    match number {
        Some(x) if x < 5 => println!("Less than five: {}", x),
        Some(x) => println!("Greater than or equal to five: {}", x),
        None => println!("No number"),
    }
}

#[allow(dead_code)]
fn demonstrate_multiple_patterns() {
    let x = 1;

    match x {
        1 | 2 => println!("One or two"),
        3..=5 => println!("Three through five"),
        _ => println!("Something else"),
    }
}

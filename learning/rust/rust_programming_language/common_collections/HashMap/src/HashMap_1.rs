use std::collections::HashMap;

fn main() {
    println!("=== HashMap Demonstration ===\n");

    // 1. Creating an empty HashMap
    println!("1. Creating an empty HashMap:");
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Hello"), 20);
    println!("   Created HashMap with key 'Hello' and value 20");
    println!("   HashMap: {:?}\n", scores);

    // 2. Creating HashMap using collect method
    println!("2. Creating HashMap using collect method:");
    let teams = vec![String::from("Blue"), String::from("Yellow")];
    let initial_scores = vec![10, 50];

    /*
     * Using collect method on tuple vectors to create HashMap
     * iter(): Creates an immutable reference iterator, returns std::slice::Iter<'_, T>
     * Each element produced by the iterator is of type &T (reference)
     * Does not take ownership of teams/initial_scores, can continue using original vectors
     *
     * zip(): Pairs elements from two iterators, returns a new iterator producing (A, B) tuples
     * Example: [1,2,3].zip([a,b,c]) produces [(1,a), (2,b), (3,c)]
     * Length is determined by the shorter iterator
     *
     * collect(): Consumes the iterator, collecting all elements into a collection
     * For HashMap, it expects an iterator of (K, V) tuples, which matches zip output
     *
     * Execution process:
     * teams.iter() → produces iterator of ["Blue", "Yellow"] references
     * initial_scores.iter() → produces iterator of [10, 50] references
     * zip() → produces iterator of [("Blue", 10), ("Yellow", 50)] tuples
     * collect() → builds HashMap<&str, i32> containing the mappings
     */
    let team_scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
    println!("   Teams: {:?}", teams);
    println!("   Initial scores: {:?}", initial_scores);
    println!("   Created HashMap: {:?}\n", team_scores);

    // 3. HashMap and Ownership
    println!("3. HashMap and Ownership:");
    let field_name = String::from("Favorite color");
    let field_value = String::from("Blue");

    let mut map = HashMap::new();
    map.insert(field_name, field_value);

    println!("   HashMap after inserting owned values: {:?}", map);
    // println!("{}: {}", field_name, field_value); // This would cause error - ownership moved
    println!("   Note: Original String variables can't be used after insert (ownership moved)\n");

    // Example with references to avoid ownership transfer
    println!("   Using references to preserve ownership:");
    let color = String::from("Green");
    let preference = String::from("Primary");
    let mut ref_map = HashMap::new();
    ref_map.insert(&color, &preference);
    println!("   HashMap with references: {:?}", ref_map);
    println!(
        "   Original variables still accessible: color={}, preference={}\n",
        color, preference
    );

    // 4. Accessing HashMap values
    println!("4. Accessing HashMap values using get method:");
    let mut game_scores = HashMap::new();
    game_scores.insert(String::from("Blue"), 10);
    game_scores.insert(String::from("Yellow"), 50);

    let team_name = String::from("Blue");
    let score = game_scores.get(&team_name);

    print!("   Looking for team '{}': ", team_name);
    match score {
        Some(s) => println!("Score is {}", s),
        None => println!("Team not found"),
    }

    // Try accessing non-existent key
    let missing_team = String::from("Red");
    let missing_score = game_scores.get(&missing_team);
    print!("   Looking for team '{}': ", missing_team);
    match missing_score {
        Some(s) => println!("Score is {}", s),
        None => println!("Team not found"),
    }
    println!();

    // 5. Iterating over HashMap
    println!("5. Iterating over HashMap using for loop:");
    let mut final_scores = HashMap::new();
    final_scores.insert(String::from("Blue"), 10);
    final_scores.insert(String::from("Yellow"), 50);
    final_scores.insert(String::from("Red"), 25);

    println!("   All team scores:");
    for (team, score) in &final_scores {
        println!("   {}: {}", team, score);
    }
}

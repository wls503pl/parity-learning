// Mainly to allow enumeration variants to hold generic data types, typically as follows
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

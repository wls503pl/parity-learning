/*
 * Description:
 * Define enum
 */
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

// In Rust, it is possible to attach data to variants of enumerations
// The advantages are: no additional struct is required to store related data;
// secondly, each variant can have a different type and amount of associated data
/* enum IpAddr {
    V4(String),	// Add a type after each variant
    V6(String),
}

enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}
*/

// IpAddr in the standard library
/*
struct Ipv4Addr
{
    // --snip--
}

struct Ipv6Addr
{
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
*/

fn main() {
    let home = IpAddr {
        kind: IpAddrKind::V4,
        address: String::from("127.0.0.1"),
    };

    /*
     * let home = IpAddrKind::V4(127, 0, 0, 1);
     * let loopback = IpAddrKind::V6(String::from("::1"));
     */

    let loopback = IpAddr {
        kind: IpAddrKind::V6,
        address: String::from("::1"),
    };
}

// use release_profile::kinds::PrimaryColor;
// use release_profile::utils::mix;
// The changes inside 'lib.rs' make the following use statements take effect
use release_profile::mix;
use release_profile::PrimaryColor;

fn main() {
    let red = PrimaryColor::Red;
    let yellow = PrimaryColor::Yellow;
    mix(red, yellow);
}

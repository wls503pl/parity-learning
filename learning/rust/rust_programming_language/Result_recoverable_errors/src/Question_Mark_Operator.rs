use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error>
{
    let mut f = File::open("hello.txt")?;
    
    /*let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e),
    };*/
    
    let mut s = String::new();
    
    /*
     * This statement is followed by a '?',
     * which means that if the statement is executed successfully (Result is Ok) and the execution will continue;
     * if it fails, the error Err() will be returned to the function 'read_username_from_file'.
     */
    f.read_to_string(mut &s)?;
    
    /*match f.read_to_string(&mut s)
    {
        Ok(_) => Ok(s),
        Err(e) => Err(e),    
    }*/
    
    Ok(s)   // This is an expression that returns Ok(s) to the function 'read_username_from_file'.
}

fn main()
{
    let result = read_username_from_file();
}
// lib.rs
pub trait Draw {
    fn draw(&self);
}

pub trait Clone {
    fn clone(&self) -> self;
}

pub struct Screen {
    pub components: Vec<Box<dyn Clone>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw()
        }
    }
}

pub struct Button {
    pub width: u32,
    pub height: u32,
    pub label: String,
}

impl Draw for Button {
    fn draw(&self) {
        // draw a button
    }
}

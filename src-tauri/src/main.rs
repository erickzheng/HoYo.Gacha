// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main(flavor = "multi_thread")]
async fn main() {
  // See: src/bootstrap/mod.rs
  hoyo_gacha::bootstrap::start().await;
}

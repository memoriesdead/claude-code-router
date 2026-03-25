# Browser Auth for Oracle Cloud MCP Server

## Simple 3-Step Setup

### 1. Copy Files to Your Oracle Cloud

Copy these to your Oracle Cloud MCP project:

**`types.rs`** - Add this:
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuthType {
    ApiKey,
    Browser,
}
```

Add `auth_type` field to your `ProviderConfig`:
```rust
pub struct ProviderConfig {
    pub name: String,
    pub base_url: String,
    pub auth_type: AuthType,
    pub api_key: Option<String>,  // Now optional!
    pub models: Vec<String>,
}
```

**`client.rs`** - Replace your send_request with this:

```rust
pub async fn send_request(
    provider: &ProviderConfig,
    request: &ChatRequest,
) -> Result<Response, Error> {
    let mut headers = HeaderMap::new();

    match provider.auth_type {
        AuthType::ApiKey => {
            if let Some(ref key) = provider.api_key {
                headers.insert("Authorization", format!("Bearer {}", key));
            }
        }
        AuthType::Browser => {
            // Load cookies from session file
            if let Ok(cookies) = load_cookies(&provider.name) {
                headers.insert("Cookie", cookies);
            }
        }
    }

    let response = http_client
        .post(&provider.base_url)
        .headers(headers)
        .json(&request)
        .send()
        .await?;

    Ok(response)
}

// Add these helper functions at top of file
fn load_cookies(provider_name: &str) -> Result<String, Error> {
    let path = format!("{}/.claude-code-router/sessions/{}.json", env!("HOME"), provider_name);
    let content = tokio::fs::read_to_string(&path)?;
    let json: serde_json::Value = serde_json::from_str(&content)?;
    Ok(json["cookies"].as_str().unwrap().to_string())
}
```

### 2. Get Your ChatGPT Cookies

**Option A: Use Claude Code Router (easiest)**
```bash
node ~/.claude-code-router/get-cookies.js
```

**Option B: Manual**
1. Open `chat.openai.com` in browser
2. F12 → Application → Cookies
3. Find `__Secure-next-auth.session-token`
4. Copy the value

Create file: `~/.claude-code-router/sessions/openai.json`:
```json
{
  "cookies": "__Secure-next-auth.session-token=YOUR_TOKEN_HERE"
}
```

### 3. Update Oracle Cloud Config

```rust
pub struct Config {
    pub providers: Vec<ProviderConfig>,
}

let config = Config {
    providers: vec![
        ProviderConfig {
            name: "openai".to_string(),
            base_url: "https://chat.openai.com/v1/chat/completions".to_string(),
            auth_type: AuthType::Browser,
            api_key: None,
            models: vec!["gpt-4o".to_string()],
        },
        // ... your other providers
    ],
};
```

### 4. Deploy & Done

- Paste code into Oracle Cloud
- Deploy
- Done! Your 3 PCs can now use ChatGPT

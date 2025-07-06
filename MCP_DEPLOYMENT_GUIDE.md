# MojoCode MCP Server Deployment Guide

## 🔧 Issues Fixed

### 1. Import Issues
- ✅ Fixed commented out `mcp_session` import in `src/agent.py`
- ✅ Re-enabled MCP tool loading with proper error handling
- ✅ Added graceful fallbacks for missing MCP servers

### 2. Configuration Issues  
- ✅ Added support for multiple MCP server URLs
- ✅ Updated Beam secrets configuration
- ✅ Added comprehensive error handling

### 3. Tool Integration
- ✅ Added `call_mcp_tool()` method for calling any MCP server
- ✅ Enhanced tool loading from all MCP servers
- ✅ Added proper server identification

## 🚀 Deployment Steps

### Step 1: Deploy MCP Servers
```bash
# Make the deployment script executable
chmod +x deploy_mcp_servers.sh

# Deploy all MCP servers
./deploy_mcp_servers.sh
```

This will deploy:
- **Main Tools Server**: Sandbox management and code editing
- **Sequential Thinking Server**: Advanced reasoning capabilities  
- **Context7 Server**: Documentation and library information
- **Exa Server**: Advanced web search and research

### Step 2: Set Environment Variables
The deployment script will output commands like:
```bash
beam secret set LOVABLE_MCP_URL "https://your-main-server.beam.cloud"
beam secret set THINKING_MCP_URL "https://your-thinking-server.beam.cloud"
beam secret set CONTEXT7_MCP_URL "https://your-context7-server.beam.cloud"
beam secret set EXA_MCP_URL "https://your-exa-server.beam.cloud"
```

### Step 3: Deploy the Main Agent
```bash
beam serve src/agent.py:handler
```

### Step 4: Test the Deployment
```bash
# Test all MCP servers
python test_mcp_servers.py
```

## 🧪 Testing

### Manual Testing
You can test individual servers:

```python
import asyncio
from src.client import mcp_session

async def test_server():
    url = "your-server-url"
    async with mcp_session(url) as session:
        tools = await session.list_tools()
        print(f"Available tools: {[t.name for t in tools]}")

asyncio.run(test_server())
```

### Automated Testing
Run the comprehensive test suite:
```bash
python test_mcp_servers.py
```

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to connect to MCP server"**
   - Check if the server URL is correct
   - Verify the server is deployed and running
   - Check Beam logs: `beam logs <deployment-id>`

2. **"No URL configured for server"**
   - Ensure environment variables are set correctly
   - Check Beam secrets: `beam secret list`

3. **"Tool not found"**
   - Verify the tool name matches the server implementation
   - Check server logs for any startup errors

### Debug Commands
```bash
# Check Beam deployments
beam list

# Check server logs
beam logs <deployment-id>

# Check secrets
beam secret list

# Test connectivity
curl -X POST <server-url>/mcp/list_tools
```

## 📋 Available Tools

### Main Tools Server (`tools.py`)
- `create_app_environment`: Create new sandbox environment
- `load_code`: Load code from sandbox
- `edit_code`: Edit code in sandbox

### Sequential Thinking Server (`thinking_tools.py`)
- `sequentialthinking`: Advanced reasoning and problem-solving

### Context7 Server (`context7_tools.py`)
- `resolve_library_id`: Resolve library names to Context7 IDs
- `get_library_docs`: Get documentation for libraries

### Exa Server (`exa_tools.py`)
- `exa_search`: Neural web search
- `exa_get_contents`: Get full content from URLs
- `exa_find_similar`: Find similar content

## 🎯 Next Steps

1. **Frontend Integration**: Update your frontend to use the deployed agent WebSocket URL
2. **Monitoring**: Set up monitoring for all MCP servers
3. **Scaling**: Adjust CPU/memory based on usage patterns
4. **Security**: Review and rotate API keys as needed

## 🔐 Security Notes

- Exa API key is currently hardcoded - consider moving to environment variable
- All servers use Beam's built-in authentication
- Monitor usage to prevent API quota exhaustion

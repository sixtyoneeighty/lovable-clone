#!/bin/bash

# Add beam to PATH and use Python 3.10
export PATH="/opt/homebrew/bin:$PATH"
export PYTHON_VERSION="python3.10"

# Deploy all MCP servers for MojoCode
echo "🚀 Deploying MojoCode MCP Servers..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to deploy a server and capture URL
deploy_server() {
    local server_file=$1
    local server_name=$2
    
    echo -e "${YELLOW}Deploying ${server_name}...${NC}"
    
    # Deploy and capture output
    output=$(beam serve "${server_file}" 2>&1)
    
    if [ $? -eq 0 ]; then
        # Extract URL from output (assuming it's in the format shown in beam serve output)
        url=$(echo "$output" | grep -o 'https://[^[:space:]]*' | head -1)
        echo -e "${GREEN}✅ ${server_name} deployed successfully${NC}"
        echo -e "${GREEN}   URL: ${url}${NC}"
        echo ""
        
        # Return the URL for environment variable setup
        echo "$url"
    else
        echo -e "${RED}❌ Failed to deploy ${server_name}${NC}"
        echo "$output"
        echo ""
        return 1
    fi
}

echo "Starting MCP server deployments..."
echo ""

# Deploy main tools server
echo "1. Deploying Main Tools Server (Sandbox Management)..."
MAIN_URL=$(deploy_server "src/tools.py:s" "Main Tools")

# Deploy thinking server
echo "2. Deploying Sequential Thinking Server..."
THINKING_URL=$(deploy_server "src/thinking_tools.py:thinking_server" "Sequential Thinking")

# Deploy Context7 server
echo "3. Deploying Context7 Documentation Server..."
CONTEXT7_URL=$(deploy_server "src/context7_tools.py:context7_server" "Context7 Documentation")

# Deploy Exa server
echo "4. Deploying Exa Research Server..."
EXA_URL=$(deploy_server "src/exa_tools.py:exa_server" "Exa Research")

echo "🎉 All MCP servers deployed!"
echo ""
echo "📝 Environment Variables for Agent:"
echo "=================================="
echo "LOVABLE_MCP_URL=${MAIN_URL}"
echo "THINKING_MCP_URL=${THINKING_URL}"
echo "CONTEXT7_MCP_URL=${CONTEXT7_URL}"
echo "EXA_MCP_URL=${EXA_URL}"
echo ""
echo "💡 Next steps:"
echo "1. Set these environment variables in your Beam secrets"
echo "2. Deploy the agent with: beam serve src/agent.py:handler"
echo "3. Update your frontend .env with the agent WebSocket URL"
echo ""
echo "🔧 To set Beam secrets:"
echo "beam secret set LOVABLE_MCP_URL \"${MAIN_URL}\""
echo "beam secret set THINKING_MCP_URL \"${THINKING_URL}\""
echo "beam secret set CONTEXT7_MCP_URL \"${CONTEXT7_URL}\""
echo "beam secret set EXA_MCP_URL \"${EXA_URL}\""

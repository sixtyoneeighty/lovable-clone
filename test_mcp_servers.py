#!/usr/bin/env python3
"""
Test script to verify MCP servers are working correctly
"""
import asyncio
import os
import sys
from src.client import mcp_session

async def test_mcp_server(url: str, server_name: str):
    """Test a single MCP server"""
    print(f"\n🧪 Testing {server_name} server at {url}")
    
    if not url:
        print(f"❌ No URL provided for {server_name}")
        return False
    
    try:
        async with mcp_session(url) as session:
            # List available tools
            tools = await session.list_tools()
            print(f"✅ {server_name} server connected successfully")
            print(f"📋 Available tools ({len(tools)}):")
            for tool in tools:
                print(f"   - {tool.name}: {tool.description[:100]}...")
            return True
    except Exception as e:
        print(f"❌ Failed to connect to {server_name} server: {e}")
        return False

async def test_thinking_tool(url: str):
    """Test the sequential thinking tool specifically"""
    if not url:
        return False
        
    print(f"\n🧠 Testing sequential thinking tool...")
    try:
        async with mcp_session(url) as session:
            response = await session.call_tool(
                name="sequentialthinking",
                arguments={
                    "thought": "This is a test thought to verify the thinking server is working",
                    "next_thought_needed": False,
                    "thought_number": 1,
                    "total_thoughts": 1
                }
            )
            print(f"✅ Thinking tool test successful")
            print(f"📝 Response: {response.content[0].text[:200]}...")
            return True
    except Exception as e:
        print(f"❌ Thinking tool test failed: {e}")
        return False

async def test_context7_tool(url: str):
    """Test the context7 tool specifically"""
    if not url:
        return False
        
    print(f"\n📚 Testing context7 tool...")
    try:
        async with mcp_session(url) as session:
            response = await session.call_tool(
                name="resolve_library_id",
                arguments={
                    "library_name": "react"
                }
            )
            print(f"✅ Context7 tool test successful")
            print(f"📝 Response: {response.content[0].text[:200]}...")
            return True
    except Exception as e:
        print(f"❌ Context7 tool test failed: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 MojoCode MCP Server Test Suite")
    print("=" * 50)
    
    # Test configuration
    servers = {
        "Main Tools": os.getenv("LOVABLE_MCP_URL"),
        "Sequential Thinking": os.getenv("THINKING_MCP_URL"),
        "Context7 Documentation": os.getenv("CONTEXT7_MCP_URL"),
        "Exa Research": os.getenv("EXA_MCP_URL")
    }
    
    results = {}
    
    # Test basic connectivity for all servers
    for name, url in servers.items():
        results[name] = await test_mcp_server(url, name)
    
    # Test specific tools if servers are available
    if results.get("Sequential Thinking"):
        await test_thinking_tool(servers["Sequential Thinking"])
    
    if results.get("Context7 Documentation"):
        await test_context7_tool(servers["Context7 Documentation"])
    
    # Summary
    print(f"\n📊 Test Results Summary")
    print("=" * 30)
    successful = sum(results.values())
    total = len(results)
    
    for name, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{name}: {status}")
    
    print(f"\nOverall: {successful}/{total} servers working")
    
    if successful == total:
        print("🎉 All MCP servers are working correctly!")
        return 0
    else:
        print("⚠️  Some MCP servers need attention")
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

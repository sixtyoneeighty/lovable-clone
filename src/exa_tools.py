"""
Exa MCP Server for MojoCode
Based on: https://github.com/exa-labs/exa-mcp-server
API Key: f953f1e5-ec3a-4371-911f-c52f4bc4c274
"""
from beam.integrations import MCPServer
from fastmcp import FastMCP
from typing import Dict, Any, Optional, List
import requests
import json

exa_mcp = FastMCP("mojocode-exa-mcp")

# Exa API configuration
EXA_API_KEY = "f953f1e5-ec3a-4371-911f-c52f4bc4c274"
EXA_BASE_URL = "https://api.exa.ai"

@exa_mcp.tool
def exa_search(
    query: str,
    num_results: int = 10,
    include_domains: Optional[List[str]] = None,
    exclude_domains: Optional[List[str]] = None,
    start_crawl_date: Optional[str] = None,
    end_crawl_date: Optional[str] = None,
    start_published_date: Optional[str] = None,
    end_published_date: Optional[str] = None,
    use_autoprompt: bool = True,
    type: str = "neural"
) -> Dict[str, Any]:
    """
    Search for web content using Exa's neural search capabilities.
    
    Parameters:
    - query: The search query
    - num_results: Number of results to return (max 100)
    - include_domains: List of domains to include in search
    - exclude_domains: List of domains to exclude from search
    - start_crawl_date: Start date for crawl date filter (YYYY-MM-DD)
    - end_crawl_date: End date for crawl date filter (YYYY-MM-DD)
    - start_published_date: Start date for published date filter (YYYY-MM-DD)
    - end_published_date: End date for published date filter (YYYY-MM-DD)
    - use_autoprompt: Whether to use Exa's autoprompt feature
    - type: Search type ("neural" or "keyword")
    """
    try:
        headers = {
            "Authorization": f"Bearer {EXA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "query": query,
            "numResults": num_results,
            "useAutoprompt": use_autoprompt,
            "type": type
        }
        
        if include_domains:
            payload["includeDomains"] = include_domains
        if exclude_domains:
            payload["excludeDomains"] = exclude_domains
        if start_crawl_date:
            payload["startCrawlDate"] = start_crawl_date
        if end_crawl_date:
            payload["endCrawlDate"] = end_crawl_date
        if start_published_date:
            payload["startPublishedDate"] = start_published_date
        if end_published_date:
            payload["endPublishedDate"] = end_published_date
        
        response = requests.post(
            f"{EXA_BASE_URL}/search",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                "status": "success",
                "results": response.json(),
                "query": query,
                "num_results": num_results
            }
        else:
            return {
                "status": "error",
                "error": f"API request failed with status {response.status_code}",
                "message": response.text
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@exa_mcp.tool
def exa_get_contents(
    ids: List[str],
    text: bool = True,
    highlights: bool = False,
    summary: bool = False
) -> Dict[str, Any]:
    """
    Get the contents of specific URLs by their Exa IDs.
    
    Parameters:
    - ids: List of Exa result IDs to get contents for
    - text: Whether to include the full text content
    - highlights: Whether to include highlighted snippets
    - summary: Whether to include AI-generated summaries
    """
    try:
        headers = {
            "Authorization": f"Bearer {EXA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "ids": ids,
            "contents": {
                "text": text,
                "highlights": highlights,
                "summary": summary
            }
        }
        
        response = requests.post(
            f"{EXA_BASE_URL}/contents",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                "status": "success",
                "contents": response.json()
            }
        else:
            return {
                "status": "error",
                "error": f"API request failed with status {response.status_code}",
                "message": response.text
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@exa_mcp.tool
def exa_find_similar(
    url: str,
    num_results: int = 10,
    include_domains: Optional[List[str]] = None,
    exclude_domains: Optional[List[str]] = None,
    start_crawl_date: Optional[str] = None,
    end_crawl_date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Find content similar to a given URL.
    
    Parameters:
    - url: The URL to find similar content for
    - num_results: Number of results to return
    - include_domains: List of domains to include in search
    - exclude_domains: List of domains to exclude from search
    - start_crawl_date: Start date for crawl date filter (YYYY-MM-DD)
    - end_crawl_date: End date for crawl date filter (YYYY-MM-DD)
    """
    try:
        headers = {
            "Authorization": f"Bearer {EXA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": url,
            "numResults": num_results
        }
        
        if include_domains:
            payload["includeDomains"] = include_domains
        if exclude_domains:
            payload["excludeDomains"] = exclude_domains
        if start_crawl_date:
            payload["startCrawlDate"] = start_crawl_date
        if end_crawl_date:
            payload["endCrawlDate"] = end_crawl_date
        
        response = requests.post(
            f"{EXA_BASE_URL}/findSimilar",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                "status": "success",
                "results": response.json(),
                "source_url": url
            }
        else:
            return {
                "status": "error",
                "error": f"API request failed with status {response.status_code}",
                "message": response.text
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@exa_mcp.tool
def research_topic(
    topic: str,
    focus_domains: Optional[List[str]] = None,
    num_results: int = 5
) -> Dict[str, Any]:
    """
    Research a specific topic using Exa's capabilities.
    This is a high-level function that combines search and content retrieval.
    
    Parameters:
    - topic: The topic to research
    - focus_domains: Specific domains to focus on (e.g., ["github.com", "docs.python.org"])
    - num_results: Number of results to analyze
    """
    try:
        # First, search for the topic
        search_result = exa_search(
            query=topic,
            num_results=num_results,
            include_domains=focus_domains,
            use_autoprompt=True
        )
        
        if search_result["status"] != "success":
            return search_result
        
        # Extract IDs from search results
        results = search_result["results"].get("results", [])
        ids = [result["id"] for result in results[:3]]  # Get content for top 3 results
        
        if ids:
            # Get detailed content
            content_result = exa_get_contents(
                ids=ids,
                text=True,
                summary=True
            )
            
            return {
                "status": "success",
                "topic": topic,
                "search_results": results,
                "detailed_content": content_result.get("contents", {}),
                "summary": f"Found {len(results)} results for '{topic}'"
            }
        else:
            return {
                "status": "success",
                "topic": topic,
                "search_results": results,
                "summary": f"Found {len(results)} results for '{topic}' but no detailed content available"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "topic": topic
        }

# Create the MCP server
exa_server = MCPServer(
    exa_mcp,
    name="mojocode-exa",
    cpu=1.0,
    memory=1024,
    keep_warm_seconds=300,
    concurrent_requests=50
)

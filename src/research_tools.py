"""
MCP Server for research and documentation tools
"""
import requests
from beam.integrations import MCPServer
from fastmcp import FastMCP

research_mcp = FastMCP(name="mojocode-research-mcp")

@research_mcp.tool
def search_web(query: str, max_results: int = 5) -> dict:
    """Search the web for information related to the query"""
    # Example implementation - you'd want to use a proper search API
    return {
        "query": query,
        "results": [
            {
                "title": f"Result for {query}",
                "url": "https://example.com",
                "snippet": f"Information about {query}..."
            }
        ]
    }

@research_mcp.tool
def get_npm_package_info(package_name: str) -> dict:
    """Get information about an npm package"""
    try:
        response = requests.get(f"https://registry.npmjs.org/{package_name}")
        if response.status_code == 200:
            data = response.json()
            return {
                "name": data.get("name"),
                "description": data.get("description"),
                "latest_version": data.get("dist-tags", {}).get("latest"),
                "homepage": data.get("homepage"),
                "repository": data.get("repository", {}).get("url"),
                "keywords": data.get("keywords", [])
            }
    except Exception as e:
        return {"error": str(e)}
    
    return {"error": "Package not found"}

@research_mcp.tool
def analyze_design_trends(category: str) -> dict:
    """Analyze current design trends for a given category"""
    trends = {
        "ui": [
            "Glass morphism effects",
            "Dark mode with accent colors", 
            "Micro-interactions",
            "Minimalist layouts",
            "Custom illustrations"
        ],
        "colors": [
            "Dark themes with red accents",
            "Gradient overlays",
            "High contrast combinations",
            "Monochromatic schemes",
            "Neon highlights"
        ],
        "typography": [
            "Variable fonts",
            "Large headings",
            "Increased line spacing",
            "Sans-serif dominance",
            "Custom font pairings"
        ]
    }
    
    return {
        "category": category,
        "trends": trends.get(category, ["No trends found for this category"]),
        "recommendations": f"For {category}, consider modern, clean approaches that prioritize user experience"
    }

@research_mcp.tool
def get_component_examples(component_type: str, framework: str = "react") -> dict:
    """Get code examples for specific component types"""
    examples = {
        "button": {
            "react": """
const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button 
      className={`btn btn-${variant} glass-effect`}
      {...props}
    >
      {children}
    </button>
  );
};""",
            "description": "Modern button with glass morphism effect"
        },
        "card": {
            "react": """
const Card = ({ children, className = "" }) => {
  return (
    <div className={`glass-card backdrop-blur-lg ${className}`}>
      {children}
    </div>
  );
};""",
            "description": "Glass morphism card component"
        }
    }
    
    return {
        "component_type": component_type,
        "framework": framework,
        "example": examples.get(component_type, {}).get(framework, "No example found"),
        "description": examples.get(component_type, {}).get("description", "")
    }

# Create the MCP server
research_server = MCPServer(
    research_mcp, 
    cpu=0.5, 
    memory=512, 
    keep_warm_seconds=300,
    concurrent_requests=100
)

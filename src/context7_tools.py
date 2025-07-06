"""
Context7 MCP Server for MojoCode
Based on: https://github.com/upstash/context7
"""
from beam.integrations import MCPServer
from fastmcp import FastMCP
from typing import Dict, Any, Optional
import requests
import json

context7_mcp = FastMCP("mojocode-context7-mcp")

@context7_mcp.tool
def resolve_library_id(library_name: str) -> Dict[str, Any]:
    """
    Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

    You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

    Selection Process:
    1. Analyze the query to understand what library/package the user is looking for
    2. Return the most relevant match based on:
    - Name similarity to the query (exact matches prioritized)
    - Description relevance to the query's intent
    - Documentation coverage (prioritize libraries with higher Code Snippet counts)
    - Trust score (consider libraries with scores of 7-10 more authoritative)

    Response Format:
    - Return the selected library ID in a clearly marked section
    - Provide a brief explanation for why this library was chosen
    - If multiple good matches exist, acknowledge this but proceed with the most relevant one
    - If no good matches exist, clearly state this and suggest query refinements

    For ambiguous queries, request clarification before proceeding with a best-guess match.
    """
    try:
        # This would typically call the Context7 API to resolve library names
        # For now, we'll simulate common library mappings
        library_mappings = {
            "react": "/facebook/react",
            "next.js": "/vercel/next.js", 
            "nextjs": "/vercel/next.js",
            "material-ui": "/mui/material-ui",
            "mui": "/mui/material-ui",
            "@mui/material": "/mui/material-ui",
            "tailwind": "/tailwindlabs/tailwindcss",
            "tailwindcss": "/tailwindlabs/tailwindcss",
            "typescript": "/microsoft/typescript",
            "vite": "/vitejs/vite",
            "shadcn": "/shadcn/ui",
            "shadcn/ui": "/shadcn/ui",
            "lucide": "/lucide-icons/lucide",
            "recharts": "/recharts/recharts",
            "react-router": "/remix-run/react-router",
            "react-router-dom": "/remix-run/react-router",
            "framer-motion": "/framer/motion",
            "styled-components": "/styled-components/styled-components"
        }
        
        library_id = library_mappings.get(library_name.lower())
        
        if library_id:
            return {
                "library_id": library_id,
                "library_name": library_name,
                "match_confidence": "high",
                "explanation": f"Found exact match for {library_name}",
                "status": "success"
            }
        else:
            return {
                "library_id": None,
                "library_name": library_name,
                "match_confidence": "none",
                "explanation": f"No exact match found for {library_name}. Try a more specific name or check spelling.",
                "status": "not_found",
                "suggestions": ["react", "next.js", "material-ui", "tailwindcss", "typescript"]
            }
            
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }

@context7_mcp.tool
def get_library_docs(
    context7_compatible_library_id: str,
    tokens: int = 10000,
    topic: Optional[str] = None
) -> Dict[str, Any]:
    """
    Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.
    
    Parameters:
    - context7_compatible_library_id: Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v14.3.0-canary.87') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'.
    - tokens: Maximum number of tokens of documentation to retrieve (default: 10000). Higher values provide more context but consume more tokens.
    - topic: Topic to focus documentation on (e.g., 'hooks', 'routing').
    """
    try:
        # This would typically call the Context7 API
        # For now, we'll return simulated documentation based on the library
        
        docs_content = {
            "/facebook/react": {
                "library": "React",
                "version": "18.x",
                "documentation": """
# React Documentation

## Core Concepts

### Components
React components are the building blocks of React applications. They can be functional or class-based.

```jsx
function MyComponent({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Hooks
React Hooks allow you to use state and other React features in functional components.

#### useState
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

#### useEffect
```jsx
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

### Props and State
- Props are read-only data passed to components
- State is mutable data managed within components
                """,
                "topics": ["components", "hooks", "props", "state", "jsx"]
            },
            "/vercel/next.js": {
                "library": "Next.js",
                "version": "14.x",
                "documentation": """
# Next.js Documentation

## App Router (Recommended)

### File-based Routing
Next.js uses file-based routing in the `app` directory.

```
app/
  page.tsx          # /
  about/
    page.tsx        # /about
  blog/
    [slug]/
      page.tsx      # /blog/[slug]
```

### Server Components
By default, components in the app directory are Server Components.

```tsx
// app/page.tsx
export default function HomePage() {
  return <h1>Welcome to Next.js!</h1>;
}
```

### Client Components
Use 'use client' directive for interactive components.

```tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Data Fetching
```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{JSON.stringify(data)}</div>;
}
```
                """,
                "topics": ["app-router", "routing", "server-components", "client-components", "data-fetching"]
            },
            "/mui/material-ui": {
                "library": "Material-UI",
                "version": "5.x",
                "documentation": """
# Material-UI Documentation

## Getting Started

### Installation
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Basic Usage
```tsx
import { Button, Typography, Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hello Material-UI
      </Typography>
      <Button variant="contained" color="primary">
        Click me
      </Button>
    </Box>
  );
}
```

### Theming
```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```
                """,
                "topics": ["components", "theming", "styling", "sx-prop"]
            }
        }
        
        library_docs = docs_content.get(context7_compatible_library_id)
        
        if library_docs:
            # Filter by topic if specified
            if topic:
                filtered_docs = f"# {library_docs['library']} - {topic}\n\n"
                if topic.lower() in library_docs['documentation'].lower():
                    # Extract relevant sections (simplified)
                    filtered_docs += library_docs['documentation']
                else:
                    filtered_docs += f"No specific documentation found for topic '{topic}'. Here's the general documentation:\n\n{library_docs['documentation']}"
                
                return {
                    "library_id": context7_compatible_library_id,
                    "library": library_docs['library'],
                    "version": library_docs['version'],
                    "topic": topic,
                    "documentation": filtered_docs[:tokens],
                    "available_topics": library_docs['topics'],
                    "status": "success"
                }
            else:
                return {
                    "library_id": context7_compatible_library_id,
                    "library": library_docs['library'],
                    "version": library_docs['version'],
                    "documentation": library_docs['documentation'][:tokens],
                    "available_topics": library_docs['topics'],
                    "status": "success"
                }
        else:
            return {
                "error": f"Documentation not found for library ID: {context7_compatible_library_id}",
                "status": "not_found",
                "suggestion": "Try using resolve-library-id first to get the correct library ID"
            }
            
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }

# Create the MCP server
context7_server = MCPServer(
    context7_mcp,
    name="mojocode-context7",
    cpu=0.5,
    memory=512,
    keep_warm_seconds=300,
    concurrent_requests=100
)

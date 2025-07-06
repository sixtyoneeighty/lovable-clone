import os
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from beam import Image, PythonVersion, endpoint

class StaticFileHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_GET(self):
        # Handle SPA routing - serve index.html for routes that don't exist
        if self.path != "/" and not os.path.exists(f"dist{self.path}"):
            self.path = "/index.html"
        super().do_GET()

@endpoint(
    name="mojocode-frontend",
    cpu=0.5,
    memory=512,
    image=Image(
        python_version=PythonVersion.Python311,
        python_packages=[],
    ),
)
def serve_frontend():
    server = HTTPServer(('0.0.0.0', 8000), StaticFileHandler)
    print("Starting server on port 8000...")
    server.serve_forever()

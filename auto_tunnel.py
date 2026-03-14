import subprocess
import time
import re
import os
import signal
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

child_process = None

def cleanup(signum, frame):
    print("\n[Tunnel] Shutting down Localtunnel...")
    if child_process:
        child_process.terminate()
    print("[Tunnel] Restoring localhost in .env...")
    update_env("http://localhost:8000")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)

def update_env(new_url):
    """Updates the API_URL in the .env file"""
    if not ENV_FILE.exists():
        print(f"Error: {ENV_FILE} not found.")
        return

    content = ENV_FILE.read_text()
    
    # Replace existing API_URL
    new_content = re.sub(r"^API_URL=.*$", f"API_URL={new_url}", content, flags=re.MULTILINE)
    
    # If API_URL wasn't in the file at all, append it
    if new_content == content and "API_URL=" not in content:
        new_content += f"\nAPI_URL={new_url}\n"
        
    ENV_FILE.write_text(new_content)
    print(f"✅ Auto-Updated .env with: API_URL={new_url}")

def start_cloudflare_tunnel():
    """Starts Cloudflare Tunnel and grabs the URL"""
    global child_process
    
    print("🚀 Starting Cloudflare Tunnel for port 8000...")
    print("⏳ Waiting for public URL...")
    
    # Run the cloudflared command
    child_process = subprocess.Popen(
        ["cloudflared", "tunnel", "--url", "http://127.0.0.1:8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    url_found = False

    try:
        # Read the output line by line to find the trycloudflare URL
        while True:
            line = child_process.stdout.readline()
            if not line and child_process.poll() is not None:
                break
                
            line_str = line.strip()
            
            # Print output so user sees it
            if line_str and not url_found:
                # We skip printing the massive splash screen cloudflare sends after the URL is found
                print(line_str)
            
            # Look for the URL 
            if not url_found:
                match = re.search(r"(https://[a-zA-Z0-9.-]+\.trycloudflare\.com)", line_str)
                if match:
                    url = match.group(1)
                    print("\n" + "="*50)
                    print(f"🌍 PUBLIC CLOUDFLARE URL DETECTED: {url}")
                    print("="*50 + "\n")
                    update_env(url)
                    url_found = True
                    print("\n⚠️  IMPORTANT: You must restart your API terminal (uvicorn) now so it loads the new .env URL!")
                    print("Press Ctrl+C to stop the tunnel (this will auto-revert your .env back to localhost).")

        # Keep script running
        child_process.wait()
    except KeyboardInterrupt:
        cleanup(None, None)

if __name__ == "__main__":
    start_cloudflare_tunnel()

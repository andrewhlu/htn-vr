1. Run ngrok: `ngrok.exe http 8000`
2. Copy first forwarding link and paste in `const serverWs = new WebSocket("wss://13fe-2620-101-f000-700-a857-7b6d-4b89-f2a9.ngrok.io/");`
3. Run the web app: `http-server -S -C cert.pem`
4. Run python server: `python server.py`
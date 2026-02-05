from app import create_app
import os

app = create_app()

if __name__ == "__main__":
    # Running on port 5005 for local verification
    app.run(host="127.0.0.1", port=5005, debug=True)

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

def create_app():
    # Load environment variables from the root .env file
    # We go up two levels: app -> backend -> root
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    load_dotenv(os.path.join(root_dir, '.env'), override=True)

    app = Flask(__name__)
    
    # Configure CORS to allow requests from Next.js (localhost:3000)
    CORS(app)

    # Initialize Database (Teardown contexts)
    from .db import mongo
    mongo.init_app(app)

    # Register Blueprints
    from .routes.system import system_bp
    from .routes.ai import ai_bp
    # Prefix /api means routes in system_bp will be /api/health, etc.
    app.register_blueprint(system_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api")
    
    @app.route("/")
    def index():
        return "Hospital CRM Backend (Flask) is Running on Port 5001"

    return app

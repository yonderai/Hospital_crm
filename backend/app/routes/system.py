from flask import Blueprint, jsonify
from app.db.mongo import get_db

system_bp = Blueprint('system', __name__)

# Route is /health because Blueprint is registered with url_prefix='/api'
# Final URL: /api/health
@system_bp.route("/health")
def health_check():
    """
    Health check endpoint.
    Verifies if the API is online and if MongoDB is accessible.
    """
    db = get_db()
    
    # Explicit check for None (safety)
    if db is not None:
        db_status = "connected"
    else:
        db_status = "disconnected"
    
    return jsonify({
        "status": "online",
        "service": "Flask Backend",
        "db": db_status
    })

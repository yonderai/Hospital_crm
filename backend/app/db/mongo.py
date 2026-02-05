import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from flask import g, current_app

def get_db():
    """
    Get the MongoDB database connection.
    Uses Flask's 'g' object to store the connection for the request duration.
    """
    if 'db' not in g:
        mongo_uri = os.environ.get("MONGODB_URI")
        if not mongo_uri:
            # Fallback for development matches user's local setup
            mongo_uri = "mongodb://127.0.0.1:27017/hospital_crm"
            
        try:
            # Create a client
            # serverSelectionTimeoutMS=3000 ensures we don't hang efficiently if DB is down
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
            
            # Trigger a connection check immediately
            client.admin.command('ping')
            
            # Get database name from URI or default
            db_name = mongo_uri.split('/')[-1].split('?')[0] or "hospital_crm"
            
            g.client = client
            g.db = client[db_name]
            
            # Log only on first connection per request to avoid noise, or use debug
            current_app.logger.debug(f"MongoDB connected: {db_name}")

        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            current_app.logger.error(f"MongoDB connection failed: {e}")
            g.db = None
            g.client = None

    return g.db

def close_db(e=None):
    """
    Close the database connection at the end of the request.
    This is CRITICAL to prevent connection leaks when using MongoClient in 'g'.
    """
    client = g.pop('client', None)
    if client is not None:
        client.close()

def init_app(app):
    """Register database teardown with the Flask app."""
    app.teardown_appcontext(close_db)

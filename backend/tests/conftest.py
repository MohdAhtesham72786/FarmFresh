import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

os.environ["DATABASE_URL"] = "mysql+pymysql://admin:admin123@127.0.0.1:3306/farmer_cart_test"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["AUTO_SEED_CATALOG"] = "true"

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.seed import init_db  # noqa: E402


def _mysql_ready() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    if not _mysql_ready():
        pytest.skip("MySQL is not available. Start with: docker compose up -d mysql")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    init_db()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.fixture
def session_id():
    return str(uuid.uuid4())
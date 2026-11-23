import uuid

from fastapi import Header

SESSION_HEADER = "X-Session-Id"


def get_session_id(x_session_id: str | None = Header(default=None, alias=SESSION_HEADER)) -> str:
    if x_session_id and x_session_id.strip():
        return x_session_id.strip()
    return str(uuid.uuid4())
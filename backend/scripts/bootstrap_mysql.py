#!/usr/bin/env python3
"""Initialize MySQL using root credentials from MYSQL_ROOT_PASSWORD."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SQL_FILE = ROOT / "database" / "complete-setup.sql"
def _default_mysql_bin() -> str:
    for candidate in (
        "/usr/local/mysql/bin/mysql",
        "/usr/local/bin/mysql",
        "mysql",
    ):
        if candidate == "mysql" or Path(candidate).is_file():
            return candidate
    return "mysql"


MYSQL = os.environ.get("MYSQL_BIN", _default_mysql_bin())


def main() -> int:
    password = os.environ.get("MYSQL_ROOT_PASSWORD")
    if not password:
        print("Set MYSQL_ROOT_PASSWORD then rerun:")
        print("  export MYSQL_ROOT_PASSWORD='your-mysql-root-password'")
        print("  cd backend && python scripts/bootstrap_mysql.py")
        print("\nOr run database/complete-setup.sql in MySQL Workbench as root.")
        return 1

    try:
        proc = subprocess.run(
            [MYSQL, "-u", "root", f"-p{password}", "-h", "127.0.0.1", "-P", "3306"],
            input=SQL_FILE.read_bytes(),
            check=True,
            capture_output=True,
        )
        print(proc.stdout.decode() or "MySQL bootstrap complete.")
        print("User: admin  Password: admin123  Database: farmer_cart")
        print("Next: cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000")
        return 0
    except FileNotFoundError:
        print(f"Could not find mysql client ({MYSQL}). Run complete-setup.sql in Workbench instead.")
        return 1
    except subprocess.CalledProcessError as exc:
        print(exc.stderr.decode() or "Bootstrap failed. Check MYSQL_ROOT_PASSWORD.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
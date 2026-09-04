"""ANNAM backend package compatibility entry point."""

from pathlib import Path
import sys

_backend_path = str(Path(__file__).resolve().parent)
if _backend_path not in sys.path:
    sys.path.insert(0, _backend_path)

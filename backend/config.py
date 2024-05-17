import os

DEBUG = os.getenv("DELPHI_DEBUG") is not None
SUBMISSIONS_PATH = (
    "/var/lib/delphi-submissions"
    if os.path.isdir("/var/lib/delphi-submissions") and os.getuid() == 0
    else "submissions"
)

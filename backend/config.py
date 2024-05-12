import os

DEBUG = os.getenv("DELPHI_DEBUG") is not None
SUBMISSIONS_PATH = "/var/lib/delphi-submissions" if os.path.isdir("/var/lib/delphi-submissions") else "submissions"

class ValidationResult:
    def __init__(self, is_ok: bool = True, errors: list[str] | None = None):
        self.is_ok = is_ok
        self.errors = errors if errors is not None else []

    def add_error(self, error: str):
        self.is_ok = False
        self.errors.append(error)

    def __bool__(self):
        return self.is_ok

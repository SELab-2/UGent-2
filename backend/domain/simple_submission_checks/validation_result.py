class ValidationResult:
    def __init__(self, is_valid, message):
        self.is_valid = is_valid
        self.message = message


class ErrorResult(ValidationResult):
    def __init__(self, message):
        super().__init__(False, message)


class OkResult(ValidationResult):
    def __init__(self, message, results):
        super().__init__(True, message)
        self.results = results



class ValidationResult:
    def __init__(self, is_valid: bool, message: str, sub_results: list):
        self.is_valid = is_valid
        self.message = message
        self.sub_results = sub_results

    def __str__(self, level: int = 0):
        raise NotImplementedError


class ErrorResult(ValidationResult):
    def __init__(self, message: str):
        super().__init__(False, message, [])

    def __str__(self, indent: int = 0):
        return f"{'    ' * indent}\u2718 [FAIL] {self.message}"


class OkResult(ValidationResult):
    def __init__(self, message: str, results: list[ValidationResult] | None = None):
        results = results or []
        super().__init__(True, message, results)

    def __str__(self, level: int = 0):
        ret = f"{'\t' * level}\u2714 [OK] {self.message}"
        if self.sub_results:
            sub_results_str = "\n".join(sub_result.__str__(level + 1) for sub_result in self.sub_results)
            ret += "\n" + sub_results_str
        return ret

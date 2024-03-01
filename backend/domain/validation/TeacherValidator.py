from domain.validation.ValidationResult import ValidationError, ValidationResult, ValidationSuccess


# deze klassen zijn niet meer nodig omdat we gebruik maken van pydantic en FastAPI
class TeacherValidator:
    @staticmethod
    def validate(json_data: dict) -> ValidationResult:

        name = json_data.get("name")

        errors: list[str] = []
        if not name:
            errors.append("Veld 'name' ontbreekt.")

        if len(errors) > 0:
            return ValidationError(errors)

        return ValidationSuccess()

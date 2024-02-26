from domain.validation.ValidationResult import ValidationError, ValidationResult, ValidationSuccess


class SubjectValidator:
    @staticmethod
    def validate(json_data: dict) -> ValidationResult:

        name = json_data.get("name")
        teacher_id = json_data.get("teacher_id")

        errors: list[str] = []
        if not name:
            errors.append("Veld 'name' ontbreekt.")

        if not teacher_id:
            errors.append("Veld 'teacher_id' ontbreekt.")

        if len(errors) > 0:
            return ValidationError(errors)

        return ValidationSuccess()

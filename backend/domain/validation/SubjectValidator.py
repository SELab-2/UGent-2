from domain.validation.ValidationResult import ValidationResult


class SubjectValidator:
    @staticmethod
    def validate(json_data: dict) -> ValidationResult:
        result = ValidationResult()

        name = json_data.get("name")
        teacher_id = json_data.get("teacher_id")

        if not name:
            result.add_error("Veld 'name' ontbreekt.")

        if not teacher_id:
            result.add_error("Veld 'teacher_id' ontbreekt.")

        return result

from domain.validation.ValidationResult import ValidationResult


class TeacherValidator:
    @staticmethod
    def validate(json_data: dict):
        result = ValidationResult()

        name = json_data.get("name")

        if not name:
            result.add_error("Veld 'name' ontbreekt.")

        return result

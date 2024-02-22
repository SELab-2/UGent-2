from backend.domain.validation.ValidationResult import ValidationResult


class LesgeverValidator:
    @staticmethod
    def validate(json_data: dict):
        result = ValidationResult()

        naam = json_data.get("naam")

        if not naam:
            result.add_error("Veld 'naam' ontbreekt.")

        return result

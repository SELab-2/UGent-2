from backend.domain.validation.ValidationResult import ValidationResult


class VakValidator:
    @staticmethod
    def validate(json_data: dict):
        result = ValidationResult()

        naam = json_data.get("naam")
        lesgever_id = json_data.get("lesgever_id")

        if not naam:
            result.add_error("Veld 'naam' ontbreekt.")

        if not lesgever_id:
            result.add_error("Veld 'lesgever_id' ontbreekt.")

        return result

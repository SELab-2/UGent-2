import configparser


class Properties:
    def __init__(self) -> None:
        config = configparser.ConfigParser()
        config.read("application.properties")
        self.properties: dict = {}
        for section in config.sections():
            self.properties[section] = {}
            for key, val in config[section].items():
                self.properties[section][key] = val

    def get(self, section: str, key: str) -> str:
        return self.properties[section][key]

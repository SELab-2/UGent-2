import httpx
from defusedxml.ElementTree import fromstring

# test url: https://login.ugent.be/login?service=https://localhost:8080/session
# TODO: get information out of a properties file
SERVICE = "https://localhost:8080/session"
DOMAIN = "localhost"
MAX_AGE = 24 * 60 * 60


def get_user_information(ticket: str) -> dict | None:
    user_information = httpx.get(f"https://login.ugent.be/serviceValidate?service={SERVICE}&ticket={ticket}"
                                 , headers={"Accept": "application/json,text/html"},
                                 )
    user: dict | None = parse_cas_xml(user_information.text)
    return user


def parse_cas_xml(xml: str) -> dict | None:
    namespace = "{http://www.yale.edu/tp/cas}"
    user = {}

    root = fromstring(xml)
    if root.find(f"{namespace}authenticationSuccess"):
        attributes_xml = (root
                          .find(f"{namespace}authenticationSuccess")
                          .find(f"{namespace}attributes"))

        givenname = attributes_xml.find(f"{namespace}givenname").text
        surname = attributes_xml.find(f"{namespace}surname").text
        mail = attributes_xml.find(f"{namespace}mail").text

        user["name"] = f"{givenname} {surname}"
        user["mail"] = mail
        return user
    return None


# TODO: create a session_id for the given user, create the user if it doesn't exist already
def login_user(user_information: dict) -> str:
    return "TestValueCookie"

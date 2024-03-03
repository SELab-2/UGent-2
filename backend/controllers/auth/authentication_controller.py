import httpx
from defusedxml.ElementTree import fromstring

from controllers.properties.Properties import Properties

props: Properties = Properties()


def authenticate_user(ticket: str) -> dict | None:
    service = props.get("session", "service")
    user_information = httpx.get(f"https://login.ugent.be/serviceValidate?service={service}&ticket={ticket}"
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
        user["mail"] = mail.lower()
        return user
    return None

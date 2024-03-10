import httpx
from defusedxml.ElementTree import fromstring
from sqlalchemy.orm import Session

from controllers.properties.Properties import Properties
from domain.logic.student import create_student
from domain.logic.teacher import create_teacher
from domain.logic.user import get_user_with_email
from domain.models.UserDataclass import UserDataclass

props: Properties = Properties()


def authenticate_user(session: Session, ticket: str) -> UserDataclass | None:
    """
    This function will authenticate the user.
    If the use doesn't yet exist in the database, it will create an entry.
    a

    :param session: Session with the database
    :param ticket: A ticket from login.ugent.be/login?service=https://localhost:8080/login
    :return: None if the authentication failed, user: UseDataclass is the authentication was successful
    """
    service = props.get("session", "service")
    user_information = httpx.get(f"https://login.ugent.be/serviceValidate?service={service}&ticket={ticket}")
    user_dict: dict | None = parse_cas_xml(user_information.text)

    if user_dict is None:
        return None

    user: UserDataclass | None = get_user_with_email(session, user_dict["email"])
    if user is None:
        if user_dict["role"] == "student":
            user = create_student(session, user_dict["name"], user_dict["email"])
        elif user_dict["role"] == "teacher":
            user = create_teacher(session, user_dict["name"], user_dict["email"])
    return user


def parse_cas_xml(xml: str) -> dict | None:
    """
    The authentication with CAS returns a xml-object.
    This function will read the necessary attributes and return them in a dictionary.

    :param xml: str: response xml from CAS
    :return: None if the authentication failed else dict
    """

    namespace = "{http://www.yale.edu/tp/cas}"
    root = fromstring(xml)
    if root.find(f"{namespace}authenticationSuccess"):
        attributes_xml = (root
                          .find(f"{namespace}authenticationSuccess")
                          .find(f"{namespace}attributes")
                          )

        givenname: str = attributes_xml.find(f"{namespace}givenname").text
        surname: str = attributes_xml.find(f"{namespace}surname").text
        email: str = attributes_xml.find(f"{namespace}mail").text
        role: str = attributes_xml.findall(f"{namespace}objectClass")

        role_str: str = ""
        for r in role:
            if r.text == "ugentStudent" and role_str == "":
                role_str = "student"
            elif r.text == "ugentEmployee":
                role_str = "teacher"

        return {
            "email": email.lower(),
            "name": f"{givenname} {surname}",
            "role": role_str,
        }
    return None

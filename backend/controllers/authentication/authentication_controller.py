import os
import string
from typing import TYPE_CHECKING

import httpx
from defusedxml.ElementTree import fromstring
from sqlmodel import Session

from db.models import User
from domain.logic.admin import create_admin
from domain.logic.role_enum import Role
from domain.logic.student import create_student
from domain.logic.user import get_all_users, get_user_with_email, modify_user_roles

if TYPE_CHECKING:
    from _elementtree import Element

cas_service = os.getenv("CAS_URL", "https://localhost:8080/login")


def authenticate_user(session: Session, ticket: str) -> User | None:
    """
    This function will authenticate the user.
    If the use doesn't yet exist in the database, it will create an entry.
    a

    :param session: Session with the database
    :param ticket: A ticket from login.ugent.be/login?service=https://localhost:8080/login
    :return: None if the authentication failed, user: UseDataclass is the authentication was successful
    """
    allowed_chars = set(string.ascii_letters + string.digits + "-")
    if not all(c in allowed_chars for c in ticket):
        return None
    user_information = httpx.get(f"https://login.ugent.be/serviceValidate?service={cas_service}&ticket={ticket}")
    user_dict: dict | None = parse_cas_xml(user_information.text)
    if user_dict is None:
        return None

    user: User | None = get_user_with_email(session, user_dict["email"])
    if user is None:
        num_users = len(get_all_users(session))
        if num_users == 0:
            admin = create_admin(session, user_dict["name"], user_dict["email"])
            modify_user_roles(session, admin.id, [Role.ADMIN, Role.STUDENT])
            user = admin.user
        else:
            user = create_student(session, user_dict["name"], user_dict["email"]).user
    return user


def parse_cas_xml(xml: str) -> dict | None:
    """
    The authentication with CAS returns a xml-object.
    This function will read the necessary attributes and return them in a dictionary.

    :param xml: str: response xml from CAS
    :return: None if the authentication failed else dict
    """

    namespace = "{http://www.yale.edu/tp/cas}"
    root: Element | None = fromstring(xml).find(f"{namespace}authenticationSuccess")
    if root is None:
        return None
    user_information: Element | None = root.find(f"{namespace}attributes")
    if user_information is None:
        return None
    givenname: Element | None = user_information.find(f"{namespace}givenname")
    surname: Element | None = user_information.find(f"{namespace}surname")
    email: Element | None = user_information.find(f"{namespace}mail")
    role: list | None = user_information.findall(f"{namespace}objectClass")
    if role is not None and givenname is not None and surname is not None and email is not None:
        role_str = ""
        for r in role:
            if r.text == "ugentStudent" and role_str == "":
                role_str = "student"
            elif r.text == "ugentEmployee":
                role_str = "teacher"

        return {
            "email": email.text.lower(),
            "name": f"{givenname.text} {surname.text}",
            "role": role_str,
        }
    return None

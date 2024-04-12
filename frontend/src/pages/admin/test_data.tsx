/* 

id: int
name: str
language: str
email: EmailStr
roles: list[Role]

*/

export enum Roles {
    STUDENT,
    TEACHER,
    ADMIN
}

export const teacher_test_data = [
    {name: "Marten Lievens", roles: [Roles.STUDENT]},
    {name: "Martin Verbrugge", roles: [Roles.ADMIN]},
    {name: "Een Lesgever", roles: [Roles.TEACHER]},
    {name: "Een HeleLangeNaamZodatErEllipsesGebruiktMoetenWorden", roles: [Roles.STUDENT]},
]

/* Alle mogelijke personen ongeacht hun rollen */
export const admin_test_data = [
    {name: "Marten Lievens", roles: [Roles.STUDENT]},
    {name: "Martin Verbrugge", roles: [Roles.ADMIN]},
    {name: "Martijn van der Pas", roles: [Roles.STUDENT, Roles.ADMIN]},
]

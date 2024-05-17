import {JSX, useState} from "react";
import {MdManageAccounts} from "react-icons/md";
import AddWarning from "./AddWarning.tsx";
import {useTranslation} from "react-i18next";
import adminLoader from "../dataloaders/AdminLoader.ts";


async function get_teachers(current_teachers: { name: string, email: string, id: number }[]) {
    const data = await adminLoader(); // Replace this with your actual data fetching logic
    const users = data.users.filter((user) => user.user_roles.includes("TEACHER"));
    console.log(users)
    return users.map((user) => ({
        name: user.user_name,
        email: user.user_email,
        id: user.user_id
    })).filter(user => !current_teachers.some(user1 => user1.id === user.id));
}


export default function ManageCourse(props: {
    course_id: number,
    teachers: { name: string, email: string, id: number }[]
},): JSX.Element {
    const [modalActive, setModalActive] = useState(false);
    const [teachers, setTeachers] = useState<{ name: string; email: string; id: number }[]>([]);

    const {t} = useTranslation();

    const current_teacher_list = props.teachers.map((teacher) => {
        return {
            name: teacher.name,
            email: teacher.email,
            id: teacher.id
        }
    });

    const loadTeachers = async () => {
        return await get_teachers(current_teacher_list);
    };

    const changeModal = () => {
        setModalActive(!modalActive);
        void loadTeachers().then(teachers => setTeachers(teachers));
    };

    return (
        <>
            <button className="js-modal-trigger button is-rounded is-pulled-right" onClick={changeModal}>
                <MdManageAccounts size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.teachers')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body pb-6">
                        <table className={"table is-fullwidth"}>
                            <thead>
                            <tr>
                                <th>{t('table.name')}</th>
                                <th>{t('table.email')}</th>
                                <th>{t('table.add')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teachers.map((member, index) => {
                                return (<tr key={index}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <AddWarning user_id={member.id} course_id={props.course_id}/>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </>
    )
}


export function deadline_to_string(deadline: string){
    if (deadline === "-"){
        return "-"
    }
    const deadline_date = new Date(deadline)
    const hours = String(deadline_date.getHours()).padStart(2, '0');
    const minutes = String(deadline_date.getMinutes()).padStart(2, '0');
    const day = String(deadline_date.getDate()).padStart(2, '0');
    const month = String(deadline_date.getMonth() + 1).padStart(2, '0');

    return `${hours}:${minutes} - ${day}/${month}/${deadline_date.getFullYear()}`;

}
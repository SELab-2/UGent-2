
export function deadline_to_string(deadline: Date | string){
    const deadline_date = new Date(deadline)
    const hours = String(deadline_date.getHours()).padStart(2, '0');
    const minutes = String(deadline_date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes} - ${deadline_date.getDate()}/${deadline_date.getMonth()}/${deadline_date.getFullYear()}`;

}
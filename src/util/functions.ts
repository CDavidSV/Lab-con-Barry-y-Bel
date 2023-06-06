/**
 * 
 * @param matricula 
 * @returns boolean value
 */
const validateMatricula = (matricula: string) => {
    const regex = new RegExp(/[AaLl]0\d{7}/gm);

    if (!regex.test(matricula)) return false;
    return true;
};


export { validateMatricula };
export interface User {
    matricula: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    campus: string,
    progreso?: number | null | undefined,
    estado?: boolean | null | undefined
}

export interface StudentStats {
    registered: number,
    completedCourses: number,
    inProgressCourses: number,
    averageProgress: number,
}
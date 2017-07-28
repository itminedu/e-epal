// used by dubmit component
export class StudentEpalChosen {
    constructor(
        public student_id: number,
        public epal_id: number,
        public choice_no: number,
    ) { }
}

export class StudentCourseChosen {
    constructor(
        public student_id: number,
        public coursefield_id: number,
    ) { }
}

export class StudentSectorChosen {
    constructor(
        public student_id: number,
        public sectorfield_id: number,
    ) { }
}


//used only for demo form3.ts
export class Student {
    constructor(
        //public user_id: number,
        public epaluser_id: number,
        public name: string,
        public studentsurname: string,
        public regionaddress: string,
        public regiontk: string,
        public regionarea: string,
        public certificatetype: string,
        public relationtostudent: string,
        public currentclass: string,
        ){}
}

//used by dubmit component
export class StudentEpalChosen  {
  constructor(
    //public user_id: number,
    public student_id: number,
    public epal_id: number,
    public choice_no: number,
  ) {}
}

export class StudentCourseChosen  {
  constructor(
    public student_id: number,
    public coursefield_id: number,
  ) {}
}

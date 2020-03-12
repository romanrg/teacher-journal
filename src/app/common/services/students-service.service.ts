import { Injectable } from "@angular/core";
import {from, Observable, of} from "rxjs";
import {IStudent} from "../models/IStudent";

const students: IStudent[] = [
  {
    _id: "5e5cbe27384ce7e093efc43e",
    id: 0,
    name: "Hopper",
    surname: "Rocha",
    address: "Estonia, Skyland, Fanchon Place 102",
    description: "Do elit pariatur dolor magna eiusmod adipisicing ex dolor aliquip."
  },
  {
    _id: "5e5cbe27994d31ea047bac6b",
    id: 1,
    name: "Pauline",
    surname: "Allison",
    address: "French Guiana, Rutherford, Albee Square 165",
    description: "Aute aliquip mollit consequat et nulla ut laboris."
  },
  {
    _id: "5e5cbe276b83f719ce08852f",
    id: 2,
    name: "Hall",
    surname: "Anthony",
    address: "Suriname, Leeper, Hemlock Street 139",
    description: "Minim qui esse non qui anim ad qui ad Lorem pariatur culpa voluptate labore."
  },
  {
    _id: "5e5cbe2759d762e39d2219bf",
    id: 3,
    name: "Leonor",
    surname: "Hendricks",
    address: "Uganda, Heil, Chapel Street 126",
    description: "Proident minim consequat ea sit quis mollit ex adipisicing ex veniam."
  },
  {
    _id: "5e5cbe27c994510d33a94e3f",
    id: 4,
    name: "Kidd",
    surname: "Roy",
    address: "Denmark, Eastvale, Fulton Street 9",
    description: "Irure id eiusmod cupidatat consectetur veniam."
  },
  {
    _id: "5e5cbe275fb2860d08b25010",
    id: 5,
    name: "Ester",
    surname: "Mays",
    address: "Senegal, Shindler, Beekman Place 82",
    description: "Esse qui excepteur officia eu et ad eu labore ea enim proident."
  },
  {
    _id: "5e5cbe27275241259fd835c2",
    id: 6,
    name: "Cooke",
    surname: "Marks",
    address: "El Salvador, Rosine, Himrod Street 121",
    description: "Aliqua aute dolore culpa proident proident proident irure dolor nulla eiusmod quis."
  },
  {
    _id: "5e5cbe27fdcd14568c0ee5d7",
    id: 7,
    name: "Dejesus",
    surname: "Sheppard",
    address: "Monaco, Mansfield, Jardine Place 138",
    description: "Magna dolore exercitation magna duis adipisicing et cupidatat do aliquip irure id irure elit."
  },
  {
    _id: "5e5cbe272bca8002b47890d8",
    id: 8,
    name: "Sandoval",
    surname: "Oconnor",
    address: "Kenya, Marienthal, Scholes Street 63",
    description: "Officia eiusmod sint quis quis."
  },
  {
    _id: "5e5cbe273135030bc3864b79",
    id: 9,
    name: "Lopez",
    surname: "Christensen",
    address: "Luxembourg, Condon, Dunham Place 60",
    description: "Laboris deserunt voluptate qui reprehenderit eiusmod officia eu quis laborum magna."
  },
  {
    _id: "5e5cbe2702e85d4d552586bc",
    id: 10,
    name: "Shanna",
    surname: "Byrd",
    address: "Netherlands Antilles, Bedias, Brightwater Avenue 109",
    description: "Aute incididunt sit labore reprehenderit proident in aliqua id ad laboris sit laborum."
  },
  {
    _id: "5e5cbe27145529b048a0baa5",
    id: 11,
    name: "Norris",
    surname: "Stevenson",
    address: "Czech Republic, Winchester, Dunne Court 161",
    description: "Incididunt voluptate nostrud reprehenderit est voluptate velit aliquip laboris adipisicing eu eiusmod."
  },
  {
    _id: "5e5cbe2741635a22f79ecef0",
    id: 12,
    name: "Woodard",
    surname: "Trevino",
    address: "Cook Islands, Farmington, Ford Street 27",
    description: "Esse consectetur excepteur nisi irure tempor cupidatat eu laborum adipisicing velit."
  },
  {
    _id: "5e5cbe27884a46fd0fe5def4",
    id: 13,
    name: "Fox",
    surname: "Sears",
    address: "Montserrat, Rivers, Clifton Place 23",
    description: "Sint pariatur quis id id irure irure eu ex tempor."
  },
  {
    _id: "5e5cbe2738af32df4421b1d6",
    id: 14,
    name: "Wilson",
    surname: "Dickson",
    address: "Viet Nam, Keyport, Harrison Place 82",
    description: "Voluptate cillum consequat consequat duis sunt tempor sunt fugiat est sunt nostrud fugiat culpa."
  },
  {
    _id: "5e5cbe27b1d5283525bb2d47",
    id: 15,
    name: "Harris",
    surname: "Glenn",
    address: "Algeria, Gambrills, Waldorf Court 173",
    description: "Commodo dolor sunt aliquip culpa id esse consequat eu ipsum irure laborum eu."
  },
  {
    _id: "5e5cbe27d9f5b8e5c68372c1",
    id: 16,
    name: "Jerry",
    surname: "Sharp",
    address: "Slovak Republic, Topaz, Frost Street 29",
    description: "Officia non id voluptate quis dolore id aute officia nostrud voluptate."
  },
  {
    _id: "5e5cbe27a198ec9edcbe9163",
    id: 17,
    name: "Edith",
    surname: "Blackwell",
    address: "Falkland Islands (Malvinas), Katonah, Newport Street 46",
    description: "Amet tempor sunt officia ipsum labore mollit consectetur laboris nostrud pariatur nisi."
  },
  {
    _id: "5e5cbe2798499ccae8494e59",
    id: 18,
    name: "Josephine",
    surname: "Moss",
    address: "Rwanda, Echo, Willoughby Street 135",
    description: "Anim non nulla dolore irure est anim et voluptate anim velit minim officia consectetur enim."
  },
  {
    _id: "5e5cbe27f0e7c0faf5a61af9",
    id: 19,
    name: "Jordan",
    surname: "Walker",
    address: "Fiji, Eagleville, Hazel Court 69",
    description: "Elit reprehenderit sunt ex non ad consectetur officia elit ea."
  },
  {
    _id: "5e5cbe2742a85ad864e41f54",
    id: 20,
    name: "Bobbie",
    surname: "Baird",
    address: "US Minor Outlying Islands, Nicholson, Furman Street 186",
    description: "Ad quis fugiat laborum excepteur elit voluptate sint."
  },
  {
    _id: "5e5cbe27aa60b3a4519a74c6",
    id: 21,
    name: "Fry",
    surname: "Wade",
    address: "Chad, Waterford, Tompkins Place 16",
    description: "Elit laborum minim tempor exercitation sit deserunt elit."
  },
  {
    _id: "5e5cbe27d3b11c26e9ceda91",
    id: 22,
    name: "Wiley",
    surname: "Thornton",
    address: "Namibia, Riceville, Kenmore Court 48",
    description: "Do consectetur reprehenderit do ut qui est eu."
  }
];

@Injectable({
  providedIn: "root"
})
export class StudentsServiceService {

  private students: IStudent[];
  constructor() {
    this.students = students;
  }

  public getStudents(): Observable<IStudent[]> {
    return from([this.students]);
  }
  public addStudent(student: IStudent): void {
    student.id = students.length;
    this.students.push(student);
  }
  public getOfStudents(): Observable<IStudent> {
    return of(...this.students);
  }

  public getStudentIdByName(name: string, surname: string): IStudent {
    return this.students.filter(student => student.name === name && student.surname === surname)[0];
  }

  public findStudentById(id): IStudent {
    return students.filter(student => student._id === id)[0];
  }
}

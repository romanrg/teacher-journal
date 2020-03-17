import {IStudent, StudentModel} from "../../common/models/IStudent";

export interface StudentsState {
  data: ReadonlyArray<IStudent>;
}

export const initialStudentsState: StudentsState = {
  data: [
    new StudentModel(
      "5e6a314dda8563cb9fd7db3f",
      "Keith",
      "Kirkland",
      "Cook Islands, Nile, Lacon Court 171",
      "Reprehenderit adipisicing reprehenderit deserunt proident in sint sint exercitation dolor ea ipsum nisi."
    ),
    new StudentModel(
      "5e6a314d96ae92c3115c9d20",
      "Suzette",
      "Strong",
      "Chile, Bedias, Berry Street 89",
      "Adipisicing est ad in ad ex sint pariatur nostrud cupidatat."
    ),
    new StudentModel(
      "5e6a314d44a6f4b0ee4e4f68",
      "Debbie",
      "George",
      "Taiwan, Thynedale, Livonia Avenue 53",
      "Exercitation amet ipsum consequat ut ad sint id fugiat reprehenderit."
    ),
  ]
};

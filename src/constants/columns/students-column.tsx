import { OptionsT } from "@components/form/type";
import { StudentRegistrationModelType } from "@models/student";
import { ColumnDef } from "@tanstack/react-table";
export const searchStudentsBy: OptionsT[] = [
  {
    label: 'Name',
    value: 'name'
  },
  {
    label: 'Email',
    value: 'email'
  },
  {
    label: 'Gender',
    value: 'gender'
  }
]
export const studentsColumn: ColumnDef<StudentRegistrationModelType>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'gender',
    header: 'Gender'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  }
]

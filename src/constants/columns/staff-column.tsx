import { CellAction } from '@components/tables/employee-tables/cell-action';
import { Checkbox } from '@components/ui/checkbox';
import { StaffModelType } from '@src/models';
import { ColumnDef } from '@tanstack/react-table';
export const staffColumn: ColumnDef<StaffModelType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email  Address'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    }
  }
];
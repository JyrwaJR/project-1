import { EventManagementModelType } from '@models/events-management-model';
import { ColumnDef } from '@tanstack/react-table';

export const eventsMangementColumn: ColumnDef<EventManagementModelType>[] = [
  {
    accessorKey: 'event_name',
    header: 'Name'
  },
  {
    accessorKey: 'event_location',
    header: 'Location'
  },
  {
    accessorKey: 'men',
    header: 'Total Male'
  },
  {
    accessorKey: 'women',
    header: 'Total Female'
  },
  {
    accessorKey: 'youth',
    header: 'Total Youth'
  },
  {
    accessorKey: 'event_date',
    header: 'Date'
  },
  {
    accessorKey: 'total_participants',
    header: 'Total Participants'
  }
];

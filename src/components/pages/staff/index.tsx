'use client';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

import { staffColumn } from '@constants/columns';
import BreadCrumb from '@src/components/breadcrumb';
import { Button } from '@src/components/ui/button';
import { DataTable } from '@src/components/ui/data-table';
import { Heading } from '@src/components/ui/heading';
import { Separator } from '@src/components/ui/separator';

import { AddStaff } from './add-staff';
import { useCQuery } from '@hooks/useCQuery';

export const StaffPage = () => {
  const breadcrumbItems = [{ title: 'User', link: '/dashboard/user' }];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading } = useCQuery({
    url: 'staff',
    queryKey: ['get', 'staff']
  });

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Staff`} description="Manage ur Staff" />
          <Button
            className="text-xs md:text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          searchKey="name"
          columns={staffColumn}
          data={!isLoading ? data.data.data : []}
        />
      </div>
      {isOpen && <AddStaff open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};

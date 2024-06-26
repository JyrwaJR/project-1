import React from 'react';

import BreadCrumb from '@src/components/breadcrumb';
import { ProductForm } from '@src/components/forms/product-form';
import { ScrollArea } from '@src/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Employee', link: '/dashboard/employee' },
    { title: 'Create', link: '/dashboard/employee/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ProductForm
          categories={[
            { _id: 'shirts', name: 'shirts' },
            { _id: 'pants', name: 'pants' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}

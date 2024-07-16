import { Form, FormFieldType } from '@components/form';
import { OptionsT } from '@components/form/type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { showToast } from '@components/ui/show-toast';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '@constants/index';
import { FailedToastTitle } from '@constants/toast-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCMutation } from '@hooks/useCMutation';
import { useCQuery } from '@hooks/useCQuery';
import { useRegisterStudentStore } from '@lib/store';
import { useUploadDocStore } from '@lib/store/useUploadDocStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const Schema = z
  .object({
    proof_type: z
      .string({
        required_error: 'Proof type is required'
      })
      .min(1, {
        message: 'Proof type is required'
      }),
    document_type: z
      .string({
        required_error: 'Document type is required'
      })
      .min(1, { message: 'Document type is required' }),
    image: z
      .instanceof(File, {
        message: 'Please select an image'
      })
      .refine((file) => file !== undefined && file !== null, {
        message: 'Please select an image'
      })
      .refine((file) => {
        return file && file.size <= MAX_UPLOAD_SIZE;
      }, 'File size must be less than 2MB')
      .refine((file) => {
        return file && ACCEPTED_FILE_TYPES.includes(file.type);
      }, 'File must be a PNG/jpg/jpeg'),
    document_number: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.proof_type === 'ID Proof' && !data.document_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Document number is required',
        path: ['document_number']
      });
    }
  });

type SchemaType = z.infer<typeof Schema>;

type CategoryOptions = {
  category: string;
  options: OptionsT[];
};
interface Props {
  filter?: string;
  title?: string;
  desc?: string;
}
export const ImageUploadDialog = ({
  filter,
  title = 'Upload Document',
  desc = 'Please upload your document'
}: Props) => {
  const { id } = useRegisterStudentStore();
  const { open, setOpen, onUploadedImage } = useUploadDocStore();

  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      proof_type: filter || ''
    }
  });

  const { data, isLoading } = useCQuery({
    url: 'registration/get-document-types'
  });

  const mutate = useCMutation({
    url: `registration/upload-document/${id}`,
    method: 'POST',
    queryKey: ['profile']
  });

  const transformData = (data: {
    [key: string]: string[] | undefined;
  }): CategoryOptions[] => {
    const transformedData: CategoryOptions[] = [];
    for (const category in data) {
      if (Array.isArray(data[category])) {
        const options: OptionsT[] =
          data[category]?.map((item: string) => ({
            label: item,
            value: item
          })) || [];
        transformedData.push({ category, options });
      }
    }

    return transformedData;
  };
  const proofTypeOptions: OptionsT[] = transformData(data?.data || []).map(
    (item) => ({
      label: item.category,
      value: item.category
    })
  );
  const filterSubOptions = (
    category: string,
    data?: { [key: string]: string[] | undefined }
  ) => {
    const filteredOptions = transformData(data || {}).find(
      (item) => item.category === category
    );
    return filteredOptions?.options || [];
  };
  const isFieldWithDocNo: FormFieldType[] = [
    !filter
      ? {
          required: true,
          name: 'proof_type',
          label: 'Proof type',
          type: 'select',
          select: true
        }
      : undefined,
    {
      required: true,
      name: 'document_type',
      label: 'Document Type',
      select: true
    },
    form.watch('proof_type') === 'ID Proof'
      ? {
          name: 'document_number',
          label: 'Document No',
          type: 'text'
        }
      : undefined,
    {
      required: true,
      name: 'image',
      label: 'File Upload',
      type: 'file'
    }
  ].filter(Boolean) as FormFieldType[];

  const updatedFields: FormFieldType[] = isFieldWithDocNo.map(
    (field: FormFieldType) => {
      if (field.select) {
        switch (field.name) {
          case 'proof_type':
            return {
              ...field,
              options: !!filter
                ? proofTypeOptions.filter((item) => item.value === filter)
                : filterSubOptions('Proof Category', data?.data)
            };
          case 'document_type':
            return {
              ...field,
              options: filterSubOptions(
                form.watch('proof_type') === 'Residence Proof'
                  ? 'Address Proof'
                  : form.watch('proof_type'),
                data?.data
              ),
              readOnly: !form.watch('proof_type')
            };
          default:
            return field;
        }
      }
      return field;
    }
  );

  const onSubmit: SubmitHandler<SchemaType> = async (fData) => {
    try {
      const data = new FormData();
      data.append('proof_type', fData.proof_type);
      data.append('document_type', fData.document_type);
      data.append('document_number', fData.document_number || '');
      data.append('image', fData.image);
      if (!id) {
        showToast(
          FailedToastTitle,
          'Please register first to upload documents'
        );
        return;
      }
      const res = await mutate.mutateAsync(data);
      if (res.success) {
        onUploadedImage(form.getValues('proof_type'));
        setOpen(false);
      }
    } catch (error) {
      showToast(FailedToastTitle, 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form
          fields={updatedFields}
          form={form}
          onSubmit={onSubmit}
          loading={isLoading || mutate.isLoading}
          btnStyle="md:w-full"
        />
      </DialogContent>
    </Dialog>
  );
};

'use client';

import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormFieldType } from './type';
import { create } from 'zustand';
import { CForm } from './form';
import { Form } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Stepper } from 'react-form-stepper';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { useEffect } from 'react';
import UploadImageModal from '@components/upload-image-modal';
import { PreviewRegistrationForm as PreviewForm } from '@components/pages/registration/preview-registration-form';

export type StepType = {
  id: string;
  name: string;
  fields: FormFieldType[];
};

type MultiStepType = {
  currentStep: number;
  previousStep: number;
  setPreviousStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
};

export const useMultiStepFormStore = create<MultiStepType>((set) => ({
  currentStep: 0,
  previousStep: 0,
  setPreviousStep: (step) => set({ previousStep: step }),
  setCurrentStep: (step) => set({ currentStep: step })
}));

type Props = {
  onSubmit: SubmitHandler<any>;
  form: UseFormReturn<any>;
  steps: StepType[];
  onClick?: () => void;
  checked?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export default function MultiStepForm({
  form,
  onSubmit,
  steps,
  onClick,
  checked,
  loading,
  disabled
}: Props) {
  const formStyle: string = 'w-full sm:col-span-6 md:col-span-6 xl:col-span-4';
  const { currentStep, setCurrentStep, setPreviousStep } =
    useMultiStepFormStore();
  const { trigger } = form;
  const fieldNames =
    currentStep < steps.length
      ? steps[currentStep].fields.map((field) => field.name)
      : [];
  const next = async () => {
    const data = form.getValues();
    const output = await trigger(fieldNames, {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep < steps.length) {
      setPreviousStep(currentStep);
      const step = currentStep + 1;
      setCurrentStep(step);
      onSubmit(data);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      const step = currentStep - 1;
      setCurrentStep(step);
    }
  };

  useEffect(() => {
    if (checked) {
      form.reset({
        ...form.getValues(),
        p_address: form.getValues('present_address'),
        p_landmark: form.getValues('landmark'),
        p_village: form.getValues('village'),
        p_panchayat: form.getValues('panchayat'),
        p_block: form.getValues('block'),
        p_police_station: form.getValues('police_station'),
        p_post_office: form.getValues('post_office'),
        p_district: form.getValues('district'),
        p_state: form.getValues('state'),
        p_pin_code: form.getValues('pin_code')
      });
    }
  }, [checked, form]);

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper
            steps={steps.map((step) => ({
              label: step.name
            }))}
            className="max-w-full overflow-auto"
            styleConfig={{
              activeBgColor: '#333333',
              activeTextColor: '#FFFFFF',
              completedBgColor: '#000000',
              completedTextColor: '#FFFFFF',
              inactiveBgColor: '#B0B0B0',
              inactiveTextColor: '#FFFFFF',
              labelFontSize: '1rem',
              fontWeight: 'bold',
              size: '2em',
              borderRadius: '50%',
              circleFontSize: ''
            }}
            activeStep={currentStep}
          />

          {currentStep < steps.length ? (
            steps.map((step, index) => (
              <div
                key={step.name + index}
                className={index === currentStep ? '' : 'hidden'}
              >
                {step.name === 'Upload Documents' ? (
                  <UploadImageModal fields={step.fields} />
                ) : (
                  <>
                    {onClick && step.name === 'Address' ? (
                      <>
                        <CForm
                          form={form}
                          className={formStyle}
                          loading={loading ?? false}
                          disabled={disabled}
                          fields={step.fields.filter(
                            (field) => !field.name.startsWith('p_')
                          )}
                        />
                        <Separator />
                        <div className="flex items-center space-x-2 py-4">
                          <Checkbox
                            checked={checked}
                            onClick={() => onClick()}
                            name="address"
                          />
                          <Label>Same as present</Label>
                        </div>
                        <CForm
                          form={form}
                          disabled={disabled}
                          loading={loading ?? false}
                          className={formStyle}
                          fields={step.fields
                            .filter((field) => field.name.startsWith('p_'))
                            ?.map((field) => ({
                              ...field,
                              readOnly: checked
                            }))}
                        />
                      </>
                    ) : (
                      <CForm
                        form={form}
                        className={formStyle}
                        disabled={disabled}
                        loading={loading ?? false}
                        fields={step.fields}
                      />
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <PreviewForm fields={steps} form={form} />
          )}

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button type="button" onClick={prev} disabled={currentStep === 0}>
                <ArrowLeft className="mr-4" />
                Back
              </Button>
              <Button
                disabled={disabled || loading}
                type="button"
                onClick={next}
              >
                {currentStep < steps.length ? (
                  <>
                    Next
                    <ArrowRight className="ml-4" />
                  </>
                ) : (
                  'Preview'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { aadhaarFormSchema, AadhaarFormData, formatAadhaarNumber, formatDateInput } from '@/lib/validation';

interface AadhaarFormProps {
  onSubmit: (data: AadhaarFormData) => void;
  isLoading: boolean;
  onReset: () => void;
}

export function AadhaarForm({ onSubmit, isLoading, onReset }: AadhaarFormProps) {
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [dobInput, setDobInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm<AadhaarFormData>({
    resolver: zodResolver(aadhaarFormSchema),
    defaultValues: {
      name: '',
      aadhaar_no: '',
      dob: '',
      gender: undefined,
      address: '',
    },
  });

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarNumber(e.target.value);
    setAadhaarInput(formatted);
    setValue('aadhaar_no', formatted);
    trigger('aadhaar_no');
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setDobInput(formatted);
    setValue('dob', formatted);
    trigger('dob');
  };

  const handleFormSubmit = (data: AadhaarFormData) => {
    onSubmit(data);
  };

  const handleReset = () => {
    reset();
    setAadhaarInput('');
    setDobInput('');
    onReset();
  };

  const fillSampleData = () => {
    const sampleData = {
      name: 'Rahul Kumar',
      aadhaar_no: '1234 5678 9123',
      dob: '01/01/1990',
      gender: 'Male' as const,
      address: '123, MG Road, New Delhi, Delhi - 110001',
    };

    setValue('name', sampleData.name);
    setValue('aadhaar_no', sampleData.aadhaar_no);
    setValue('dob', sampleData.dob);
    setValue('gender', sampleData.gender);
    setValue('address', sampleData.address);
    
    setAadhaarInput(sampleData.aadhaar_no);
    setDobInput(sampleData.dob);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Sample Data Button */}
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={fillSampleData}
          disabled={isLoading}
        >
          Fill Sample Data
        </Button>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name *
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter your full name"
          className={errors.name ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Aadhaar Number Field */}
      <div className="space-y-2">
        <Label htmlFor="aadhaar_no" className="text-sm font-medium text-gray-700">
          Aadhaar Number *
        </Label>
        <Input
          id="aadhaar_no"
          value={aadhaarInput}
          onChange={handleAadhaarChange}
          placeholder="1234 5678 9123"
          className={errors.aadhaar_no ? 'border-red-500' : ''}
          disabled={isLoading}
          maxLength={14}
        />
        {errors.aadhaar_no && (
          <p className="text-sm text-red-600">{errors.aadhaar_no.message}</p>
        )}
      </div>

      {/* Date of Birth Field */}
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
          Date of Birth *
        </Label>
        <Input
          id="dob"
          value={dobInput}
          onChange={handleDobChange}
          placeholder="DD/MM/YYYY"
          className={errors.dob ? 'border-red-500' : ''}
          disabled={isLoading}
          maxLength={10}
        />
        {errors.dob && (
          <p className="text-sm text-red-600">{errors.dob.message}</p>
        )}
      </div>

      {/* Gender Field */}
      <div className="space-y-2">
        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
          Gender *
        </Label>
        <Select onValueChange={(value) => setValue('gender', value as 'Male' | 'Female' | 'Other')} disabled={isLoading}>
          <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-red-600">{errors.gender.message}</p>
        )}
      </div>

      {/* Address Field */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address *
        </Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Enter your complete address"
          className={`min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <Button 
          type="submit" 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Aadhaar Card'
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
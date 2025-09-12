'use client';

import { useState } from 'react';
import { AadhaarForm } from '@/components/AadhaarForm';
import { ImageDisplay } from '@/components/ImageDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AadhaarFormData } from '@/lib/validation';

export default function Home() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<AadhaarFormData | null>(null);

  const handleFormSubmit = async (data: AadhaarFormData) => {
    setIsGenerating(true);
    setError(null);
    setCurrentFormData(data);

    try {
      const response = await fetch('/api/generate-aadhaar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate Aadhaar card');
      }

      // Create blob URL from response
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImageUrl(imageUrl);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (generatedImageUrl) {
      URL.revokeObjectURL(generatedImageUrl);
    }
    setGeneratedImageUrl(null);
    setError(null);
    setCurrentFormData(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Aadhaar Card Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate sample Aadhaar cards for educational and testing purposes. 
            This tool creates realistic-looking Aadhaar cards that are clearly marked as samples.
          </p>
        </div>

        {/* Educational Notice */}
        <Alert className="max-w-3xl mx-auto">
          <AlertDescription className="text-center">
            <strong>Educational Use Only:</strong> This tool generates sample Aadhaar cards for educational, 
            testing, and demonstration purposes only. These are not official documents and should never be used 
            for identity verification or any legal purposes.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">
                Enter Details
              </CardTitle>
              <CardDescription>
                Fill in the information to generate your sample Aadhaar card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AadhaarForm 
                onSubmit={handleFormSubmit} 
                isLoading={isGenerating}
                onReset={handleReset}
              />
            </CardContent>
          </Card>

          {/* Image Display Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">
                Generated Aadhaar Card
              </CardTitle>
              <CardDescription>
                Your sample Aadhaar card will appear here once generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageDisplay 
                imageUrl={generatedImageUrl}
                isGenerating={isGenerating}
                error={error}
                formData={currentFormData}
              />
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center space-y-4 mt-12">
          <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-blue-900 mb-2">Realistic Design</h3>
              <p className="text-gray-600 text-sm">
                Generated cards closely resemble the official Aadhaar card format with proper styling and layout.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-blue-900 mb-2">Input Validation</h3>
              <p className="text-gray-600 text-sm">
                All inputs are validated to ensure proper formatting and data integrity before generation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-blue-900 mb-2">Download Ready</h3>
              <p className="text-gray-600 text-sm">
                Generated cards can be instantly downloaded as PNG images for your educational needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
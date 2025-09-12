'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AadhaarFormData } from '@/lib/validation';

interface ImageDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  formData: AadhaarFormData | null;
}

export function ImageDisplay({ imageUrl, isGenerating, error, formData }: ImageDisplayProps) {
  const handleDownload = () => {
    if (imageUrl && formData) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `aadhaar_card_${formData.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-800">Generating Aadhaar Card</h3>
          <p className="text-sm text-gray-600">
            Please wait while we create your sample Aadhaar card...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          <div className="space-y-2">
            <p className="font-medium">Error generating Aadhaar card:</p>
            <p>{error}</p>
            <p className="text-sm">Please check your input and try again.</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800">No Image Generated</h3>
          <p className="text-sm text-gray-600 max-w-sm">
            Fill out the form with your details and click "Generate Aadhaar Card" to create your sample card.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <img
          src={imageUrl}
          alt="Generated Aadhaar Card"
          className="w-full h-auto max-w-full"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
      </div>

      {/* Download Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-800">Sample Aadhaar Card Generated</h4>
            <p className="text-xs text-gray-600">
              {formData ? `For: ${formData.name}` : 'Ready for download'}
            </p>
          </div>
          <Button
            onClick={handleDownload}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Download PNG
          </Button>
        </div>

        {/* Usage Instructions */}
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800 text-xs">
            <strong>Remember:</strong> This is a sample document for educational purposes only. 
            It should not be used for official identification or verification purposes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
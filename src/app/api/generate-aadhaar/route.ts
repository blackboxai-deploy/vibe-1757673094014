import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { aadhaarFormSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = aadhaarFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    
    // Create temporary output path
    const tempDir = path.join(process.cwd(), 'tmp');
    const outputFileName = `aadhaar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
    const outputPath = path.join(tempDir, outputFileName);
    
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });
    
    // Prepare Python script path
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_aadhaar.py');
    
    // Convert data to JSON string for Python script
    const jsonData = JSON.stringify(data);
    
    // Execute Python script
    const result = await new Promise<{ success: boolean; error?: string }>((resolve) => {
      const pythonProcess = spawn('python3', [scriptPath, jsonData, outputPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: stderr || 'Unknown error occurred' });
        }
      });
      
      pythonProcess.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });
      
      // Set timeout for Python script execution
      setTimeout(() => {
        pythonProcess.kill();
        resolve({ success: false, error: 'Script execution timeout' });
      }, 30000); // 30 seconds timeout
    });
    
    if (!result.success) {
      // Clean up failed file if it exists
      try {
        await fs.unlink(outputPath);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      return NextResponse.json(
        { error: 'Failed to generate Aadhaar card', details: result.error },
        { status: 500 }
      );
    }
    
    // Check if file was created
    try {
      await fs.access(outputPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Generated file not found' },
        { status: 500 }
      );
    }
    
    // Read the generated image file
    const imageBuffer = await fs.readFile(outputPath);
    
    // Clean up temporary file
    try {
      await fs.unlink(outputPath);
    } catch (error) {
      console.error('Failed to cleanup temporary file:', error);
    }
    
    // Return image as response
    return new NextResponse(imageBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="aadhaar_card_${data.name.replace(/\s+/g, '_').toLowerCase()}.png"`,
        'Content-Length': imageBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
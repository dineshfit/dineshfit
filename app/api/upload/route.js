import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const targetType = data.get('type'); // 'hero' or 'transformation'

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a clean, unique filename based on timestamp to avoid cache conflicts
    const fileExtension = path.extname(file.name) || '.jpg';
    const filename = `${targetType}-${Date.now()}${fileExtension}`;
    
    // Define path pointing straight to your public directory
    const publicPath = path.join(process.cwd(), 'public', filename);
    
    // Save file locally
    await writeFile(publicPath, buffer);
    
    // Return the clean public URL path back to the frontend state
    return NextResponse.json({ success: true, url: `/${filename}` });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
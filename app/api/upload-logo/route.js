export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { Client, Storage, ID } from "node-appwrite";
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Initialize Appwrite client (server SDK)
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);

    // Convert file to buffer and create Blob for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: file.type });
    
    // Create a File object from the Blob with a safe filename
    const safeFileName = file.name.replace(/[#\s]/g, '_');
    const fileObject = new File([blob], safeFileName, { type: file.type });

    const fileUpload = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      ID.unique(),
      fileObject
    );

    // Get file URL
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileUpload.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

    return NextResponse.json({
      success: true,
      fileId: fileUpload.$id,
      fileUrl: fileUrl
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}

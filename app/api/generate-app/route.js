import { NextResponse } from "next/server";
import { auth, currentUser } from '@clerk/nextjs/server'

export async function POST(request) {
  try {
    const body = await request.json();
    const { websiteUrl, appName, logoFile, primaryColor } = body;

    // Validate required fields
    if (!websiteUrl || !appName) {
      return NextResponse.json(
        {
          error: "Missing required fields: websiteUrl and appName are required",
        },
        { status: 400 }
      );
    }

    // Check authentication
    const { isAuthenticated } = await auth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const userId = user.id;

    // Generate package name from app name
    const packageName = `com.web2app.${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    // Prepare payload for build server
    const buildPayload = {
      app_name: appName,
      app_url: websiteUrl,
      logo_url: logoFile || "https://via.placeholder.com/512x512.png",
      package_name: packageName
    };

    console.log("Sending build request:", buildPayload);

    console.log("data: ", buildPayload)
    // Make request to build server
    const buildResponse = await fetch("https://flutterapkbuilder-production.up.railway.app/build-apk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildPayload),
    });

    if (!buildResponse.ok) {
      const errorText = await buildResponse.text();
      console.error("Build server error:", errorText);
      return NextResponse.json(
        { error: "Failed to build APK", details: errorText },
        { status: buildResponse.status }
      );
    }

    const buildResult = await buildResponse.json();
    console.log("Build server response:", buildResult);

    // Return the download URL from build server
    return NextResponse.json({
      success: true,
      downloadUrl: buildResult.downloadUrl || buildResult.download_url,
      message: "APK built successfully"
    });

  } catch (error) {
    console.error("Error building APK:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: text, // Text input for the image generation
        n: 1,         // Number of images to generate
        size: "1024x1024", // Image size
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json(); // Log error details
      console.error("Error response:", errorDetails);
      throw new Error("Failed to generate image");
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      images: result.data.map((img: { url: string }) => img.url), // returns an array of image URLs
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
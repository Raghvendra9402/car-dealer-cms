import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/db";
import { BodyType, MakeName } from "@/lib/generated/prisma/enums";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const validMake = Object.values(MakeName);
const validBodyType = Object.values(BodyType);

export const AI = inngest.createFunction(
  { id: "ai-data" },
  { event: "test/ai.data" },
  async ({ event, step }) => {
    await step.run("analyze-car-image", async () => {
      try {
        const res = await fetch(event.data.imageUrl);
        const imageArrayBuffer = await res.arrayBuffer();
        const base64ImageData =
          Buffer.from(imageArrayBuffer).toString("base64");

        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          config: {
            responseMimeType: "application/json",
          },
          contents: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64ImageData,
              },
            },
            {
              text: `Act as an expert automotive inspector and copywriter. Analyze this image and provide:
                1. "make": The car manufacturer. Must be one of these exact values: ${validMake.join(", ")}. If the car make is not in this list, use the closest match or leave as null.
                2. "name": Model.
                3. "seats" : Seats in the car.
                4. "bodyType" : Body type of the car. Must be one of these exact values: ${validBodyType.join(", ")}.
                3. "launchYear": The original year this specific generation was launched.
                4. "condition": A summary of the visual state (e.g., 'Excellent', 'Fair').
                5. "damageReport": List any visible dents, scratches, or missing parts. If none, state 'No visible damage'.
                6. "description": An attractive, SEO-friendly description using keywords like 'performance', 'rugged', and 'lifestyle appeal'.
                7. "tags": 5 SEO keywords for this car.
                8. "color": Color of the vehicle.
                `,
            },
          ],
        });

        const analysis = JSON.parse(result.text!);

        return prisma.aIResponse.create({
          data: {
            id: event.data.id,
            status: "DONE",
            result: analysis,
          },
        });
      } catch (error) {
        return prisma.aIResponse.create({
          data: {
            id: event.data.id,
            status: "ERROR",
            result: {},
          },
        });
      }
    });
  },
);

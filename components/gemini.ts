
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Using gemini-2.5-flash for fast, accurate generation with Google Search Grounding.
const GEMINI_MODEL = 'gemini-2.5-flash';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BASE_INSTRUCTIONS = `You are the "Pharma-Sure Verification Engine" & "AI Analytics Core". 
Your goal is to analyze user uploads (photos of medicine packaging, strips, bottles, documents, or QR codes) and generate a "Blockchain Verification Certificate & Supply Chain Dashboard" as a single-page interactive HTML application.

CRITICAL: Use the 'googleSearch' tool to verify the specific medicine names, manufacturers, or pharmaceutical standards detected in the prompt or image. 
- If a drug name is found (e.g., "Dolo 650", "Amoxicillin"), search for its real composition, side effects, and manufacturer reputation.
- **RECALL CHECK**: You MUST actively search for recent "Regulatory Recalls", "FDA Alerts", or "CDSCO Warnings" associated with the identified drug or manufacturer.
- Incorporate this REAL WORLD DATA into the dashboard content (e.g., "Verified Manufacturer: [Real Name Found]", "Active Ingredients: [Real Ingredients Found]", "Recent Alerts: [Real News]").

CORE VISUAL STYLE:
- Use a clean, clinical, and trustworthy color palette (Teals, Blues, Greens, White).
- Use CSS for all styling (Tailwind allowed).
- NO external images. Use Heroicons (SVG) or CSS shapes for visual elements.
- DATA VISUALIZATION: Use CSS-based progress bars, simple bar charts (using div heights), and colored status indicators to represent "Multipowered Analytics".
- Make it look like a real production software interface.

RESPONSE FORMAT:
Return ONLY the raw HTML code. Do not wrap it in markdown. Start immediately with <!DOCTYPE html>.
`;

const ROLE_INSTRUCTIONS = {
  manufacturer: `
    ROLE CONTEXT: INDUSTRIAL MANUFACTURING
    The user is a Factory Manager or Production Supervisor.
    
    IF IMAGE INPUT (Raw Material, Batch Sheet, or Production Line) OR TEXT REQUEST:
    - Generate a "Batch Production & Market Intelligence Dashboard".
    - CORE FEATURE: Generate a secure QR Code for the current batch.
    - IMPLEMENTATION: You MUST include an <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://pharma-sure.com/verify/[BATCH_ID]" alt="Batch QR Code" /> to render the actual QR code visually.
    - Show: Batch ID (Generated), Manufacturing Date (Now), Expiry Date (+2 years).
    - Action: "Commit to Blockchain" button.
    - Supply Chain: Show "Step 1: Manufacturing" as active.
    
    **NEW FEATURE: GLOBAL RECALL INTELLIGENCE**
    - SEARCH TASK: Actively search for recalls related to the active ingredient or similar products in the market.
    - UI: Display a "Regulatory Monitor" section. 
      - If no recalls found: Show a Green "Global Compliance: CLEAR" card.
      - If recalls found: Show a Yellow or Red "Competitor/Ingredient Alert" card detailing the issue to prevent similar defects.

    **NEW FEATURE: MULTIPOWERED SAFETY ANALYTICS**
    - Generate a "Batch Quality Score" visualization (0-100%) based on simulated purity tests.
    - Create a "Global Distribution Map" visualization (using CSS grid or simplified shapes) showing intended regions.
    - Show a "Counterfeit Attempt Prediction" graph: Simulated data showing areas of high risk for this drug type.

    **NEW FEATURE: SALES & DELIVERY ANALYTICS**
    - **Sales Performance**: Create a CSS bar chart showing "Units Sold" across top 3 regions (e.g., "North Tier-2", "South Metro").
    - **Batch Delivery Tracker**: A visual stepper showing the journey of recent batches [Factory -> Logistics -> Distributor -> Pharmacy]. Show status like "In Transit: 45%", "Delivered: 55%".
    - **Pharmacist Recommendation Impact**: A specific metric card or pie chart showing "Sales Driven by Pharmacist Recommendation" vs "Direct Prescriptions". highlighting the Doctor-Pharmacy coordination.
    
    - SEARCH TASK: Verify raw material suppliers or recent GMP standards if relevant text is found.
  `,
  pharmacist: `
    ROLE CONTEXT: PHARMACIST (MSME)
    The user is a Pharmacy Owner.

    IF VIDEO INPUT (Pharmacist Recording/Instruction):
    - The user has uploaded a video explaining dosage, safety, or introducing a drug.
    - TASK: Analyze the video content (simulated based on metadata/context).
    - Generate a "Digital Pharmacist Patient Guide".
    - EXTRACT/SUMMARIZE: The Pharmacist's Greeting, Drug Name, Specific Dosage Instructions (Morning/Night), and Safety Warnings mentioned.
    - Content: Create a clean, accessible layout with a "Pharmacist's Advice" section.
    - Visuals: detailed cards for "Dosage Schedule" and "Side Effect Watchlist".

    IF IMAGE INPUT (Medicine Box, Invoice, or Bulk Carton):
    - Generate an "Inventory Verification & Analytics Dashboard".
    - Show: Product Name, Detected Batch No, Supplier Validity (Verified via Search).
    - Blockchain: Show the full history trail (Manufacturing -> Distributor -> Pharmacy).
    
    **NEW FEATURE: ACTIVE DRUG RECALL ALERTS**
    - SEARCH TASK: **CRITICAL**. Search for "FDA recall [Drug Name]" or "CDSCO recall [Drug Name]".
    - UI: This is the most important safety feature.
      - If a recall is found: Render a LARGE RED FLASHING BANNER at the top: "⚠️ RECALL ALERT: [Reason]". Add a "Quarantine Stock" button.
      - If safe: Render a prominent Green Shield: "No Active Recalls / Safety Verified".

    **NEW FEATURE: MULTIPOWERED ANALYTICS**
    - **Expiry Risk Heatmap**: Visual representation of stock nearing expiration.
    - **Demand Prediction**: A trend line showing expected sales based on "Seasonal Fluctuations" (simulated).
    - **Safety Compliance Score**: A gauge showing how compliant the current stock is with regulatory standards.
    
    **NEW FEATURE: DIRECT ORDER INTEGRATION**
    - Analyze current stock levels (simulated).
    - Add a primary action button: "Order Re-stock from Manufacturer".
    - Use a blue color scheme to distinguish this B2B action from standard verification tasks.
    
    - Action: "Add to Digital Inventory" button.
  `,
  patient: `
    ROLE CONTEXT: PATIENT / CONSUMER
    The user is an end-consumer checking if their medicine is safe.

    IF IMAGE INPUT (Medicine Strip, Pill, or Bottle):
    - Generate a "Consumer Safety Certificate & Health Companion".
    - Header: LARGE "AUTHENTIC" (Green) or "COUNTERFEIT ALERT" (Red).
    
    **NEW FEATURE: AI DOSAGE REMINDERS**
    - Generate a "Smart Dosage Timeline": A visual horizontal timeline showing "8:00 AM (Take with food)", "2:00 PM", "8:00 PM".
    - Add "Add to Calendar" and "Set WhatsApp Reminder" buttons.
    
    **NEW FEATURE: DRUG SAFETY MULTIPOWERED ANALYTICS**
    - **Safety Pulse Score**: A large circular metric (0-100) indicating the safety profile of this drug for general use.
    - **Side Effect Probability**: A bar chart comparing "Common" vs "Rare" side effects based on real data found via search.
    - **Interaction Checker**: A section warning about common interactions (e.g., "Avoid Alcohol", "No Grapefruit").
    
    - Education: Show a "Verify the Hologram" tip.
    - Action: "Report Adverse Reaction" button.
    - SEARCH TASK: Fetch accurate side effects, dosage norms, and interaction warnings for the specific identified drug.
  `
};

interface UserDetails {
    name: string;
    role: 'manufacturer' | 'pharmacist' | 'patient';
    companyName?: string;
    licenseId?: string;
    factoryId?: string;
}

export async function bringToLife(prompt: string, user: UserDetails, fileBase64?: string, mimeType?: string): Promise<{ html: string, sources: { title: string, uri: string }[] }> {
  const parts: any[] = [];
  
  const roleInstruction = ROLE_INSTRUCTIONS[user.role];
  
  // Personalization Injection
  let personalizedContext = `\nCURRENT USER SESSION:\nName: ${user.name}\nRole: ${user.role.toUpperCase()}`;
  if (user.companyName) personalizedContext += `\nOrganization: ${user.companyName}`;
  if (user.licenseId) personalizedContext += `\nLicense ID: ${user.licenseId}`;
  if (user.factoryId) personalizedContext += `\nFactory ID: ${user.factoryId}`;
  personalizedContext += `\n\nINSTRUCTION: Personalize the dashboard header and reports to show they belong to "${user.companyName || user.name}".`;

  const finalSystemInstruction = `${BASE_INSTRUCTIONS}\n${roleInstruction}\n${personalizedContext}`;

  const userPrompt = fileBase64 
    ? `Analyze this input acting as ${user.name} (${user.role}). Search for details about any visible text/medicines and generate the dashboard with ANALYTICS and REMINDERS.` 
    : prompt || `Generate a demo Pharma-Sure dashboard for ${user.name} (${user.role}) handling 'Amoxicillin 500mg' (Search for real specs and news). Include Dosage Reminders and Safety Analytics.`;

  parts.push({ text: userPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: 0.4, 
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    // Extract Grounding Sources
    const sources: { title: string, uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                sources.push({ title: chunk.web.title, uri: chunk.web.uri });
            }
        });
    }

    return { html: text, sources };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

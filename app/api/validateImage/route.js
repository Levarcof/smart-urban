export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ success: false, message: "Image URL missing" }), { status: 400 });
    }

    const API_KEY = process.env.ROBOFLOW_API_KEY;

    // ✅ YOUR REAL MODEL NAME
    const MODEL = "garbage-detection-sozy9-q8ks4/2";

    const apiUrl = `https://detect.roboflow.com/${MODEL}?api_key=${API_KEY}&image=${encodeURIComponent(imageUrl)}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log("Roboflow Response:", data);

    const predictions = data.predictions || [];

    // ✅ confidence filter (important)
    const isGarbage = predictions.some(p => p.confidence > 0.4);

    return new Response(
      JSON.stringify({
        success: true,
        isGarbage,
        predictions,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Roboflow Error:", err);
    return new Response(JSON.stringify({ success: false, message: "AI detection failed" }), { status: 500 });
  }
}

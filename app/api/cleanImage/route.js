export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ success: false, message: "Image URL missing" }),
        { status: 400 }
      );
    }

    const API_KEY = process.env.ROBOFLOW_API_KEY;
    const MODEL = "garbage-detection-sozy9-q8ks4/2";

    const apiUrl = `https://detect.roboflow.com/${MODEL}?api_key=${API_KEY}&image=${encodeURIComponent(image)}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log("Roboflow Response:", data);

    const predictions = data.predictions || [];

    // ✅ Define garbage classes exactly as in your Roboflow model
    const garbageClasses = ["plastic", "metal", "paper", "trashbag", "waste"];

    // ✅ Check if at least one prediction is garbage
    const isGarbage = predictions.some(
      (p) =>
        p.confidence > 0.5 &&
        garbageClasses.some(
          (cls) => cls.toLowerCase() === p.class.toLowerCase().trim()
        )
    );

    // ✅ Reverse logic: success true if NOT garbage
    const success = !isGarbage;

    return new Response(
      JSON.stringify({
        success,       // true if image NOT garbage, false if garbage
        isGarbage,     // true if image contains garbage
        predictions,   // full predictions for reference
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Roboflow Error:", err);

    return new Response(
      JSON.stringify({ success: false, message: "AI detection failed" }),
      { status: 500 }
    );
  }
}
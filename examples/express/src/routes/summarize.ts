import { Router, Request, Response } from "express";
import { wrap } from "npm-ai-hooks";

const router = Router();
const summarize = wrap((text: string) => text, { task: "summarize" });

router.get("/", async (req: Request, res: Response) => {
  try {
    const text = req.query.text as string;
    
    if (!text) {
      return res.status(400).json({ 
        error: "Missing text parameter",
        example: "/summarize?text=Your long text here..."
      });
    }
    
    const result = await summarize(text);
    return res.json({
      summary: result.output,
      meta: result.meta
    });
  } catch (error: any) {
    console.error("Summarize Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
      provider: error.provider || null
    });
  }
});

export default router;
# app.py — Stable Diffusion v1.5, kényszerített GPU (CUDA)
import base64
from io import BytesIO
from typing import Optional
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler

MODEL_ID = "stable-diffusion-v1-5/stable-diffusion-v1-5"
USE_SAFETY_CHECKER = False  # publikusan érdemes True

DEFAULT_QUALITY = "high detail, high resolution, ultra sharp, clean edges"
DEFAULT_NEGATIVE = "blurry, low quality, deformed, artefacts, watermark, text, logo artifacts"

STYLE_PRESETS = {
    "logo": "minimal, vector style, clean edges, solid colors, centered, plain background",
    "pattern": "seamless repeating pattern, tiling, textile print, balanced density"
}

# -- Kényszerített CUDA ellenőrzés --
assert torch.cuda.is_available(), "CUDA nem elérhető! Telepíts CUDA-s PyTorch-ot (cu118) és/vagy frissítsd a GPU drivert."
DEVICE = "cuda"
DTYPE = torch.float16  # GTX 980-hoz fp16 javasolt

app = FastAPI(title="Stable Diffusion v1.5 (GPU forced)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

class GenerateBody(BaseModel):
    prompt: str
    steps: Optional[int] = 30
    guidance_scale: Optional[float] = 7.5
    seed: Optional[int] = None
    height: Optional[int] = 512
    width: Optional[int] = 768
    mode: Optional[str] = "logo"          # "logo" vagy "pattern"
    negative_prompt: Optional[str] = None # ha küldesz saját negatív promptot, azt használjuk
    use_defaults: Optional[bool] = True   # ha False, nem fűzzük hozzá az alap stringeket

print("GPU:", torch.cuda.get_device_name(0))
print("Loading SD v1.5 to CUDA...")
pipe = StableDiffusionPipeline.from_pretrained(
    MODEL_ID,
    torch_dtype=DTYPE,
    use_safetensors=True,
    safety_checker=None if not USE_SAFETY_CHECKER else None,
)
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config)

# Átköltöztetés GPU-ra + memóriatakarékosság
pipe.to(DEVICE)
pipe.enable_attention_slicing()
pipe.enable_vae_tiling()  # kevés VRAM-nál segít textúrázott VAE-ben

torch.backends.cudnn.benchmark = True
print("Pipeline ready on CUDA.")

@app.get("/")
def root():
    return {"status": "ok", "device": DEVICE}

@app.post("/generate")
def generate(body: GenerateBody):
    if not body.prompt or not body.prompt.strip():
        return {"error": "Missing prompt"}

    # Seed
    gen = None
    if body.seed is not None:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        gen = torch.Generator(device=device).manual_seed(int(body.seed))

    # Méret
    h = max(256, min(768, int(body.height or 512)))
    w = max(256, min(768, int(body.width or 512)))

    steps = max(5, min(50, int(body.steps or 20)))
    guidance = float(body.guidance_scale or 7.5)

    # -- ÚJ: végső promptok felépítése --
    base = body.prompt.strip()
    if (body.use_defaults is None) or body.use_defaults:
        style = STYLE_PRESETS.get((body.mode or "logo").lower(), "")
        # minőség + stílus + felhasználó promptja
        final_prompt = ", ".join([p for p in [style, base, DEFAULT_QUALITY] if p])
        final_negative = body.negative_prompt.strip() if body.negative_prompt else DEFAULT_NEGATIVE
    else:
        final_prompt = base
        final_negative = body.negative_prompt.strip() if body.negative_prompt else None

    with torch.inference_mode():
        image = pipe(
            prompt=final_prompt,
            negative_prompt=final_negative,   # <-- diffusers támogatja
            num_inference_steps=steps,
            guidance_scale=guidance,
            height=h, width=w,
            generator=gen,
        ).images[0]

    buf = BytesIO()
    image.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return {
        "photo": b64,
        "used_prompt": final_prompt,
        "used_negative": final_negative
    }

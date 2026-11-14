# EcBiz Economics marking

The written marker runs in `/api/ecbiz-mark` on Vercel. Import the GitHub repository as a Vercel project and set `ECBIZ_OPENAI_API_KEY` as a server-side environment variable. Redeploy after setting it. The default model is `gpt-4.1-mini`; set `ECBIZ_MARKING_MODEL` to choose a compatible model with image and Structured Outputs support. Use the Economics page on that deployment at `/subjects/economics.html#practice`. GitHub Pages serves only static files, so the existing Pages URL cannot run the marking API.

The server looks up each question and its marking scheme by ID. It sends the answer and any submitted Paper 2 diagram to OpenAI for marking with response storage disabled. Non-essay marks must be backed by scheme criteria. Eight-mark questions use the existing EcBiz discussion bands with the scheme as indicative content. Teach Jojo uses a two-point scheme derived from its existing outcome and explanation. MCQs and games retain their automatic answer-key feedback.

The endpoint is public on a public deployment. For shared deployments, configure an IP rate limit for POST requests to `/api/ecbiz-mark` in the hosting firewall and a provider spending budget. The API key belongs in the hosting environment.

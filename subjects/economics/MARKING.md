# EcBiz Economics marking

The hosted marker looks up the EcBiz scheme by question ID and sends the scheme, question and submitted answer to the OpenAI Responses API with response storage disabled. Multiple-choice and supported exact-list marking stay in the browser. Written answers continue to use the on-device marker on GitHub Pages until a hosted endpoint is configured.

## Activate on GitHub Pages

1. Import this repository into a Vercel project. Use the repository root. Keep the settings from `vercel.json`.
2. Set `ECBIZ_OPENAI_API_KEY` as a server-side environment variable for the deployment. Use a dedicated OpenAI project. The default API model is `gpt-6-sol` at medium reasoning effort. An optional `ECBIZ_MARKING_MODEL` selects a compatible API model. ChatGPT and API models may differ, so benchmark the configured deployment before enabling it for students.
3. Deploy, then open the Vercel copy of `/subjects/economics.html` and grade synthetic correct, partial and incorrect answers. Verify that it shows the hosted-marking notice and returns points with feedback, plus a discussion band on an 8-mark answer.
4. Set `endpoint` in `subjects/economics/marking-config.json` to the production Vercel HTTPS URL ending in `/api/ecbiz-mark`. After the change publishes to GitHub Pages, test the same answers at the existing EcBiz URL.
5. Monitor usage. The endpoint is public, so configure an IP rate limit for POSTs to `/api/ecbiz-mark` in the hosting firewall and use the provider spending controls appropriate for the site.

Set `endpoint` back to `null` to restore the previous on-device path on GitHub Pages. Put no key in that file or in the Git repository.

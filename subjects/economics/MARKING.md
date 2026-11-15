# EcBiz Economics marking

The Economics section runs on GitHub Pages. It has no marking endpoint, API key or server setup. The first written submission downloads a WebLLM model on a browser and device with WebGPU. EcBiz shows loading progress and the browser can reuse its cached model files on future visits. A Paper 2 diagram submission loads a separate vision model and requires additional graphics memory. The worker processes one answer at a time, including during mock marking. Student answers and diagram files stay in the browser.

The marker uses the question’s own scheme and validates score bounds and per-mark evidence. Eight-mark discussion answers use the EcBiz discussion bands. Teach Jojo uses a two-point scheme derived from its worked explanation. Multiple choice uses the existing answer key.

For a deployment check, open `subjects/economics.html#practice` over HTTPS in a WebGPU-capable browser. Submit a written answer, check the loading progress and feedback, and submit a second answer. Then test a mock with a labelled diagram image. Check known full, partial and zero-credit answers before relying on the model for formal assessment.

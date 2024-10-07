import torch
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="silma-ai/SILMA-9B-Instruct-v1.0",
    model_kwargs={"torch_dtype": torch.bfloat16},
    device="mps",  # replace with "mps" to run on a Mac device
)

messages = [
    {"role": "user", "content": "اكتب رسالة تعتذر فيها لمديري في العمل عن الحضور اليوم لأسباب مرضية."},
]

outputs = pipe(messages, max_new_tokens=256)
assistant_response = outputs[0]["generated_text"][-1]["content"].strip()
print(assistant_response)


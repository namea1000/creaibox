import json

with open('scratch/step_50_chunks_raw.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

try:
    chunks = json.loads(raw)
    print("Parsed successfully. Number of chunks:", len(chunks))
    for i, chunk in enumerate(chunks):
        with open(f'scratch/step_50_chunk_{i}_target.txt', 'w', encoding='utf-8') as tf:
            tf.write(chunk['TargetContent'])
        with open(f'scratch/step_50_chunk_{i}_replacement.txt', 'w', encoding='utf-8') as rf:
            rf.write(chunk['ReplacementContent'])
        print(f"Wrote chunk {i}")
except Exception as e:
    print("Error parsing:", e)

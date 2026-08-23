import json

path = r"C:\Users\GBESSI\.gemini\antigravity\brain\a316dca9-7778-49bf-80bc-b8dc93246f20\.system_generated\logs\transcript_full.jsonl"
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if 'première correction' in content:
                    with open('scratch/full_user_prompt.txt', 'w', encoding='utf-8') as out:
                        out.write(content)
        except Exception:
            pass

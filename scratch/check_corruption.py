import os
import re

corrupted_files = []
# characters like Ã, Ǹ, ǟ
bad_chars = ['Ã', 'Ǹ', 'ǟ', '©', '']

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for char in bad_chars:
                        if char in content:
                            corrupted_files.append((path, char))
                            break
            except Exception as e:
                pass

for path, char in corrupted_files:
    print(f"CORRUPTED: {path} (contains {char})")

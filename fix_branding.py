import os
import re

directory = 'src'
# Regex explanation:
# AiX OS
# (?!\u2122) -> not followed by ™
# (?!™) -> not followed by ™
# (?!&trade;) -> not followed by &trade;
# (?!<sup) -> not followed by <sup
pattern = re.compile(r'AiX OS(?!\u2122)(?!™)(?!&trade;)(?!<sup)(?! OS)(?!·)(?! -)(?! —)(?! •)')
# Actually, I shouldn't exclude things like AiX OS - but I want to make sure I don't add ™ to things that already have it.
# Let's just do: AiX OS(?!™)(?!&trade;)(?!<sup)
pattern2 = re.compile(r'AiX OS(?!™)(?!&trade;)(?!<sup)')

count = 0
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json', '.md')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern2.sub('AiX OS™', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {filepath}")

print(f"Total files updated: {count}")

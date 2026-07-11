import os
import re

directory = 'src'

# Define mappings from dark mode tailwind classes to light mode luxury classes
replacements = {
    r'bg-zinc-950': 'bg-white',
    r'bg-zinc-900': 'bg-zinc-50',
    r'bg-zinc-800': 'bg-zinc-100',
    r'bg-\[\#080808\]': 'bg-white',
    r'bg-\[\#090909\]': 'bg-zinc-50',
    r'bg-\[\#0a0a0a\]': 'bg-zinc-50',
    r'bg-\[\#050505\]': 'bg-white',
    r'bg-black': 'bg-white',
    r'text-white': 'text-zinc-900',
    r'text-zinc-400': 'text-zinc-500',
    r'text-zinc-300': 'text-zinc-600',
    r'text-zinc-500': 'text-zinc-400',
    r'border-zinc-900': 'border-zinc-200',
    r'border-zinc-800': 'border-zinc-200',
    r'border-zinc-850': 'border-zinc-200',
    r'border-zinc-700': 'border-zinc-300',
    r'hover:bg-zinc-900': 'hover:bg-zinc-100',
    r'hover:bg-zinc-800': 'hover:bg-zinc-200',
    r'hover:border-zinc-800': 'hover:border-zinc-300',
    r'hover:border-zinc-700': 'hover:border-zinc-300',
    r'hover:text-white': 'hover:text-zinc-900',
    r'shadow-black': 'shadow-zinc-200/50',
    r'from-zinc-900': 'from-zinc-50',
    r'to-black': 'to-white',
    r'to-zinc-950': 'to-zinc-100',
}

sorted_replacements = dict(sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True))

count = 0
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in sorted_replacements.items():
                new_content = re.sub(pattern, replacement, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {filepath}")

print(f"Total files updated: {count}")

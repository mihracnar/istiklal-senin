import os
import re

def fix_homepage_links():
    root_dir = os.getcwd()

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                
                rel_path = os.path.relpath(root, root_dir)
                if rel_path == ".":
                    depth = 0
                    prefix = "" 
                else:
                    depth = rel_path.count(os.sep) + 1
                    prefix = "../" * depth

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # 1. Menüdeki "Ana Sayfa" yazan linki bul ve düzelt
                # Genelde <li><a href="">Ana Sayfa</a></li> yapısındadır
                # prefix boşsa (kök dizin) "index.html" veya "/" yapar
                home_link = prefix if prefix else "./"
                
                # Hem boş href="" hem de hatalı href="/" durumlarını yakalayalım
                new_content = re.sub(r'href=""(?=[^>]*>Ana Sayfa</a>)', f'href="{home_link}"', content)
                new_content = re.sub(r'href="/"(?=[^>]*>Ana Sayfa</a>)', f'href="{home_link}"', new_content)
                
                # 2. Logo linkini de düzeltelim (H1 içindeki logo genelde ana sayfaya gider)
                new_content = re.sub(r'<h1><a href=""', f'<h1><a href="{home_link}"', new_content)
                new_content = re.sub(r'<h1><a href="/"', f'<h1><a href="{home_link}"', new_content)

                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Ana Sayfa linki düzeltildi: {file_path}")

if __name__ == "__main__":
    fix_homepage_links()
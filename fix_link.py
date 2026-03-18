import os
import re

def fix_paths():
    # Proje kök dizini (scriptin çalıştığı yer)
    root_dir = os.getcwd()

    # Değiştirilecek dosya uzantıları ve paternler
    # href="css/...", src="/js/...", src="/images/..." gibi yapıları yakalar
    patterns = [
        (r'(href|src)="/?((css|js|images)/)', r'\1="{prefix}\2'),
    ]

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                
                # Kök dizine olan uzaklığı hesapla (derinlik)
                # Örneğin 'mekanlar/refik-meyhanesi/index.html' -> derinlik 2
                rel_path = os.path.relpath(root, root_dir)
                if rel_path == ".":
                    depth = 0
                else:
                    depth = rel_path.count(os.sep) + 1
                
                prefix = "../" * depth

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Referansları güncelle
                new_content = content
                for pattern, replacement in patterns:
                    formatted_replacement = replacement.replace("{prefix}", prefix)
                    new_content = re.sub(pattern, formatted_replacement, new_content)

                # Menü linklerini de düzeltelim (opsiyonel ama gerekli)
                # href="mekanlar" -> href="../../mekanlar" gibi
                menu_patterns = [
                    (r'href="(mekanlar|kisi-ve-olaylar|benim-rotam|en-yeniler|magaza|cerez-politikasi|kisisel-verilerin-korunmasi)"', 
                     r'href="' + prefix + r'\1"')
                ]
                for pattern, replacement in menu_patterns:
                    new_content = re.sub(pattern, replacement, new_content)

                # Değişiklik varsa dosyayı kaydet
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Düzenlendi: {file_path} (Derinlik: {depth})")

if __name__ == "__main__":
    fix_paths()
    print("\nİşlem tamamlandı! Tüm referanslar göreceli (relative) hale getirildi.")
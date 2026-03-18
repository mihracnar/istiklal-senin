import os

def fix_folder_prefixes():
    root_dir = os.getcwd()
    
    # Hatalı prefix barındırma ihtimali olan ana liste sayfaları
    folders = ["mekanlar", "kisi-ve-olaylar", "benim-rotam"]

    for folder in folders:
        # Sadece o klasörün içindeki ana index.html dosyasını hedef alıyoruz
        file_path = os.path.join(root_dir, folder, "index.html")
        
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Örneğin: href="mekanlar/ kısmını bulup sadece href=" olarak değiştirir.
            # Böylece href="mekanlar/santral-sinemasi..." -> href="santral-sinemasi..." olur.
            pattern = f'href="{folder}/'
            new_content = content.replace(pattern, 'href="')

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Klasör isimleri (prefix) temizlendi: {file_path}")

if __name__ == "__main__":
    fix_folder_prefixes()
    print("\nİşlem tamam! Linkler bulundukları klasöre tam uyumlu hale geldi.")
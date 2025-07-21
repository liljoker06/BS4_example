import os

def create_init_files(base_dir="."):
    for root, dirs, files in os.walk(base_dir):
        if "__pycache__" in root or "venv" in root:
            continue
        if "__init__.py" not in files:
            init_path = os.path.join(root, "__init__.py")
            open(init_path, "a").close()
            print(f"{init_path} créé.")

if __name__ == "__main__":
    create_init_files("app")

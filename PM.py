import os

def is_excluded(file_path):
    excluded_dirs = ['node_modules', 'generated', 'dist', 'build']
    excluded_exts = ['.json', '.lock', '.gql']

    # Check if the file is in an excluded directory
    if any(excluded_dir in file_path for excluded_dir in excluded_dirs):
        return True

    # Check if the file has an excluded extension
    if any(file_path.endswith(ext) for ext in excluded_exts):
        return True

    return False

def count_lines_of_code(base_dir):
    total_lines = 0

    for root, _, files in os.walk(base_dir):
        for file in files:
            file_path = os.path.join(root, file)

            if not is_excluded(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        total_lines += sum(1 for line in f if line.strip())  # Ignorar líneas en blanco
                except (UnicodeDecodeError, FileNotFoundError):
                    # Skip files that cannot be read
                    continue

    return total_lines

def calculate_effort(lines_of_code):
    # COCOMO II formula: Effort = (Lines / 1000) * 2.94 * 0.33
    return (lines_of_code / 1000)**1.0677 * 2.94 * 0.33

if __name__ == "__main__":
    base_directory = os.path.dirname(os.path.abspath(__file__))
    lines_of_code = count_lines_of_code(base_directory)
    effort = calculate_effort(lines_of_code)

    print(f"Líneas de código fuente: {lines_of_code}")
    print(f"Esfuerzo estimado (Meses por Persona): {effort:.2f} meses")
    print(f"Esfuerzo estimado (dividido entre 3 personas): {effort / 3:.2f} meses")
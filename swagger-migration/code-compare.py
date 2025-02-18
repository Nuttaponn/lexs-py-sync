import os
import filecmp
import csv

def find_ts_files(directory):
    """Find all .ts files in a directory."""
    ts_files = {}
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts'):
                relative_path = os.path.relpath(os.path.join(root, file), directory)
                ts_files[relative_path] = os.path.join(root, file)
    return ts_files

def normalize_file_content(file_path):
    """Normalize the content of a TypeScript file by sorting lines alphabetically."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip() and not line.strip().startswith('//')]
        return sorted(lines)
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return []

def compare_directories(dir1, dir2):
    """Compare .ts files between two directories."""
    ts_files_dir1 = find_ts_files(dir1)
    ts_files_dir2 = find_ts_files(dir2)

    added = []
    deleted = []
    modified = []
    identical = []

    # Compare files
    for file in ts_files_dir1:
        if file not in ts_files_dir2:
            deleted.append(file)
        else:
            content1 = normalize_file_content(ts_files_dir1[file])
            content2 = normalize_file_content(ts_files_dir2[file])

            if content1 == content2:
                identical.append(file)
            else:
                modified.append(file)

    for file in ts_files_dir2:
        if file not in ts_files_dir1:
            added.append(file)

    return added, deleted, modified, identical

def export_differences_to_csv(modified_files, dir1, dir2, output_csv):
    """Export the list of modified files and their differences to a CSV file."""
    try:
        with open(output_csv, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['File Path', 'Differences'])  # Header row

            for file in modified_files:
                file1 = os.path.join(dir1, file)
                file2 = os.path.join(dir2, file)

                content1 = normalize_file_content(file1)
                content2 = normalize_file_content(file2)

                differences = "\n".join([
                    f"- {line}" for line in content1 if line not in content2
                ] + [
                    f"+ {line}" for line in content2 if line not in content1
                ])

                writer.writerow([file, differences])

        print(f"Differences exported to {output_csv}")
    except Exception as e:
        print(f"Error writing to CSV file: {e}")

if __name__ == "__main__":
    dir1 = input("Enter the first directory: ")
    dir2 = input("Enter the second directory: ")
    output_csv = input("Enter the output CSV file path: ")

    added, deleted, modified, identical = compare_directories(dir1, dir2)

    print("\nComparison Results:")
    print(f"Added files ({len(added)}):")
    for file in added:
        print(f"  {file}")

    print(f"\nDeleted files ({len(deleted)}):")
    for file in deleted:
        print(f"  {file}")

    print(f"\nModified files ({len(modified)}):")
    for file in modified:
        print(f"  {file}")

    print(f"\nIdentical files ({len(identical)}):")
    for file in identical:
        print(f"  {file}")

    # Export modified files to CSV
    export_differences_to_csv(modified, dir1, dir2, output_csv)

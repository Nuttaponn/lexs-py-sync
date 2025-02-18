import os
import csv

def count_lines_in_file(file_path):
    """Count the number of lines in a given file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return sum(1 for _ in file)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0

def count_lines_in_ts_files(directory, output_csv):
    """Count lines in all .ts files in the directory and write to a CSV."""
    results = []

    # Walk through the directory to find all .ts files
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts'):
                file_path = os.path.join(root, file)
                line_count = count_lines_in_file(file_path)
                results.append([file_path, line_count])

    # Write results to CSV
    try:
        with open(output_csv, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['File Path', 'Number of Lines'])  # Header row
            writer.writerows(results)
        print(f"Results written to {output_csv}")
    except Exception as e:
        print(f"Error writing to CSV file: {e}")

if __name__ == "__main__":
    # Define the directory to search and the output CSV file
    directory_to_search = input("Enter the directory to search for .ts files: ")
    output_csv_file = input("Enter the path for the output CSV file: ")

    # Run the line counting function
    count_lines_in_ts_files(directory_to_search, output_csv_file)

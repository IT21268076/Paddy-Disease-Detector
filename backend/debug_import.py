import sys
import os

# Print current working directory
print("Current Working Directory:", os.getcwd())

# Print Python path
print("\nPython Path:")
for path in sys.path:
    print(path)

# Try importing
try:
    import app
    print("\nSuccessfully imported 'app'")
    
    try:
        import app.main
        print("Successfully imported 'app.main'")
    except Exception as e:
        print(f"Error importing app.main: {e}")
        
except Exception as e:
    print(f"Error importing app: {e}")
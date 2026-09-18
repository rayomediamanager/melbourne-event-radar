with open('src/App.tsx', 'r') as f:
    lines = f.readlines()
    for i in range(784, 788):
        print(f"{i+1}: {repr(lines[i])}")

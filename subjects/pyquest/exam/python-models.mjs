export const pythonModels = {
  sports: `names = []
distances = []
overall_best = 0.0
winner = 0

for student in range(8):
    names.append(input("Student name: "))
    jumps = []
    for jump in range(3):
        while True:
            try:
                distance = float(input("Jump distance: "))
            except ValueError:
                continue
            if 0.50 <= distance <= 6.00:
                break
        jumps.append(distance)

    distances.append(jumps)
    personal_best = max(distances[student])
    print(names[student], personal_best)
    if personal_best > overall_best:
        overall_best = personal_best
        winner = student

print(names[winner], overall_best)`,
  library: `names = []
borrowed = []
library_total = 0

for class_index in range(6):
    names.append(input("Class name: "))
    counts = []
    for week in range(4):
        while True:
            try:
                count = int(input("Books borrowed: "))
            except ValueError:
                continue
            if 0 <= count <= 40:
                break
        counts.append(count)

    borrowed.append(counts)
    class_total = sum(borrowed[class_index])
    print(names[class_index], "total:", class_total)
    if class_total >= 100:
        print(names[class_index], "reached 100 books")
    library_total += class_total

print("Library total:", library_total)`
};

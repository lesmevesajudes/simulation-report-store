import json

data = []
total = 0
with open('simulations_20191117.csv') as f:
    for line in f:
    	simulacio = json.loads(line.replace("\"\"", "\"").strip()[1:-1])
        persones = simulacio['persones'].values()
        total +=reduce(lambda acc, persona : acc + 1 if persona['GG_270_mensual'].values()[0] > 0 else acc , persones, 0)
print total
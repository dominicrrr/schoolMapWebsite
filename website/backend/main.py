import sqlite3
import json

con = sqlite3.connect("pins.db")
cur = con.cursor()

#cur.execute("CREATE TABLE student(id integer, firstName text, lastName text, age integer)")

#students_values = [(33974, "Dominic", "Rios", 17),
#                   (34134, "Maia", "Franco", 17),
#                   (37455, "Adrian", "Ruiz", 16),
#                   (33556, "Jose", "Jaramillo", 17)]

#cur.executemany("insert into student values (?, ?, ?, ?)", students_values)
#con.commit()

#for row in cur.execute("select * from student"):
#    print(row)


#cur.execute("DROP TABLE IF EXISTS pinTable")
#con.commit()

#cur.execute("CREATE TABLE pinTable(markerId text, color text, layer text, xy text, date text, studentId integer, details text, incidentType text)")
#con.commit()

#cur.execute("CREATE TABLE customIncidents(color text, incident text)")
#con.commit()

#latlng = {'xy' : {
#    'lat':273.5,
#    'lng': 396.40625
#                }
#}

#json_data = json.dumps(latlng['xy'])

#cur.execute('''
#    INSERT INTO pinTable (xy) VALUES (?)
#''', (json_data,))  

con.close()
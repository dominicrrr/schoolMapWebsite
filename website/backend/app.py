import sqlite3
from flask import Flask, render_template, g, jsonify, request, json

app = Flask(__name__, template_folder='../frontend/templates/', static_folder='../frontend/static/')
app.config['DATABASE'] = 'pins.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(app.config['DATABASE'])
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
 
@app.route('/')
def index():
    students = []
    cur = get_db().cursor()
    for row in cur.execute("SELECT * FROM student"):
        details = []
        for detail in row:
            details.append(detail)
        students.append(details)
    return render_template('index.html', students=students)

@app.route('/sendData')
def sendToJS():
    conn = sqlite3.connect("pins.db")
    print("Database connection established")

    cur = conn.cursor()
    print("Cursor created")

    cur.execute('SELECT * FROM pinTable')
    entries = cur.fetchall()
    print("Entries fetched from the database")

    print("Raw entries:")
    print(entries)

    columns = [column[0] for column in cur.description]
    print("Columns fetched:", columns)

    results = [dict(zip(columns, entry)) for entry in entries]
    print("Converted entries to dictionary format:")
    print(json.dumps(results, indent=4))

    conn.close()
    print("Database connection closed")
    return jsonify(results)

@app.route('/append', methods=['POST'])
def append_to_db():
    sendToJS()
    try:
        data = request.get_json()

        conn = sqlite3.connect('pins.db')
        cur = conn.cursor()
        z = -1
        print(data)

        for z, item in enumerate(data):
            print(item)
            lat_lng_str = item[3]
            lat_lng_values = lat_lng_str.strip('LatLng()').split(',')
            latitude = float(lat_lng_values[0])
            longitude = float(lat_lng_values[1])
            print("Latitude:", latitude)
            print("Longitude:", longitude)
            latlng = {'xy': {'lat': latitude, 'lng': longitude}}
            json_data = json.dumps(latlng['xy'])

            marker_id = item[0]
            color = item[1]
            layer = item[2]
            xy = json_data
            date = item[4]
            student_id = item[5]
            details = item[6]
            incident_type = item[7]

            print(marker_id)
            print(color)
            print(layer)
            print(xy)
            print(date)
            print(student_id)
            print(details)
            print(incident_type)

            cur.execute('INSERT INTO pinTable VALUES(?, ?, ?, ?, ?, ?, ?, ?)', (marker_id, color, layer, xy, date, student_id, details, incident_type))

        conn.commit()
        conn.close()

        return jsonify({"message": "Data appended successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/edit')
def editDb():
    pass


if __name__ == '__main__':
    app.run(debug=True)
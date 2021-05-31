from drivers_sim import DriversSim
from bottle import route, run, static_file


# TODO randomly update driver location every 5 seconds
sim = DriversSim('./drivers.get.json', 5.0)

@route('/')
@route('/<file_path>')
def serve_static(file_path="index.html"):
    print("route('/'): " + file_path)
    return static_file(file_path, root='./app/')

@route('/drivers')
def get_cars():
    return sim.getDrivers()

run(host='localhost', port=8080, debug=True)

import json
from faker import Faker
from random import randrange, random
from threading import Timer

class DriversSim:
    def __init__(self, file_path, update_time):
        self.file_path = file_path
        self.update_time = update_time
        self.file = open(file_path, 'w+')
        self.file.write("[]")
        self.fake = Faker()
        #generate 10 fake drivers
        try:
            self.drivers = self._read_file()
        except:
            self.drivers = []
            for i in range(10):
                self.genobj()
            self._write_file()
        print("DriversSim")
        Timer(self.update_time, self._update_sim).start()

    # generate fake driver profile
    def genobj(self):
        d = {
            "driverName": self.fake.name(),
            "driverCityOrigin": self.fake.city(),
            "driverLanguage": ['de', 'en', 'nl', 'fr', 'es', 'ar'][randrange(6)],
            "driverPhone": self.fake.phone_number(),
            "driverInfo": self.fake.catch_phrase(),
            "licensePlate": self.fake.license_plate(),
            "kmDriven": int(random() * 100000),
            "location": [str(round(random() * 10 + 43, 5)), str(round(random() * 30, 5))] # [Latitude, Longitude]
        }
        self.drivers.append(d)

    def getDrivers(self):
        return json.dumps(self.drivers)

    def _update_sim(self):
        print("update_sim")
        for i in range(len(self.drivers)):
            # print("i: {}, location: {}".format(i, self.drivers[i]["location"]))
            self.drivers[i]["location"] = self._randomMove(self.drivers[i]["location"])
        Timer(self.update_time, self._update_sim).start()

    def _randomMove(self, location):
        lan, lng = float(location[0]), float(location[1])
        lan += round(random() * 2 - 1, 5)
        lng += round(random() * 2 - 1, 5)
        return [str(lan), str(lng)] 
    def _read_file(self):
        self.drivers = json.loads(open(self.file_path, "r").read())

    def _write_file(self):
        file = open(self.file_path, "w")
        file.write(json.dumps(self.drivers))
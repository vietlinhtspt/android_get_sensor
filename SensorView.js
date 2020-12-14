import React, { useState, useEffect, Component} from "react";
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { StyleSheet, Text, View } from "react-native";
import { map, filter } from "rxjs/operators";

setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms
setUpdateIntervalForType(SensorTypes.gyroscope, 400);


export default function() {
  const [acc_x, set_acc_x] = useState(0);
  const [acc_y, set_acc_y] = useState(0);
  const [acc_z, set_acc_z] = useState(0);

  const [gyro_x, set_gyro_x] = useState(0);
  const [gyro_y, set_gyro_y] = useState(0);
  const [gyro_z, set_gyro_z] = useState(0);

  const [acc_time, set_acc_time] = useState(0);
  const [gyro_time, set_gyro_time] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every second!');
      
      const acc_subscription = accelerometer
        .pipe(map(({ x, y, z, timestamp}) => 
        {
          set_acc_x(x)
          set_acc_y(y)
          set_acc_z(z)
          set_acc_time(timestamp)
          console.log("Acc: ", timestamp, x, y, z)
          return x + y + z
        }), filter(speed => speed > 20))
        .subscribe(
          speed => console.log(`You moved your phone with ${speed}`),
          error => {
            console.log("The sensor is not available");
          }
        );

      const gyro_subscription = gyroscope
        .pipe(map(({ x, y, z, timestamp}) => 
        {
          set_gyro_x(x)
          set_gyro_y(y)
          set_gyro_z(z)
          set_gyro_time(timestamp)
          console.log("Gyro: ", timestamp, x, y, z)
          return x + y + z
        }), filter(speed => speed > 20))
        .subscribe(
          speed => console.log(`You rotated your phone with ${speed}`),
          error => {
            console.log("The sensor is not available");
          }
        );

      setTimeout(() => {
        // If it's the last gyro_subscription to gyroscope it will stop polling in the native API
        console.log("Unsubcription")
        acc_subscription.unsubscribe();
        gyro_subscription.unsubscribe();
      }, 1000);
      
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Get sensor app</Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueValue}>acc_time: {acc_time}</Text>
        <Text style={styles.valueValue}>Acc x: {acc_x.toFixed(5)}</Text>
        <Text style={styles.valueValue}>Acc y: {acc_y.toFixed(5)}</Text>
        <Text style={styles.valueValue}>Acc z: {acc_z.toFixed(5)}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.valueValue}>acc_time: {gyro_time}</Text>
        <Text style={styles.valueValue}>gyroscope x: {gyro_x.toFixed(5)}</Text>
        <Text style={styles.valueValue}>gyroscope y: {gyro_y.toFixed(5)}</Text>
        <Text style={styles.valueValue}>gyroscope z: {gyro_z.toFixed(5)}</Text>
      </View>
     
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginTop: 50
  },
  headline: {
    fontSize: 30,
    textAlign: "left",
    margin: 10
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
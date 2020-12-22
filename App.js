/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";

import NetInfo from "@react-native-community/netinfo";

const TIME_UPDATESENSOR = 1000
const TIME_POSTSENSOR = 2000

setUpdateIntervalForType(SensorTypes.accelerometer, TIME_UPDATESENSOR); // defaults to 100ms
setUpdateIntervalForType(SensorTypes.gyroscope, TIME_UPDATESENSOR);

const App: () => React$Node = () => {

  const [acc_x, set_acc_x] = useState(0);
  const [acc_y, set_acc_y] = useState(0);
  const [acc_z, set_acc_z] = useState(0);

  const [gyro_x, set_gyro_x] = useState(0);
  const [gyro_y, set_gyro_y] = useState(0);
  const [gyro_z, set_gyro_z] = useState(0);

  const [acc_time, set_acc_time] = useState(0);
  const [gyro_time, set_gyro_time] = useState(0);

  const post_acc_data = (time, x, y, z) => {
      post_data('https://label-studio-testing-17020860.herokuapp.com/sensor/SensorAccApiView/', JSON.stringify({
        time: time,
        x: x,
        y: y,
        z: z
      }))
  }

  const post_gyro_data = (time, x, y, z) => {
    post_data('https://label-studio-testing-17020860.herokuapp.com/sensor/SensorGyroApiView/', JSON.stringify({
      time: time,
      x: x,
      y: y,
      z: z
    }))
}

  const post_data = (url, body) => {
    fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      }).then((res) => {
        //console.log("Đặt bàn thành công");
        // this.createAlert("Gửi dữ liệu thành công");
        console.log(res)
        return res;
      })
      .catch((err) => {
        //console.log("Đặt bàn thất bại", err);
        console.log("ERR: ",err)
        return null;
      });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');

      NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
      });
      
      const acc_subscription = accelerometer
        .pipe(map(({ x, y, z, timestamp}) => 
        {
          set_acc_x(x)
          set_acc_y(y)
          set_acc_z(z)
          set_acc_time(timestamp)
          post_acc_data(timestamp, x, y, z)
          
          // plusSlides(1);
          // console.log("Acc: ", timestamp, x, y, z)
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
          post_gyro_data(timestamp, x, y, z)
          // console.log("Gyro: ", timestamp, x, y, z)
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
        // console.log("Unsubcription")
        acc_subscription.unsubscribe();
        gyro_subscription.unsubscribe();
      }, TIME_POSTSENSOR);
      
    }, TIME_POSTSENSOR);
    return () => clearInterval(interval);
    // Update the document title using the browser API
  });

  return (
    <>
      {/* <StatusBar barStyle="dark-content" /> */}
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Gyroscope sensor</Text>
              <Text style={styles.sectionDescription}>
                <Text style={styles.highlight}>Timestamp</Text> {gyro_time} {"\n"}
                <Text style={styles.highlight}>x</Text> {gyro_x} {"\n"}
                <Text style={styles.highlight}>y</Text> {gyro_y} {"\n"}
                <Text style={styles.highlight}>z</Text> {gyro_z} 
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Accelerometer sensor</Text>
              <Text style={styles.sectionDescription}>
              <Text style={styles.highlight}>Timestamp</Text> {acc_time} {"\n"}
                <Text style={styles.highlight}>x</Text> {acc_x} {"\n"}
                <Text style={styles.highlight}>y</Text> {acc_y} {"\n"}
                <Text style={styles.highlight}>z</Text> {acc_z} 
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

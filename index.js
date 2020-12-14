/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import SensorView from "./SensorView"
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => SensorView);

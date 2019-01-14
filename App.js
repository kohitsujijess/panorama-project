import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PanoramaImage from './src/components/PanoramaImage';

if (typeof window !== 'object') {
  global.window = global;
  global.window.navigator = {};
}

export default class App extends React.Component {


  render() {
    return (
      <PanoramaImage />
    );
  }
}

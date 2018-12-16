import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { ImagePicker } from 'expo';
import { Permissions } from 'expo';
//import ImagePicker from 'react-native-image-picker';

class PanoramaImage extends Component {
  state = {
    image: null
  }

  takePhoto = async () => {
    const { cameraPermssion } = await Permissions.askAsync(Permissions.CAMERA);
    const { cameraRollPermssion } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //if (cameraPermssion === 'granted' && cameraRollPermssion === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,

      });
      // parameterなどを編集してパノラマの機能を再現できない場合は、nativeのパノラマ機能を呼び出す
      //window.webkit.messageHandlers.<機能の名前>;
      
    //let result = ImagePicker.launchCamera({mediaType: 'mixed' });

      console.log(result);

      if (!result.cancelled) {
        this.setState({image: result.uri});
      }

    //}
  }

  render() {
    let { image } = this.state;

    return(
      <View style={styles.containerStyle}>
        <Text>Panorama</Text>

        <Button
          onPress={this.takePhoto}
          title="panorama"
        />

        {
          image &&
          <Image
            source={{uri: image}}
            style={{width: 300, height: 300}}
          />
        }
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 15
  }
}

export default PanoramaImage;

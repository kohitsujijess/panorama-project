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
    this.setState({ cameraPermission: status === 'granted' });
    if (cameraPermssion === 'granted' && cameraRollPermssion === 'granted') {
        // 撮影ボタンを押したときの処理
        let picture = await ImagePicker.takePictureAsync();
        Toast.show({
          text: 'Success',
          buttonText: 'Okay',
          duration: 2000,
        });
        // カメラを起動させるボタンを押してから撮影ボタンを押すまでの間に、captureの処理を走らせる
        console.log(picture.uri);
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
  
        });  
  
      if (!picture.cancelled) {
        this.setState({image: picture.uri});
      }

    }
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

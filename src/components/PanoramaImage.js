import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, Icon } from 'expo';
import mergeImages from 'merge-images';
const pictures = [];

export default class PanoramaImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };

    this.takePicture = this.takePicture.bind(this);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  }

  async takePicture() {
    const take = async () => {
      let pictureData = await this.camera.takePictureAsync();
      pictures.push(pictureData.uri);
    }
    // TODO 実機を矢印の方向に動かすというメッセージを表示

    let interVal = setInterval(take, 1000);
    setTimeout(function(){
      clearInterval(interVal);
    }, 10000);

    const mergePictures = () => {
      console.log(pictures);
      mergeImages(pictures).then(b64 => { 
        console.log(b64);
        CameraRoll.saveToCameraRoll(b64, ['photo']);
      });
    }
     
    const delayRun = (waitSeconds, someFunction) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(someFunction())
        }, waitSeconds)
      })  
    }
     
    delayRun(12000, mergePictures);
  }

  render() {
    const {
      hasCameraPermission,
    } = this.state;

    if (hasCameraPermission === null || hasCameraPermission === false) {
      return (
        <View>
          <Text>
            カメラの使用が許可されていません。
          </Text>
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Camera
          style={{
            flex: 1,
          }}
          type={this.state.type}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                this.takePicture();
              }}
            >
              <Icon.MaterialIcons
                name="camera"
                size={70}
                style={{ marginBottom: 20 }}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

import React from 'react';
import { Text, CameraRoll, View, TouchableOpacity, Image } from 'react-native';
import { Camera, Permissions, Icon } from 'expo';
import Canvas, {Image as  ImageData}  from 'react-native-canvas';
const pictures = [];

export default class PanoramaImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      cameraRollUri: null,
      pictureList: null,
    };

    this.takePicture = this.takePicture.bind(this);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
    const { camera_roll_status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: camera_roll_status === 'granted' });
  }

  async takePicture() {
    const take = async () => {
      let pictureData = await this.camera.takePictureAsync();
      pictures.push(pictureData.uri);
    }

    let interVal = setInterval(take, 2000);
    setTimeout(function(){
      clearInterval(interVal);
    }, 10000);

    const mergePictures = async () => {
      this.setState({ pictureList: pictures });
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

  handleCanvas(canvas) {
    canvas.width = 200;
    canvas.height = 200;

    const context = canvas.getContext('2d');
    context.fillRect(0, 0, 200, 200);

    context.getImageData(0, 0, 200, 200)
      .then(async (imageData) => {
        const data = Object.values(imageData.data);
        const length = Object.keys(data).length;
        for (let i = 0; i < length; i += 4) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
        const imgData = new ImageData(canvas, data, 200, 200);
        //context.putImageData(imgData, 0, 0);
        //let saveResult = await CameraRoll.saveToCameraRoll(imgData, 'photo'); 第一引数が'pictureData.uri'みたいにstringになる
      });
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
                name="arrow-forward"
                size={70}
                style={{ marginBottom: 20 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'left',
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
        {this.state.pictureList && 
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center'}}>
        {this.state.pictureList && 
          this.state.pictureList.map((item, index) => (
            <Image
          key={index}
          source={{ uri: item }}
          style={{ width: 80, height: 80 }}
         />
        ))}
        </View>
        }
        </View>
        );
  }
}

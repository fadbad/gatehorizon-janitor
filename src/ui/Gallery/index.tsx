import * as React from 'react';

import {
  Animated,
  CameraRoll,
  Dimensions,
  I18nManager,
  Image,
  ImageURISource,
  PanResponder,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TextStyle
} from 'react-native';
import ImageZoom from './zoom';
import FastImage from "react-native-fast-image";

const simpleStyle: {
  [x: string]: ViewStyle | TextStyle;
} = {
  count: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 38,
    zIndex: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  countText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 0,
      height: 0.5
    },
    textShadowRadius: 0
  }
};

const styles = (
  width: number,
  height: number,
  backgroundColor: string
): {
  [x: string]: ViewStyle | TextStyle;
} => {
  return {
    modalContainer: { backgroundColor, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    watchOrigin: { position: 'absolute', width, bottom: 20, justifyContent: 'center', alignItems: 'center' },
    watchOriginTouchable: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 30,
      borderColor: 'white',
      borderWidth: 0.5,
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    watchOriginText: { color: 'white', backgroundColor: 'transparent' },
    imageStyle: {},
    container: { backgroundColor }, 
    moveBox: { flexDirection: 'row', alignItems: 'center' },
    menuContainer: { position: 'absolute', width, height, left: 0, bottom: 0, zIndex: 12 },
    menuShadow: {
      position: 'absolute',
      width,
      height,
      backgroundColor: 'black',
      left: 0,
      bottom: 0,
      opacity: 0.2,
      zIndex: 10
    },
    menuContent: { position: 'absolute', width, left: 0, bottom: 0, zIndex: 11 },
    operateContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      height: 40,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1
    },
    operateText: { color: '#333' },
    loadingTouchable: { width, height },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    arrowLeftContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, justifyContent: 'center', zIndex: 13 },
    arrowRightContainer: { position: 'absolute', top: 0, bottom: 0, right: 0, justifyContent: 'center', zIndex: 13 }
  };
};

interface IOnMove {
  type: string;
  positionX: number;
  positionY: number;
  scale: number;
  zoomCurrentDistance: number;
}

class Props {
  public show?: boolean = false;
  public imageUrls: IImageInfo[] = [];
  public flipThreshold?: number = 80;
  public maxOverflow?: number = 300;
  public index?: number = 0;
  public failImageSource?: IImageInfo = undefined;
  public backgroundColor?: string = 'black';
  public footerContainerStyle?: object = {};
  public menuContext?: any = { saveToLocal: 'Save', cancel: 'Cancel' };
  public saveToLocalByLongPress?: boolean = false;
  public enableImageZoom?: boolean = true;
  public style?: ViewStyle = {};
  /**
   * Enable swipe down to close image viewer.
   * When swipe down, will trigger onCancel.
   */
  public enableSwipeDown?: boolean = true;
  public swipeDownThreshold?: number = 10;
  public doubleClickInterval?: number;
  public enablePreload?: boolean = false;
  public pageAnimateTime?: number = 100;
  public onLongPress?: (image?: IImageInfo) => void = () => {};
  public onClick?: (close?: () => any, currentShowIndex?: number) => void = () => {};
  public onDoubleClick?: (close?: () => any) => void = () => {};
  public onSave?: (url: string) => void = () => {};
  public onMove?: (position?: IOnMove) => void = () => {};
  public renderHeader?: (currentIndex?: number) => React.ReactElement<any> = () => {
    return null as any;
  };
  public renderFooter?: (currentIndex: number) => React.ReactElement<any> = () => {
    return null as any;
  };
  public renderIndicator?: (currentIndex?: number, allSize?: number) => React.ReactElement<any> = (
    currentIndex?: number,
    allSize?: number
  ) => {
    return React.createElement(
      View,
      { style: simpleStyle.count },
      React.createElement(Text, { style: simpleStyle.countText }, allSize > 1 ? currentIndex + '/' + allSize : '')
    );
  };
  public renderImage?: (props: any) => React.ReactElement<any> = (props: any) => {
    return React.createElement(FastImage, props);
  };
  public renderArrowLeft?: () => React.ReactElement<any> = () => {return null as any;};
  public renderArrowRight?: () => React.ReactElement<any> = () => {return null as any;};
  public onShowModal?: (content?: any) => void = () => {};
  public onCancel?: () => void = () => {};
  public onSwipeDown?: () => void = () => {};
  public loadingRender?: () => React.ReactElement<any> = () => {};
  public onSaveToCamera?: (index?: number) => void = () => {};
  public onChange?: (index?: number) => void = () => {};
  public menus?: ({ cancel, saveToLocal }: any) => React.ReactElement<any>;
}

class State {
  public show?: boolean = false;
  public currentShowIndex?: number = 0;
  public imageLoaded?: boolean = false;
  public imageSizes?: IImageSize[] = [];
  public isShowMenu?: boolean = false;
}

interface IImageInfo {
  url: string;
  width?: number;
  height?: number;
  sizeKb?: number;
  originSizeKb?: number;
  originUrl?: string;
  props?: any;
  freeHeight?: boolean;
  freeWidth?: boolean;
}

interface IImageSize {
  width: number;
  height: number;
  status: 'loading' | 'success' | 'fail';
}

export default class ImageViewer extends React.Component<Props, State> {
  public static defaultProps = new Props();
  public state = new State();

  // ???????????????????????????
  private fadeAnim = new Animated.Value(0);

  // ??????????????????
  private standardPositionX = 0;

  // ????????????????????????????????????
  private positionXNumber = 0;
  private positionX = new Animated.Value(0);

  private width = 0;
  private height = 0;

  private styles = styles(0, 0, 'transparent');

  // ??????????????? layout. fix ?????????????????? onLayout ??? bug
  private hasLayout = false;

  // ???????????????????????? index
  private loadedIndex = new Map<number, boolean>();

  private handleLongPressWithIndex = new Map<number, any>();

  private imageRefs: any[] = [];

  public componentDidMount() {
    this.init(this.props);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.index !== this.state.currentShowIndex) {
      this.setState(
        {
          currentShowIndex: nextProps.index
        },
        () => {
          // ???????????????????????????
          this.loadImage(nextProps.index || 0);

          this.jumpToCurrentImage();

          // ????????????
          Animated.timing(this.fadeAnim, {
            toValue: 1,
            duration: 200,
			useNativeDriver: true,
          }).start();
        }
      );
    }
  }

  /**
   * props ??????????????????
   */
  public init(nextProps: Props) {
    if (nextProps.imageUrls.length === 0) {
      // ??????????????????
      this.fadeAnim.setValue(0);
      return this.setState(new State());
    }

    // ??? imageSizes ???????????????
    const imageSizes: IImageSize[] = [];
    nextProps.imageUrls.forEach(imageUrl => {
      imageSizes.push({
        width: imageUrl.width || 0,
        height: imageUrl.height || 0,
        status: 'loading'
      });
    });

    this.setState(
      {
        currentShowIndex: nextProps.index,
        imageSizes
      },
      () => {
        // ???????????????????????????
        this.loadImage(nextProps.index || 0);

        this.jumpToCurrentImage();

        // ????????????
        Animated.timing(this.fadeAnim, {
          toValue: 1,
          duration: 200,
		  useNativeDriver: true,
        }).start();
      }
    );
  }
  /**
   * reset Image scale and position
   */
  public resetImageByIndex = (index: number) => {
    this.imageRefs[index] && this.imageRefs[index].reset();
  };
  /**
   * ????????????????????????
   */
  public jumpToCurrentImage() {
    // ????????????????????????
    this.positionXNumber = this.width * (this.state.currentShowIndex || 0) * (I18nManager.isRTL ? 1 : -1);
    this.standardPositionX = this.positionXNumber;
    this.positionX.setValue(this.positionXNumber);
  }

  /**
   * ?????????????????????????????????????????????
   */
  public loadImage(index: number) {
    if (!this!.state!.imageSizes![index]) {
      return;
    }

    if (this.loadedIndex.has(index)) {
      return;
    }
    this.loadedIndex.set(index, true);

    const image = this.props.imageUrls[index];
    const imageStatus = { ...this!.state!.imageSizes![index] };

    // ?????? imageSize
    const saveImageSize = () => {
      // ???????????? success ?????????????????????
      if (this!.state!.imageSizes![index] && this!.state!.imageSizes![index].status !== 'loading') {
        return;
      }

      const imageSizes = this!.state!.imageSizes!.slice();
      imageSizes[index] = imageStatus;
      this.setState({ imageSizes });
    };

    if (this!.state!.imageSizes![index].status === 'success') {
      // ?????????????????????????????????
      return;
    }

    // ?????????????????????????????????????????? success
    if (this!.state!.imageSizes![index].width > 0 && this!.state!.imageSizes![index].height > 0) {
      imageStatus.status = 'success';
      saveImageSize();
      return;
    }

    // ?????????????????????????????????
    const sizeLoaded = false;
    // ???????????????????????????
    let imageLoaded = false;

    // Tagged success if url is started with file:, or not set yet(for custom source.uri).
    if (!image.url || image.url.startsWith(`file:`)) {
      imageLoaded = true;
    }

    // ????????????????????????????????????????????? success
    if (image.width && image.height) {
      if (this.props.enablePreload && imageLoaded === false) {
        Image.prefetch(image.url);
      }
      imageStatus.width = image.width;
      imageStatus.height = image.height;
      imageStatus.status = 'success';
      saveImageSize();
      return;
    }

    Image.getSize(
      image.url,
      (width: number, height: number) => {
        imageStatus.width = width;
        imageStatus.height = height;
        imageStatus.status = 'success';
        saveImageSize();
      },
      () => {
        try {
          const data = (Image as any).resolveAssetSource(image.props.source);
          imageStatus.width = data.width;
          imageStatus.height = data.height;
          imageStatus.status = 'success';
          saveImageSize();
        } catch (newError) {
          // Give up..
          imageStatus.status = 'fail';
          saveImageSize();
        }
      }
    );
  }

  /**
   * ???????????????
   */
  public preloadImage = (index: number) => {
    if (index < this.state.imageSizes!.length) {
      this.loadImage(index + 1);
    }
  };
  /**
   * ????????????????????????
   */
  public handleHorizontalOuterRangeOffset = (offsetX: number = 0) => {
    this.positionXNumber = this.standardPositionX + offsetX;
    this.positionX.setValue(this.positionXNumber);

    const offsetXRTL = !I18nManager.isRTL ? offsetX : -offsetX;

    if (offsetXRTL < 0) {
      if (this!.state!.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
        this.loadImage((this!.state!.currentShowIndex || 0) + 1);
      }
    } else if (offsetXRTL > 0) {
      if (this!.state!.currentShowIndex || 0 > 0) {
        this.loadImage((this!.state!.currentShowIndex || 0) - 1);
      }
    }
  };

  /**
   * ?????????????????????????????????????????????
   */
  public handleResponderRelease = (vx: number = 0) => {
    const vxRTL = I18nManager.isRTL ? -vx : vx;
    const isLeftMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0);
    const isRightMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0);

    if (vxRTL > 0.7) {
      // ?????????
      this.goBack.call(this);

      // ??????????????????????????????????????????????????????????????????????????????????????????
      if (this.state.currentShowIndex || 0 > 0) {
        this.loadImage((this.state.currentShowIndex || 0) - 1);
      }
      return;
    } else if (vxRTL < -0.7) {
      // ?????????
      this.goNext.call(this);
      if (this.state.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
        this.loadImage((this.state.currentShowIndex || 0) + 1);
      }
      return;
    }

    if (isLeftMove) {
      // ?????????
      this.goBack.call(this);
    } else if (isRightMove) {
      // ?????????
      this.goNext.call(this);
      return;
    } else {
      // ?????????????????????
      this.resetPosition.call(this);
      return;
    }
  };

  /**
   * ????????????
   */
  public goBack = () => {
    if (this.state.currentShowIndex === 0) {
      // ?????????????????????
      this.resetPosition.call(this);
      return;
    }

    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX + this.width
      : this.standardPositionX - this.width;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: this.props.pageAnimateTime,
	  useNativeDriver: true,
    }).start();

    const nextIndex = (this.state.currentShowIndex || 0) - 1;

    this.setState(
      {
        currentShowIndex: nextIndex
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      }
    );
  };

  /**
   * ????????????
   */
  public goNext = () => {
    if (this.state.currentShowIndex === this.props.imageUrls.length - 1) {
      // ?????????????????????
      this.resetPosition.call(this);
      return;
    }

    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX - this.width
      : this.standardPositionX + this.width;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: this.props.pageAnimateTime,
	  useNativeDriver: true,
    }).start();

    const nextIndex = (this.state.currentShowIndex || 0) + 1;

    this.setState(
      {
        currentShowIndex: nextIndex
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      }
    );
  };

  /**
   * ????????????
   */
  public resetPosition() {
    this.positionXNumber = this.standardPositionX;
    Animated.timing(this.positionX, {
      toValue: this.standardPositionX,
      duration: 150,
	  useNativeDriver: true,
    }).start();
  }

  /**
   * ??????
   */
  public handleLongPress = (image: IImageInfo) => {
    if (this.props.saveToLocalByLongPress) {
      // ?????????????????????????????????
      this.setState({ isShowMenu: true });
    }

    if (this.props.onLongPress) {
      this.props.onLongPress(image);
    }
  };

  /**
   * ??????
   */
  public handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.handleCancel, this.state.currentShowIndex);
    }
  };

  /**
   * ??????
   */
  public handleDoubleClick = () => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(this.handleCancel);
    }
  };

  /**
   * ??????
   */
  public handleCancel = () => {
    this.hasLayout = false;
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  /**
   * ????????????
   */
  public handleLayout = (event: any) => {
    if (event.nativeEvent.layout.width !== this.width) {
      this.hasLayout = true;

      this.width = event.nativeEvent.layout.width;
      this.height = event.nativeEvent.layout.height;
      this.styles = styles(this.width, this.height, this.props.backgroundColor || 'transparent');

      // ????????????
      this.forceUpdate();
      this.jumpToCurrentImage();
    }
  };

  public getContent() {
    const screenWidth = this.width;
    const screenHeight = this.height;

    const ImageElements = this.props.imageUrls.map((image, index) => {
      if ((this.state.currentShowIndex || 0) > index + 1 || (this.state.currentShowIndex || 0) < index - 1) {
        return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
      }

      if (!this.handleLongPressWithIndex.has(index)) {
        this.handleLongPressWithIndex.set(index, this.handleLongPress.bind(this, image));
      }

      let width = this!.state!.imageSizes![index] && this!.state!.imageSizes![index].width;
      let height = this.state.imageSizes![index] && this.state.imageSizes![index].height;
      const imageInfo = this.state.imageSizes![index];

      if (!imageInfo || !imageInfo.status) {
        return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
      }

      if (width > screenWidth) {
        const widthPixel = screenWidth / width;
        width *= widthPixel;
        height *= widthPixel;
      }

      if (height > screenHeight) {
        const HeightPixel = screenHeight / height;
        width *= HeightPixel;
        height *= HeightPixel;
      }

      const Wrapper = ({ children, ...others }: any) => (
        <ImageZoom
          cropWidth={this.width}
          cropHeight={this.height}
          maxOverflow={this.props.maxOverflow}
          horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
          responderRelease={this.handleResponderRelease}
          onMove={this.props.onMove}
          onLongPress={this.handleLongPressWithIndex.get(index)}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick}
          enableSwipeDown={this.props.enableSwipeDown}
          swipeDownThreshold={this.props.swipeDownThreshold}
          onSwipeDown={this.handleSwipeDown}
          pinchToZoom={this.props.enableImageZoom}
          enableDoubleClickZoom={this.props.enableImageZoom}
          doubleClickInterval={this.props.doubleClickInterval}
          {...others}
        >
          {children}
        </ImageZoom>
      );

      switch (imageInfo.status) {
        case 'loading':
          return (
            <Wrapper
              key={index}
              style={{
                ...this.styles.modalContainer,
                ...this.styles.loadingContainer
              }}
              imageWidth={screenWidth}
              imageHeight={screenHeight}
            >
              <View style={this.styles.loadingContainer}>{this!.props!.loadingRender!()}</View>
            </Wrapper>
          );
        case 'success':
          if (!image.props) {
            image.props = {};
          }

          if (!image.props.style) {
            image.props.style = {};
          }
          image.props.style = {
            ...this.styles.imageStyle, // User config can override above.
            ...image.props.style,
            width,
            height
          };

          if (typeof image.props.source === 'number') {
            // source = require(..), doing nothing
          } else {
            if (!image.props.source) {
              image.props.source = {};
            }
            image.props.source = {
              uri: image.url,
              ...image.props.source
            };
          }
          if (this.props.enablePreload) {
            this.preloadImage(this.state.currentShowIndex || 0);
          }
          return (
            <ImageZoom
              key={index}
              ref={el => (this.imageRefs[index] = el)}
              cropWidth={this.width}
              cropHeight={this.height}
              maxOverflow={this.props.maxOverflow}
              horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
              responderRelease={this.handleResponderRelease}
              onMove={this.props.onMove}
              onLongPress={this.handleLongPressWithIndex.get(index)}
              onClick={this.handleClick}
              onDoubleClick={this.handleDoubleClick}
              imageWidth={width}
              imageHeight={height}
              enableSwipeDown={this.props.enableSwipeDown}
              swipeDownThreshold={this.props.swipeDownThreshold}
              onSwipeDown={this.handleSwipeDown}
              panToMove={!this.state.isShowMenu}
              pinchToZoom={this.props.enableImageZoom && !this.state.isShowMenu}
              enableDoubleClickZoom={this.props.enableImageZoom && !this.state.isShowMenu}
              doubleClickInterval={this.props.doubleClickInterval}
            >
              {this!.props!.renderImage!(image.props)}
            </ImageZoom>
          );
        case 'fail':
          return (
            <Wrapper
              key={index}
              style={this.styles.modalContainer}
              imageWidth={this.props.failImageSource ? this.props.failImageSource.width : screenWidth}
              imageHeight={this.props.failImageSource ? this.props.failImageSource.height : screenHeight}
            >
              {this.props.failImageSource &&
                this!.props!.renderImage!({
                  source: {
                    uri: this.props.failImageSource.url
                  },
                  style: {
                    width: this.props.failImageSource.width,
                    height: this.props.failImageSource.height
                  }
                })}
            </Wrapper>
          );
      }
    });

    return (
      <Animated.View style={{ zIndex: 9 }}>
        <Animated.View style={{ ...this.styles.container, opacity: this.fadeAnim }}>
          {this!.props!.renderHeader!(this.state.currentShowIndex)}

          <View style={this.styles.arrowLeftContainer}>
            <TouchableWithoutFeedback onPress={this.goBack}>
              <View>{this!.props!.renderArrowLeft!()}</View>
            </TouchableWithoutFeedback>
          </View>

          <View style={this.styles.arrowRightContainer}>
            <TouchableWithoutFeedback onPress={this.goNext}>
              <View>{this!.props!.renderArrowRight!()}</View>
            </TouchableWithoutFeedback>
          </View>

          <Animated.View
            style={{
              ...this.styles.moveBox,
              transform: [{ translateX: this.positionX }],
              width: this.width * this.props.imageUrls.length
            }}
          >
            {ImageElements}
          </Animated.View>
          {this!.props!.renderIndicator!((this.state.currentShowIndex || 0) + 1, this.props.imageUrls.length)}

          {this.props.imageUrls[this.state.currentShowIndex || 0] &&
            this.props.imageUrls[this.state.currentShowIndex || 0].originSizeKb &&
            this.props.imageUrls[this.state.currentShowIndex || 0].originUrl && (
              <View style={this.styles.watchOrigin}>
                <TouchableOpacity style={this.styles.watchOriginTouchable}>
                  <Text style={this.styles.watchOriginText}>????????????(2M)</Text>
                </TouchableOpacity>
              </View>
            )}
          <View style={[{ bottom: 0, position: 'absolute', zIndex: 9 }, this.props.footerContainerStyle]}>
            {this!.props!.renderFooter!(this.state.currentShowIndex || 0)}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }

  public saveToLocal = () => {
    if (!this.props.onSave) {
      CameraRoll.saveToCameraRoll(this.props.imageUrls[this.state.currentShowIndex || 0].url);
      this!.props!.onSaveToCamera!(this.state.currentShowIndex);
    } else {
      this.props.onSave(this.props.imageUrls[this.state.currentShowIndex || 0].url);
    }

    this.setState({ isShowMenu: false });
  };

  public getMenu() {
    if (!this.state.isShowMenu) {
      return null;
    }

    if (this.props.menus) {
      return (
        <View style={this.styles.menuContainer}>
          {this.props.menus({ cancel: this.handleLeaveMenu, saveToLocal: this.saveToLocal })}
        </View>
      );
    }

    return (
      <View style={this.styles.menuContainer}>
        <View style={this.styles.menuShadow} />
        <View style={this.styles.menuContent}>
          <TouchableHighlight underlayColor="#F2F2F2" onPress={this.saveToLocal} style={this.styles.operateContainer}>
            <Text style={this.styles.operateText}>{this.props.menuContext.saveToLocal}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="#F2F2F2"
            onPress={this.handleLeaveMenu}
            style={this.styles.operateContainer}
          >
            <Text style={this.styles.operateText}>{this.props.menuContext.cancel}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  public handleLeaveMenu = () => {
    this.setState({ isShowMenu: false });
  };

  public handleSwipeDown = () => {
    if (this.props.onSwipeDown) {
      this.props.onSwipeDown();
    }
    this.handleCancel();
  };

  public render() {
    let childs: React.ReactElement<any> = null as any;

    childs = (
      <View>
        {this.getContent()}
        {this.getMenu()}
      </View>
    );

    return (
      <View
        onLayout={this.handleLayout}
        style={{
          flex: 1,
          overflow: 'hidden',
          ...this.props.style
        }}
      >
        {childs}
      </View>
    );
  }
}

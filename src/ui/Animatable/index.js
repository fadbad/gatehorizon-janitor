// https://github.com/oblador/react-native-animatable

import {
  	View as CoreView,
  	Text as CoreText,
  	Image as CoreImage,
	TouchableOpacity as CoreTouchableOpacity
} from 'react-native';
import createComponent from './createAnimatableComponent';
import createAnimation from './createAnimation'
import { registerAnimation, initializeRegistryWithDefinitions } from './registry';
import * as ANIMATION_DEFINITIONS from './definitions';

initializeRegistryWithDefinitions(ANIMATION_DEFINITIONS);

export const createAnimatableComponent = createComponent;
export const View = createComponent(CoreView);
export const Text = createComponent(CoreText);
export const Image = createComponent(CoreImage);
export const TouchableOpacity = createComponent(CoreTouchableOpacity);

export default Animatable = {
	createAnimation,
	registerAnimation,
	initializeRegistryWithDefinitions,
	createAnimatableComponent,
	View,
	Text,
	Image,
	TouchableOpacity,
}

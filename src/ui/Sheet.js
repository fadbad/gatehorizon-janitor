import React from "react";
import Modal from './Modal'
import Animatable from './Animatable'
import Gesture from './Gesture'
import Div from './Div'
import { getBottomSpace, useKeyboard, statusBarHeight, useDimensions } from '../utils'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const Sheet = ({
	show, hide,
	draggable = true, 
	closable = true, 
	scrollable = false,
	style, 
	radius = 10, 
	bg = 'white', 
	overlay = '#00000066', 
	handleColor = '#00000025',
	inset = 80, 
	children = <Div />
}) => {
	const ANIM = React.useRef()
	const { keyboardShown, keyboardHeight } = useKeyboard()

	const { width, height } = useDimensions()

	const HEIGHT = height - statusBarHeight - keyboardHeight - inset

	const [H, setH] = React.useState(HEIGHT)

	React.useEffect(() => {
		if(keyboardShown){
			setH(height - statusBarHeight - keyboardHeight)
		} else {
			setH(height - statusBarHeight - inset)
		}
	}, [inset, keyboardHeight, height])

	return (
		<Modal
			isVisible={show}
			avoidKeyboard={true}
			hasBackdrop={false}
			animationIn={'fadeIn'}
			animationInTiming={300}
			animationOut={'fadeOut'}
			animationOutTiming={200}
			onModalWillHide={() => {
				ANIM?.current?.fadeOutDown(300)
			}}
			onBackButtonPress={hide}
		>
		<GestureHandlerRootView style={{flex: 1}}>
			<Div bg={overlay} f={1}>
				<Div f={1} onPress={closable ? hide : null} />
				<Gesture down callback={draggable ? hide : () => {}}>
					<Animatable.View ref={ANIM} animation={'fadeInUp'} duration={300}>
						<Div fw overflow={'hidden'}>
							<Div fw bg={bg} shadow={3} rt={radius} pb={ keyboardShown ? 0 : getBottomSpace} style={style}>
								{draggable && (
									<Div fw center onPress={hide}>
										<Div w={45} h={4} r={4} my={8} bg={handleColor} />
									</Div>
								)}

								<Div fw
									maxH={H}
									h={scrollable ? H : null}
								>
									{children}
								</Div>
							</Div>
						</Div>

					</Animatable.View>
				</Gesture>
			</Div>
		</GestureHandlerRootView>
		</Modal>
	);
}

export default React.memo(Sheet)

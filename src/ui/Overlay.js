import React from 'react';
import Div from './Div'
import Modal from './Modal'

export default ({
	children,
	show,
	hide = () => null,
	style,
	overlayBg = 'rgba(0, 0, 0, .4)',
	bg = 'white',
	r = 5,
	p = 16,
	w = 'auto',
	h = 'auto',
	fs,
	...rest
}) => (
	<Modal
		isVisible={show}
		onBackdropPress={hide}
		backdropColor={overlayBg}
		backdropOpacity={1}
		transparent
		{...rest}
	>
		<Div f={1} center onPress={hide} activeOpacity={1}>
			<Div
				p={p} maxHeight={'100%'}
				r={r} bg={bg}
				w={fs ? '100%' : w}
				h={fs ? '100%' : h}
				shadow={3}
				style={style}
			>
				{children}
			</Div>
		</Div>
	</Modal>
)

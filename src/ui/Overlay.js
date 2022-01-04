import React from 'react';
import PropTypes from 'prop-types';

import Div from './Div'
import Modal from './Modal'

const Overlay = props => {
  	const {
		children,
		isVisible,
		onBackdropPress,
		style,
		overlayBg,
		bg,
		r,
		p,
		w,
		h,
		fs,
		...rest
  	} = props;

  	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
			backdropColor={overlayBg}
			backdropOpacity={1}
			transparent
			{...rest}
		>

      		<Div f={1} center>
			  	<Div absoluteFill onPress={onBackdropPress} />
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
  	);
};

Overlay.propTypes = {
  children: PropTypes.element.isRequired,
  isVisible: PropTypes.bool.isRequired,
  style: PropTypes.any,
  overlayBg: PropTypes.string,
  bg: PropTypes.string,
  onBackdropPress: PropTypes.func,
  r: PropTypes.number,
  p: PropTypes.number,
  w: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  h: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fs: PropTypes.bool,
};

Overlay.defaultProps = {
  r: 5,
  p: 16,
  fs: false,
  overlayBg: 'rgba(0, 0, 0, .4)',
  bg: 'white',
  w: 'auto', h: 'auto',
  onBackdropPress: () => null,
};

export default Overlay

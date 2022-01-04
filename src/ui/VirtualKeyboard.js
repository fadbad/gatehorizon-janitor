import React from 'react'
import Div from './Div'
import Text from './Text'
import Icon from './Icon'
import { e2a, isRTL } from '../utils/src/functions'

const Cell = ({symbol, onPress, color}) => (
	<Div f={1} center onPress={() => onPress(symbol.toString())} key={symbol}>
		<Text center size={24} lh={24} color={color}>
			{isRTL ? e2a(symbol || '0') : symbol}
		</Text>
	</Div>
)

const Row = ({ nums, onPress, color }) => {
	const cells = nums.map((val) => <Cell key={val} symbol={val} onPress={onPress} color={color} />);
	return (
		<Div row mt={16}>
			{cells}
		</Div>
	);
}

export default ({ 
	color = 'grey', 
	onPress = () => null, 
	decimal = false,
	style
}) => {
	const [text, setText] = React.useState('')

	const onLocalPress = val => {
		let curText = text;
		if (isNaN(val)) {
			if (val === 'back') {
				curText = curText.slice(0, -1);
			} else {
				curText += val;
			}
		} else {
			curText += val;
		}

		setText(curText)
		onPress && onPress(curText)
	}

	return (
		<Div style={style}>
			<Row nums={[1, 2, 3]} onPress={onLocalPress} color={color} />
			<Row nums={[4, 5, 6]} onPress={onLocalPress} color={color} />
			<Row nums={[7, 8, 9]} onPress={onLocalPress} color={color} />

			<Div row mt={16}>
				{decimal ? (
					<Cell symbol={'.'} onPress={onLocalPress} color={color} />
				) : (
					<Div f={1} />
				)}

				<Cell symbol={0} onPress={onLocalPress} color={color} />
				
				<Div onPress={() => onLocalPress('back')} f={1} center>
					<Icon name={'backspace'} size={24} color={color} />
				</Div>
			</Div>
		</Div>
	)
}

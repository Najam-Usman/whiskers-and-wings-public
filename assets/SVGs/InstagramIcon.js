import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

export function InstagramIcon(props) {

	const {color} = props

	return (
	<Svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" {...props}>
		<Circle cx={17} cy={7} r={1.5} fill={color}></Circle>
		<G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
			<Path d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"></Path>
			<Path d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"></Path>
		</G>
	</Svg>);
}
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function BackIcon(props) {

    const {width = 45, height = 45} = props

	return (
    
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 72 72" {...props}>
            <Path 
                fill="none" 
                stroke="#30200e" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeMiterlimit={10} 
                strokeWidth={8} 
                d="m46.196 16.205l-19.392 19.46l19.392 19.46">
            </Path>
        </Svg>
        
    );
}
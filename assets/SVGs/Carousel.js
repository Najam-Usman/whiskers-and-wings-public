import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Carousel(props) {

    const {width = 28, height = 28,} = props

	return (
    
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
            <Path 
                fill={"#341408"} 
                d="M16 3H8c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2M2 7v10c0 1.103.897 2 2 2V5c-1.103 0-2 .897-2 2m18-2v14c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2"/>
        </Svg>
        
    );
}
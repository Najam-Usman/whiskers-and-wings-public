import React from 'react';
import { Path, Svg } from 'react-native-svg';

export function ReportIcon(props) {

    const {color = 'white', width = 35, height = 35} = props;

	return (

    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" {...props}>

        <Path 
        fill={color}
        d="M13 17.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25-8.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0z">
        </Path>
        
        <Path 
        fill={color}
        d="M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752Zm3.03.751a1.002 1.002 0 0 0-1.732 0L2.168 19.499A1.002 1.002 0 0 0 3.034 21h17.932a1.002 1.002 0 0 0 .866-1.5L12.866 3.994Z">
        </Path>
    
    </Svg>);


}
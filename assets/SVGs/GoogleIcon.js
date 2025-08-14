import * as React from "react"
import Svg, { Path } from "react-native-svg"
const GoogleIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    viewBox="0 0 32 32"
    {...props}
  >
    <Path
      fill="#00ac47"
      d="M23.75 16a7.745 7.745 0 0 1-15.032 2.626l-4.433 3.546A13.244 13.244 0 0 0 29.25 16"
    />
    <Path
      fill="#4285f4"
      d="M23.75 16a7.739 7.739 0 0 1-3.252 6.299l4.383 3.506A13.204 13.204 0 0 0 29.25 16"
    />
    <Path
      fill="#ffba00"
      d="M8.25 16a7.698 7.698 0 0 1 .468-2.626L4.285 9.828a13.177 13.177 0 0 0 0 12.344l4.433-3.546A7.698 7.698 0 0 1 8.25 16Z"
    />
    <Path fill="#2ab2db" d="M8.718 13.374z" />
    <Path
      fill="#ea4435"
      d="M16 8.25a7.699 7.699 0 0 1 4.558 1.496l4.06-3.79A13.215 13.215 0 0 0 4.285 9.828l4.433 3.546A7.756 7.756 0 0 1 16 8.25Z"
    />
    <Path fill="#2ab2db" d="M8.718 18.626z" />
    <Path fill="#4285f4" d="M29.25 15v1L27 19.5H16.5V14h11.75a1 1 0 0 1 1 1Z" />
  </Svg>
)
export default GoogleIcon

import { Cloudinary } from "@cloudinary/url-gen";
import {CLOUD_NAME} from '@env'


// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
    cloud: {
        cloudName: CLOUD_NAME
    },
    url : {
        secure: true
    },
});

export default cld;
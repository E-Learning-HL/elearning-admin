import { Image } from 'antd';
import { PREFIX_IMAGE_URL } from '../../const/const';
import { useState } from 'react';
import defaultImage from '../../assets/image/default-thumbnail.jpg';

export default function ImageCommon({ data, className }) {
  const [image, setImage] = useState(data);
  return (
    <Image
      src={image ? `${PREFIX_IMAGE_URL}${image.key}` : defaultImage}
      className={className}
      onError={() => {
        setImage(null);
      }}
      alt={image?.key}
    />
  );
}

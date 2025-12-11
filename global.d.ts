// src/types/react-native-vector-icons.d.ts
declare module 'react-native-vector-icons/*' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  type IconProps = TextProps & {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  };

  const Icon: ComponentType<IconProps>;
  export default Icon;
}


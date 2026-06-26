import { Image, type ImageStyle, type StyleProp } from 'react-native';

// Riri's poses — the brand's illustration system (copied from the web app).
const POSES = {
  'cockatiel-superhero': require('../assets/mascot/cockatiel-superhero.png'),
  celebrate: require('../assets/mascot/mascot-celebrate.png'),
  fly: require('../assets/mascot/mascot-fly.png'),
  hello: require('../assets/mascot/mascot-hello.png'),
  laptop: require('../assets/mascot/mascot-laptop.png'),
  ohno: require('../assets/mascot/mascot-ohno.png'),
  point: require('../assets/mascot/mascot-point.png'),
  read: require('../assets/mascot/mascot-read.png'),
  'sad-sit': require('../assets/mascot/mascot-sad-sit.png'),
  sad: require('../assets/mascot/mascot-sad.png'),
  thumbsup: require('../assets/mascot/mascot-thumbsup.png'),
  wave: require('../assets/mascot/mascot-wave.png'),
} as const;

export type MascotPose = keyof typeof POSES;

export function Mascot({
  pose = 'thumbsup',
  size = 120,
  style,
}: {
  pose?: MascotPose;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={POSES[pose]}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
    />
  );
}

import {
    faArrowLeft,
    faArrowRight,
    faBolt,
    faBookOpen,
    faCheck,
    faCircle,
    faFaceFrown,
    faFileAudio,
    faFileLines,
    faFlag,
    faFolderOpen,
    faHeadphones,
    faHouse,
    faMagnifyingGlass,
    faMicrophone,
    faPause,
    faPencil,
    faPhone,
    faPlay,
    faRightFromBracket,
    faRotateLeft,
    faShieldHalved,
    faStop,
    faTrash,
    faTriangleExclamation,
    faUser,
    faVideo,
    faWaveSquare,
    type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const ICONS = {
  arrowRight: faArrowRight,
  bolt: faBolt,
  arrowLeft: faArrowLeft,
  bookOpen: faBookOpen,
  check: faCheck,
  circle: faCircle,
  faceFrown: faFaceFrown,
  fileAudio: faFileAudio,
  fileLines: faFileLines,
  flag: faFlag,
  folderOpen: faFolderOpen,
  house: faHouse,
  magnifyingGlass: faMagnifyingGlass,
  microphone: faMicrophone,
  headphones: faHeadphones,
  pause: faPause,
  pencil: faPencil,
  play: faPlay,
  phone: faPhone,
  rotateLeft: faRotateLeft,
  rightFromBracket: faRightFromBracket,
  shieldHalved: faShieldHalved,
  stop: faStop,
  trash: faTrash,
  triangleExclamation: faTriangleExclamation,
  user: faUser,
  video: faVideo,
  waveSquare: faWaveSquare,
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 18,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <FontAwesomeIcon icon={ICONS[name]} size={size} color={color} />;
}

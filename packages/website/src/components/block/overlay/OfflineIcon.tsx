import { useEffect, useState } from "react";
import {
  MdSignalWifiConnectedNoInternet1,
  MdSignalWifiConnectedNoInternet2,
  MdSignalWifiConnectedNoInternet3,
  MdSignalWifiConnectedNoInternet4,
} from "react-icons/md";

const icons = [
  MdSignalWifiConnectedNoInternet1,
  MdSignalWifiConnectedNoInternet2,
  MdSignalWifiConnectedNoInternet3,
  MdSignalWifiConnectedNoInternet4,
];

function OfflineIcon() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((index) => (index + 1) % icons.length);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const Icon = icons[index];

  return <Icon />;
}

export default OfflineIcon;

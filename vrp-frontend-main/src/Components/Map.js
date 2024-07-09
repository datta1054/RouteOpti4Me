import React, { useMemo } from "react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  // Circle,
  // MarkerClusterer
} from "@react-google-maps/api";
import locs from "../Output/locs";
import result from "../Output/result";

import { useSelector } from "react-redux";

const Map = (props) => {
  const solutionData = useSelector((state) => state.solution.solutionData);
  const { selectedRoute, mapRoutes } = useSelector((state) => state.routes);
  let locationData = useSelector((state) => state.nodes.nodes);
  locationData = locationData.filter((loc) => loc.node !== result[0].depotNode);

  const containerStyle = {
    width: "100%",
    height: "700px",
  };
  const center = {
    lat: solutionData?.nodeData[solutionData.depotNode - 1].latitude,
    lng: solutionData?.nodeData[solutionData.depotNode - 1].longitude,
  };

  const options = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );
  const image = process.env.PUBLIC_URL + "/warehouse.png";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
  });
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      options={options}
      zoom={14}
    >
      <MarkerF position={center} icon={image} />

      {solutionData?.nodeData.map((loc, index) =>
        index !== 0 ? (
          <MarkerF
            key={index}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            label={loc.node.toString()}
          />
        ) : null
      )}

      {mapRoutes.map((route, index) => (
        <DirectionsRenderer
          directions={selectedRoute === null ? route.dir : selectedRoute.dir}
          options={{
            polylineOptions: {
              strokeColor:
                selectedRoute === null ? route.clr : selectedRoute.clr,
            },
            suppressMarkers: true,
          }}
          key={index}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;

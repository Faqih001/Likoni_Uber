import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

// Map component to display the map with markers and directions to the destination
const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

// The map component uses the react-native-maps library to display the map
const Map = () => {
  // It fetches the driver data from the API and generates markers for each driver
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  // Driver data is fetched from the API and stored in the driver store using the useDriverStore hook
  const { selectedDriver, setDrivers } = useDriverStore();

  // The useFetch hook is used to fetch the driver data from the API
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  // The markers state is used to store the generated markers for each driver
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // The useEffect hook is used to generate the markers from the driver data
  useEffect(() => {
    // If the driver data is an array, generate the markers from the data
    if (Array.isArray(drivers)) {
      // If the user's location is not available, return early
      if (!userLatitude || !userLongitude) return;

      // Generate the markers from the driver data
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      // Set the markers state with the generated markers
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  // The useEffect hook is used to calculate the driver times to the destination
  useEffect(() => {
    // If the markers and destination coordinates are available, calculate the driver times
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      // Calculate the driver times to the destination
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  // The calculateRegion function is used to calculate the region for the map
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  // If the data is loading or the user's location is not available, display a loading indicator
  if (loading || (!userLatitude && !userLongitude))
    // Return the loading indicator component
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  // If there is an error fetching the data, display the error message
  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  // Return the map component with the specified props
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker, index) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === +marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;

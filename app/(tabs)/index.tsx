import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function Index() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
        setLoading(false);
        return;
      }

      // Atualiza posição em tempo real
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setLocation(coords);

          setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );

      setLoading(false);
    })();
  }, []);

  if (loading || !region || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <MapView style={styles.map} region={region}>
      {/* Marcador do usuário com ícone personalizado */}
      <Marker coordinate={location}>
        <Image
          source={require("../assets/personagem.png")} // coloque seu ícone em app/assets/
          style={{ width: 40, height: 40 }}
        />
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

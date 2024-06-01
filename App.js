import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = 'f6f15412'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Filme não encontrado', 'Tem certeza de que esse é o nome do filme? Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Biblioteca de filmes</Text>
      
      <TextInput
        style={styles.input}
        placeholder="O que está procurando hoje?"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      
      <Button title="Buscar Filme" onPress={handleSearch} />
      
      {movieData && (
        <View style={styles.movieContainer}>
          {movieData.Poster !== 'N/A' && (
            <Image
              source={{ uri: movieData.Poster }}
              style={styles.moviePoster}
            />
          )}
          <Text style={styles.movieTitle}>{movieData.Title}</Text>
          <Text style={styles.movieInfo}>Ano: {movieData.Year}</Text>
          <Text style={styles.movieInfo}>Gênero: {movieData.Genre}</Text>
          <Text style={styles.movieInfo}>Diretor: {movieData.Director}</Text>
          <Text style={styles.movieInfo}>Prêmios: {movieData.Awards}</Text>
        </View>
      )}

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 8,
    width: '100%',
  },
  locationContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
 movieContainer: {
  margin: 20,
  backgroundColor: '#D4F1F4',
  padding: 20,
  borderRadius: 10,
},
  moviePoster: {
    width: 200,
    height: 300,
    marginBottom: 10,
    alignSelf: 'center'
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  movieInfo: {
    textAlign: 'left',
    width: '100%',
    marginLeft: 20,
    marginRight: 20
  },
});

export default App;

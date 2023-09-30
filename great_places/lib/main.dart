import 'package:flutter/material.dart';
import 'package:great_places/providers/great_places.dart';
import 'package:great_places/screens/add_place.dart';
import 'package:great_places/screens/place_detail.dart';
import 'package:great_places/screens/places_list.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => GreatPlaces(),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Great Places',
        theme: ThemeData(
          primarySwatch: Colors.indigo,
          primaryIconTheme: const IconThemeData(color: Colors.amber),
          // useMaterial3: true,
        ),
        home: const PlacesListScreen(),
        routes: {
          AddPlaceScreen.routeName: (context) => const AddPlaceScreen(),
          PlaceDetailScreen.routeName: (context) => const PlaceDetailScreen(),
        },
      ),
    );
  }
}

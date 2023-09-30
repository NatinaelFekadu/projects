import 'package:flutter/material.dart';
import 'package:great_places/providers/great_places.dart';
import 'package:great_places/screens/add_place.dart';
import 'package:great_places/screens/place_detail.dart';
import 'package:provider/provider.dart';

class PlacesListScreen extends StatelessWidget {
  const PlacesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Places'),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.of(context).pushNamed(AddPlaceScreen.routeName);
            },
            icon: const Icon(Icons.add),
          )
        ],
      ),
      body: FutureBuilder(
        future: Provider.of<GreatPlaces>(context, listen: false)
            .fetchAndSetPlaces(),
        builder: (context, snapshot) => snapshot.connectionState ==
                ConnectionState.waiting
            ? const Center(child: CircularProgressIndicator())
            : Consumer<GreatPlaces>(
                child: const Center(
                  child: Text('Got no places yet, start adding some.'),
                ),
                builder: (context, greatPlaces, child) => greatPlaces
                        .items.isEmpty
                    ? child!
                    : ListView.builder(
                        itemBuilder: (context, index) => ListTile(
                          leading: CircleAvatar(
                            backgroundImage:
                                FileImage(greatPlaces.items[index].image),
                          ),
                          title: Text(greatPlaces.items[index].title),
                          subtitle:
                              Text(greatPlaces.items[index].location!.address!),
                          onTap: () {
                            Navigator.of(context).pushNamed(
                                PlaceDetailScreen.routeName,
                                arguments: greatPlaces.items[index].id);
                          },
                        ),
                        itemCount: greatPlaces.items.length,
                      ),
              ),
      ),
    );
  }
}

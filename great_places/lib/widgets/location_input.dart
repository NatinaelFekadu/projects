import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:great_places/helpers/location_helper.dart';
import 'package:great_places/screens/map.dart';
import 'package:location/location.dart';

class LocationInput extends StatefulWidget {
  final Function onSelectPlace;
  const LocationInput(this.onSelectPlace, {super.key});

  @override
  State<LocationInput> createState() => _LocationInputState();
}

class _LocationInputState extends State<LocationInput> {
  var _isLoading = false;

  void _showPreview(double lat, double lng) {
    final staticMapImageUrl =
        LocationHelper.showPreviewImage(latitude: lat, longitude: lng);
    setState(() {
      _previewImageUrl = staticMapImageUrl;
    });
  }

  Future<void> _getCurrentUserLocation() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final locationData = await Location().getLocation();
      _showPreview(locationData.latitude!, locationData.longitude!);
      widget.onSelectPlace(locationData.latitude, locationData.longitude);
    } catch (error) {
      return;
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _selectOnMap() async {
    final selectedLocation =
        await Navigator.of(context).push<LatLng>(MaterialPageRoute(
      fullscreenDialog: true,
      builder: (context) => const MapScreen(
        isSelecting: true,
      ),
    ));
    if (selectedLocation == null) {
      return;
    }
    _showPreview(selectedLocation.latitude, selectedLocation.longitude);
    widget.onSelectPlace(selectedLocation.latitude, selectedLocation.longitude);
  }

  String? _previewImageUrl;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
            height: 170,
            width: double.infinity,
            decoration:
                BoxDecoration(border: Border.all(width: 1, color: Colors.grey)),
            alignment: Alignment.center,
            child: _previewImageUrl != null
                ? Image.network(
                    _previewImageUrl!,
                    fit: BoxFit.cover,
                    width: double.infinity,
                  )
                : _isLoading
                    ? const CircularProgressIndicator()
                    : const Text(
                        'No Location Chosen',
                        textAlign: TextAlign.center,
                      )),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextButton.icon(
              onPressed: _getCurrentUserLocation,
              icon: const Icon(Icons.location_on),
              label: const Text('Current location'),
              style: TextButton.styleFrom(
                  foregroundColor: Theme.of(context).primaryColor),
            ),
            TextButton.icon(
              onPressed: _selectOnMap,
              icon: const Icon(Icons.map),
              label: const Text('Select on Map'),
              style: TextButton.styleFrom(
                  foregroundColor: Theme.of(context).primaryColor),
            ),
          ],
        )
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:meals_app/widgets/main_drawer.dart';

class FilterScreen extends StatefulWidget {
  static const routeName = '/filters';

  final Function saveFilter;
  final Map<String, bool> currentFilters;
  const FilterScreen(this.currentFilters, this.saveFilter, {super.key});

  @override
  State<FilterScreen> createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen> {
  var _isGlutenFree = false;
  var _isVegan = false;
  var _isVegetarian = false;
  var _isLactoseFree = false;

  @override
  void initState() {
    _isGlutenFree = widget.currentFilters['gluten']!;
    _isLactoseFree = widget.currentFilters['lactose']!;
    _isVegan = widget.currentFilters['vegan']!;
    _isVegetarian = widget.currentFilters['vegetarian']!;
    super.initState();
  }

  Widget buildSwitchListTile(
      String title, String description, bool value, switchHandler) {
    return SwitchListTile(
        title: Text(title),
        subtitle: Text(description),
        value: value,
        onChanged: switchHandler);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Filters'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: () {
              final selectedFilters = {
                'gluten': _isGlutenFree,
                'lactose': _isLactoseFree,
                'vegan': _isVegan,
                'vegetarian': _isVegetarian,
              };
              // print(selectedFilters);
              widget.saveFilter(selectedFilters);
            },
          ),
        ],
      ),
      drawer: const MainDrawer(),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
              'Adjust Your Meal Selection',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
          Expanded(
            child: ListView(
              children: [
                buildSwitchListTile(
                  'Gluten-Free',
                  'Only include gluten-free meals',
                  _isGlutenFree,
                  (newValue) {
                    setState(() {
                      _isGlutenFree = newValue;
                    });
                  },
                ),
                buildSwitchListTile(
                  'Lactose-Free',
                  'Only include lactose-free meals',
                  _isLactoseFree,
                  (newValue) {
                    setState(() {
                      _isLactoseFree = newValue;
                    });
                  },
                ),
                buildSwitchListTile(
                  'Vegan',
                  'Only include vegan meals',
                  _isVegan,
                  (newValue) {
                    setState(() {
                      _isVegan = newValue;
                    });
                  },
                ),
                buildSwitchListTile(
                  'Vegetarian',
                  'Only include vegetarian meals',
                  _isVegetarian,
                  (newValue) {
                    setState(() {
                      _isVegetarian = newValue;
                    });
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

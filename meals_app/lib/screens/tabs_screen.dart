import 'package:flutter/material.dart';

import 'package:meals_app/models/meal.dart';
import 'package:meals_app/screens/catergories_screen.dart';
import 'package:meals_app/screens/favorites_screen.dart';
import 'package:meals_app/widgets/main_drawer.dart';

class TabsScreen extends StatefulWidget {
  final List<Meal> favoriteMeals;
  const TabsScreen(this.favoriteMeals, {super.key});

  @override
  State<TabsScreen> createState() => _TabsScreenState();
}

class _TabsScreenState extends State<TabsScreen> {
  // @override
  // Widget build(BuildContext context) {
  //   return DefaultTabController(
  //     length: 2,
  //     child: Scaffold(
  //       appBar: AppBar(
  //         title: const Text('Meals'),
  //         bottom: const TabBar(tabs: [
  //           Tab(
  //             icon: Icon(Icons.category),
  //             text: 'Categories',
  //           ),
  //           Tab(
  //             icon: Icon(Icons.star),
  //             text: 'Favorites',
  //           )
  //         ]),
  //       ),
  //       body: const TabBarView(children: [
  //         CategoriesScreen(),
  //         Favorites()
  //       ],),
  //     ),
  //   );
  // }
  List<Map<String, Object>> _pages = [];

  @override
  void initState() {
    _pages = [
      const {'page': CategoriesScreen(), 'title': 'Categories'},
      {
        'page': FavoritesScreen(widget.favoriteMeals),
        'title': 'Your Favorites'
      },
    ];
    super.initState();
  }

  int _selectedPageIndex = 0;

  void _selectPage(int index) {
    setState(() {
      _selectedPageIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_pages[_selectedPageIndex]['title'] as String),
      ),
      drawer: const MainDrawer(),
      body: _pages[_selectedPageIndex]['page'] as Widget,
      bottomNavigationBar: BottomNavigationBar(
        onTap: _selectPage,
        unselectedItemColor: Colors.white,
        selectedItemColor: Colors.amber,
        currentIndex: _selectedPageIndex,
        backgroundColor: Theme.of(context).primaryColor,
        // type: BottomNavigationBarType.shifting,
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.category), label: 'Categories'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Favorites'),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';

import 'package:meals_app/models/meal.dart';
import 'package:meals_app/widgets/meal_item.dart';

class CategoryMealsScreen extends StatefulWidget {
  static const routeName = '/category-meals';
  final List<Meal> availableMeals;
  // final String categoryId;
  // final String categoryTitle;
  const CategoryMealsScreen(this.availableMeals, {super.key});

  @override
  State<CategoryMealsScreen> createState() => _CategoryMealsScreenState();
}

class _CategoryMealsScreenState extends State<CategoryMealsScreen> {
  List<Meal> categoryMeals = [];
  String categoryTitle = '';
  bool _isLoadedInitData = false;
  void _removeMealHandler(String mealId) {
    setState(() {
      categoryMeals.removeWhere((meal) => meal.id == mealId);
    });
  }

  @override
  void didChangeDependencies() {
    if (!_isLoadedInitData) {
      final routeArgs =
          ModalRoute.of(context)?.settings.arguments as Map<String, String>;
      categoryTitle = routeArgs['title'] as String;
      categoryMeals = widget.availableMeals
          .where(
            (meal) => meal.categories.contains(
              routeArgs['id'],
            ),
          )
          .toList();
    }
    _isLoadedInitData = true;
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(categoryTitle),
      ),
      body: ListView.builder(
        itemBuilder: (ctx, index) {
          return MealItem(
            id: categoryMeals[index].id,
            title: categoryMeals[index].title,
            imageUrl: categoryMeals[index].imageUrl,
            duration: categoryMeals[index].duration,
            complexity: categoryMeals[index].complexity,
            affordability: categoryMeals[index].affordability,
            // removeItem: _removeMealHandler,
          );
        },
        itemCount: categoryMeals.length,
      ),
    );
  }
}

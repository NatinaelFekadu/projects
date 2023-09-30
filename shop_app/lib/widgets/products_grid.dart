import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shop_app/providers/products.dart';

import 'package:shop_app/widgets/product_item.dart';

class ProductsGrid extends StatelessWidget {
  final bool showFavorites;
  const ProductsGrid(this.showFavorites, {super.key});

  @override
  Widget build(BuildContext context) {
    final productsData = Provider.of<Products>(context);
    final loadedProducts =
        showFavorites ? productsData.filterFavorites : productsData.items;
    return GridView.builder(
      padding: const EdgeInsets.all(10),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1.5,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10),
      itemBuilder: (ctx, index) => ChangeNotifierProvider.value(
        value: loadedProducts[index],
        child: const ProductItem(
            // loadedProducts[index].id,
            // loadedProducts[index].title,
            // loadedProducts[index].imageUrl,
            ),
      ),
      itemCount: loadedProducts.length,
    );
  }
}

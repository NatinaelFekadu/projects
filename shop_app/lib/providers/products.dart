import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shop_app/models/http_exception.dart';

import 'package:shop_app/providers/product.dart';

class Products with ChangeNotifier {
  List<Product> _items = [
    // Product(
    //     id: 'p1',
    //     title: 'Red Shirt',
    //     description: 'A red shirt - it is pretty red!',
    //     price: 29.99,
    //     imageUrl:
    //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzOnIhvgPSRGEwOQt0Wzrb2-JFzzF-WRCWpBEB3m3rWA&s'),
    // Product(
    //     id: 'p2',
    //     title: 'Trousers',
    //     description: 'A nice pair of trousers.',
    //     price: 59.99,
    //     imageUrl:
    //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXgc2kPmLSBIIcIEEe0by_l_T6K4hanily0g&usqp=CAU'),
    // Product(
    //     id: 'p3',
    //     title: 'Yellow Scart',
    //     description: 'Warm and cozy - exactly what you need for Winter.',
    //     price: 19.99,
    //     imageUrl:
    //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxOL4CBP_vlgqGFNybhmbNDHTLvqdFOp6PsMY9JpYTK0isgeo955VE1vLQTyXvNQMLc_4&usqp=CAU'),
    // Product(
    //     id: 'p4',
    //     title: 'A Pan',
    //     description: 'Prepare any meal you want.',
    //     price: 43.99,
    //     imageUrl:
    //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYaLJj4pz-5Z2lFyr4djEaXczcpEaRkOFCSVNseuVAl_q3sTWm0ykssK6HFQ6t0MiaGaw&usqp=CAU'),
  ];

  final String token;
  final String userId;

  Products(this.token, this._items, this.userId);

  List<Product> get items {
    return [..._items];
  }

  Product findById(String id) {
    return _items.firstWhere((product) => product.id == id);
  }

  List<Product> get filterFavorites {
    return _items.where((product) => product.isFavorite).toList();
  }

  Future<void> addProduct(Product product) async {
    final url = Uri.https('flutter-5275a-default-rtdb.firebaseio.com',
        '/products.json', {'auth': token});
    try {
      final response = await http.post(url,
          body: json.encode({
            'title': product.title,
            'price': product.price,
            'description': product.description,
            'isFavorite': product.isFavorite,
            'imageUrl': product.imageUrl,
            'creatorId': userId,
          }));
      final newProduct = Product(
        id: json.decode(response.body)['name'],
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
      );
      _items.add(newProduct);
      notifyListeners();
    } catch (error) {
      rethrow;
    }
  }

  Future<void> fetchAndSetProducts([bool filterByUserId = false]) async {
    final filterMap = filterByUserId
        ? {'auth': token, 'orderBy': '"creatorId"', 'equalTo': '"$userId"'}
        : {'auth': token};
    var url = Uri.https(
      'flutter-5275a-default-rtdb.firebaseio.com',
      '/products.json',
      filterMap,
    );
    try {
      final response = await http.get(url);
      if (json.decode(response.body) == null) {
        return;
      }
      url = Uri.https('flutter-5275a-default-rtdb.firebaseio.com',
          '/UserFavorites/$userId.json', {'auth': token});
      final favResponse = await http.get(url);
      final favData = json.decode(favResponse.body);

      final extractedData = json.decode(response.body) as Map<String, dynamic>;
      final List<Product> loadedProducts = [];
      extractedData.forEach((prodId, prodData) {
        loadedProducts.add(Product(
          id: prodId,
          title: prodData['title'],
          description: prodData['description'],
          price: prodData['price'],
          imageUrl: prodData['imageUrl'],
          isFavorite: favData == null ? false : favData[prodId] ?? false,
        ));
      });
      _items = loadedProducts;
      notifyListeners();
    } catch (error) {
      rethrow;
    }
  }

  Future<void> updateProduct(String id, Product product) async {
    final prodInd = _items.indexWhere((element) => element.id == id);
    final url = Uri.https('flutter-5275a-default-rtdb.firebaseio.com',
        '/products/$id.json', {'auth': token});
    await http.patch(url,
        body: json.encode({
          'title': product.title,
          'description': product.description,
          'price': product.price,
          'imageUrl': product.imageUrl,
        }));
    _items[prodInd] = product;
    notifyListeners();
  }

  Future<void> deleteProduct(String id) async {
    final url = Uri.https('flutter-5275a-default-rtdb.firebaseio.com',
        '/products/$id.json', {'auth': token});
    final existingProductIndex =
        _items.indexWhere((element) => element.id == id);
    Product? existingProduct = _items[existingProductIndex];
    _items.removeWhere((element) => element.id == id);
    notifyListeners();
    try {
      final response = await http.delete(url);
      if (response.statusCode >= 400) {
        throw HttpException('Couldn\'t delete the product');
      }
      existingProduct = null;
    } catch (error) {
      _items.insert(existingProductIndex, existingProduct!);
      notifyListeners();
      rethrow;
    }
  }
}

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:shop_app/providers/cart.dart';

class OrderItem {
  final String id;
  final double amount;
  final DateTime dateTime;
  final List<CartItem> cartProducts;

  OrderItem({
    required this.id,
    required this.amount,
    required this.dateTime,
    required this.cartProducts,
  });
}

class Orders with ChangeNotifier {
  List<OrderItem> _orders = [];
  String token = '';
  String userId;

  Orders(this.token, this._orders, this.userId);

  List<OrderItem> get orders {
    return [..._orders];
  }

  Future<void> fetchAndSetOrders() async {
    final url = Uri.https('flutter-5275a-default-rtdb.firebaseio.com',
        '/orders/$userId.json', {'auth': token});
    try {
      final response = await http.get(url);
      if (json.decode(response.body) == null) {
        return;
      }
      final extractedData = json.decode(response.body) as Map<String, dynamic>;
      final List<OrderItem> loadedOrders = [];
      extractedData.forEach((ordId, ordData) {
        loadedOrders.add(OrderItem(
          id: ordId,
          amount: ordData['amount'],
          dateTime: DateTime.parse(ordData['dateTime']),
          cartProducts: (ordData['cartProducts'] as List<dynamic>)
              .map(
                (item) => CartItem(
                  id: item['id'],
                  title: item['title'],
                  price: item['price'],
                  quantity: item['quantity'],
                ),
              )
              .toList(),
        ));
      });
      _orders = loadedOrders.reversed.toList();

      notifyListeners();
    } catch (error) {
      rethrow;
    }
  }

  Future<void> addOrder(List<CartItem> cartProducts, double amount) async {
    final url = Uri.https('flutter-5275a-default-rtdb.firebaseio.com',
        '/orders/$userId.json', {'auth': token});
    final timeStamp = DateTime.now();
    try {
      final response = await http.post(
        url,
        body: json.encode(
          {
            'amount': amount,
            'dateTime': timeStamp.toIso8601String(),
            'cartProducts': cartProducts
                .map((element) => {
                      'id': element.id,
                      'title': element.title,
                      'quantity': element.quantity,
                      'price': element.price,
                    })
                .toList()
          },
        ),
      );
      _orders.insert(
        0,
        OrderItem(
          id: json.decode(response.body)['name'],
          amount: amount,
          dateTime: DateTime.now(),
          cartProducts: cartProducts,
        ),
      );
    } catch (error) {
      rethrow;
    }
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shop_app/widgets/app_drawer.dart';

import 'package:shop_app/widgets/order_item.dart';
import 'package:shop_app/providers/order.dart' show Orders;

class OrdersScreen extends StatefulWidget {
  static const routeName = '/orders';
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  Future _ordersFuture = Future(() => null);
  // var _isLoading = false;
  // @override
  // void initState() {
  // _isLoading = true;

  // Provider.of<Orders>(context, listen: false).fetchAndSetOrders().then((_) {
  //   setState(() {
  //     _isLoading = false;
  //   });
  // }).catchError((error) {
  //   print(error);
  //   setState(() {
  //     _isLoading = false;
  //   });
  // });
  // super.initState();
  // }

  Future<void> _obtainOrdersFuture() {
    return Provider.of<Orders>(context, listen: false).fetchAndSetOrders();
  }

  @override
  void initState() {
    _ordersFuture = _obtainOrdersFuture();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // final ordersData = Provider.of<Orders>(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Orders'),
      ),
      drawer: const AppDrawer(),
      body: FutureBuilder(
        future: _ordersFuture,
        builder: (ctx, dataSnapshot) {
          if (dataSnapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else {
            if (dataSnapshot.error != null) {
              return const Center(
                child: Text('An error occurred'),
              );
            } else {
              return Consumer<Orders>(
                builder: (ctx, ordersData, child) => ListView.builder(
                  itemCount: ordersData.orders.length,
                  itemBuilder: (ctx, index) => OrderItem(
                    ordersData.orders[index],
                  ),
                ),
              );
            }
          }
        },
      ),
      // body: _isLoading
      //     ? const Center(child: CircularProgressIndicator())
      //     : ListView.builder(
      //         itemCount: ordersData.orders.length,
      //         itemBuilder: (ctx, index) => OrderItem(
      //           ordersData.orders[index],
      //         ),
      //       ),
    );
  }
}

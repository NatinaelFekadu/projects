import 'dart:math';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'package:shop_app/providers/order.dart' as ord;

class OrderItem extends StatefulWidget {
  final ord.OrderItem order;
  const OrderItem(this.order, {super.key});

  @override
  State<OrderItem> createState() => _OrderItemState();
}

class _OrderItemState extends State<OrderItem> {
  var _expandedMode = false;
  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      height: _expandedMode
          ? min(widget.order.cartProducts.length * 20 + 110, 200)
          : 95,
      child: Card(
        child: Column(
          children: [
            ListTile(
              title: Text('\$${widget.order.amount.toStringAsFixed(2)}'),
              subtitle: Text(
                DateFormat('dd/MM/yyyy hh:mm').format(widget.order.dateTime),
              ),
              trailing: IconButton(
                onPressed: () {
                  setState(() {
                    _expandedMode = !_expandedMode;
                  });
                },
                icon:
                    Icon(_expandedMode ? Icons.expand_less : Icons.expand_more),
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 4),
              height: _expandedMode
                  ? min(widget.order.cartProducts.length * 20 + 10, 100)
                  : 0,
              child: ListView(
                children: widget.order.cartProducts
                    .map(
                      (prod) => Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            prod.title,
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            '${prod.quantity}x \$${prod.price}',
                            style: const TextStyle(
                                fontSize: 18, color: Colors.grey),
                          )
                        ],
                      ),
                    )
                    .toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shop_app/providers/cart.dart';

class CartItem extends StatelessWidget {
  final String id;
  final String productId;
  final String title;
  final double price;
  final int quantity;
  const CartItem({
    required this.id,
    required this.productId,
    required this.title,
    required this.price,
    required this.quantity,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<Cart>(context, listen: false);
    return Dismissible(
      key: ValueKey(id),
      background: Container(
        color: Theme.of(context).colorScheme.error,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.all(20),
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 15),
        child: const Icon(
          Icons.delete,
          color: Colors.white,
          size: 40,
        ),
      ),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) {
        cart.removeItem(productId);
      },
      confirmDismiss: (direction) {
        return showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
                  title: const Text('Are you sure?'),
                  content: const Text(
                      'Do you want to remove the item from the cart?'),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.of(ctx).pop(false);
                      },
                      child: const Text('No'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.of(ctx).pop(true);
                      },
                      child: const Text('Yes'),
                    ),
                  ],
                ));
      },
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 15),
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: ListTile(
            leading: CircleAvatar(
              child: Padding(
                  padding: const EdgeInsets.all(5),
                  child: FittedBox(child: Text('\$$price'))),
            ),
            title: Text(title),
            subtitle: Text('Total: \$${(price * quantity).toStringAsFixed(2)}'),
            trailing: Text('$quantity x'),
          ),
        ),
      ),
    );
  }
}

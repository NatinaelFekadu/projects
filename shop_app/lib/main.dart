import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shop_app/providers/auth.dart';
import 'package:shop_app/providers/cart.dart';
import 'package:shop_app/providers/order.dart';
import 'package:shop_app/providers/products.dart';
import 'package:shop_app/screens/auth_screen.dart';
import 'package:shop_app/screens/cart.dart';
import 'package:shop_app/screens/edit_product.dart';
import 'package:shop_app/screens/orders.dart';
import 'package:shop_app/screens/product_detail.dart';
import 'package:shop_app/screens/products_overview.dart';
import 'package:shop_app/screens/splash.dart';
import 'package:shop_app/helpers/custom_route.dart';
// import 'package:shop_app/screens/products_overview.dart';
import 'package:shop_app/screens/user_products.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (ctx) => Auth(),
        ),
        ChangeNotifierProxyProvider<Auth, Products>(
          update: (ctx, auth, previousProducts) {
            if (auth.token != null) {
              return Products(
                auth.token!,
                previousProducts == null ? [] : previousProducts.items,
                auth.userId,
              );
            } else {
              return previousProducts ?? Products('', [], '');
            }
          },
          create: ((context) => Products('', [], '')),
        ),
        ChangeNotifierProvider(
          create: (ctx) => Cart(),
        ),
        ChangeNotifierProxyProvider<Auth, Orders>(
          update: (ctx, auth, previousOrders) => Orders(auth.token!,
              previousOrders == null ? [] : previousOrders.orders, auth.userId),
          create: (ctx) => Orders('', [], ''),
        ),
      ],
      child: Consumer<Auth>(
        builder: (context, auth, child) => MaterialApp(
          title: 'MyShop',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
              // useMaterial3: true,
              primarySwatch: Colors.purple,
              fontFamily: 'Lato',
              pageTransitionsTheme: PageTransitionsTheme(builders: {
                TargetPlatform.android: CustomPageTransitionBuilder(),
                TargetPlatform.iOS: CustomPageTransitionBuilder(),
              }),
              floatingActionButtonTheme: const FloatingActionButtonThemeData(
                backgroundColor: Colors.deepOrange,
              )
              // useMaterial3: true,
              ),
          home: auth.isAuth
              ? const ProductsOverviewScreen()
              : FutureBuilder(
                  future: auth.tryAutoLogin(),
                  builder: (context, snapshot) =>
                      snapshot.connectionState == ConnectionState.waiting
                          ? const SplashScreen()
                          : const AuthScreen(),
                ),
          routes: {
            ProductDetailScreen.routeName: (ctx) => const ProductDetailScreen(),
            CartScreen.routeName: (ctx) => const CartScreen(),
            OrdersScreen.routeName: (ctx) => const OrdersScreen(),
            UserProductsScreen.routeName: (ctx) => const UserProductsScreen(),
            EditProductScreen.routeName: (ctx) => const EditProductScreen(),
          },
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shop_app/providers/product.dart';
import 'package:shop_app/providers/products.dart';

class EditProductScreen extends StatefulWidget {
  static const routeName = '/edit-product';
  const EditProductScreen({super.key});

  @override
  State<EditProductScreen> createState() => _EditProductScreenState();
}

class _EditProductScreenState extends State<EditProductScreen> {
  final _priceFocusNode = FocusNode();
  final _desciptionFocuscNode = FocusNode();
  final _imageUrlController = TextEditingController();
  final _imageUrlFocuesNode = FocusNode();
  final _form = GlobalKey<FormState>();
  var _isInit = true;
  var _isLoading = false;
  var _editMode = false;
  var _initialValues = {
    'title': '',
    'description': '',
    'price': '',
    'imageUrl': '',
  };

  var _editedProduct = Product(
    id: '',
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
  );

  @override
  void initState() {
    _imageUrlFocuesNode.addListener(_updateImageUrl);
    super.initState();
  }

  void _updateImageUrl() {
    if (!_imageUrlFocuesNode.hasFocus) {
      if ((!_imageUrlController.text.startsWith('http') &&
              !_imageUrlController.text.startsWith('https')) ||
          (!_imageUrlController.text.endsWith('.jpg') &&
              !_imageUrlController.text.endsWith('.png') &&
              !_imageUrlController.text.endsWith('.jpeg'))) {
        return;
      }
      setState(() {});
    }
  }

  @override
  void didChangeDependencies() {
    if (_isInit) {
      final id = ModalRoute.of(context)!.settings.arguments;
      if (id != null) {
        final productId = id as String;
        _editedProduct =
            Provider.of<Products>(context, listen: false).findById(productId);
        _editMode = true;
        super.didChangeDependencies();
        _initialValues = {
          'title': _editedProduct.title,
          'price': _editedProduct.price.toString(),
          'description': _editedProduct.description,
          'imageUrl': '',
        };
        _imageUrlController.text = _editedProduct.imageUrl;
      }
    }
    _isInit = false;
  }

  void _saveForm() async {
    setState(() {
      _isLoading = true;
    });
    final isValid = _form.currentState!.validate();
    if (!isValid) {
      return;
    }
    _form.currentState!.save();
    if (_editedProduct.id != '') {
      await Provider.of<Products>(context, listen: false)
          .updateProduct(_editedProduct.id, _editedProduct);
    } else {
      try {
        await Provider.of<Products>(context, listen: false)
            .addProduct(_editedProduct);
      } catch (error) {
        if (context.mounted) {
          await showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Text('An error occurred'),
              content: const Text('something went wrong'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                  },
                  child: const Text('Okay'),
                ),
              ],
            ),
          );
        }
      }
      // finally {
      //   setState(() {
      //     _isLoading = false;
      //   });
      //   if (context.mounted) {
      //     Navigator.of(context).pop();
      //   }
      // }
    }
    setState(() {
      _isLoading = false;
    });
    if (context.mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_editMode ? 'Edit Product' : 'Add Product'),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _form,
                child: ListView(
                  children: [
                    TextFormField(
                      initialValue: _initialValues['title'],
                      decoration: const InputDecoration(labelText: 'Title'),
                      textInputAction: TextInputAction.next,
                      onFieldSubmitted: (_) {
                        FocusScope.of(context).requestFocus(_priceFocusNode);
                      },
                      onSaved: (value) {
                        _editedProduct = Product(
                          id: _editedProduct.id,
                          isFavorite: _editedProduct.isFavorite,
                          title: value!,
                          description: _editedProduct.description,
                          price: _editedProduct.price,
                          imageUrl: _editedProduct.imageUrl,
                        );
                      },
                      validator: (value) {
                        if (value!.isEmpty) {
                          return 'Field required!';
                        }
                        return null;
                      },
                    ),
                    TextFormField(
                      initialValue: _initialValues['price'],
                      decoration: const InputDecoration(labelText: 'Price'),
                      textInputAction: TextInputAction.next,
                      keyboardType: TextInputType.number,
                      focusNode: _priceFocusNode,
                      onFieldSubmitted: (_) {
                        FocusScope.of(context)
                            .requestFocus(_desciptionFocuscNode);
                      },
                      onSaved: (value) {
                        _editedProduct = Product(
                          id: _editedProduct.id,
                          isFavorite: _editedProduct.isFavorite,
                          title: _editedProduct.title,
                          description: _editedProduct.description,
                          price: double.parse(value!),
                          imageUrl: _editedProduct.imageUrl,
                        );
                      },
                      validator: (value) {
                        if (value!.isEmpty) {
                          return 'Field required!';
                        }
                        if (double.tryParse(value) == null) {
                          return 'Please enter a vaild number';
                        }
                        if (double.parse(value) <= 0) {
                          return 'Price must be greater than 0';
                        }
                        return null;
                      },
                    ),
                    TextFormField(
                      initialValue: _initialValues['description'],
                      maxLines: 3,
                      decoration:
                          const InputDecoration(labelText: 'Description'),
                      keyboardType: TextInputType.multiline,
                      focusNode: _desciptionFocuscNode,
                      onSaved: (value) {
                        _editedProduct = Product(
                          id: _editedProduct.id,
                          isFavorite: _editedProduct.isFavorite,
                          title: _editedProduct.title,
                          description: value!,
                          price: _editedProduct.price,
                          imageUrl: _editedProduct.imageUrl,
                        );
                      },
                      validator: (value) {
                        if (value!.isEmpty) {
                          return 'Field required!';
                        }
                        if (value.length < 10) {
                          return 'Should be at least 10 characters long';
                        }
                        return null;
                      },
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          width: 100,
                          height: 100,
                          margin: const EdgeInsets.only(top: 12, right: 10),
                          decoration: BoxDecoration(
                            border: Border.all(
                              width: 1,
                              color: Colors.grey,
                            ),
                          ),
                          child: _imageUrlController.text.isEmpty
                              ? const Text('Enter a URL')
                              : FittedBox(
                                  child: Image.network(
                                  _imageUrlController.text,
                                  fit: BoxFit.cover,
                                )),
                        ),
                        Expanded(
                          child: TextFormField(
                            decoration:
                                const InputDecoration(labelText: 'Image URL'),
                            controller: _imageUrlController,
                            textInputAction: TextInputAction.done,
                            onFieldSubmitted: (_) {
                              _saveForm();
                            },
                            focusNode: _imageUrlFocuesNode,
                            onSaved: (value) {
                              _editedProduct = Product(
                                id: _editedProduct.id,
                                isFavorite: _editedProduct.isFavorite,
                                title: _editedProduct.title,
                                description: _editedProduct.description,
                                price: _editedProduct.price,
                                imageUrl: value!,
                              );
                            },
                            validator: (value) {
                              if (value!.isEmpty) {
                                return 'Field required!';
                              }
                              if (!value.startsWith('http') &&
                                  !value.startsWith('https')) {
                                return 'Please enter a valid URL';
                              }
                              if (!value.endsWith('.jpg') &&
                                  !value.endsWith('.png') &&
                                  !value.endsWith('.jpeg')) {
                                return 'Please enter a valid image URL';
                              }
                              return null;
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 60,
                    ),
                    ElevatedButton(
                      onPressed: _saveForm,
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor),
                      child: const Text('Submit'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  @override
  void dispose() {
    _priceFocusNode.dispose();
    _desciptionFocuscNode.dispose();
    _imageUrlFocuesNode.removeListener(_updateImageUrl);
    super.dispose();
  }
}

import 'package:chat_app/widgets/chat/messages.dart';
import 'package:chat_app/widgets/chat/new_message.dart';
// import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Chats'),
        actions: [
          DropdownButton(
            items: [
              DropdownMenuItem(
                value: 'logout',
                child: Container(
                  child: const Row(
                    children: [
                      Icon(
                        Icons.exit_to_app,
                        color: Colors.black,
                      ),
                      SizedBox(
                        width: 8,
                      ),
                      Text('Logout')
                    ],
                  ),
                ),
              ),
            ],
            onChanged: (value) {
              if (value == 'logout') {
                FirebaseAuth.instance.signOut();
              }
            },
            icon: Icon(
              Icons.more_vert,
              color: Theme.of(context).primaryIconTheme.color,
            ),
          )
        ],
      ),
      body: Container(
        child: const Column(
          children: [
            Expanded(
              child: Messages(),
            ),
            NewMessage(),
          ],
        ),
      ),
    );
  }
}

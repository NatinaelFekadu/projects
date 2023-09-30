import 'package:chat_app/widgets/chat/message_bubble.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
// import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

class Messages extends StatelessWidget {
  const Messages({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: FirebaseAuth.instance.currentUser!.reload(),
      builder: (ctx, futureSnapshot) {
        if (futureSnapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }
        return StreamBuilder(
          stream: FirebaseFirestore.instance
              .collection('chat')
              .orderBy('createdAt', descending: true)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            }

            return ListView.builder(
              reverse: true,
              itemCount: snapshot.data!.docs.length,
              itemBuilder: (context, index) => MessageBubble(
                snapshot.data!.docs[index]['text'],
                snapshot.data!.docs[index]['username'],
                snapshot.data!.docs[index]['userImage'],
                snapshot.data!.docs[index]['userId'] ==
                    FirebaseAuth.instance.currentUser!.uid,
                uniqueKey: ValueKey(snapshot.data!.docs[index].id),
              ),
            );
          },
        );
      },
    );
  }
}

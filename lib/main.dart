import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:wikitude_flutter_app/customUrl.dart';

import 'arview.dart';
import 'category.dart';
import 'custom_expansion_tile.dart';
import 'sample.dart';

import 'package:augmented_reality_plugin_wikitude/wikitude_plugin.dart';
import 'package:augmented_reality_plugin_wikitude/wikitude_sdk_build_information.dart';
import 'package:augmented_reality_plugin_wikitude/wikitude_response.dart';

void main() {
  runApp(MyApp());
}

//chargement des templates
Future<String> _loadSamplesJson() async {
  return await rootBundle.loadString('samples/samples.json');
}

Future<List<Category>> _loadSamples() async {
  String samplesJson = await _loadSamplesJson();
  List<dynamic> categoriesFromJson = json.decode(samplesJson);
  List<Category> categories = [];

  for (int i = 0; i < categoriesFromJson.length; i++) {
    categories.add(new Category.fromJson(categoriesFromJson[i]));
  }
  return categories;
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle.dark.copyWith(statusBarColor: Color(0xffffb300)));

    return MaterialApp(
        theme: ThemeData(
            primaryColor: Color(0xffffb300),
            primaryColorDark: Color(0xfffb8c00),
            accentColor: Color(0xffffb300)),
        home: MainMenu());
  }
}

class MainMenu extends StatefulWidget {
  @override
  MyAppState createState() => new MyAppState();
}

class MyAppState extends State<MainMenu> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Projet TUT RA'),
      ),
      body: FutureBuilder<List<Category>>(
        future: _loadSamples(),
        builder: (context, snapshot) {
          final categories = snapshot.data;

          if (snapshot.hasData) {
            return Container(
                decoration: BoxDecoration(color: Colors.white),
                alignment: Alignment.center,
                child: Column(
                  children: <Widget>[
                    Container(
                      child: FlatButton(
                        color: Colors.blue,
                        child: Text(
                          'Démo 2D',
                          style: TextStyle(fontSize: 20.0, color: Colors.white),
                        ),
                        onPressed: () {
                          //click sur le bouton de démo 2D
                          launchActivityAR(categories, 0);
                        },
                      ),
                    ),
                    Container(
                      child: FlatButton(
                        color: Colors.blue,
                        child: Text(
                          'Démo 3D',
                          style: TextStyle(fontSize: 20.0, color: Colors.white),
                        ),
                        onPressed: () {
                          //click sur le bouton de démo 3D
                          launchActivityAR(categories, 1);
                        },
                      ),
                    ),
                  ],
                ));
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Erreur de récupération des samples'),
            );
          } else {
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }

  void launchActivityAR(List<Category>? categories, index) {
    if (categories != null) {
      Sample sample = categories[index].samples[0];
      List<String> features = [];

      for (int j = 0; j < sample.requiredFeatures.length; j++) {
        features.add(sample.requiredFeatures[j]);
      }

      final checkSupported = _isDeviceSupporting(features);
      checkSupported.then((resp) {
        if (resp.success) {
          _pushArView(sample);
        } else {
          _showDialog("Fonctionnalité(s) manquante(s)", resp.message);
        }
      });
    } else {
      _showDialog("Erreur !", "Aucune catégorie récupérées dans sample.json");
    }
  }

  Future<WikitudeResponse> _isDeviceSupporting(List<String> features) async {
    return await WikitudePlugin.isDeviceSupporting(features);
  }

  Future<WikitudeResponse> _requestARPermissions(List<String> features) async {
    return await WikitudePlugin.requestARPermissions(features);
  }

  Future<void> _pushArView(Sample sample) async {
    WikitudeResponse permissionsResponse =
        await _requestARPermissions(sample.requiredFeatures);
    if (permissionsResponse.success) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ArViewWidget(sample: sample)),
      );
    } else {
      _showPermissionError(permissionsResponse.message);
    }
  }

  void _showDialog(String title, String message) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(title),
            content: Text(message),
            actions: <Widget>[
              TextButton(
                child: Text("Ok"),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        });
  }

  void _showPermissionError(String message) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Permissions required"),
            content: Text(message),
            actions: <Widget>[
              TextButton(
                child: const Text('Cancel'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              TextButton(
                child: const Text('Open settings'),
                onPressed: () {
                  Navigator.of(context).pop();
                  WikitudePlugin.openAppSettings();
                },
              )
            ],
          );
        });
  }
}

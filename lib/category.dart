import 'sample.dart';

///Représente une expérience de réalité augmentée
class Category {
  
  String categoryName; //le nom de la catégorie

  //les samples associés à une expérience RA
  //- le chemin de la page html
  //- le nom de l'expérience
  //- les fonctionnalités requises
  //- la configuration de la caméra 
  List<Sample> samples; 

  Category({required this.categoryName, required this.samples});

  factory Category.fromJson(Map<String, dynamic> jsonMap){
    List<dynamic> samplesFromJson = jsonMap["samples"];
    List<Sample> samples = [];
    for(int i = 0; i < samplesFromJson.length; i++) {
      samples.add(new Sample.fromJson(samplesFromJson[i]));
    }

    return Category(
      categoryName: jsonMap["category_name"],
      samples: samples
    );
  }
}
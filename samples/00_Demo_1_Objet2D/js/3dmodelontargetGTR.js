var World = {
    rotating: false,

    init: function initFn() {
        this.createOverlays();
    },
	
	/*Les augmentations sont crées ici */
    createOverlays: function createOverlaysFn() {
        /*
            Mise en place du tracker : le fichier .wtc créé avec Wikitude Studio
         */
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/tracker.wtc", {
            onError: World.onError
        });

        /*
            Ici, on créé une variable ImageTracker qui permet à l'application de savoir 
			qu'elle doit tracker cette image.
         */
        this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
            onTargetsLoaded: World.showInfoBar,
            onError: World.onError
        });
		
		
		/*On dit à l'application de charger une vidéo */
		this.video = new AR.VideoDrawable("assets/gtr-promo.mp4", 1, {
            translate: {
                y: 0
            },
            onError: World.onError
        });

        /*
            On dit à l'application de charger un modèle 3D
			on indique la taille du modèle et sa position
        */
        this.modelCar = new AR.Model("assets/model.wt3", {
            onClick: World.toggleAnimateModel,
            onLoaded: World.showInfoBar,
            onError: World.onError,
            scale: {
                x: 0.0025,
                y: 0.0025,
                z: 0.0025
            },
            translate: {
                x: 0.13756857686534474,
                y: -0.060883570379337726,
				z: 0.009492482227211205
            },
            rotate: {
                z: 0
            }
        });

        /*
            On indique l'animation à jouer au moment de l'apparition du modèle
        */
        this.appearingAnimation = this.createAppearingAnimation(this.modelCar, 0.0025);


        /*
            L'animation de rotation est précisée ici
        */
        this.rotationAnimation = new AR.PropertyAnimation(this.modelCar, "rotate.z", -25, 335, 10000);
		
		
        /*
            On ajoute un bouton en chargant une image dans le dossier 'asset' 
			et qui permettra de lancer ou d'arrêter l'animation de rotation.
        */
        var imgRotate = new AR.ImageResource("assets/rotateButton.png", {
            onError: World.onError
        });
        var buttonRotate = new AR.ImageDrawable(imgRotate, 0.3, {
            translate: {
                x: 1,
				y: 0,
				z: 0
            },
            onClick: World.toggleAnimateModel
        });
		
		/*
            On ajoute un bouton en chargant une image dans le dossier 'asset' 
			et qui permettra de lancer une page web.
        */
		var imgWeb = new AR.ImageResource("assets/webButton.png", {
            onError: World.onError
        });
        var buttonWeb = new AR.ImageDrawable(imgWeb, 0.3, {
            translate: {
                x: 1,
				y: 0.5,
				z: 0
            },
            onClick: World.openWebBrowser
        });
		
		

        /*
            Ici, on lie les augmentations et l'image cible
        */
        this.trackable = new AR.ImageTrackable(this.tracker, "*", {
            drawables: {
                cam: [this.modelCar, buttonRotate, buttonWeb, World.video]
            },
			onImageRecognized: function onImageRecognizedFn() {
				World.appear;
				
                if (this.hasVideoStarted) {
                    World.video.resume();
                } else {
                    this.hasVideoStarted = true;
                    World.video.play(-1);
                }
                World.hideInfoBar();
            },
			onImageLost: function onImageLostFn() {
                World.video.pause();
            },
            onError: World.onError
        });
    },
	
	/*
            Fonction de création de l'animation d'apparition
	*/
    createAppearingAnimation: function createAppearingAnimationFn(model, scale) {
        
        var sx = new AR.PropertyAnimation(model, "scale.x", 0, scale, 1500, {
            type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
        });
        var sy = new AR.PropertyAnimation(model, "scale.y", 0, scale, 1500, {
            type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
        });
        var sz = new AR.PropertyAnimation(model, "scale.z", 0, scale, 1500, {
            type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
        });

        return new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [sx, sy, sz]);
    },
	
	/*
		Fonction d'apparition de l'animation
	*/
    appear: function appearFn() {
        World.hideInfoBar();
        World.resetModel();
        World.appearingAnimation.start();
    },
	
	
	/*Arrête l'animation */
    resetModel: function resetModelFn() {
        World.rotationAnimation.stop();
        World.rotating = false;
        World.modelCar.rotate.z = -25;
    },
	
	/*Fonction d'animation de rotation */
    toggleAnimateModel: function toggleAnimateModelFn() {
        if (!World.rotationAnimation.isRunning()) {
            if (!World.rotating) {
                World.rotationAnimation.start(-1);
                World.rotating = true;
            } else {
                World.rotationAnimation.resume();
            }
        } else {
            World.rotationAnimation.pause();
        }
        return false;
    },
	
	/*
	Fonction d'ouverture du navigateur
	(Ouvre la navigateur intégré à Wikitude)
	*/
	openWebBrowser: function openWebBrowserFn() {
		AR.context.openInBrowser("https://www.nissan.fr/vehicules/neufs/gt-r.html");
	},
	
	
	/*Erreur de création */
    onError: function onErrorFn(error) {
        alert(error);
    },

    hideInfoBar: function hideInfoBarFn() {
        document.getElementById("infoBox").style.display = "none";
    },

    showInfoBar: function worldLoadedFn() {
        document.getElementById("infoBox").style.display = "table";
        document.getElementById("loadingMessage").style.display = "none";
    }
};

World.init();
var World = {
    loaded: false,
    drawables: [],

    init: function initFn() {
        World.createPanneau();
        World.createTracker();
    },
		
	/*
		Créer le modèle et l'ajoute à la liste des drawables
	*/
    createPanneau: function createPanneauFn() {

        var panneau = World.getPanneau();
        World.drawables.push(panneau);
    },
	
	/*
		Créer l'augmentation correspondant au modèle
	*/
    getPanneau: function getPanneauFn() {
		
		/*
            On dit à l'application de charger un modèle 3D
			on indique la taille du modèle et sa position
        */
        return new AR.Model("assets/panneau.wt3", {
            scale: {
                x: 1,
                y: 1,
                z: 1
            },
            translate: {
                x: 0.0,
                y: 0.0,
                z: 0.0
            },
            rotate: {
                x: -90
            },
            onError: World.onError
        });
    },
	
	/*
		Mise en place du tracker : le fichier .wto créé avec Wikitude Studio
    */
    createTracker: function createTrackerFn() {
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/extincteur.wto", {
            onError: World.onError
        });

        this.tracker = new AR.ObjectTracker(this.targetCollectionResource, {
            onError: World.onError
        });
		
		/*
            Ici, on créé une variable objectTrackable qui permet à l'application de savoir 
			qu'elle doit tracker cet objet.
         */
        this.objectTrackable = new AR.ObjectTrackable(this.tracker, "*", {
            drawables: {
                cam: World.drawables
            },
            onObjectRecognized: World.objectRecognized,
            onObjectLost: World.objectLost,
            onError: World.onError
        });
    },
	
	/*
		Fonction qui est lancée lors de la reconnaissance de l'objet
		Appel une fonction qui affiche tous les drawables
	*/
    objectRecognized: function objectRecognizedFn() {
        World.hideInfoBar();
        World.setAugmentationsEnabled(true);
    },
	
	/*
		Fonction qui est lancée lors de la perte de reconnaissance de l'objet
		Appel une fonction qui cache tous les drawables
	*/
    objectLost: function objectLostFn() {
        World.setAugmentationsEnabled(false);
    },
	
	/*
		Affiche ou cache les drawables selon la valeur du
		paramètre 'enable'
	*/
    setAugmentationsEnabled: function setAugmentationsEnabledFn(enabled) {
        for (var i = 0; i < World.drawables.length; i++) {
            World.drawables[i].enabled = enabled;
        }
    },
	
	/*
		Erreur lors du chargement de l'Architecture World
	*/
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
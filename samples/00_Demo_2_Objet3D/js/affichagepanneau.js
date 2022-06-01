var World = {
    loaded: false,
    drawables: [],

    init: function initFn() {
        World.createCones();
        World.createTracker();
    },

    createCones: function createConesFn() {

        var cone = World.getCone();
        World.drawables.push(cone);
    },

    getCone: function getConeFn() {

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

    createTracker: function createTrackerFn() {
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/extincteur.wto", {
            onError: World.onError
        });

        this.tracker = new AR.ObjectTracker(this.targetCollectionResource, {
            onError: World.onError
        });

        this.objectTrackable = new AR.ObjectTrackable(this.tracker, "*", {
            drawables: {
                cam: World.drawables
            },
            onObjectRecognized: World.objectRecognized,
            onObjectLost: World.objectLost,
            onError: World.onError
        });
    },

    objectRecognized: function objectRecognizedFn() {
        World.hideInfoBar();
        World.setAugmentationsEnabled(true);
    },

    objectLost: function objectLostFn() {
        World.setAugmentationsEnabled(false);
    },

    setAugmentationsEnabled: function setAugmentationsEnabledFn(enabled) {
        for (var i = 0; i < World.drawables.length; i++) {
            World.drawables[i].enabled = enabled;
        }
    },

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
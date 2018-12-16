//'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:ThemesCtrl
 * @description
 * # ThemesCtrl
 * Controller of the breazehomeDesktop
 */
var app = angular.module('breazehomeDesktop');

angular.module('breazehomeDesktop').controller('ThemesCtrl', function ($scope, $rootScope, Themes, $location) {
    // Redirect 
    if (!$rootScope.user || !$rootScope.user.isSuperuser) {
        $location.path('/')
    }

    Themes.selectedTheme = null;
    //console.log(Themes.selectedTheme);

    $rootScope.sendthisimage = "../images/landing/bg-img.jpg";
    $scope.status = '  '; //for customized theme
    $scope.customFullscreen = false; //for customized theme

    //Font change
    $scope.font = "";
    $scope.fontList = ["Default", "Bookman", "Comic Sans MS", "Trebuchet MS", "Arial Black", "Impact",
        "Bungee", "Chango", "Clicker Script", "Devonshire", "Eater", "Fruktur", "Griffy", "Stalemate"];
    $rootScope.myfont = $scope.font;
    $rootScope.myfontList = $scope.fontList;
    $scope.onChangeFont = function () {
        //trigerred on color change
        //$(".themePreviewSection").css("font-family", $scope.font);
        $(".themePreviewSection .landing-slogan h1, .themePreviewSection .landing-slogan h2").css("font-family", $scope.font);
        if ($scope.font == "Default") {
            //$(".themePreviewSection").css("font-family", "");
            $(".themePreviewSection .landing-slogan h1, .themePreviewSection .landing-slogan h2").css("font-family", "");
        };
        $rootScope.sendthistestfont = $scope.font;
    };
    $scope.onChangeImage = function () {
        if (document.getElementById('bgchanger').value != "") {
            var url = document.getElementById('bgchanger').value;
            $(".landing-top").css('backgroundImage', "url('" + url + "')");
            $(".landing-top").css('background-size', "cover");
            $(".landing-top").css('background-position', "center");
            $(".landing-top").css('overflow', "hidden");
            $(".landing-top").css('position', "relative");
            $(".landing-top").css('padding-bottom', "100px");
            $(".landing-top").css('width', "100%");
            $(".landing-top").css('background-repeat', "no-repeat");

            $rootScope.sendthisimage = $scope.bgimage;
            console.log($rootScope.sendthisimage);
        };
    };
    $scope.onChangeColorMain = function () {
        $(".landing-search-submit").css("background-color", $scope.newTheme.color_1);
        $(".landing-search-dropdown-btn").css("background-color", $scope.newTheme.color_1);
        $(".landing-top").css("background-color", $scope.newTheme.color_1);
        $(".landing-top").css("background-blend-mode", "luminosity");
    };
    $scope.onChangeColorAdditional = function () {
        $(".landing-properties").css("background-color", $scope.newTheme.color_2);
    };
    $scope.onChangeColorAccent = function () {
        $(".caption").css("background-color", $scope.newTheme.color_3);

    };
    $scope.onChangeColorSupp1 = function () {
        $(".lptl").css("color", $scope.newTheme.color_4);
    };
    $scope.onChangeColorSupp2 = function () {
        $(".landing-app-slogan").css("color", $scope.newTheme.color_5);
        $(".landing-app").css("background-color", $scope.newTheme.color_5);
    };
    $scope.onChangeColorSupp3 = function () {
        $(".mysloganmotto").css("color", $scope.newTheme.color_6);
        $(".landing-header-menu-item").css("color", $scope.newTheme.color_6);
    };

    //db code
    $scope.themesList = {};

    $rootScope.preferredTheme = null;
    $rootScope.currentPage = 'Themes';
    //for customized theme
    $scope.redirectCustomTheme = function () {

        $rootScope.tempcurrentTheme = {};
        Themes.selectedTheme = $rootScope.tempcurrentTheme;

        console.log(Themes.selectedTheme);
        Themes.isNewTheme = true;
        $location.path('/customizetheme');
    };
    //Set default theme
    $scope.redirectDefaultApplyTheme = function () {
        Themes.applyDefaultTheme().then((res) => {
            $rootScope.appThemes = undefined
        })
        $location.path('/')
        location.reload()
    };
    //Set selected theme
    $scope.redirectApplyTheme = function () {
        Themes.applyTheme($rootScope.user.id, Themes.currentTheme.id);
        $location.path('/')
        location.reload();
    };

    $scope.mythemesList = {
        "lifesabreaze": [
            { "color_1": "#6495ED" },
            { "color_2": "#00008B" },
            { "color_3": "#FFFF00" },
            { "color_4": "#808080" },
            { "color_5": "#778899" },
            { "color_6": "#DCDCDC" }
        ],
        "corporatedepression": [
            { "color_1": "#808080" },
            { "color_2": "#000000" },
            { "color_3": "#FFFF00" },
            { "color_4": "#696969" },
            { "color_5": "#808080" },
            { "color_6": "#DCDCDC" }
        ],
        "myohmy": [
            { "color_1": "#E6E6FA" },
            { "color_2": "#DCDCDC" },
            { "color_3": "#4B0082" },
            { "color_4": "#808080" },
            { "color_5": "#778899" },
            { "color_6": "#DCDCDC" }
        ],
        "malaria": [
            { "color_1": "#20B2AA" },
            { "color_2": "#3CB371" },
            { "color_3": "#FFD700" },
            { "color_4": "#808080" },
            { "color_5": "#778899" },
            { "color_6": "#DCDCDC" }
        ]
    };
    $rootScope.tempthemeslist = $scope.mythemesList;
    //$scope.currentTheme = null;
    $scope.currentDupTheme = null;

    $rootScope.testNewTheme = $scope.newTheme;

    //old design
    $scope.try = function (themeID) {
        console.log(themeID);
    };

    //Alternate pages
    $("#showlandingpage2").hide();
    $("#showlandingpage3").hide();

    $("#insertview1").click(function () {
        $("#showlandingpage3").hide();
        $("#showlandingpage2").hide();
        $("#showlandingpage").show();
    });
    $("#insertview2").click(function () {
        $("#showlandingpage").hide();
        $("#showlandingpage3").hide();
        $("#showlandingpage2").show();
    });
    $("#insertview3").click(function () {
        $("#showlandingpage").hide();
        $("#showlandingpage2").hide();
        $("#showlandingpage3").show();
    });

    //Hide delete prethemes
    $scope.getPreThemes = function (themeID) {
        if (themeID == "36") {
            $(".hidebutton").hide();
        }
        if (themeID == "37") {
            $(".hidebutton").hide();
        }
        if (themeID == "38") {
            $(".hidebutton").hide();
        }
        if (themeID == "39") {
            $(".hidebutton").hide();
        }
    };

    //Hide edit unless hovered
    $("#hoveredit").hover(function () {
        $("#hoveredit").hide();
    });

    $scope.copyTheme = function (themeID) {
        //copy selected theme into currentDupTheme variable
        $rootScope.preferredTheme = themeID;
        $scope.currentDupTheme = $scope.themesList[themeID];
    };

    // Get all Breazehome true themes
    Themes.getAllThemes().then((res) => {
        $scope.themes = res.data.results;
        for (var i in $scope.themes) {
            if ($scope.themes[i].image == "true") {
                //console.log($scope.themes[i].image);
                var theme = $scope.themes[i];
                $scope.themesList[theme.id] = theme;
            }
        }
        //console.log($scope.themesList[theme.id]);
    })
    //console.log(Themes.selectedTheme);

    //Edit Breazehome themes test
    $scope.editTheme = function (thisTheme, themeID) {
        Themes.editTheme(thisTheme, themeID).then(function () {
            Themes.getAllThemes().then((res) => {
                $scope.themes = res.data.results;
                for (var i in $scope.themes) {
                    if ($scope.themes[i].image == "true") {
                        var theme = $scope.themes[i];
                        $scope.themesList[theme.id] = theme;
                    }
                }
                console.log($scope.themesList);
            })
        });
    };
    //Delete Breazehome themes by setting image to false
    $scope.deletemyTheme = function (thisTheme, themeID) {
        thisTheme.image = "false";
        console.log($scope.tempfalse);
        Themes.editTheme(thisTheme, themeID).then(function () {
            Themes.getAllThemes().then((res) => {
                $scope.themes = res.data.results;
                for (var i in $scope.themes) {
                    if ($scope.themes[i].image == "true") {
                        var theme = $scope.themes[i];
                        $scope.themesList[theme.id] = theme;
                    }
                }
                console.log($scope.themesList);
            })
        });
    };

    //Refresh default theme
    $scope.setDefault = function () {
        Themes.currentTheme = {
            "themeName": "Default",
            "color_1": "",
            "color_2": "",
            "color_3": "",
            "color_4": "",
            "color_5": "",
            "color_6": "",
            "image": ""
        };
        $rootScope.tempcurrentTheme = Themes.currentTheme;
        Themes.selectedTheme = $rootScope.tempcurrentTheme;
    }
    // Set preferred theme for user
    $scope.setTheme = function (themeID) {
        //$rootScope.preferredTheme = themeID;
        //console.log($rootScope.preferredTheme);
        Themes.currentTheme = $scope.themesList[themeID];
        $rootScope.tempcurrentTheme = Themes.currentTheme;
        $rootScope.appThemes = Themes.currentTheme;
        //console.log($scope.currentTheme.themeName);
        //console.log($rootScope.tempcurrentTheme);
        Themes.selectedTheme = $rootScope.tempcurrentTheme;
        //console.log(Themes.selectedTheme);
    }
    //$rootScope.tempcurrentTheme = $scope.currentTheme;
    $rootScope.tempcurrentTheme = Themes.currentTheme;
    //console.log($rootScope.tempcurrentTheme);

    // Delete theme
    $scope.deleteTheme = function (themeID, $event) {
        $event.stopPropagation();
        console.log(themeID);
        Themes.deleteTheme(themeID).then(function () {
            delete $scope.themesList[themeID];
        })
    }

    // Create theme
    $scope.createTheme = function () {
        Themes.createTheme($scope.newTheme).then(function () {
            Themes.getAllThemes().then((res) => {
                $scope.themes = res.data.results;
                for (var i in $scope.themes) {
                    //var theme = $scope.themes[i]
                    //$scope.themesList[theme.id] = theme;
                    if ($scope.themes[i].image == "true") {
                        console.log($scope.themes[i].image);
                        var theme = $scope.themes[i];
                        $scope.themesList[theme.id] = theme;
                        if ($scope.themes[i].themeName == $scope.newTheme.themeName) {
                            alert("Equal names");
                        }
                    }
                }
                console.log($scope.themesList);
            })
        });
    }

    $scope.goToCustomSelect = function (themeID) {
        Themes.currentTheme = $scope.themesList[themeID];
        $rootScope.tempcurrentTheme = Themes.currentTheme;
        //console.log($scope.currentTheme.themeName);
        //console.log($rootScope.tempcurrentTheme);
        Themes.selectedTheme = $rootScope.tempcurrentTheme;
        //console.log(Themes.selectedTheme);
        Themes.isNewTheme = false;
        $location.path('/customizetheme');
    }

    //Select predetermined theme
    $scope.selectPreTheme1 = function () {
        $rootScope.color1 = $scope.themesList.lifesabreaze[0].color_1;
        $rootScope.color2 = $scope.themesList.lifesabreaze[1].color_2;
        $rootScope.color3 = $scope.themesList.lifesabreaze[2].color_3;
        $rootScope.color4 = $scope.themesList.lifesabreaze[3].color_4;
        $rootScope.color5 = $scope.themesList.lifesabreaze[4].color_5;
        $rootScope.color6 = $scope.themesList.lifesabreaze[5].color_6;
    };

    
});


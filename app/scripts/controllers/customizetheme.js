//'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:CustomizeCtrl
 * @description
 * # ThemesCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop').controller('CustomizethemeCtrl', function ($scope, $rootScope, $location, Themes) {
    // Redirect 
    if (!$rootScope.user || !$rootScope.user.isSuperuser) {
        $location.path('/')
    }
    if (Themes.isNewTheme == true) {
        $(".trydel").hide();
        $(".tryedit").hide();
    }
    if (Themes.isNewTheme == false) {
        $(".trydel").show();
        $(".tryedit").show();
    }
    $scope.themesList = {};

    $scope.newTheme = {
        "themeName": "New Theme",
        "color_1": "#c0c0c0",
        "color_2": "#ffffff",
        "color_3": "#c0c0c0",
        "color_4": "#ffffff",
        "color_5": "#ffffff",
        "color_6": "#c0c0c0",
        "image": "true"
    };

    $rootScope.tempcurrentTheme = {};

    $rootScope.test = $scope.customThemesList;
    //console.log($rootScope.test);
    $rootScope.testNewTheme = $scope.newTheme;

    $rootScope.temptest = $scope.newTheme;
    //console.log($rootScope.temptest);

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
        //console.log($scope.themesList);
    })

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
        $scope.returnToThemes();
        location.reload(); //Reload to fetch new data
    };

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
                    }
                }
                console.log($scope.themesList);
            })
        });
        $scope.returnToThemes();
        location.reload(); //Reload to fetch new data
    }

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
        $scope.returnToThemes();
        location.reload(); //Reload to fetch new data
    };

    $rootScope.tempcurrentTheme = Themes.currentTheme;
    //console.log($rootScope.tempcurrentTheme);

    //insert the new copies information into create theme fields
    if (Themes.selectedTheme.id >= 0)
    {
        $scope.newTheme.themeName = Themes.selectedTheme.themeName;
        $scope.newTheme.color_1 = Themes.selectedTheme.color_1;
        $scope.newTheme.color_2 = Themes.selectedTheme.color_2;
        $scope.newTheme.color_3 = Themes.selectedTheme.color_3;
        $scope.newTheme.color_4 = Themes.selectedTheme.color_4;
        $scope.newTheme.color_5 = Themes.selectedTheme.color_5;
        $scope.newTheme.color_6 = Themes.selectedTheme.color_6;
    } else {
        $rootScope.tempcurrentTheme = {
            "themeName": "New Theme",
            "color_1": "#ffffff",
            "color_2": "#ffffff",
            "color_3": "#ffffff",
            "color_4": "#ffffff",
            "color_5": "#ffffff",
            "color_6": "#ffffff",
            "image": "true"
        };
        $scope.newTheme.themeName = $rootScope.tempcurrentTheme.themeName;
        $scope.newTheme.color_1 = $rootScope.tempcurrentTheme.color_1;
        $scope.newTheme.color_2 = $rootScope.tempcurrentTheme.color_2;
        $scope.newTheme.color_3 = $rootScope.tempcurrentTheme.color_3;
        $scope.newTheme.color_4 = $rootScope.tempcurrentTheme.color_4;
        $scope.newTheme.color_5 = $rootScope.tempcurrentTheme.color_5;
        $scope.newTheme.color_6 = $rootScope.tempcurrentTheme.color_6;
    }

    //Regular font change
    $scope.font = "";
    $scope.fontList = ["Default", "Bookman", "Comic Sans MS", "Trebuchet MS", "Arial Black", "Impact",
        "Bungee", "Chango", "Clicker Script", "Devonshire", "Eater", "Fruktur", "Griffy", "Stalemate"];
    $rootScope.myfont = $scope.font;
    $rootScope.myfontList = $scope.fontList;
    $scope.onChangeFont = function () {
        //trigerred on color change
        //$(".themePreviewSection").css("font-family", $scope.font);
        $(".landing-slogan h1, .landing-slogan h2").css("font-family", $scope.font);
        if ($scope.font == "Default") {
            //$(".themePreviewSection").css("font-family", "");
            $(".landing-slogan h1, .landing-slogan h2").css("font-family", "");
        };
        $rootScope.sendthistestfont = $scope.font;
    };

    $scope.applyTheme = function (font,c1,c2,c3,c4,c5,c6) {
        $location.path('/');
    };
    $scope.returnToThemes = function () {
        $location.path('/themes');
    };
});

var app = angular.module('breazehomeDesktop');

// START search engine:acris005@fiu.edu

// goal: the goal of this is to define autofocus behavior
// help: autofocus means user doesn't have to use place cursor on input field
app.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
        $timeout(function() {
            var xPosition = window.scrollX;
            var yPosition = window.scrollY;

            $element[0].focus();
            window.scrollTo(xPosition, yPosition);
        });
    }
  }
}]);

// END search engine

app.directive("myPreview", function () {
    return {
        scope: false,
        templateUrl: "/views/landing.html"
    }
});

app.directive("myPreview2", function () {
    return {
        templateUrl: "/views/detail.html"
    }
});

app.directive("myPreview3", function () {
    return {
        templateUrl: "/views/results.html"
    }
});

app.directive("myPreview4", function () {
    return {
        templateUrl: "/views/customizetheme.html"
    }
});

//backgrounds
app.directive("mainColor", function ($rootScope, Admin, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("background-color", $rootScope.appThemes.color_1);
                elem.css("background-blend-mode", "luminosity");
            });
        }
    }
});

//texts
app.directive("mainColorText", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("color", $rootScope.appThemes.color_1);
            })
        }
    }
});

//backgrounds
app.directive("additionalColor", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("background-color", $rootScope.appThemes.color_2);
            })
        }
    }
});

//texts
app.directive("additionalColorText", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("color", $rootScope.appThemes.color_2);
            })
        }
    }
});

//backgrounds
app.directive("accentColor", function ($rootScope, Themes, $location) {
    //console.log('directive accent:' + Themes.currentTheme.id);
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("background-color", $rootScope.appThemes.color_3);
            })
        }
    }
});

//texts
app.directive("accentColorText", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("color", $rootScope.appThemes.color_3);
            })
        }
    }
});

//gradient
app.directive("accentColorGradient", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("background", "linear-gradient(60deg, transparent 50%, " + $rootScope.appThemes.color_3 + " 50%)");
            })
        }
    }
});

//landing logo
app.directive("accentColorLogo", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("-webkit-filter", "opacity(.5) drop-shadow(0px 0px 0px " + $rootScope.appThemes.color_3 + ")");
            })
        }
    }
});

app.directive("supp1Color", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("color", $rootScope.appThemes.color_4);
            })
        }
    }
});

app.directive("supp2Color", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("color", $rootScope.appThemes.color_5);
            })
        }
    }
});

app.directive("supp3Color", function ($rootScope, Themes, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('$root.appThemes', function() {
                if($rootScope.appThemes === undefined) {
                    return
                }
                elem.css("color", $rootScope.appThemes.color_6);
            })
        }
    }
});

app.directive("sloganFont", function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if ($('.fontchange').change(function () {
                elem.css("font-family", $rootScope.sendthistestfont);
                console.log($rootScope.sendthistestfont);
            })) {
                elem.css("font-family", $rootScope.sendthistestfont);
            }
        }
    }
});

app.directive("imageUrl", function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if ($('.addimageurl').change(function () {
            })) {
                elem.css("backgroundImage", "url('" + $rootScope.sendthisimage + "')");
            } else {
                elem.css("backgroundImage", "url('" + $rootScope.sendthisimage + "')");
            }
        }
    }
});

; (function ($) {
    $.gameFunction = function (options) {
        var gameFunction = {
            options: $.extend({
                "fullContainer": $("#full-container"),
                "action": $("#gameAction"),
                "categoryIndex": $("#categoryIndex"),
                "answerIndex": $("#answerIndex"),
                "questionPane": $("#question"),
                "topicPane": $("#topics"),
                "whammyPane": $("#whammy"),
                "answerPane": $("#answer"),
                "startPane": $("#start"),
                "helpPane": $("#instructions"),
                "gameOverPane": $("#game-over"),
                "errorPane": $("#error"),
                "playButton": $("a.play-button"),
                "helpButton": $("a.help-button"),
                "topicButtons": $("a.topic"),
                "totalPointsBox": $("#points"),
                "totalPointsValue": $("#points").text(),
                "currentPointsBox": $(".points-value"),
                "currentPointsValue": $(".points-value").text(),
                "gameOverScreenText": $(".game-over-screen-text"),
                "errorMessage": $(".errorMessage"),
                "currentTopic": "",
                "currentQuestion": "",
                "currentAnswers": [],
                "studyTopics": [],
                "choiceButton": "",
                "pointsEarned": 0,
                "tokens": 0,
                "gameOver": false,
                "h": window.innerHeight,
                "gameId": 0
            }, options),
            hidePane: function (array) {
                $.each(array, function () {
                    this.addClass("behind");
                });
            },
            clearPane: function (array) {
                $.each(array, function () {
                    this.html("");
                });
            },
            cardFlip: function ($element) {
                $element.parent(".flipper").toggleClass("flipped current");
                return this;
            },
            setHeight: function () {
                gameFunction.resizeWindow();
                $(window).resize(function () {
                    gameFunction.resizeWindow();
                });
            },
            resizeWindow: function () {
                gameFunction.options.h = $(window).height();
                gameFunction.options.fullContainer.css("height", gameFunction.options.h);
            },
            setCategory: function ($element) {
                gameFunction.options.categoryIndex.val($element.attr("id"));
            },
            getTopicAndQuestion: function ($element) {
                gameFunction.options.action.val("GetQuestion");
                if (jQuery.cfajax) {
                    var canDo = jQuery.cfajax({
                        "ajax_method": "Gamification.PlayGame",
                        "$form": gameFunction.options.fullContainer,
                        "response_type": "json",
                        "$response_container": $element.children(".front-content"),
                        "spinner": "<p class='waiting cfajax-appended'></p>",
                        success: function (data) { gameFunction.displayTopic(data, $element) },
                        error: function (data) {
                            gameFunction.showError(data);
                        }
                    });

                    canDo.cfaMakeRequest();
                } else {
					var data = JSON.parse('{"ReturnedData" : {"CategoryTitle": "Random Topic", "QuestionText": "This question is related to the randomly selected topic", "Answers" : ["Choice 1", "Choice 2", "Choice 3"], "IsWhammy": false } }');
					gameFunction.displayTopic(data, $element);
				}
            },
            displayTopic: function (data, $element) {
				gameFunction.options.gameId++;
                gameFunction.options.currentTopic = data.ReturnedData.CategoryTitle;
                gameFunction.options.currentQuestion = data.ReturnedData.QuestionText;
                gameFunction.options.currentAnswers = data.ReturnedData.Answers;
                gameFunction.setCardTopic($element);
                gameFunction.cardFlip($element);
                gameFunction.buildQuestion();
                if( data.ReturnedData.IsWhammy ){ var timer = setTimeout(function () { gameFunction.showWhammy(); }, 1000); }
                else{ var timer = setTimeout(function () { gameFunction.showQuestion(); }, 1000); }
            },
            setCardTopic: function ($element) {
                $element.next().html('<span class="back-content">' + gameFunction.options.currentTopic + '</span>');
            },
            buildQuestion: function () {
                gameFunction.options.questionPane.append('<div class="question-topic">' + gameFunction.options.currentTopic + '</div>\
                    <div class="question-box"><span class="incorrect animated fast behind" title="incorrect">Incorrect</span><span class="correct animated fast behind" title="correct!">Correct!</span>\
                    <span class="question-text">' + gameFunction.options.currentQuestion + '</span>\
                    </div><ul id="answer-choices" class="choice-list nostyle"></ul>');

                $.each(gameFunction.options.currentAnswers, function (x) {
                    $("#answer-choices").append('<li class="answer-box"><a href="#" id="answer' + x + '" class="choice">' + this + '</a></li>');
                });

                gameFunction.bindAnswerButtons();
            },
            buildAnswer: function (data) {
                gameFunction.options.pointsEarned = data.ReturnedData.BonusPoints + data.ReturnedData.BasePoints;

                gameFunction.options.answerPane.append('<div class="question-topic">' + gameFunction.options.currentTopic + '</div>\
                    <div class="question-box"><span class="question-text">' + data.ReturnedData.ExplanationText + '</span></div>');

                if (data.ReturnedData.BasePoints > 0) {
                    gameFunction.options.answerPane.append('<div class="points new-text">CORRECT ANSWER</div>');
                }
                if (data.ReturnedData.ConsecutiveQuestionsCorrect > 1) {
                    gameFunction.options.answerPane.append('<div class="points streak-text">STREAK BONUS</div>');
                }
                if (data.ReturnedData.IsWhammy) {
                    gameFunction.options.answerPane.append('<div class="points piggy-text">PIGGY BONUS</div>');
                    gameFunction.options.pointsEarned = gameFunction.options.pointsEarned * 2;
                }

                if (gameFunction.options.pointsEarned > 0) {
                    gameFunction.options.answerPane.append('<div class="points points-text">+<span class="points-value">0</span></div>');
                }

                gameFunction.options.answerPane.append('<div class="continue-button behind"><a href="#" class="button">Continue</a></div>');

                gameFunction.options.currentPointsBox = $(".points-value");
                gameFunction.options.currentPointsValue = $(".points-value").text();
            },
            buildGameOver: function () {
                if (gameFunction.options.totalPointsValue > 0) {
                    $(".game-over-screen-picture").addClass("nice-job");
                }else{
                    $(".game-over-screen-picture").addClass("try-again");
                }

                gameFunction.options.gameOverScreenText.append("<div class='mbm'>You earned " + gameFunction.options.totalPointsValue + " points this game!</div>");

                if (gameFunction.options.studyTopics.length != 0) {
                    gameFunction.options.gameOverScreenText.append("<div class='mbl'>Topics to Study:<ul id='study-topics' class='nostyle study-topics'></ul></div>");
                    $.each(gameFunction.options.studyTopics, function (x) {
                        $("#study-topics").append('<li>' + this + '</li>');
                    });
                }

                if (gameFunction.options.tokens > 0) {
                    gameFunction.options.gameOverScreenText.append("<span><a href='#' class='button refresh-window'>Play again</a></span>");
                }

                gameFunction.bindGameOverButton();
            },
            showQuestion: function () {
                gameFunction.hidePane([gameFunction.options.topicPane, gameFunction.options.whammyPane, gameFunction.options.answerPane]);
                gameFunction.options.questionPane.removeClass("behind");
            },
            showWhammy: function () {
                gameFunction.hidePane([gameFunction.options.topicPane, gameFunction.options.answerPane, gameFunction.options.questionPane]);
                gameFunction.options.whammyPane.removeClass("behind");
                var timer = setTimeout(function () { gameFunction.showQuestion(); }, 2000);
            },
            showGameOver: function () {
                gameFunction.hidePane([gameFunction.options.topicPane, gameFunction.options.whammyPane, gameFunction.options.answerPane, gameFunction.options.questionPane, gameFunction.options.startPane, gameFunction.options.helpPane]);
                gameFunction.clearPane([gameFunction.options.topicPane, gameFunction.options.whammyPane, gameFunction.options.answerPane, gameFunction.options.questionPane, gameFunction.options.startPane, gameFunction.options.helpPane]);
                gameFunction.options.gameOverPane.removeClass("behind");
            },
            showAnswer: function (data) {
                gameFunction.options.gameOver = data.ReturnedData.GameOver;
                gameFunction.hidePane([gameFunction.options.topicPane, gameFunction.options.whammyPane, gameFunction.options.questionPane]);
                gameFunction.options.answerPane.removeClass("behind");

                if (data.ReturnedData.BasePoints > 0) {
                    var timer = setTimeout(function () {
                        $(".new-text").fadeIn(500, function () {
                            timer = setInterval(function () {
                                if (gameFunction.addPoints(data.ReturnedData.BasePoints)) {
                                    clearInterval(timer);
                                    if (data.ReturnedData.ConsecutiveQuestionsCorrect > 1) {
                                        $(".streak-text").fadeIn(500, function () {
                                            timer = setInterval(function () {
                                                if (gameFunction.addPoints(data.ReturnedData.BasePoints + data.ReturnedData.BonusPoints)) {
                                                    clearInterval(timer);
                                                    if (data.ReturnedData.IsWhammy > 0) {
                                                        $(".piggy-text").fadeIn(500, function () {
                                                            timer = setInterval(function () {
                                                                if (gameFunction.addPoints(gameFunction.options.pointsEarned)) {
                                                                    clearInterval(timer);
                                                                    gameFunction.showContinue();
                                                                }
                                                            }, 1);
                                                        });
                                                    } else { gameFunction.showContinue(); }
                                                }
                                            }, 1);
                                        });
                                    } else if (data.ReturnedData.IsWhammy > 0) {
                                        $(".piggy-text").fadeIn(500, function () {
                                            timer = setInterval(function () {
                                                if (gameFunction.addPoints(gameFunction.options.pointsEarned)) {
                                                    clearInterval(timer);
                                                    gameFunction.showContinue();
                                                }
                                            }, 1);
                                        });
                                    } else {
                                        gameFunction.showContinue();
                                    }
                                }
                            });
                        });
                    }, 500);
                } else {
                    gameFunction.showContinue();
                }
            },
            addPoints: function (pointsEarned) {
                gameFunction.options.currentPointsValue++;
                gameFunction.options.currentPointsBox.text(gameFunction.options.currentPointsValue);
                gameFunction.options.totalPointsValue++;
                gameFunction.options.totalPointsBox.text(gameFunction.options.totalPointsValue);
                if (gameFunction.options.currentPointsValue == pointsEarned) {
                    return true;
                } else {
                    return false;
                }
            },
            showContinue: function () {
                var continueButton = $(".continue-button");

                continueButton.on("click", function (e) {
                    e.preventDefault();
                    gameFunction.bindContinueButton();
                });
                var timer = setTimeout(function () {
                    continueButton.show(500, function () { jQuery(this).toggleClass("behind"); });
                }, 1000);
            },
            setAnswer: function ($element) {
                gameFunction.options.answerIndex.val($element.attr("id").slice(-1));
            },
            setAsCorrect: function ($element, data) {
				data.ReturnedData.BasePoints = 100;
                $element.toggleClass("answer-box-correct");
                $(".question-box .correct").toggleClass("answerBounce behind");
                gameFunction.buildAnswer(data);
                $("#question .question-text").toggleClass("behind");
                var timer = setTimeout(function () {
                    gameFunction.showAnswer(data);
                }, 1000);
            },
            setAsIncorrect: function ($element, data) {
                $element.addClass("answer-box-incorrect");
                $(".current .back").addClass("incorrect");
                gameFunction.options.studyTopics.push(gameFunction.options.currentTopic);
                $("#answer"+data.ReturnedData.AnswerIndex).addClass("answer-box-correct");
                $(".question-box .incorrect").toggleClass("answerBounce behind");
                gameFunction.buildAnswer(data);
                $("#question .question-text").addClass("behind");
                var timer = setTimeout(function () {
                    gameFunction.showAnswer(data);
                }, 1000);
            },
            selectAnswer: function ($element) {
                gameFunction.setAnswer($element);
                gameFunction.options.action.val("SubmitAnswer");

                if (jQuery.cfajax) {
                    var canDo = jQuery.cfajax({
                        "ajax_method": "Gamification.PlayGame",
                        "$form": gameFunction.options.fullContainer,
                        "response_type": "json",
                        success: function (data) {
                            $(".question-box").scrollTop(0);
                            if (data.ReturnedData.BasePoints > 0) {
                                gameFunction.setAsCorrect($element, data);
                            }
                            else {
                                gameFunction.setAsIncorrect($element, data);
                            }
                        },
                        error: function (data) {
                            gameFunction.showError(data);
                        }
                    });

                    canDo.cfaMakeRequest();
                } else {
					var data = JSON.parse('{"ReturnedData" : {"AnswerIndex": "2", "BasePoints": "0", "BonusPoints": "0", "ConsecutiveQuestionsCorrect" : "0", "IsWhammy": false, "ExplanationText": "This is the explanation for the randomly selected question.", "GameOver": false } }');
					$(".question-box").scrollTop(0);
					if (data.ReturnedData.AnswerIndex == gameFunction.options.answerIndex.val()) {
						gameFunction.setAsCorrect($element, data);
					}
					else {
						gameFunction.setAsIncorrect($element, data);
					}
				}
            },
            resetPanes: function () {
                gameFunction.options.questionPane.html("");
                gameFunction.options.answerPane.html("");
            },
            bindPlayButton: function () {
                gameFunction.hidePane([gameFunction.options.startPane, gameFunction.options.helpPane]);
                gameFunction.options.topicPane.removeClass("behind");
            },
            bindHelpButton: function () {
                gameFunction.hidePane([gameFunction.options.startPane]);
                gameFunction.options.helpPane.removeClass("behind");
            },
            bindTopicButtons: function ($element) {
                gameFunction.setCategory($element);
                gameFunction.getTopicAndQuestion($element);
                gameFunction.options.topicButtons.off("click").on("click", function (e) { e.preventDefault(); });
            },
            bindAnswerButtons: function () {
                gameFunction.options.choiceButton = $("a.choice");

                gameFunction.options.choiceButton.on("click", function (e) {
                    e.preventDefault();
                    gameFunction.options.choiceButton.off("click").on("click", function (e) { e.preventDefault(); });
                    gameFunction.selectAnswer($(this));
                });
            },
            bindContinueButton: function () {
			console.log(gameFunction.options.gameId);
                if (gameFunction.options.gameOver || gameFunction.options.gameId == 3) {
                    gameFunction.buildGameOver();
                    gameFunction.showGameOver();
                } else {
                    gameFunction.options.answerPane.addClass("behind");
                    $(".current").removeClass("current");
                    var timer = setTimeout(function () {
                        gameFunction.options.topicPane.removeClass("behind");
                        gameFunction.options.topicButtons.off("click").on("click", function (e) {
                            e.preventDefault();
                            gameFunction.bindTopicButtons($(this));
                        });
                        gameFunction.resetPanes();
                    }, 500);
                }
            },
            bindGameOverButton: function () {
                $(".refresh-window").on("click", function (e) { e.preventDefault(); location.reload(); });
            },
            init: function () {
                $("body").addClass("gameCabinet");
                gameFunction.options.playButton.on("click", function (e) {
                    e.preventDefault();
                    gameFunction.bindPlayButton();
                });

                gameFunction.options.helpButton.on("click", function (e) {
                    e.preventDefault();
                    gameFunction.bindHelpButton();
                });

                gameFunction.options.topicButtons.on("click", function (e) {
                    e.preventDefault();
                    gameFunction.bindTopicButtons($(this));
                });

                gameFunction.setHeight();
            },
            showError: function (data) {
                if (data != 0) {
                    gameFunction.options.errorMessage.text(data.ErrorCode + ": " + data.Message);
                }
                gameFunction.hidePane([gameFunction.options.topicPane, gameFunction.options.whammyPane, gameFunction.options.answerPane, gameFunction.options.questionPane, gameFunction.options.startPane, gameFunction.options.helpPane, gameFunction.options.gameOverPane]);
                gameFunction.clearPane([gameFunction.options.topicPane, gameFunction.options.whammyPane, gameFunction.options.answerPane, gameFunction.options.questionPane, gameFunction.options.startPane, gameFunction.options.helpPane, gameFunction.options.gameOverPane]);
                gameFunction.options.errorPane.removeClass("behind");
            }
        };

        return {
            init: gameFunction.init,
            setHeight: gameFunction.setHeight,
            showError: gameFunction.showError
        };
    };
})(jQuery);
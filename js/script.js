window.onload = function() {
    config.load_data();
    translator.translate_ui();

    dom_setup();
    add_navigation_events();
    timetable.display_current();



    function dom_setup() {
        create_header_buttons();
        fill_periods_container();

        function create_header_buttons() {
            var header = document.getElementsByTagName("header")[0];
            var counter = 0;


            for (entry of config.data.timetable) {
                var new_button = document.createElement("button");

                new_button.innerText = entry.day;
                new_button.setAttribute("data-dayNumber", counter);


                new_button.addEventListener("click", function(e) {
                    var header_buttons = document.querySelectorAll("header > button");

                    for (button of header_buttons) {
                        button.classList.remove("open");
                    }

                    e.target.classList.add("open");

                    timetable.display_for_day(e.target.getAttribute("data-dayNumber"));
                });


                header.append(new_button);
                counter++;
            }
        }


        function fill_periods_container() {

            var i = 0;
            for (period of config.data.periods) {
                var el = document.createElement("div")
                var period_el = document.createElement("div")
                var content_el = document.createElement("div")
                el.setAttribute('class', "routine-schedule")
                el.classList.add("hidden");
                period_el.setAttribute('class', "period-element")
                content_el.setAttribute('class', "schedule-content")
                el.style.transitionDelay = i * 0.025 + "s";

                var start = (period.start).split(":")
                var start_amp = start[0] >= 12 ? "PM" : "AM";
                var start_hr = start[0] >= 13 ? parseInt(start[0]) - 12 : start[0];
                var start_min = start[1];

                var end = (period.end).split(":")
                var end_amp = end[0] >= 12 ? "PM" : "AM";
                var end_hr = end[0] >= 13 ? parseInt(end[0]) - 12 : end[0];
                var end_min = end[1];

                start_hr = String(start_hr).padStart(2, 0)
                start_min = String(start_min).padStart(2, 0)

                end_hr = String(end_hr).padStart(2, 0)
                end_min = String(end_min).padStart(2, 0)

                period_el.innerHTML = `${start_hr}:${start_min} ${start_amp} - ${end_hr}:${end_min} ${end_amp}`
                content_el.innerHTML += "<div></div><div></div>"
                el.innerHTML += period_el.outerHTML
                el.innerHTML += content_el.outerHTML
                document.getElementById('timetable-routines').appendChild(el)
                i++;
            }
        }

    }



    function add_navigation_events() {
        add_swipe_events();
        add_keyboard_events();


        function add_swipe_events() {
            var timetable_div = document.getElementById("timetable-routines");

            timetable_div.ontouchstart = function(e_start) {
                var touch_start_position = e_start.touches[0].clientX;

                timetable_div.ontouchmove = function(e_end) {
                    var touch_end_position = e_end.touches[0].clientX;

                    if (touch_start_position < touch_end_position - 75) {
                        timetable_div.ontouchmove = null;
                        timetable.display_previous_day();
                    } else if (touch_start_position > touch_end_position + 75) {
                        timetable_div.ontouchmove = null;
                        timetable.display_next_day();
                    }
                };
            };
        }


        function add_keyboard_events() {
            window.addEventListener("keydown", function(e) {
                if (e.keyCode == 37) {
                    timetable.display_previous_day();
                } else if (e.keyCode == 39) {
                    timetable.display_next_day();
                }
            });
        }
    }
};



var timetable = {
    currently_shown_day_number: 0,

    display_for_day: function(dayNumber) {
        timetable.currently_shown_day_number = dayNumber;

        timetable.routine_el.hide();

        setTimeout(function() {
            timetable.routine_el.fill(dayNumber);
            timetable.routine_el.show();
        }, 450);
    },


    display_current: function() {
        var d = new Date();
        dayNumber = (d.getDay() != 0) ? d.getDay() - 1 : 6;

        var header_buttons = document.querySelectorAll("header > button");

        if (dayNumber >= config.data.timetable.length) {
            header_buttons[0].classList.add("open");
            timetable.display_for_day(0);
        } else {
            header_buttons[dayNumber].classList.add("open");
            timetable.display_for_day(dayNumber);
        }
    },


    display_previous_day: function() {
        var previous_day_number;
        var header_buttons = document.querySelectorAll("header > button");

        if (timetable.currently_shown_day_number != 0) {
            previous_day_number = parseInt(timetable.currently_shown_day_number) - 1;
            header_buttons[previous_day_number].click();
        }
    },


    display_next_day: function() {
        var next_day_number;
        var header_buttons = document.querySelectorAll("header > button");

        if (timetable.currently_shown_day_number != config.data.timetable.length - 1) {
            next_day_number = parseInt(timetable.currently_shown_day_number) + 1;
            header_buttons[next_day_number].click();
        }
    },


    routine_el: {
        fill: function(dayNumber) {
            var routine = document.querySelectorAll(".routine-schedule");

            //for (let period = 0; period < config.data.timetable[dayNumber].schedule.length; period++) {
            for (let period = 0; period < config.data.timetable[dayNumber].schedule.length && period < config.data.periods.length; period++) {
                var subject_name = config.data.timetable[dayNumber].schedule[period].subject;
                var subject_room = config.data.timetable[dayNumber].schedule[period].room;
                console.log(config.data.timetable[dayNumber])

                if (subject_name != "") {

                    if (typeof config.data.colors[subject_name] != "undefined") {
                        routine[period].querySelector(".schedule-content").style.color = config.data.colors[subject_name];
                    } else {
                        routine[period].querySelector(".schedule-content").style.color = "#000";
                    }

                    routine[period].querySelector(".schedule-content").querySelectorAll("div")[0].innerText = subject_name;
                    routine[period].querySelector(".schedule-content").querySelectorAll("div")[1].innerText = subject_room;
                } else {
                    routine[period].querySelector(".schedule-content").querySelectorAll("div")[0].innerText = "";
                    routine[period].querySelector(".schedule-content").querySelectorAll("div")[1].innerText = "";
                }
            }
        },


        show: function() {
            var routine = document.querySelectorAll(".routine-schedule");

            for (el of routine) {
                el.classList.remove("hidden");
            }

        },


        hide: function() {
            var routine = document.querySelectorAll(".routine-schedule");

            for (el of routine) {
                el.classList.add("hidden");
            }
        }
    }
};